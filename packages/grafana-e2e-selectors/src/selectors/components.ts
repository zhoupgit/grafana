// NOTE: by default Component string selectors are set up to be aria-labels,
// however there are many cases where your component may not need an aria-label
// (a <button> with clear text, for example, does not need an aria-label as it's already labeled)
// but you still might need to select it for testing,
// in that case please add the attribute data-testid={selector} in the component and
// prefix your selector string with 'data-testid' so that when create the selectors we know to search for it on the right attribute
/**
 * Selectors grouped/defined in Components
 *
 * @alpha
 */
export const Components = {
  RadioButton: {
    container: 'data-testid radio-button', //10.2.3 new*,
  },
  Breadcrumbs: {
    breadcrumb: (title: string) => `data-testid ${title} breadcrumb`, //9.4.0 new*,
  },
  TimePicker: {
    openButton: 'data-testid TimePicker Open Button', //*
    overlayContent: 'data-testid TimePicker Overlay Content', // 10.2.3 new*,
    fromField: 'data-testid Time Range from field', //10.2.3 data-test-id*
    toField: 'data-testid Time Range to field', //10.2.3 data-test-id*
    applyTimeRange: 'data-testid TimePicker submit button', //*
    copyTimeRange: 'data-testid TimePicker copy button', // 10.4.0 new*,
    pasteTimeRange: 'data-testid TimePicker paste button', // 10.4.0 new*,
    calendar: {
      label: 'data-testid Time Range calendar', //10.2.3 data-test-id*
      openButton: 'data-testid Open time range calendar', //10.2.3 data-test-id*
      closeButton: 'data-testid Close time range Calendar', //10.2.3 data-test-id*
    },
    absoluteTimeRangeTitle: 'data-testid-absolute-time-range-narrow', //*
  },
  DataSourcePermissions: {
    form: () => 'form[name="addPermission"]', //9.5.0 new**
    roleType: 'Role to add new permission to', //9.5.0 new**
    rolePicker: 'Built-in role picker', //9.5.0 new**
    permissionLevel: 'Permission Level', //9.5.0 new**
  },
  DateTimePicker: {
    input: 'data-testid date-time-input', //10.2.3 new**
  },
  DataSource: {
    TestData: {
      QueryTab: {
        scenarioSelectContainer: 'Test Data Query scenario select container', //*
        scenarioSelect: 'Test Data Query scenario select', //*
        max: 'TestData max', //*
        min: 'TestData min', //*
        noise: 'TestData noise', //*
        seriesCount: 'TestData series count', //*
        spread: 'TestData spread', //*
        startValue: 'TestData start value', //*
        drop: 'TestData drop values', //*
      },
    },
    DataSourceHttpSettings: {
      urlInput: 'data-testid Datasource HTTP settings url', //10.4.0 dti*
    },
    Jaeger: {
      traceIDInput: 'Trace ID', //*
    },
    Prometheus: {
      configPage: {
        connectionSettings: 'Data source connection URL', // aria-label in grafana experimental //*
        manageAlerts: 'prometheus-alerts-manager', // id for switch component //10.4.0*
        scrapeInterval: 'data-testid scrape interval', //10.4.0*
        queryTimeout: 'data-testid query timeout', //10.4.0*
        defaultEditor: 'data-testid default editor',
        disableMetricLookup: 'disable-metric-lookup', // id for switch component //10.4.0*
        prometheusType: 'data-testid prometheus type', //10.4.0*
        prometheusVersion: 'data-testid prometheus version', //10.4.0*
        cacheLevel: 'data-testid cache level', //10.4.0*
        incrementalQuerying: 'prometheus-incremental-querying', // id for switch component //10.4.0*
        queryOverlapWindow: 'data-testid query overlap window', //10.4.0*
        disableRecordingRules: 'disable-recording-rules', // id for switch component //10.4.0*
        customQueryParameters: 'data-testid custom query parameters', //10.4.0*
        httpMethod: 'data-testid http method', //10.4.0*
        exemplarsAddButton: 'data-testid Add exemplar config button', //10.3.0 dti*
        internalLinkSwitch: 'data-testid Internal link switch', //10.3.0 dti*
        codeModeMetricNamesSuggestionLimit: 'data-testid code mode metric names suggestion limit', //11.1.0*
      },
      queryEditor: {
        // kickstart: '', see QueryBuilder queryPatterns below
        explain: 'data-testid prometheus explain switch wrapper', //10.4.0*
        editorToggle: 'data-testid QueryEditorModeToggle', // wrapper for toggle //10.4.0*
        options: 'data-testid prometheus options', // wrapper for options group //10.4.0*
        legend: 'data-testid prometheus legend wrapper', // wrapper for multiple compomnents //10.4.0*
        format: 'data-testid prometheus format', //10.4.0*
        step: 'prometheus-step', // id for autosize component //10.4.0*
        type: 'data-testid prometheus type', //wrapper for radio button group //10.4.0*
        exemplars: 'prometheus-exemplars', // id for editor switch component //10.4.0*
        builder: {
          // see QueryBuilder below for commented selectors
          // labelSelect: 'data-testid Select label',
          // valueSelect: 'data-testid Select value',
          // matchOperatorSelect: 'data-testid Select match operator',
          metricSelect: 'data-testid metric select', //10.4.0*
          hints: 'data-testid prometheus hints', // wrapper for hints component //10.4.0*
          metricsExplorer: 'data-testid metrics explorer', //10.4.0*
          queryAdvisor: 'data-testid query advisor', //10.4.0*
        },
        code: {
          queryField: 'data-testid prometheus query field', //10.4.0*
          metricsCountInfo: 'data-testid metrics count disclaimer', //11.1.0*
          metricsBrowser: {
            openButton: 'data-testid open metrics browser', //10.4.0*
            selectMetric: 'data-testid select a metric', //10.4.0*
            seriesLimit: 'data-testid series limit', //10.3.1*
            metricList: 'data-testid metric list', //10.4.0*
            labelNamesFilter: 'data-testid label names filter', //10.4.0*
            labelValuesFilter: 'data-testid label values filter', //10.4.0*
            useQuery: 'data-testid use query', //10.4.0*
            useAsRateQuery: 'data-testid use as rate query', //10.4.0*
            validateSelector: 'data-testid validate selector', //10.4.0*
            clear: 'data-testid clear', //10.4.0*
          },
        },
      },
      exemplarMarker: 'data-testid Exemplar marker', //10.3.0 dti*
      variableQueryEditor: {
        queryType: 'data-testid query type', //10.4.0*
        labelnames: {
          metricRegex: 'data-testid label names metric regex', //10.4.0*
        },
        labelValues: {
          labelSelect: 'data-testid label values label select', //10.4.0*
          // metric select see queryEditor: builder for more context
          // label select for metric filtering see queryEditor: builder for more context
        },
        metricNames: {
          metricRegex: 'data-testid metric names metric regex', //10.4.0*
        },
        varQueryResult: 'data-testid variable query result', //10.4.0*
        seriesQuery: 'data-testid prometheus series query', //10.4.0*
        classicQuery: 'data-testid prometheus classic query', //10.4.0*
      },
      annotations: {
        minStep: 'prometheus-annotation-min-step', // id for autosize input //10.4.0*
        title: 'data-testid prometheus annotation title', //10.4.0*
        tags: 'data-testid prometheus annotation tags', //10.4.0*
        text: 'data-testid prometheus annotation text', //10.4.0*
        seriesValueAsTimestamp: 'data-testid prometheus annotation series value as timestamp', //10.4.0*
      },
    },
  },
  Menu: {
    MenuComponent: (title: string) => `${title} menu`, //*
    MenuGroup: (title: string) => `${title} menu group`, //*
    MenuItem: (title: string) => `${title} menu item`, //*
    SubMenu: {
      container: 'data-testid SubMenu container', //10.3.0 dti*
      icon: 'data-testid SubMenu icon', //10.3.0 dti*
    },
  },
  Panels: {
    Panel: {
      title: (title: string) => `data-testid Panel header ${title}`, //*
      content: 'data-testid panel content', //11.1.0*
      headerItems: (item: string) => `data-testid Panel header item ${item}`, //10.2.0 dti*
      menuItems: (item: string) => `data-testid Panel menu item ${item}`, //9.5.0*
      menu: (title: string) => `data-testid Panel menu ${title}`, //9.5.0*
      containerByTitle: (title: string) => `${title} panel`, //*
      headerCornerInfo: (mode: string) => `Panel header ${mode}`, //*
      status: (status: string) => `data-testid Panel status ${status}`, //10.2.0 dti*
      loadingBar: () => `Panel loading bar`, //10.0.0*
      HoverWidget: {
        container: 'data-testid hover-header-container', //10.1.0 dti*
        dragIcon: 'data-testid drag-icon', //10.0.0*
      },
      PanelDataErrorMessage: 'data-testid Panel data error message', //10.4.0*
    },
    Visualization: {
      Graph: {
        container: 'Graph container', //9.5.0 new**
        VisualizationTab: {
          legendSection: 'Legend section', //*
        },
        Legend: {
          legendItemAlias: (name: string) => `gpl alias ${name}`, //*
          showLegendSwitch: 'gpl show legend', //*
        },
        xAxis: {
          labels: () => 'div.flot-x-axis > div.flot-tick-label', //*
        },
      },
      BarGauge: {
        /**
         * @deprecated use valueV2 from Grafana 8.3 instead
         */
        value: 'Bar gauge value',
        valueV2: 'data-testid Bar gauge value', //*
      },
      PieChart: {
        svgSlice: 'data testid Pie Chart Slice', //10.3.0 dti*
      },
      Text: {
        container: () => '.markdown-html', //*
      },
      Table: {
        header: 'table header', //*
        footer: 'table-footer', //*
        body: 'data-testid table body', //10.2.0*
      },
    },
  },
  VizLegend: {
    seriesName: (name: string) => `data-testid VizLegend series ${name}`, //10.3.0 dti*
  },
  Drawer: {
    General: {
      title: (title: string) => `Drawer title ${title}`, //*
      expand: 'Drawer expand', //*
      contract: 'Drawer contract', //*
      close: 'data-testid Drawer close', //10.3.0 dti*
      rcContentWrapper: () => '.rc-drawer-content-wrapper', //9.4.0*
      subtitle: 'data-testid drawer subtitle', //10.4.0*
    },
    DashboardSaveDrawer: {
      saveButton: 'data-testid Save dashboard drawer button', //11.1.0*
      saveAsButton: 'data-testid Save as dashboard drawer button', //11.1.0*
      saveAsTitleInput: 'Save dashboard title field', //11.1.0*
    },
  },
  PanelEditor: {
    General: {
      content: 'data-testid Panel editor content', //11.1.0 dti*
    },
    OptionsPane: {
      content: 'data-testid Panel editor option pane content', //11.1.0 dti*
      select: 'Panel editor option pane select', //*
      fieldLabel: (type: string) => `${type} field property editor`, //*
      fieldInput: (title: string) => `data-testid Panel editor option pane field input ${title}`, //11.0.0*
    },
    // not sure about the naming *DataPane*
    DataPane: {
      content: 'data-testid Panel editor data pane content', //11.1.0 dti*
    },
    applyButton: 'data-testid Apply changes and go back to dashboard', //9.2.0 dti*
    toggleVizPicker: 'data-testid toggle-viz-picker', //10.1.0 dti*
    toggleVizOptions: 'data-testid toggle-viz-options', //10.1.0 dti*
    toggleTableView: 'data-testid toggle-table-view', //11.1.0 dti*

    // [Geomap] Map controls
    showZoomField: 'Map controls Show zoom control field property editor', //10.2.0*
    showAttributionField: 'Map controls Show attribution field property editor', //10.2.0*
    showScaleField: 'Map controls Show scale field property editor', //10.2.0*
    showMeasureField: 'Map controls Show measure tools field property editor', //10.2.0*
    showDebugField: 'Map controls Show debug field property editor', //10.2.0*

    measureButton: 'show measure tools', //9.2.0*
  },
  PanelInspector: {
    Data: {
      content: 'Panel inspector Data content', //*
    },
    Stats: {
      content: 'Panel inspector Stats content', //*
    },
    Json: {
      content: 'data-testid Panel inspector Json content', //11.1.0 dti*
    },
    Query: {
      content: 'Panel inspector Query content', //*
      refreshButton: 'Panel inspector Query refresh button', //*
      jsonObjectKeys: () => '.json-formatter-key', //*
    },
  },
  Tab: {
    title: (title: string) => `data-testid Tab ${title}`, //11.2.0 dti*
    active: () => '[class*="-activeTabStyle"]', //*
  },
  RefreshPicker: {
    /**
     * @deprecated use runButtonV2 from Grafana 8.3 instead
     */
    runButton: 'RefreshPicker run button', //*
    /**
     * @deprecated use intervalButtonV2 from Grafana 8.3 instead
     */
    intervalButton: 'RefreshPicker interval button', //*
    runButtonV2: 'data-testid RefreshPicker run button', //*
    intervalButtonV2: 'data-testid RefreshPicker interval button', //*
  },
  QueryTab: {
    content: 'Query editor tab content', //*
    queryInspectorButton: 'Query inspector button', //*
    queryHistoryButton: 'data-testid query-history-button', //10.2.0 dti*
    addQuery: 'data-testid query-tab-add-query', //10.2.0 'Query editor add query button' before that*
    queryGroupTopSection: 'data-testid query group top section', //11.2.0*
    addExpression: 'data-testid query-tab-add-expression', //11.2.0*
  },
  QueryHistory: {
    queryText: 'Query text', //9.0.0*
  },
  QueryEditorRows: {
    rows: 'Query editor row', //*
  },
  QueryEditorRow: {
    actionButton: (title: string) => `data-testid ${title}`, //10.4.0 dti*
    title: (refId: string) => `Query editor row title ${refId}`,
    container: (refId: string) => `Query editor row ${refId}`,
  },
  AlertTab: {
    content: 'data-testid Alert editor tab content',
  },
  AlertRules: {
    groupToggle: 'data-testid group-collapse-toggle', //11.0.0*
    toggle: 'data-testid collapse-toggle', //11.0.0*
    expandedContent: 'data-testid expanded-content', //11.0.0*
    previewButton: 'data-testid alert-rule preview-button', //11.1.0*
    ruleNameField: 'data-testid alert-rule name-field', //11.1.0*
    newFolderButton: 'data-testid alert-rule new-folder-button', //11.1.0*
    newFolderNameField: 'data-testid alert-rule name-folder-name-field', //11.1.0*
    newFolderNameCreateButton: 'data-testid alert-rule name-folder-name-create-button', //11.1.0*
    newEvaluationGroupButton: 'data-testid alert-rule new-evaluation-group-button', //11.1.0*
    newEvaluationGroupName: 'data-testid alert-rule new-evaluation-group-name', //11.1.0*
    newEvaluationGroupInterval: 'data-testid alert-rule new-evaluation-group-interval', //11.1.0*
    newEvaluationGroupCreate: 'data-testid alert-rule new-evaluation-group-create-button', //11.1.0*
  },
  Alert: {
    /**
     * @deprecated use alertV2 from Grafana 8.3 instead
     */
    alert: (severity: string) => `Alert ${severity}`, //*
    alertV2: (severity: string) => `data-testid Alert ${severity}`, //*
  },
  TransformTab: {
    content: 'data-testid Transform editor tab content', //10.1.0 dti*
    newTransform: (name: string) => `data-testid New transform ${name}`, //10.1.0 dti*
    transformationEditor: (name: string) => `data-testid Transformation editor ${name}`, //10.1.0 dti*
    transformationEditorDebugger: (name: string) => `data-testid Transformation editor debugger ${name}`, //10.1.0 dti*
  },
  Transforms: {
    card: (name: string) => `data-testid New transform ${name}`, //10.1.0 dti*
    disableTransformationButton: 'data-testid Disable transformation button', //10.4.0*
    Reduce: {
      modeLabel: 'data-testid Transform mode label', //10.2.3 dti*
      calculationsLabel: 'data-testid Transform calculations label', //10.2.3 dti*
    },
    SpatialOperations: {
      actionLabel: 'root Action field property editor', //9.1.2*
      locationLabel: 'root Location Mode field property editor', //10.2.0 'root Action field property editor' since 9.1.2*
      location: {
        autoOption: 'Auto location option', //9.1.2*
        coords: {
          option: 'Coords location option', //9.1.2*
          latitudeFieldLabel: 'root Latitude field field property editor', //9.1.2*
          longitudeFieldLabel: 'root Longitude field field property editor', //9.1.2*
        },
        geohash: {
          option: 'Geohash location option', //9.1.2*
          geohashFieldLabel: 'root Geohash field field property editor', //9.1.2*
        },
        lookup: {
          option: 'Lookup location option', //9.1.2*
          lookupFieldLabel: 'root Lookup field field property editor', //9.1.2*
          gazetteerFieldLabel: 'root Gazetteer field property editor', //9.1.2*
        },
      },
    },
    searchInput: 'data-testid search transformations', //10.2.3 dti*
    noTransformationsMessage: 'data-testid no transformations message', //10.2.3*
    addTransformationButton: 'data-testid add transformation button', //10.1.0 dti*
    removeAllTransformationsButton: 'data-testid remove all transformations button', //10.4.0*
  },
  NavBar: {
    Configuration: {
      button: 'Configuration', //9.5.0 new**
    },
    Toggle: {
      button: 'data-testid Toggle menu', //10.2.3 dti*
    },
    Reporting: {
      button: 'Reporting', //9.5.0 new**
    },
  },
  NavMenu: {
    Menu: 'data-testid navigation mega-menu', //10.2.3*
    item: 'data-testid Nav menu item', //9.5.0*
  },
  NavToolbar: {
    container: 'data-testid Nav toolbar', //9.4.0 new!
    shareDashboard: 'data-testid Share dashboard', //11.1.0*
    markAsFavorite: 'data-testid Mark as favorite', //11.1.0*
    editDashboard: {
      editButton: 'data-testid Edit dashboard button', //11.1.0*
      saveButton: 'data-testid Save dashboard button', //11.1.0*
      exitButton: 'data-testid Exit edit mode button', //11.1.0*
      settingsButton: 'data-testid Dashboard settings', //11.1.0*
      addRowButton: 'data-testid Add row button', //11.1.0*
      addLibraryPanelButton: 'data-testid Add a panel from the panel library button', //11.1.0*
      addVisualizationButton: 'data-testid Add new visualization menu item', //11.1.0*
      pastePanelButton: 'data-testid Paste panel button', //11.1.0*
      discardChangesButton: 'data-testid Discard changes button', //11.1.0*
      discardLibraryPanelButton: 'data-testid Discard library panel button', //11.1.0*
      unlinkLibraryPanelButton: 'data-testid Unlink library panel button', //11.1.0*
      saveLibraryPanelButton: 'data-testid Save library panel button', //11.1.0*
      backToDashboardButton: 'data-testid Back to dashboard button', //11.1.0*
    },
  },

  PageToolbar: {
    container: () => '.page-toolbar', //*
    item: (tooltip: string) => `${tooltip}`, //*
    itemButton: (title: string) => `data-testid ${title}`, //9.5.0 dti*
  },
  QueryEditorToolbarItem: {
    button: (title: string) => `QueryEditor toolbar item button ${title}`, //*
  },
  BackButton: {
    backArrow: 'data-testid Go Back', //10.3.0 dti*
  },
  OptionsGroup: {
    group: (title?: string) => (title ? `data-testid Options group ${title}` : 'data-testid Options group'), //11.1.0 dti*
    toggle: (title?: string) =>
      title ? `data-testid Options group ${title} toggle` : 'data-testid Options group toggle', //11.1.0 dti*
  },
  PluginVisualization: {
    item: (title: string) => `Plugin visualization item ${title}`, //*
    current: () => '[class*="-currentVisualizationItem"]', //*
  },
  Select: {
    option: 'data-testid Select option', //11.1.0 dti*
    input: () => 'input[id*="time-options-input"]', //*
    singleValue: () => 'div[class*="-singleValue"]', //*
  },
  FieldConfigEditor: {
    content: 'Field config editor content', //*
  },
  OverridesConfigEditor: {
    content: 'Field overrides editor content', //*
  },
  FolderPicker: {
    /**
     * @deprecated use containerV2 from Grafana 8.3 instead
     */
    container: 'Folder picker select container', //*
    containerV2: 'data-testid Folder picker select container', //*
    input: 'data-testid folder-picker-input', //10.4.0 'Select a folder' before that*
  },
  ReadonlyFolderPicker: {
    container: 'data-testid Readonly folder picker select container', //*
  },
  DataSourcePicker: {
    container: 'data-testid Data source picker select container', //10.1.0 dti*
    /**
     * @deprecated use inputV2 instead
     */
    input: () => 'input[id="data-source-picker"]', //*
    inputV2: 'data-testid Select a data source', //10.1.0 dti*
    dataSourceList: 'data-testid Data source list dropdown', //10.4.0*
    advancedModal: {
      dataSourceList: 'data-testid Data source list', //10.4.0*
      builtInDataSourceList: 'data-testid Built in data source list', //10.4.0*
    },
  },
  TimeZonePicker: {
    /**
     * @deprecated use TimeZonePicker.containerV2 from Grafana 8.3 instead
     */
    container: 'Time zone picker select container', //*
    containerV2: 'data-testid Time zone picker select container', //*
    changeTimeSettingsButton: 'data-testid Time zone picker Change time settings button', //11.0.0*
  },
  WeekStartPicker: {
    /**
     * @deprecated use WeekStartPicker.containerV2 from Grafana 8.3 instead
     */
    container: 'Choose starting day of the week', //*
    containerV2: 'data-testid Choose starting day of the week', //*
    placeholder: 'Choose starting day of the week', //*
  },
  TraceViewer: {
    spanBar: 'data-testid SpanBar--wrapper', //9.0.0 '[data-test-id="SpanBar--wrapper"]' before that*
  },
  QueryField: { container: 'data-testid Query field' }, //10.3.0 dti*
  QueryBuilder: {
    queryPatterns: 'data-testid Query patterns', //10.3.0 dti*
    labelSelect: 'data-testid Select label', //10.3.0 dti*
    inputSelect: 'data-testid Select label-input',
    valueSelect: 'data-testid Select value', //10.3.0 dti*
    matchOperatorSelect: 'data-testid Select match operator', //10.3.0 dti*
  },
  ValuePicker: {
    button: (name: string) => `data-testid Value picker button ${name}`, //10.3.0 dti*
    select: (name: string) => `data-testid Value picker select ${name}`, //10.3.0 dti*
  },
  Search: {
    /**
     * @deprecated use sectionV2 from Grafana 8.3 instead
     */
    section: 'Search section', //*
    sectionV2: 'data-testid Search section', //*
    /**
     * @deprecated use itemsV2 from Grafana 8.3 instead
     */
    items: 'Search items', //*
    itemsV2: 'data-testid Search items', //*
    cards: 'data-testid Search cards', //*
    collapseFolder: (sectionId: string) => `data-testid Collapse folder ${sectionId}`, //*
    expandFolder: (sectionId: string) => `data-testid Expand folder ${sectionId}`, //*
    dashboardItem: (item: string) => `${Components.Search.dashboardItems} ${item}`, //*
    dashboardCard: (item: string) => `data-testid Search card ${item}`, //*
    folderHeader: (folderName: string) => `data-testid Folder header ${folderName}`, //9.3.0*
    folderContent: (folderName: string) => `data-testid Folder content ${folderName}`, //9.3.0*
    dashboardItems: 'data-testid Dashboard search item',
  },
  DashboardLinks: {
    container: 'data-testid Dashboard link container', //*
    dropDown: 'data-testid Dashboard link dropdown', //*
    link: 'data-testid Dashboard link', //*
  },
  LoadingIndicator: {
    icon: 'data-testid Loading indicator', //10.4.0 dti*
  },
  CallToActionCard: {
    /**
     * @deprecated use buttonV2 from Grafana 8.3 instead
     */
    button: (name: string) => `Call to action button ${name}`, //*
    buttonV2: (name: string) => `data-testid Call to action button ${name}`, //*
  },
  DataLinksContextMenu: {
    singleLink: 'data-testid Data link', //10.3.0 dti*
  },
  CodeEditor: {
    container: 'data-testid Code editor container', //10.2.3 dti*
  },
  ReactMonacoEditor: {
    editorLazy: 'data-testid ReactMonacoEditor editorLazy', //11.1.0
  },
  DashboardImportPage: {
    textarea: 'data-testid-import-dashboard-textarea', //*
    submit: 'data-testid-load-dashboard', //*
  },
  ImportDashboardForm: {
    name: 'data-testid-import-dashboard-title', //*
    submit: 'data-testid-import-dashboard-submit', //*
  },
  PanelAlertTabContent: {
    content: 'data-testid Unified alert editor tab content', //10.2.3 dti*
  },
  VisualizationPreview: {
    card: (name: string) => `data-testid suggestion-${name}`, //*
  },
  ColorSwatch: {
    name: `data-testid-colorswatch`, //*
  },
  DashboardRow: {
    title: (title: string) => `data-testid dashboard-row-title-${title}`, //*
  },
  UserProfile: {
    profileSaveButton: 'data-testid-user-profile-save', //*
    preferencesSaveButton: 'data-testid-shared-prefs-save', //*
    orgsTable: 'data-testid-user-orgs-table', //*
    sessionsTable: 'data-testid-user-sessions-table', //*
    extensionPointTabs: 'data-testid-extension-point-tabs', //10.2.3*
    extensionPointTab: (tabId: string) => `data-testid-extension-point-tab-${tabId}`, //10.2.3*
  },
  FileUpload: {
    inputField: 'data-testid-file-upload-input-field', //9.0.0*
    fileNameSpan: 'data-testid-file-upload-file-name', //9.0.0*
  },
  DebugOverlay: {
    wrapper: 'debug-overlay', //9.2.0*
  },
  OrgRolePicker: {
    input: 'Role', //9.5.0 new*
  },
  AnalyticsToolbarButton: {
    button: 'Dashboard insights', //9.5.0 new**
  },
  Variables: {
    variableOption: 'data-testid variable-option', //9.5.0*
    variableLinkWrapper: 'data-testid variable-link-wrapper', //11.1.1*
  },
  Annotations: {
    annotationsTypeInput: 'data-testid annotations-type-input', //11.1.0 dti*
    annotationsChoosePanelInput: 'data-testid choose-panels-input', //11.1.0 dti*
    editor: {
      testButton: 'data-testid annotations-test-button', //11.0.0*
      resultContainer: 'data-testid annotations-query-result-container', //11.0.0*
    },
  },
  Tooltip: {
    container: 'data-testid tooltip', //10.2.0*
  },
  ReturnToPrevious: {
    buttonGroup: 'data-testid dismissable button group', //11.0.0*
    backButton: 'data-testid back', //11.0.0*
    dismissButton: 'data-testid dismiss', //11.0.0*
  },
  SQLQueryEditor: {
    selectColumn: 'data-testid select-column', //11.0.0*
    selectAggregation: 'data-testid select-aggregation', //11.0.0*
    selectAlias: 'data-testid select-alias', //11.0.0*
    filterConjunction: 'data-testid filter-conjunction', //11.0.0*
    filterField: 'data-testid filter-field', //11.0.0*
    filterOperator: 'data-testid filter-operator', //11.0.0*
    headerTableSelector: 'data-testid header-table-selector', //11.0.0*
    headerFilterSwitch: 'data-testid header-filter-switch', //11.0.0*
    headerGroupSwitch: 'data-testid header-group-switch', //11.0.0*
    headerOrderSwitch: 'data-testid header-order-switch', //11.0.0*
    headerPreviewSwitch: 'data-testid header-preview-switch', //11.0.0*
  },
  EntityNotFound: {
    container: 'data-testid entity-not-found', //11.2.0*
  },
};
