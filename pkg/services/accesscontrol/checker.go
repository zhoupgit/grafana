package accesscontrol

import (
	"context"

	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/services/user"
)

type Checker interface {
	Get(ctx context.Context, user *user.SignedInUser, action string) func(scopes ...string) bool
}

func ProvideChecker(actionResolver ActionResolver, features featuremgmt.FeatureToggles) Checker {
	return &checker{
		actionResolver: actionResolver,
		features:       features,
	}
}

type checker struct {
	actionResolver ActionResolver
	features       featuremgmt.FeatureToggles
}

func (c *checker) Get(ctx context.Context, user *user.SignedInUser, action string) func(scopes ...string) bool {
	if user.Permissions == nil || user.Permissions[user.OrgID] == nil {
		return func(scopes ...string) bool { return false }
	}

	actions := []string{action}
	if c.features.IsEnabled(ctx, featuremgmt.FlagAccessActionSets) {
		actionSets := c.actionResolver.Resolve(action)
		actions = append(actions, actionSets...)
	}

	var userScopes []string
	for _, a := range actions {
		if scopes, ok := user.Permissions[user.OrgID][a]; ok {
			userScopes = append(userScopes, scopes...)
		}
	}
	if len(userScopes) == 0 {
		return func(scopes ...string) bool { return false }
	}

	lookup := make(map[string]bool, len(userScopes))
	for i := range userScopes {
		lookup[userScopes[i]] = true
	}

	var checkedWildcards bool
	var hasWildcard bool

	return func(scopes ...string) bool {
		if !checkedWildcards {
			wildcards := wildcardsFromScopes(scopes...)
			for _, w := range wildcards {
				if _, ok := lookup[w]; ok {
					hasWildcard = true
					break
				}
			}
			checkedWildcards = true
		}

		if hasWildcard {
			return true
		}

		for _, s := range scopes {
			if lookup[s] {
				return true
			}
		}
		return false
	}
}

func wildcardsFromScopes(scopes ...string) Wildcards {
	prefixes := make([]string, len(scopes))
	for _, scope := range scopes {
		prefixes = append(prefixes, ScopePrefix(scope))
	}

	return WildcardsFromPrefixes(prefixes)
}
