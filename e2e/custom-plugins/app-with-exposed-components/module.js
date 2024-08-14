define(['@grafana/data', '@grafana/runtime', 'react'], function (grafanaData, grafanaRuntime, React) {
  var AppPlugin = grafanaData.AppPlugin;
  var usePluginComponent = grafanaRuntime.usePluginComponent;
  var usePluginComponents = grafanaRuntime.usePluginComponents;

  var MyComponent = function () {
    var plugin = usePluginComponent('myorg-componentexposer-app/reusable-component/v1');
    var pluginComponents = usePluginComponents({ extensionPointId: 'plugins/myorg-extensionpoint-app/actions' });
    var TestComponent = plugin.component;
    var isLoading = plugin.isLoading;

    if (!TestComponent) {
      return null;
    }

    if (!pluginComponents.components.length) {
      return React.createElement('div', null, 'No components found');
    }

    // return React.createElement(
    //   React.Fragment,
    //   null,
    //   React.createElement('div', null, 'Exposed component:'),
    //   isLoading ? 'Loading..' : React.createElement(TestComponent, { name: 'World' })
    // );
    return React.createElement(
      'div',
      React.createElement(
        'div',
        { 'data-testid': 'test' },
        ('div', null, 'Added component:'),
        !pluginComponents.components.length
          ? 'No components found'
          : pluginComponents.components.map((Component, id) => React.createElement(Component, { key: id }))
      ),
      React.createElement('div', null, 'Exposed component:'),
      isLoading ? 'Loading..' : React.createElement(TestComponent, { name: 'World' })
    );
  };

  var App = function () {
    return React.createElement('div', null, 'Hello Grafana!', React.createElement(MyComponent, null));
  };

  var plugin = new AppPlugin().setRootPage(App);
  return { plugin: plugin };
});
