package zanzana

import (
	"fmt"

	openfgav1 "github.com/openfga/api/proto/openfga/v1"
)

const (
	RelationRead string = "read"
)

const (
	TypeUser      string = "user"
	TypeDashboard string = "dashboard"
)

func NewObject(typ, id string) string {
	return fmt.Sprintf("%s:%s", typ, id)
}

func NewOrgScopedObject(typ, id string, orgID int64) string {
	return NewObject(typ, fmt.Sprintf("%d-%s", orgID, id))
}

var actionTranslations = map[string]string{
	"dashboards:read": RelationRead,
}

type kindTranslation struct {
	typ       string
	orgScoped bool
}

var kindTranslations = map[string]kindTranslation{
	// FIXME(kalleep): We have folder scoped dashboard actions...
	"dashboards": {
		typ:       TypeDashboard,
		orgScoped: true,
	},
}

func TranslateToTuple(user string, action, kind, identifier string, orgID int64) (*openfgav1.TupleKey, bool) {
	relation, ok := actionTranslations[action]
	if !ok {
		return nil, false
	}

	t, ok := kindTranslations[kind]
	if !ok {
		return nil, false
	}

	tuple := &openfgav1.TupleKey{
		Relation: relation,
	}

	tuple.User = user
	tuple.Relation = relation

	if t.orgScoped {
		tuple.Object = NewOrgScopedObject(t.typ, identifier, orgID)
	} else {
		tuple.Object = NewObject(t.typ, identifier)
	}

	return tuple, true
}
