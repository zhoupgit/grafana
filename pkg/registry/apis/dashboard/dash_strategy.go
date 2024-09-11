package dashboard

import (
	"context"
	"fmt"

	"github.com/grafana/grafana/pkg/apimachinery/utils"
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
	s.saveSpecBlob(ctx, obj)
}

func (s *dashStrategy) PrepareForUpdate(ctx context.Context, obj, old runtime.Object) {
	s.saveSpecBlob(ctx, obj)
}

func (s *dashStrategy) saveSpecBlob(ctx context.Context, obj runtime.Object) {
	dash, ok := obj.(*dashboard.Dashboard)
	if !ok {
		fmt.Printf("Expecting dashboard: %t // %+v\n", obj, obj)
		return
	}
	dash.UID = "" // don't try to match UIDs

	if s.client != nil {
		spec, err := dash.Spec.MarshalJSON()
		if err == nil {
			meta, err := utils.MetaAccessor(obj)
			if err == nil {
				gr := dashboard.DashboardResourceInfo.GroupResource()
				rsp, err := s.client.PutBlob(ctx, &resource.PutBlobRequest{
					Resource: &resource.ResourceKey{
						Namespace: meta.GetNamespace(),
						Group:     gr.Group,
						Resource:  gr.Resource,
						Name:      meta.GetName(),
					},
					Method:      resource.PutBlobRequest_GRPC,
					ContentType: "applicaiton/json",
					Value:       spec,
				})
				if err != nil {
					fmt.Printf("ERRROR: %s\n", err)
				} else {
					// Save a reference to the blob in the metadata
					meta.SetBlob(&utils.BlobInfo{
						UID:      rsp.Uid,
						Size:     rsp.Size,
						Hash:     rsp.Hash,
						MimeType: rsp.MimeType,
						Charset:  rsp.MimeType,
					})
					fmt.Printf("WROTE BLOB: %+v\n", rsp)
				}
			}
		}
	}
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
