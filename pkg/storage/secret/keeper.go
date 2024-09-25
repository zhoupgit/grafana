package secret

import (
	"context"
	"encoding/base64"
	"fmt"
	"strings"

	"github.com/grafana/grafana/pkg/setting"
	"github.com/grafana/grafana/pkg/util"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apiserver/pkg/registry/generic"
	"k8s.io/apiserver/pkg/registry/rest"
)

type EncryptedValue struct {
	Scheme string // how was the value saved
	Salt   string // random short string (never exposed externally)
	Value  string // The encrypted value
}

type SecretManager interface {
	GetKeeper(ctx context.Context, namespace string, name string) (SecretKeeper, error)
	InitStorage(scheme *runtime.Scheme, storage map[string]rest.Storage, optsGetter generic.RESTOptionsGetter) error
}

type SecretKeeper interface {
	Encrypt(ctx context.Context, value string) (EncryptedValue, error)
	Decrypt(ctx context.Context, value EncryptedValue) (string, error)

	// Get a remote value from a path
	ReadValue(ctx context.Context, path string) (string, error)
}

func ProvideSecretManager(cfg *setting.Cfg) (SecretManager, error) {
	// TODO... read config and actually use key
	return &simpleManager{
		keeper: &simpleKeeper{},
	}, nil
}

var (
	_ SecretManager = (*simpleManager)(nil)
)

type simpleManager struct {
	keeper SecretKeeper
}

// GetKeeper implements SecretManager.
func (s *simpleManager) GetKeeper(ctx context.Context, namespace string, name string) (SecretKeeper, error) {
	if name == "" || name == "default" {
		return s.keeper, nil
	}
	return nil, fmt.Errorf("custom stores are not supported")
}

func (s *simpleManager) InitStorage(scheme *runtime.Scheme, storage map[string]rest.Storage, optsGetter generic.RESTOptionsGetter) error {
	return nil
}

type simpleKeeper struct{}

// Encode implements SecretKeeper.
func (s *simpleKeeper) Encrypt(ctx context.Context, value string) (EncryptedValue, error) {
	salt, err := util.GetRandomString(10)
	if err != nil {
		return EncryptedValue{}, err
	}
	return EncryptedValue{
		Scheme: "base64",
		Salt:   salt,
		Value:  base64.StdEncoding.EncodeToString([]byte(salt + value)),
	}, nil
}

// Decode implements SecretKeeper.
func (s *simpleKeeper) Decrypt(ctx context.Context, value EncryptedValue) (string, error) {
	if value.Scheme != "base64" {
		return "", fmt.Errorf("unsupported key")
	}

	out, err := base64.StdEncoding.DecodeString(value.Value)
	if err != nil {
		return "", err
	}
	f, ok := strings.CutPrefix(string(out), value.Salt)
	if !ok {
		return "", fmt.Errorf("salt not found in value")
	}
	return f, nil
}

func (s *simpleKeeper) ReadValue(ctx context.Context, path string) (string, error) {
	return "", fmt.Errorf("unsupported operation")
}
