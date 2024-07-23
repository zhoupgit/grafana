package notifier

import (
	"context"
	"encoding/base64"

	"github.com/grafana/grafana/pkg/apimachinery/identity"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/ngalert/api/tooling/definitions"
	"github.com/grafana/grafana/pkg/services/ngalert/models"
	"github.com/grafana/grafana/pkg/services/secrets"
)

// ReceiverService is the service for managing alertmanager receivers.
type ReceiverService struct {
	authz             receiverAccessControlService
	receiverStore     receiverStore
	encryptionService secrets.Service
	log               log.Logger
}

// receiverAccessControlService provides access control for receivers.
type receiverAccessControlService interface {
	FilterRead(context.Context, identity.Requester, ...*models.Receiver) ([]*models.Receiver, error)
	AuthorizeRead(context.Context, identity.Requester, *models.Receiver) error
	FilterReadDecrypted(context.Context, identity.Requester, ...*models.Receiver) ([]*models.Receiver, error)
	AuthorizeReadDecrypted(context.Context, identity.Requester, *models.Receiver) error
	HasList(ctx context.Context, user identity.Requester) (bool, error)
}

type receiverStore interface {
	GetReceiver(ctx context.Context, orgID int64, uid string) (*models.Receiver, error)
	GetReceivers(ctx context.Context, orgID int64, uids ...string) ([]*models.Receiver, error)
	DeleteReceiver(ctx context.Context, orgID int64, uid string, callerProvenance models.Provenance, version string) error
}

func NewReceiverService(
	authz receiverAccessControlService,
	receiverStore receiverStore,
	encryptionService secrets.Service,
	log log.Logger,
) *ReceiverService {
	return &ReceiverService{
		authz:             authz,
		encryptionService: encryptionService,
		log:               log,
		receiverStore:     receiverStore,
	}
}

// GetReceiver returns a receiver by name.
// The receiver's secure settings are decrypted if requested and the user has access to do so.
func (rs *ReceiverService) GetReceiver(ctx context.Context, q models.GetReceiverQuery, user identity.Requester) (definitions.GettableApiReceiver, error) {
	rcv, err := rs.receiverStore.GetReceiver(ctx, q.OrgID, models.GetUID(q.Name))
	if err != nil {
		return definitions.GettableApiReceiver{}, err
	}

	auth := rs.authz.AuthorizeReadDecrypted
	if !q.Decrypt {
		auth = rs.authz.AuthorizeRead
	}
	if err := auth(ctx, user, rcv); err != nil {
		return definitions.GettableApiReceiver{}, err
	}

	rs.decryptOrRedactSecureSettings(ctx, rcv, q.Decrypt)

	return ReceiverToGettable(rcv)
}

// GetReceivers returns a list of receivers a user has access to.
// Receivers can be filtered by name, and secure settings are decrypted if requested and the user has access to do so.
func (rs *ReceiverService) GetReceivers(ctx context.Context, q models.GetReceiversQuery, user identity.Requester) ([]definitions.GettableApiReceiver, error) {
	uids := make([]string, 0, len(q.Names))
	for _, name := range q.Names {
		uids = append(uids, models.GetUID(name))
	}

	receivers, err := rs.receiverStore.GetReceivers(ctx, q.OrgID, uids...)
	if err != nil {
		return nil, err
	}

	filterFn := rs.authz.FilterReadDecrypted
	if !q.Decrypt {
		filterFn = rs.authz.FilterRead
	}
	filtered, err := filterFn(ctx, user, receivers...)
	if err != nil {
		return nil, err
	}

	var output []definitions.GettableApiReceiver
	for i := q.Offset; i < len(filtered); i++ {
		r := filtered[i]
		rs.decryptOrRedactSecureSettings(ctx, r, q.Decrypt)
		res, err := ReceiverToGettable(r)
		if err != nil {
			return nil, err
		}

		output = append(output, res)
		// stop if we have reached the limit or we have found all the requested receivers
		if (len(output) == q.Limit && q.Limit > 0) || (len(output) == len(q.Names)) {
			break
		}
	}

	return output, nil
}

// ListReceivers returns a list of receivers a user has access to.
// Receivers can be filtered by name.
// This offers an looser permissions compared to GetReceivers. When a user doesn't have read access it will check for list access instead of returning an empty list.
// If the users has list access, all receiver settings will be removed from the response. This option is for backwards compatibility with the v1/receivers endpoint
// and should be removed when FGAC is fully implemented.
func (rs *ReceiverService) ListReceivers(ctx context.Context, q models.ListReceiversQuery, user identity.Requester) ([]definitions.GettableApiReceiver, error) { // TODO: Remove this method with FGAC.
	listAccess, err := rs.authz.HasList(ctx, user)
	if err != nil {
		return nil, err
	}

	uids := make([]string, 0, len(q.Names))
	for _, name := range q.Names {
		uids = append(uids, models.GetUID(name))
	}

	receivers, err := rs.receiverStore.GetReceivers(ctx, q.OrgID, uids...)
	if err != nil {
		return nil, err
	}

	if !listAccess {
		var err error
		receivers, err = rs.authz.FilterRead(ctx, user, receivers...)
		if err != nil {
			return nil, err
		}
	}

	var output []definitions.GettableApiReceiver
	for i := q.Offset; i < len(receivers); i++ {
		r := receivers[i]

		// Remove settings.
		for _, integration := range r.Integrations {
			integration.Settings = nil
			integration.SecureSettings = nil
			integration.DisableResolveMessage = false
		}

		res, err := ReceiverToGettable(r)
		if err != nil {
			return nil, err
		}

		output = append(output, res)
		// stop if we have reached the limit or we have found all the requested receivers
		if (len(output) == q.Limit && q.Limit > 0) || (len(output) == len(q.Names)) {
			break
		}
	}

	return output, nil
}

// DeleteReceiver deletes a receiver by uid.
// UID field currently does not exist, we assume the uid is a particular hashed value of the receiver name.
func (rs *ReceiverService) DeleteReceiver(ctx context.Context, uid string, orgID int64, callerProvenance definitions.Provenance, version string) error {
	//TODO: Check delete permissions.
	return rs.receiverStore.DeleteReceiver(ctx, orgID, uid, models.Provenance(callerProvenance), version)
}

func (rs *ReceiverService) CreateReceiver(ctx context.Context, r definitions.GettableApiReceiver, orgID int64) (definitions.GettableApiReceiver, error) {
	// TODO: Stub
	panic("not implemented")
}

func (rs *ReceiverService) UpdateReceiver(ctx context.Context, r definitions.GettableApiReceiver, orgID int64) (definitions.GettableApiReceiver, error) {
	// TODO: Stub
	panic("not implemented")
}

func (rs *ReceiverService) decryptOrRedactSecureSettings(ctx context.Context, recv *models.Receiver, decrypt bool) {
	decryptOrRedact := rs.redactor()
	if decrypt {
		decryptOrRedact = rs.decryptor(ctx)
	}
	for _, r := range recv.Integrations {
		for field, val := range r.SecureSettings {
			newVal, err := decryptOrRedact(val)
			if err != nil {
				newVal = ""
				rs.log.Warn("failed to decrypt secure setting", "name", recv.Name, "error", err)
			}
			r.SecureSettings[field] = newVal
		}
	}
}

// decryptor returns a decryptFn that decrypts a secure setting. If decryption fails, the fallback value is used.
func (rs *ReceiverService) decryptor(ctx context.Context) decryptFn {
	return func(value string) (string, error) {
		decoded, err := base64.StdEncoding.DecodeString(value)
		if err != nil {
			return "", err
		}
		decrypted, err := rs.encryptionService.Decrypt(ctx, decoded)
		if err != nil {
			return "", err
		}
		return string(decrypted), nil
	}
}

// redactor returns a decryptFn that redacts a secure setting.
func (rs *ReceiverService) redactor() decryptFn {
	return func(value string) (string, error) {
		return definitions.RedactedValue, nil
	}
}

type decryptFn = func(value string) (string, error)
