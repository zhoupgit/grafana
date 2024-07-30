import { ActionModel, Field, LinkModel } from '@grafana/data';

export const getDataLinks = (field: Field, rowIdx: number) => {
  const links: Array<LinkModel<Field>> = [];
  const linkLookup = new Set<string>();

  if ((field.config.links?.length ?? 0) > 0 && field.getLinks != null) {
    const v = field.values[rowIdx];
    const disp = field.display ? field.display(v) : { text: `${v}`, numeric: +v };
    field.getLinks({ calculatedValue: disp, valueRowIndex: rowIdx }).forEach((link) => {
      const key = `${link.title}/${link.href}`;
      if (!linkLookup.has(key)) {
        links.push(link);
        linkLookup.add(key);
      }
    });
  }

  return links;
};

export const getActions = (field: Field, rowIdx: number) => {
  const actions: Array<ActionModel<Field>> = [];
  const lookup = new Set<string>();

  const v = field.values[rowIdx];
  const disp = field.display ? field.display(v) : { text: `${v}`, numeric: +v };
  field.getActions?.({ calculatedValue: disp, valueRowIndex: rowIdx }).forEach((action) => {
    const key = `${action.title}`;
    if (!lookup.has(key)) {
      actions.push(action);
      lookup.add(key);
    }
  });

  return actions;
};
