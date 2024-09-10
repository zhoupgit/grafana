package externalsessionimpl

import (
	"context"

	"github.com/grafana/grafana/pkg/services/auth"
	"github.com/grafana/grafana/pkg/services/secrets"
)

type Service struct {
	store auth.ExternalSessionStore
}

func ProvideService(extSessionStore auth.ExternalSessionStore, secretService secrets.Service) auth.ExternalSessionService {
	return &Service{store: extSessionStore}
}

func (s *Service) GetExternalSession(ctx context.Context, query *auth.GetExternalSessionQuery) (*auth.ExternalSession, error) {
	return s.store.GetExternalSession(ctx, query)
}
