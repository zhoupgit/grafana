define(['@grafana/data', 'module', 'react'], function (grafanaData, amdModule, React) {
  const plugin = new grafanaData.AppPlugin()
    .exposeComponent({
      id: 'myorg-componentexposer-app/reusable-component/v1',
      title: 'Reusable component',
      description: 'A component that can be reused by other app plugins.',
      component: function ({ name }) {
        return React.createElement('div', { 'data-testid': 'exposed-component' }, 'Hello ', name, '!');
      },
    })
    .addComponent({
      targets: 'plugins/myorg-extensionpoint-app/actions',
      title: 'Add component',
      description: 'Add component to an extension point',
      component: function () {
        return React.createElement('div', { 'data-testid': 'added-component' }, 'Yo - added component!');
      },
    });

  return {
    plugin: plugin,
  };
});
