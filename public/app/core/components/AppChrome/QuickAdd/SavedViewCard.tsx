import { css } from '@emotion/css';
import { useCallback, useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Button, Card, Icon, IconButton, IconName, Input, useStyles2 } from '@grafana/ui';

import { SavedView, useDeleteSavedViewMutation, useEditSavedViewMutation } from '../../../savedviews/api';
import { myView } from '../../../savedviews/utils';

type Props = {
  view: SavedView;
};

export function SavedViewCard(props: Props) {
  const [deleteSavedViewMutation] = useDeleteSavedViewMutation();
  const [editSavedViewMutation] = useEditSavedViewMutation();
  const styles = useStyles2(getStyles);

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
  const { user, uid, icon, description, name, url, metadata } = props.view;

  const [editName, setEditName] = useState<string>(name);
  const [editDescription, setEditDescription] = useState<string>(description);

  const deleteSavedView = (uid: string) => {
    deleteSavedViewMutation({
      uid,
    });
  };

  const edit = useCallback(
    (uid: string) => {
      editSavedViewMutation({
        uid: uid,
        name: editName,
        icon,
        description: editDescription,
        url: url,
        metadata,
      });
    },
    [editName, editSavedViewMutation, icon, editDescription, metadata]
  );

  const iconName = icon as IconName;

  const readNameComponent = (
    <div onClick={() => setIsEditingName(true)}>
      {iconName ? <Icon name={iconName} className={css({ marginRight: 5, marginTop: -2 })} /> : undefined}
      {name}
    </div>
  );
  const addonAfter = (
    <Button
      onClick={(event) => {
        edit(uid || '');
      }}
    >
      Save
    </Button>
  );
  const editNameComponent = (
    <Input
      className={css({ width: '100%' })}
      onBlur={() => setTimeout(() => setIsEditingName(false), 100)}
      addonAfter={addonAfter}
      value={editName}
      onChange={(event) => setEditName(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          setEditName(event.currentTarget.value);
          edit(uid || '');
        }
      }}
    />
  );

  const readDescriptionComponent = <div onClick={() => setIsEditingDescription(true)}>{description}</div>;
  const addonAfterDescription = (
    <Button
      onClick={(event) => {
        edit(uid || '');
      }}
    >
      Save
    </Button>
  );
  const editDescriptionComponent = (
    <Input
      className={css({ width: '100%' })}
      onBlur={() => setTimeout(() => setIsEditingDescription(false), 100)}
      addonAfter={addonAfterDescription}
      value={editDescription}
      onChange={(event) => setEditDescription(event.currentTarget.value)}
    />
  );

  const sinceAdded = Date.now() - props.view.createdAtTimestamp;
  console.log(sinceAdded);
  return (
    <Card className={sinceAdded < 2000 ? styles.fresh : undefined}>
      <Card.Heading>{isEditingName && myView(props.view) ? editNameComponent : readNameComponent}</Card.Heading>
      <Card.Meta className={styles.singleLine}>
        <a href={url} onClick={() => window.open(url, '_self')}>
          {url}
        </a>
      </Card.Meta>
      <Card.Description>
        {isEditingDescription && myView(props.view) ? editDescriptionComponent : readDescriptionComponent}
      </Card.Description>
      <Card.Actions>
        <a href={url}>
          <IconButton key="link" name="repeat" tooltip="Switch to" />
        </a>
        {myView(props.view) && (
          <a href="#">
            <IconButton
              key="delete"
              name="trash-alt"
              tooltip="Delete this view"
              onClick={() => deleteSavedView(uid || '')}
            />
          </a>
        )}
      </Card.Actions>
    </Card>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  singleLine: css({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    overflow: 'hidden',
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textOverflow: 'ellipsis',
  }),
  fresh: css({
    borderColor: theme.colors.success.main,
    borderWidth: 1,
    borderStyle: 'solid',
  }),
});
