import { Button, Card, IconButton } from '@grafana/ui';

import { SavedView, useDeleteSavedViewMutation } from '../../../savedviews/api';

type Props = {
  view?: SavedView;
};

export function SavedViewCard(props: Props) {
  const [deleteSavedViewMutation] = useDeleteSavedViewMutation();

  const { uid, name, url } = props.view || {};

  const URL = url || 'http://localhost:3000/explore?schemaVersion=1&panes=...';
  const NAME = name || 'New Dashboard - Dashboards - Grafana<';

  const deleteSavedView = (uid: string) => {
    deleteSavedViewMutation({
      uid,
    });
  };

  return (
    <Card>
      <Card.Heading>{NAME}</Card.Heading>
      <Card.Meta>{URL}</Card.Meta>
      <Card.Description>Description</Card.Description>
      <Card.Actions>
        <Button key="open" variant="secondary" onClick={() => alert('open')}>
          Open
        </Button>
        <Card.SecondaryActions>
          <IconButton
            key="delete"
            name="trash-alt"
            tooltip="Delete this data source"
            onClick={() => deleteSavedView(uid || '')}
          />
        </Card.SecondaryActions>
      </Card.Actions>
    </Card>
  );
}
