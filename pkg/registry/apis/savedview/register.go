package savedview

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/runtime/serializer"
	"k8s.io/apiserver/pkg/authorization/authorizer"
	"k8s.io/apiserver/pkg/registry/generic"
	"k8s.io/apiserver/pkg/registry/rest"
	genericapiserver "k8s.io/apiserver/pkg/server"
	"k8s.io/kube-openapi/pkg/common"

	"github.com/prometheus/client_golang/prometheus"

	savedview "github.com/grafana/grafana/pkg/apis/savedview/v0alpha1"
	grafanarest "github.com/grafana/grafana/pkg/apiserver/rest"
	"github.com/grafana/grafana/pkg/services/apiserver/builder"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
)

var _ builder.APIGroupBuilder = (*SavedViewAPIBuilder)(nil)

// This is used just so wire has something unique to return
type SavedViewAPIBuilder struct{}

func NewSavedViewAPIBuilder() *SavedViewAPIBuilder {
	return &SavedViewAPIBuilder{}
}

func RegisterAPIService(features featuremgmt.FeatureToggles, apiregistration builder.APIRegistrar, registerer prometheus.Registerer) *SavedViewAPIBuilder {
	if !features.IsEnabledGlobally(featuremgmt.FlagKubernetesAggregator) {
		return nil // skip registration unless opting into aggregator mode
	}

	builder := NewSavedViewAPIBuilder()
	apiregistration.RegisterAPI(NewSavedViewAPIBuilder())
	return builder
}

func (b *SavedViewAPIBuilder) GetAuthorizer() authorizer.Authorizer {
	return nil // default authorizer is fine
}

func (b *SavedViewAPIBuilder) GetGroupVersion() schema.GroupVersion {
	return savedview.SchemeGroupVersion
}

func addKnownTypes(scheme *runtime.Scheme, gv schema.GroupVersion) {
	scheme.AddKnownTypes(gv,
		&savedview.SavedView{},
		&savedview.SavedViewList{},
	)
}

func (b *SavedViewAPIBuilder) InstallSchema(scheme *runtime.Scheme) error {
	gv := savedview.SchemeGroupVersion
	err := savedview.AddToScheme(scheme)
	if err != nil {
		return err
	}

	// Link this version to the internal representation.
	// This is used for server-side-apply (PATCH), and avoids the error:
	//   "no kind is registered for the type"
	addKnownTypes(scheme, schema.GroupVersion{
		Group:   savedview.GROUP,
		Version: runtime.APIVersionInternal,
	})
	metav1.AddToGroupVersion(scheme, gv)
	return scheme.SetVersionPriority(gv)
}

func (b *SavedViewAPIBuilder) GetAPIGroupInfo(
	scheme *runtime.Scheme,
	codecs serializer.CodecFactory,
	optsGetter generic.RESTOptionsGetter,
	_ grafanarest.DualWriteBuilder,
) (*genericapiserver.APIGroupInfo, error) {
	apiGroupInfo := genericapiserver.NewDefaultAPIGroupInfo(savedview.GROUP, scheme, metav1.ParameterCodec, codecs)

	resourceInfo := savedview.SavedViewResourceInfo
	storage := map[string]rest.Storage{}
	savedViewStorage, err := newStorage(scheme, optsGetter)
	if err != nil {
		return nil, err
	}
	storage[resourceInfo.StoragePath()] = savedViewStorage
	apiGroupInfo.VersionedResourcesStorageMap[savedview.VERSION] = storage
	return &apiGroupInfo, nil
}

func (b *SavedViewAPIBuilder) GetOpenAPIDefinitions() common.GetOpenAPIDefinitions {
	return savedview.GetOpenAPIDefinitions
}

// Register additional routes with the server
func (b *SavedViewAPIBuilder) GetAPIRoutes() *builder.APIRoutes {
	return nil
}
