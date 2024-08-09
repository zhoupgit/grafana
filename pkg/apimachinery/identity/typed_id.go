package identity

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

const (
	TypeUser           string = "user"
	TypeAPIKey         string = "api-key"
	TypeServiceAccount string = "service-account"
	TypeAnonymous      string = "anonymous"
	TypeRenderService  string = "render"
	TypeAccessPolicy   string = "access-policy"
	TypeProvisioning   string = "provisioning"
	TypeEmpty          string = ""
)

var AnonymousTypedID = NewTypedID(TypeAnonymous, 0)

func ParseType(str string) (string, error) {
	switch str {
	case TypeUser:
		return TypeUser, nil
	case TypeAPIKey:
		return TypeAPIKey, nil
	case TypeServiceAccount:
		return TypeServiceAccount, nil
	case TypeAnonymous:
		return TypeAnonymous, nil
	case TypeRenderService:
		return TypeRenderService, nil
	case TypeAccessPolicy:
		return TypeAccessPolicy, nil
	default:
		return "", ErrInvalidTypedID.Errorf("got invalid identity type %s", str)
	}
}

var allTypes = []string{
	TypeUser,
	TypeAPIKey,
	TypeServiceAccount,
	TypeAnonymous,
	TypeRenderService,
	TypeAccessPolicy,
	TypeProvisioning,
}

func IsValidTypedID(typedID string) bool {
	if !IsIdentityType(typedID, allTypes...) {
		return false
	}

	parts := strings.Split(typedID, ":")
	return len(parts) == 2
}

// ParseTypeAndID will parse out the type and id into seperate field.
// Expected format is of <type>:<id>
func ParseTypeAndID(typedID string) (string, string, error) {
	if !IsValidTypedID(typedID) {
		return "", "", errors.New("invalid type id")
	}

	parts := strings.Split(typedID, ":")
	return parts[0], parts[1], nil
}

// IsIdentityType returns true if typed id matches any expected identity type
func IsIdentityType(typedID string, expected ...string) bool {
	for _, e := range expected {
		if strings.HasPrefix(string(typedID), e) {
			return true
		}
	}

	return false
}

func ParseTypedID(str string) (TypedID, error) {
	var typeID TypedID

	parts := strings.Split(str, ":")
	if len(parts) != 2 {
		return typeID, ErrInvalidTypedID.Errorf("expected typed id to have 2 parts")
	}

	t, err := ParseType(parts[0])
	if err != nil {
		return typeID, err
	}

	return NewTypedIDString(t, parts[1]), nil
}

// MustParseTypedID parses namespace id, it will panic if it fails to do so.
// Suitable to use in tests or when we can guarantee that we pass a correct format.
func MustParseTypedID(str string) TypedID {
	typeID, err := ParseTypedID(str)
	if err != nil {
		panic(err)
	}
	return typeID
}

func NewTypedID(t string, id int64) TypedID {
	return TypedID(fmt.Sprintf("%s:%d", t, id))
}

// NewTypedIDString creates a new TypedID with a string id
func NewTypedIDString(t string, id string) TypedID {
	return TypedID(fmt.Sprintf("%s:%s", t, id))
}

// FIXME(kalleep): remove this one and only use string
type TypedID string

func (ni TypedID) ID() string {
	return ""
	// return ni.id
}

// UserID will try to parse and int64 identifier if namespace is either user or service-account.
// For all other namespaces '0' will be returned.
func (ni TypedID) UserID() (int64, error) {
	if ni.IsType(TypeUser, TypeServiceAccount) {
		return ni.ParseInt()
	}
	return 0, nil
}

// ParseInt will try to parse the id as an int64 identifier.
func (ni TypedID) ParseInt() (int64, error) {
	return strconv.ParseInt(ni.ID(), 10, 64)
}

func (ni TypedID) Type() string {
	return strings.Split(string(ni), ":")[0]
}

func (ni TypedID) IsType(expected ...string) bool {
	return IsIdentityType(ni.String(), expected...)
}

func (ni TypedID) String() string {
	return string(ni)
}
