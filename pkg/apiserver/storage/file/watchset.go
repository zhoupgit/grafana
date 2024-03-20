// SPDX-License-Identifier: AGPL-3.0-only
// Provenance-includes-location: https://github.com/tilt-dev/tilt-apiserver/blob/main/pkg/storage/filepath/watchset.go
// Provenance-includes-license: Apache-2.0
// Provenance-includes-copyright: The Kubernetes Authors.

package file

import (
	"fmt"
	"strconv"
	"sync"
	"time"

	"k8s.io/apimachinery/pkg/api/meta"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/apiserver/pkg/storage"
	"k8s.io/klog/v2"
)

type UpdateEvent struct {
	ev watch.Event
	// optional: oldObject is only set for modifications for determining their type as necessary (when using predicate filtering)
	oldObject runtime.Object
}

// Keeps track of which watches need to be notified
type WatchSet struct {
	mu      sync.RWMutex
	nodes   map[int]*watchNode
	counter int
	// Buffers events during startup so that the brief window in which informers
	// are getting set up doesn't end up them losing the events
	buffered      []UpdateEvent
	bufferedMutex sync.RWMutex
}

func NewWatchSet() *WatchSet {
	return &WatchSet{
		buffered: make([]UpdateEvent, 0, 64),
		nodes:    make(map[int]*watchNode, 20),
		counter:  0,
	}
}

// Creates a new watch with a unique id, but
// does not start sending events to it until start() is called.
func (s *WatchSet) newWatch(requestedRV uint64, p storage.SelectionPredicate, namespace string) *watchNode {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.counter++

	node := &watchNode{
		requestedRV: requestedRV,
		id:          s.counter,
		s:           s,
		updateCh:    make(chan UpdateEvent, 10),
		outCh:       make(chan watch.Event),
		predicate:   p,
	}
	if namespace != "" {
		node.namespace = namespace
		node.isNamespaced = true
	}
	return node
}

func (s *WatchSet) cleanupWatchers() {
	fmt.Println("Pre cleanup - lock get")
	s.mu.Lock()
	defer s.mu.Unlock()
	fmt.Println("Looping on nodes for cleanup")
	for _, w := range s.nodes {
		fmt.Println("Stopping node")
		w.stop()

	}
}

// oldObject is only passed in the event of a modification
// in case a predicate filtered watch is impactec as a result of modification
// and wants to convert a MODIFIED event to DELETED instead
func (s *WatchSet) notifyWatchers(ev watch.Event, oldObject runtime.Object) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	updateEv := UpdateEvent{
		ev: ev,
	}
	if oldObject != nil {
		updateEv.oldObject = oldObject
	}

	// Events are always buffered because of an inadvertent delay
	// which is built into the way the Start function works for a node
	// The delay is due to the channel implementation
	s.bufferedMutex.Lock()
	s.buffered = append(s.buffered, updateEv)
	s.bufferedMutex.Unlock()

	for _, w := range s.nodes {
		w.updateCh <- updateEv
	}
}

type watchNode struct {
	s            *WatchSet
	id           int
	updateCh     chan UpdateEvent
	outCh        chan watch.Event
	requestedRV  uint64
	namespace    string
	isNamespaced bool
	predicate    storage.SelectionPredicate
}

// Returns a boolean signifying
func (w *watchNode) isValid(e UpdateEvent) (bool, error) {
	obj, err := meta.Accessor(e.ev.Object)
	if err != nil {
		klog.Warningf("Could not get accessor to object in event")
		return false, nil
	}

	eventRV, err := strconv.Atoi(obj.GetResourceVersion())
	if err != nil {
		return false, err
	}

	if eventRV <= int(w.requestedRV) {
		return false, nil
	}

	if w.isNamespaced && (w.namespace != obj.GetNamespace()) {
		return false, err
	}

	isCurrentMatch, err := w.predicate.Matches(e.ev.Object)
	if err != nil {
		return false, err
	}

	return isCurrentMatch, nil
}

// Only call this method if current object matches the predicate
func (w *watchNode) handleAddedToFilteredList(e UpdateEvent) (*watch.Event, error) {
	if e.oldObject == nil {
		return nil, fmt.Errorf("oldObject should be set for modified events")
	}

	ok, err := w.predicate.Matches(e.oldObject)
	if err != nil {
		return nil, err
	}

	if !ok {
		e.ev.Type = watch.Added
	}

	return &e.ev, nil
}

func (w *watchNode) handleDeletedFromFilteredList(e UpdateEvent) (*watch.Event, error) {
	if e.oldObject == nil {
		return nil, fmt.Errorf("oldObject should be set for modified events")
	}

	ok, err := w.predicate.Matches(e.oldObject)
	if err != nil {
		return nil, err
	}

	if !ok {
		return nil, nil
	}

	// isn't a match but used to be
	e.ev.Type = watch.Deleted

	oldObjectAccessor, err := meta.Accessor(e.oldObject)
	if err != nil {
		klog.Warning("Could not get accessor to correct the old RV of filtered out object")
		return nil, err
	}

	obj, err := meta.Accessor(e.ev.Object)
	if err != nil {
		klog.Warningf("Could not get accessor to object in event")
		return nil, err
	}

	oldObjectAccessor.SetResourceVersion(obj.GetResourceVersion())
	e.ev.Object = e.oldObject

	return &e.ev, nil
}

func (w *watchNode) processEvent(e UpdateEvent) error {
	valid, err := w.isValid(e)
	if err != nil {
		klog.Errorf("Could not determine validity of the event: %v", err)
		return err
	}
	if valid {
		ev, err := w.handleAddedToFilteredList(e)
		if err != nil {
			return err
		}
		if ev != nil {
			w.outCh <- *ev
		}
	} else {
		ev, err := w.handleDeletedFromFilteredList(e)
		if err != nil {
			return err
		}
		if ev != nil {
			w.outCh <- *ev
		}
	}

	return nil
}

// Start sending events to this watch.
func (w *watchNode) Start(initEvents ...watch.Event) {
	time.Sleep(500 * time.Millisecond)

	w.s.mu.Lock()
	w.s.nodes[w.id] = w
	w.s.mu.Unlock()

	go func() {
		for _, ev := range initEvents {
			w.outCh <- ev
		}

		w.s.bufferedMutex.RLock()
		for _, e := range w.s.buffered {
			if err := w.processEvent(e); err != nil {
				klog.Errorf("Could not process event: %v", err)
			}
		}
		w.s.bufferedMutex.RUnlock()

		for e := range w.updateCh {
			if err := w.processEvent(e); err != nil {
				klog.Errorf("Could not process event: %v", err)
			}
		}
		close(w.outCh)
	}()
}

func (w *watchNode) Stop() {
	w.s.mu.Lock()
	defer w.s.mu.Unlock()
	w.stop()
}

// Unprotected func: ensure mutex on the parent watch set is locked before calling
func (w *watchNode) stop() {
	delete(w.s.nodes, w.id)
	close(w.updateCh)
}

func (w *watchNode) ResultChan() <-chan watch.Event {
	return w.outCh
}
