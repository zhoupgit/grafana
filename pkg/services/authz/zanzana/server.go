package zanzana

import (
	"google.golang.org/grpc"

	openfgav1 "github.com/openfga/api/proto/openfga/v1"
	"github.com/openfga/openfga/pkg/logger"
	"github.com/openfga/openfga/pkg/server"
	"github.com/openfga/openfga/pkg/storage"

	"github.com/grafana/grafana/pkg/services/grpcserver"
)

type Server struct {
	cfg     *Config
	log     logger.Logger
	srv     openfgav1.OpenFGAServiceServer
	grpcSrv *grpc.Server
}

func New(grpc grpcserver.Provider, store storage.OpenFGADatastore) (*Server, error) {
	// TODO: add support for more options
	opts := []server.OpenFGAServiceV1Option{
		server.WithDatastore(store),
		// TODO: Write and log adapter for open fga logging interface
		server.WithLogger(logger.NewNoopLogger()),
	}

	// FIXME(kalleep): Interceptors
	// We probably need to at least need to add store id interceptor also
	// would be nice to inject our own requestid
	srv, err := server.NewServerWithOpts(opts...)
	if err != nil {
		return nil, err
	}

	openfgav1.RegisterOpenFGAServiceServer(grpc.GetServer(), srv)

	return &Server{}, nil
}
