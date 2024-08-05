import { Button, Card, IconButton } from '@grafana/ui';

export function SavedViewCard() {
  return (
    <Card>
      <Card.Heading>New Dashboard - Dashboards - Grafana</Card.Heading>
      <Card.Meta>http://localhost:3000/explore?schemaVersion=1&panes=...</Card.Meta>
      <Card.Description>Description</Card.Description>
      <Card.Actions>
        <Button key="open" variant="secondary" onClick={() => alert('open')}>
          Open
        </Button>
        <Card.SecondaryActions>
          <IconButton key="delete" name="trash-alt" tooltip="Delete this data source" />
        </Card.SecondaryActions>
      </Card.Actions>
    </Card>
  );
}
