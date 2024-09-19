package resource

import (
	"github.com/fullstorydev/grpchan"
	"github.com/fullstorydev/grpchan/inprocgrpc"
	grpcAuth "github.com/grpc-ecosystem/go-grpc-middleware/v2/interceptors/auth"
	"google.golang.org/grpc"

	grpcUtils "github.com/grafana/grafana/pkg/storage/unified/resource/grpc"
)

type ResourceClient interface {
	ResourceReadClient
	ResourceWriteClient
	ResourceIndexClient
	DiagnosticsClient
}

// Internal implementation
type resourceClient struct {
	ResourceReadClient
	ResourceWriteClient
	ResourceIndexClient
	DiagnosticsClient
}

func NewResourceClient(channel *grpc.ClientConn) ResourceClient {
	cc := grpchan.InterceptClientConn(channel, grpcUtils.UnaryClientInterceptor, grpcUtils.StreamClientInterceptor)
	return &resourceClient{
		ResourceReadClient:  NewResourceReadClient(cc),
		ResourceWriteClient: NewResourceWriteClient(cc),
		ResourceIndexClient: NewResourceIndexClient(cc),
		DiagnosticsClient:   NewDiagnosticsClient(cc),
	}
}

func NewLocalResourceClient(server ResourceServer) ResourceClient {
	channel := &inprocgrpc.Channel{}

	auth := &grpcUtils.Authenticator{}
	for _, desc := range []*grpc.ServiceDesc{
		&ResourceRead_ServiceDesc,
		&ResourceWrite_ServiceDesc,
		&ResourceIndex_ServiceDesc,
		&Diagnostics_ServiceDesc,
	} {
		channel.RegisterService(
			grpchan.InterceptServer(
				desc,
				grpcAuth.UnaryServerInterceptor(auth.Authenticate),
				grpcAuth.StreamServerInterceptor(auth.Authenticate),
			),
			server,
		)
	}

	cc := grpchan.InterceptClientConn(channel, grpcUtils.UnaryClientInterceptor, grpcUtils.StreamClientInterceptor)
	return &resourceClient{
		ResourceReadClient:  NewResourceReadClient(cc),
		ResourceWriteClient: NewResourceWriteClient(cc),
		ResourceIndexClient: NewResourceIndexClient(cc),
		DiagnosticsClient:   NewDiagnosticsClient(cc),
	}
}
