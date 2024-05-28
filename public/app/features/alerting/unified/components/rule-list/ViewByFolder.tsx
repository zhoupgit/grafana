import { css } from '@emotion/css';
import React from 'react';

import type { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import type { CombinedRuleNamespace } from 'app/types/unified-alerting';

import { getApplicationFromRulesSource, getRulesSourceUniqueKey } from '../../utils/datasource';
import { makeFolderAlertsLink } from '../../utils/misc';

import { EvaluationGroupWithRules } from './EvaluationGroupWithRules';
import Namespace from './Namespace';

interface Props {
  namespaces: CombinedRuleNamespace[];
}

const ViewByFolder = ({ namespaces }: Props) => {
  const styles = useStyles2(getStyles);

  return (
    <>
      <ul className={styles.rulesTree} role="tree" aria-label="List of alert rules">
        {namespaces.map((namespace) => {
          const { rulesSource, uid } = namespace;

          const application = getApplicationFromRulesSource(rulesSource);
          const href = application === 'grafana' && uid ? makeFolderAlertsLink(uid, namespace.name) : undefined;

          return (
            <Namespace
              key={getRulesSourceUniqueKey(rulesSource) + namespace.name}
              href={href}
              name={namespace.name}
              application={application}
            >
              {namespace.groups
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((group) => (
                  <EvaluationGroupWithRules key={group.name} group={group} />
                ))}
            </Namespace>
          );
        })}
      </ul>
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  rulesTree: css({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }),
});

export default ViewByFolder;
