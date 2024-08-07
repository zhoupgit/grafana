import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { Card, Icon, IconButton, IconName, useStyles2 } from '@grafana/ui';

import { HistoryView } from '../../../savedviews/api';

type Props = {
  view: HistoryView;
  deleteHistoryView: (view: HistoryView) => void;
  saveHistoryView: (view: HistoryView) => void;
};

export function HistoryViewCard(props: Props) {
  const { icon, description, name, url } = props.view;
  const styles = useStyles2(getStyles);
  const iconName = icon as IconName;

  return (
    <Card className={css({ opacity: 0.8 })}>
      <Card.Heading>
        <div>
          {iconName ? <Icon name={iconName} className={css({ marginRight: 5, marginTop: -2 })} /> : undefined}
          {name}
        </div>
      </Card.Heading>
      <Card.Meta>
        <a href={url} onClick={() => window.open(url, '_self')}>
          {decodeURIComponent(decodeURI(url))}
        </a>
      </Card.Meta>
      <Card.Description>
        <div>{description}</div>
      </Card.Description>
      <Card.Actions>
        <a href="#">
          <IconButton key="save" name="save" tooltip="Save" onClick={() => props.saveHistoryView(props.view)} />
        </a>
        <a href={url}>
          <IconButton key="link" name="repeat" tooltip="Switch to" />
        </a>
        <a href="#">
          <IconButton
            key="delete"
            name="trash-alt"
            tooltip="Delete this view"
            onClick={() => props.deleteHistoryView(props.view)}
          />
        </a>
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
});
