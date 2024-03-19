// SPDX-License-Identifier: AGPL-3.0-only
// Provenance-includes-location: https://github.com/tilt-dev/tilt-apiserver/blob/main/pkg/storage/filepath/watchset.go
// Provenance-includes-license: Apache-2.0
// Provenance-includes-copyright: The Kubernetes Authors.

package file

import (
	"fmt"
	"sync"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/apiserver/pkg/storage"
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
}

func NewWatchSet() *WatchSet {
	return &WatchSet{
		nodes:   make(map[int]*watchNode, 20),
		counter: 0,
	}
}

// Creates a new watch with a unique id, but
// does not start sending events to it until start() is called.
func (s *WatchSet) newWatch(requestedRV uint64) *watchNode {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.counter++

	return &watchNode{
		requestedRV: requestedRV,
		id:          s.counter,
		s:           s,
		updateCh:    make(chan UpdateEvent, 10),
		outCh:       make(chan watch.Event),
	}
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
func (s *WatchSet) notifyWatchers(ev watch.Event, oldObject ...runtime.Object) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	fmt.Println("notifyWatchers START")

	if len(s.nodes) == 0 {
		fmt.Println("No nodes")
		return
	}

	fmt.Println("NOTIFY: length of nodes=", len(s.nodes))

	fmt.Println("Looping on nodes for notify")
	updateEv := UpdateEvent{
		ev: ev,
	}
	if len(oldObject) > 0 {
		updateEv.oldObject = oldObject[0]
	}

	for _, w := range s.nodes {
		fmt.Println("Updating channel with ev")
		w.updateCh <- updateEv
	}

	fmt.Println("notifyWatchers COMPLETE")
}

type watchNode struct {
	s           *WatchSet
	id          int
	updateCh    chan UpdateEvent
	outCh       chan watch.Event
	requestedRV uint64
}

// Start sending events to this watch.
func (w *watchNode) Start(p storage.SelectionPredicate, initEvents []watch.Event) {
	w.s.mu.Lock()
	w.s.nodes[w.id] = w
	w.s.mu.Unlock()

	fmt.Println("Start pre")

	go func() {
		for _, e := range initEvents {
			w.outCh <- e
		}

		for e := range w.updateCh {
			fmt.Println("From update channel", e)

			ok, err := p.Matches(e.ev.Object)
			if err != nil {
				continue
			}

			if !ok {
				if e.ev.Type == watch.Modified {
					if ok, err := p.Matches(e.oldObject); err == nil && ok {
						e.ev.Type = watch.Deleted
						e.ev.Object = e.oldObject
					} else {
						continue
					}
				} else {
					continue
				}
			}
			fmt.Println("To out channel", e)
			w.outCh <- e.ev
		}

		fmt.Println("Start post")
		close(w.outCh)
	}()
}

func (w *watchNode) Stop() {
	w.s.mu.Lock()
	defer w.s.mu.Unlock()
	w.stop()
}

func (w *watchNode) stop() {
	fmt.Println("Before close")
	delete(w.s.nodes, w.id)
	close(w.updateCh)
	fmt.Println("After close")
}

func (w *watchNode) ResultChan() <-chan watch.Event {
	fmt.Println("ResultChan")
	return w.outCh
}
