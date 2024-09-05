package dashboard

import (
	"context"
	"fmt"

	dashboard "github.com/grafana/grafana/pkg/apis/dashboard/v0alpha1"
	"github.com/grafana/grafana/pkg/storage/unified/resource"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/util/validation/field"
	"k8s.io/apiserver/pkg/registry/rest"
	"k8s.io/apiserver/pkg/storage/names"
)

type dashStrategy struct {
	runtime.ObjectTyper
	names.NameGenerator
	client resource.ResourceClient
}

var (
	_ rest.RESTUpdateStrategy = (*dashStrategy)(nil)
	_ rest.RESTCreateStrategy = (*dashStrategy)(nil)
	_ rest.RESTDeleteStrategy = (*dashStrategy)(nil)
)

func newDashboardStrategy(typer runtime.ObjectTyper, client resource.ResourceClient) *dashStrategy {
	return &dashStrategy{typer, names.SimpleNameGenerator, client}
}

// NamespaceScoped returns true because all Generic resources must be within a namespace.
func (s *dashStrategy) NamespaceScoped() bool {
	return true
}

func (s *dashStrategy) BeginCreateFunc(ctx context.Context, obj runtime.Object) {
	fmt.Printf("BeginCreateFunc: %t // %+v\n", obj, obj)
}

func (s *dashStrategy) PrepareForCreate(ctx context.Context, obj runtime.Object) {
	dash, ok := obj.(*dashboard.Dashboard)
	if !ok {
		fmt.Printf("Expecting dashboard: %t // %+v\n", obj, obj)
		return
	}
	fmt.Printf("PrepareForCreate: %+v\n", dash)

	// While dual writing...
	dash.ResourceVersion = "" // clear any resource version
	dash.UID = ""             // should not be set

	if s.client != nil {
		spec, err := dash.Spec.MarshalJSON()
		if err == nil {
			fmt.Printf("WRITE BLOB: %d\n", len(spec))
		}
	}
}

func (s *dashStrategy) PrepareForUpdate(ctx context.Context, obj, old runtime.Object) {
	fmt.Printf("PrepareForUpdate: %t // %+v\n", obj, obj)
}

func (s *dashStrategy) Validate(ctx context.Context, obj runtime.Object) field.ErrorList {
	return field.ErrorList{}
}

// WarningsOnCreate returns warnings for the creation of the given object.
func (s *dashStrategy) WarningsOnCreate(ctx context.Context, obj runtime.Object) []string { return nil }

func (s *dashStrategy) AllowCreateOnUpdate() bool {
	return true
}

func (s *dashStrategy) AllowUnconditionalUpdate() bool {
	return true
}

func (s *dashStrategy) Canonicalize(obj runtime.Object) {}

func (s *dashStrategy) ValidateUpdate(ctx context.Context, obj, old runtime.Object) field.ErrorList {
	return field.ErrorList{}
}

// WarningsOnUpdate returns warnings for the given update.
func (s *dashStrategy) WarningsOnUpdate(ctx context.Context, obj, old runtime.Object) []string {
	return nil
}
