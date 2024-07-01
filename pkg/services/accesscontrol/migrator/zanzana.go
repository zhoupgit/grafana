package migrator

import (
	"context"
	"fmt"
	"strconv"

	openfgav1 "github.com/openfga/api/proto/openfga/v1"

	"github.com/grafana/grafana/pkg/infra/db"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/authz/zanzana"
)

var collectors = []func(ctx context.Context, store db.DB, tuples map[string][]*openfgav1.TupleKey) error{
	collectManagedPermissions,
}

// SyncToZanzana is a temporary function to sync RBAC permissions to zanzana.
// We should rewrite the migration after we have "migrated" all possible actions
// into our schema. This will only do a one time migration for each action so its
// is not really syncing the full rbac state. If a fresh sync is needed the tuple
// needs to be cleared first.
func SyncToZanzana(client zanzana.Client, store db.DB, log log.Logger) error {
	ctx := context.Background()

	tuplesMap := make(map[string][]*openfgav1.TupleKey)

	for _, c := range collectors {
		if err := c(ctx, store, tuplesMap); err != nil {
			return fmt.Errorf("failed to collect permissions: %w", err)
		}
	}

	for action, tuples := range tuplesMap {
		if err := batch(len(tuples), 100, func(start, end int) error {
			return client.Write(ctx, &openfgav1.WriteRequest{
				Writes: &openfgav1.WriteRequestWrites{
					TupleKeys: tuples[start:end],
				},
			})
		}); err != nil {
			log.Warn("Failed to sync permissions to zanzana", "err", err, "action", action)
			return nil
		}
	}

	return nil
}

func collectManagedPermissions(ctx context.Context, store db.DB, tuples map[string][]*openfgav1.TupleKey) error {
	const query = `
		SELECT ur.user_id, p.action, p.kind, p.identifier, r.org_id FROM permission p
		INNER JOIN role r on p.role_id = r.id
		LEFT JOIN user_role ur on r.id  = ur.role_id
		LEFT JOIN team_role tr on r.id  = tr.role_id
		LEFT JOIN builtin_role br on r.id  = br.role_id
		WHERE r.name LIKE 'managed:%'
	`
	type Permission struct {
		RoleName   string `xorm:"role_name"`
		OrgID      int64  `xorm:"org_id"`
		Action     string `xorm:"action"`
		Kind       string
		Identifier string
		UserID     int64 `xorm:"user_id"`
		TeamID     int64 `xorm:"user_id"`
	}

	var permissions []Permission
	err := store.WithDbSession(ctx, func(sess *db.Session) error {
		return sess.SQL(query).Find(&permissions)
	})

	if err != nil {
		return err
	}

	for _, p := range permissions {
		var subject string
		if p.UserID > 0 {
			subject = zanzana.NewObject(zanzana.TypeUser, strconv.FormatInt(p.UserID, 10))
		} else if p.TeamID > 0 {
			subject = zanzana.NewObject(zanzana.TypeUser, strconv.FormatInt(p.UserID, 10))
		} else {
			// FIXME(kalleep): Unsuported role binding (org role)
			continue
		}

		tuple, ok := zanzana.TranslateToTuple(subject, p.Action, p.Kind, p.Identifier, p.OrgID)
		if !ok {
			// FIXME(kalleep): Warning log for unsuported actions
			continue
		}

		tuples[p.Action] = append(tuples[p.Action], tuple)
	}

	return nil
}
