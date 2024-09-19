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
    container: {
      '10.2.3': 'data-testid radio-button',
    },
  },
  Breadcrumbs: {
    breadcrumb: {
      '9.4.0': (title: string) => `data-testid ${title} breadcrumb`,
    },
  },
  TimePicker: {
    openButton: {
      '8.5.0': 'data-testid TimePicker Open Button',
    },
    overlayContent: {
      '10.2.3': 'data-testid TimePicker Overlay Content',
    },
    fromField: {
      '10.2.3': 'data-testid Time Range from field',
      '8.5.0': 'Time Range from field',
    },
    toField: {
      '10.2.3': 'data-testid Time Range to field',
      '8.5.0': 'Time Range to field',
    },
    applyTimeRange: {
      '8.5.0': 'data-testid TimePicker submit button',
    },
    copyTimeRange: {
      '10.4.0': 'data-testid TimePicker copy button',
    },
    pasteTimeRange: {
      '10.4.0': 'data-testid TimePicker paste button',
    },
    calendar: {
      label: {
        '10.2.3': 'data-testid Time Range calendar',
        '8.5.0': 'Time Range calendar',
      },
      openButton: {
        '10.2.3': 'data-testid Open time range calendar',
        '8.5.0': 'Open time range calendar',
      },
      closeButton: {
        '10.2.3': 'data-testid Close time range Calendar',
        '8.5.0': 'Close time range Calendar',
      },
    },
    absoluteTimeRangeTitle: {
      '8.5.0': 'data-testid-absolute-time-range-narrow',
    },
  },
  DataSourcePermissions: {
    form: { '9.5.0': () => 'form[name="addPermission"]' },
    roleType: {
      '9.5.0': 'Role to add new permission to',
    },
    rolePicker: {
      '9.5.0': 'Built-in role picker',
    },
    permissionLevel: {
      '9.5.0': 'Permission Level',
    },
  },
  DateTimePicker: {
    input: {
      '10.2.3': 'data-testid date-time-input',
    },
  },
  DataSource: {
    TestData: {
      QueryTab: {
        scenarioSelectContainer: {
          '8.5.0': 'Test Data Query scenario select container',
        },
        scenarioSelect: {
          '8.5.0': 'Test Data Query scenario select',
        },
        max: {
          '8.5.0': 'TestData max',
        },
        min: {
          '8.5.0': 'TestData min',
        },
        noise: {
          '8.5.0': 'TestData noise',
        },
        seriesCount: {
          '8.5.0': 'TestData series count',
        },
        spread: {
          '8.5.0': 'TestData spread',
        },
        startValue: {
          '8.5.0': 'TestData start value',
        },
        drop: {
          '8.5.0': 'TestData drop values',
        },
      },
    },
    DataSourceHttpSettings: {
      urlInput: {
        '10.4.0': 'data-testid Datasource HTTP settings url',
        '8.5.0': 'Datasource HTTP settings url',
      },
    },
    Jaeger: {
      traceIDInput: {
        '8.5.0': 'Trace ID',
      },
    },
    Prometheus: {
      configPage: {
        connectionSettings: { '8.5.0': 'Data source connection URL' }, // aria-label in grafana experimental
        manageAlerts: { '10.4.0': 'prometheus-alerts-manager' }, // id for switch component
        scrapeInterval: {
          '10.4.0': 'data-testid scrape interval',
        },
        queryTimeout: {
          '10.4.0': 'data-testid query timeout',
        },
        defaultEditor: 'data-testid default editor',
        disableMetricLookup: { '10.4.0': 'disable-metric-lookup' }, // id for switch component
        prometheusType: {
          '10.4.0': 'data-testid prometheus type',
        },
        prometheusVersion: {
          '10.4.0': 'data-testid prometheus version',
        },
        cacheLevel: {
          '10.4.0': 'data-testid cache level',
        },
        incrementalQuerying: { '10.4.0': 'prometheus-incremental-querying' }, // id for switch component
        queryOverlapWindow: {
          '10.4.0': 'data-testid query overlap window',
        },
        disableRecordingRules: { '10.4.0': 'disable-recording-rules' }, // id for switch component
        customQueryParameters: {
          '10.4.0': 'data-testid custom query parameters',
        },
        httpMethod: {
          '10.4.0': 'data-testid http method',
        },
        exemplarsAddButton: {
          '10.3.0': 'data-testid Add exemplar config button',
          '8.5.0': 'Add exemplar config button',
        },
        internalLinkSwitch: {
          '10.3.0': 'data-testid Internal link switch',
          '8.5.0': 'Internal link switch',
        },
        codeModeMetricNamesSuggestionLimit: {
          '11.1.0': 'data-testid code mode metric names suggestion limit',
        },
      },
      queryEditor: {
        // kickstart: '', see QueryBuilder queryPatterns below
        explain: {
          '10.4.0': 'data-testid prometheus explain switch wrapper',
        },
        editorToggle: {
          '10.4.0': 'data-testid QueryEditorModeToggle', // wrapper for toggle
        },
        options: {
          '10.4.0': 'data-testid prometheus options', // wrapper for options group
        },
        legend: {
          '10.4.0': 'data-testid prometheus legend wrapper', // wrapper for multiple compomnents
        },
        format: {
          '10.4.0': 'data-testid prometheus format',
        },
        step: {
          '10.4.0': 'prometheus-step', // id for autosize component
        },
        type: {
          '10.4.0': 'data-testid prometheus type', //wrapper for radio button group
        },
        exemplars: {
          '10.4.0': 'prometheus-exemplars', // id for editor switch component
        },
        builder: {
          // see QueryBuilder below for commented selectors
          // labelSelect: 'data-testid Select label',
          // valueSelect: 'data-testid Select value',
          // matchOperatorSelect: 'data-testid Select match operator',
          metricSelect: {
            '10.4.0': 'data-testid metric select',
          },
          hints: {
            '10.4.0': 'data-testid prometheus hints', // wrapper for hints component
          },
          metricsExplorer: {
            '10.4.0': 'data-testid metrics explorer',
          },
          queryAdvisor: {
            '10.4.0': 'data-testid query advisor',
          },
        },
        code: {
          queryField: {
            '10.4.0': 'data-testid prometheus query field',
          },
          metricsCountInfo: {
            '11.1.0': 'data-testid metrics count disclaimer',
          },
          metricsBrowser: {
            openButton: {
              '10.4.0': 'data-testid open metrics browser',
            },
            selectMetric: {
              '10.4.0': 'data-testid select a metric',
            },
            seriesLimit: {
              '10.3.1': 'data-testid series limit',
            },
            metricList: {
              '10.4.0': 'data-testid metric list',
            },
            labelNamesFilter: {
              '10.4.0': 'data-testid label names filter',
            },
            labelValuesFilter: {
              '10.4.0': 'data-testid label values filter',
            },
            useQuery: {
              '10.4.0': 'data-testid use query',
            },
            useAsRateQuery: {
              '10.4.0': 'data-testid use as rate query',
            },
            validateSelector: {
              '10.4.0': 'data-testid validate selector',
            },
            clear: {
              '10.4.0': 'data-testid clear',
            },
          },
        },
      },
      exemplarMarker: {
        '10.3.0': 'data-testid Exemplar marker',
        '8.5.0': 'Exemplar marker',
      },
      variableQueryEditor: {
        queryType: {
          '10.4.0': 'data-testid query type',
        },
        labelnames: {
          metricRegex: {
            '10.4.0': 'data-testid label names metric regex',
          },
        },
        labelValues: {
          labelSelect: {
            '10.4.0': 'data-testid label values label select',
          },
          // metric select see queryEditor: builder for more context
          // label select for metric filtering see queryEditor: builder for more context
        },
        metricNames: {
          metricRegex: {
            '10.4.0': 'data-testid metric names metric regex',
          },
        },
        varQueryResult: {
          '10.4.0': 'data-testid variable query result',
        },
        seriesQuery: {
          '10.4.0': 'data-testid prometheus series query',
        },
        classicQuery: {
          '10.4.0': 'data-testid prometheus classic query',
        },
      },
      annotations: {
        minStep: {
          '10.4.0': 'prometheus-annotation-min-step', // id for autosize input
        },
        title: {
          '10.4.0': 'data-testid prometheus annotation title',
        },
        tags: {
          '10.4.0': 'data-testid prometheus annotation tags',
        },
        text: {
          '10.4.0': 'data-testid prometheus annotation text',
        },
        seriesValueAsTimestamp: {
          '10.4.0': 'data-testid prometheus annotation series value as timestamp',
        },
      },
    },
  },
  Menu: {
    MenuComponent: {
      '8.5.0': (title: string) => `${title} menu`,
    },
    MenuGroup: {
      '8.5.0': (title: string) => `${title} menu group`,
    },
    MenuItem: {
      '8.5.0': (title: string) => `${title} menu item`,
    },
    SubMenu: {
      container: {
        '10.3.0': 'data-testid SubMenu container',
        '8.5.0': 'SubMenu container',
      },
      icon: {
        '10.3.0': 'data-testid SubMenu icon',
        '8.5.0': 'SubMenu icon',
      },
    },
  },
  Panels: {
    Panel: {
      title: {
        '8.5.0': (title: string) => `data-testid Panel header ${title}`,
      },
      content: {
        '11.1.0': 'data-testid panel content',
      },
      headerItems: {
        '10.2.0': (item: string) => `data-testid Panel header item ${item}`,
      },
      menuItems: {
        '9.5.0': (item: string) => `data-testid Panel menu item ${item}`,
      },
      menu: {
        '9.5.0': (title: string) => `data-testid Panel menu ${title}`,
      },
      containerByTitle: {
        '8.5.0': (title: string) => `${title} panel`,
      },
      headerCornerInfo: {
        '8.5.0': (mode: string) => `Panel header ${mode}`,
      },
      status: {
        '10.2.0': (status: string) => `data-testid Panel status ${status}`,
      },
      loadingBar: {
        '10.0.0': () => `Panel loading bar`,
      },
      HoverWidget: {
        container: {
          '10.1.0': 'data-testid hover-header-container',
          '8.5.0': 'hover-header-container',
        },
        dragIcon: {
          '10.0.0': 'data-testid drag-icon',
        },
      },
      PanelDataErrorMessage: {
        '10.4.0': 'data-testid Panel data error message',
      },
    },
    Visualization: {
      Graph: {
        container: {
          '9.5.0': 'Graph container',
        },
        VisualizationTab: {
          legendSection: {
            '8.5.0': 'Legend section',
          },
        },
        Legend: {
          legendItemAlias: {
            '8.5.0': (name: string) => `gpl alias ${name}`,
          },
          showLegendSwitch: {
            '8.5.0': 'gpl show legend',
          },
        },
        xAxis: {
          labels: { '8.5.0': () => 'div.flot-x-axis > div.flot-tick-label' },
        },
      },
      BarGauge: {
        /**
         * @deprecated use valueV2 from Grafana 8.3 instead
         */
        value: 'Bar gauge value',
        valueV2: {
          '8.5.0': 'data-testid Bar gauge value',
        },
      },
      PieChart: {
        svgSlice: {
          '10.3.0': 'data testid Pie Chart Slice',
        },
      },
      Text: {
        container: { '8.5.0': () => '.markdown-html' },
      },
      Table: {
        header: {
          '8.5.0': 'table header',
        },
        footer: {
          '8.5.0': 'table-footer',
        },
        body: {
          '10.2.0': 'data-testid table body',
        },
      },
    },
  },
  VizLegend: {
    seriesName: {
      '10.3.0': (name: string) => `data-testid VizLegend series ${name}`,
    },
  },
  Drawer: {
    General: {
      title: {
        '8.5.0': (title: string) => `Drawer title ${title}`,
      },
      expand: {
        '8.5.0': 'Drawer expand',
      },
      contract: {
        '8.5.0': 'Drawer contract',
      },
      close: {
        '10.3.0': 'data-testid Drawer close',
        '8.5.0': 'Drawer close',
      },
      rcContentWrapper: { '9.4.0': () => '.rc-drawer-content-wrapper' },
      subtitle: {
        '10.4.0': 'data-testid drawer subtitle',
      },
    },
    DashboardSaveDrawer: {
      saveButton: {
        '11.1.0': 'data-testid Save dashboard drawer button',
      },
      saveAsButton: {
        '11.1.0': 'data-testid Save as dashboard drawer button',
      },
      saveAsTitleInput: {
        '11.1.0': 'Save dashboard title field',
      },
    },
  },
  PanelEditor: {
    General: {
      content: {
        '11.1.0': 'data-testid Panel editor content',
        '8.5.0': 'Panel editor content',
      },
    },
    OptionsPane: {
      content: {
        '11.1.0': 'data-testid Panel editor option pane content',
        '8.5.0': 'Panel editor option pane content',
      },
      select: {
        '8.5.0': 'Panel editor option pane select',
      },
      fieldLabel: {
        '8.5.0': (type: string) => `${type} field property editor`,
      },
      fieldInput: {
        '11.0.0': (title: string) => `data-testid Panel editor option pane field input ${title}`,
      },
    },
    // not sure about the naming *DataPane*
    DataPane: {
      content: {
        '11.1.0': 'data-testid Panel editor data pane content',
        '8.5.0': 'Panel editor data pane content',
      },
    },
    applyButton: {
      '9.2.0': 'data-testid Apply changes and go back to dashboard',
    },
    toggleVizPicker: {
      '10.1.0': 'data-testid toggle-viz-picker',
      '8.5.0': 'toggle-viz-picker',
    },
    toggleVizOptions: {
      '10.1.0': 'data-testid toggle-viz-options',
      '8.5.0': 'toggle-viz-options',
    },
    toggleTableView: {
      '11.1.0': 'data-testid toggle-table-view',
      '8.5.0': 'toggle-table-view',
    },

    // [Geomap] Map controls
    showZoomField: {
      '10.2.0': 'Map controls Show zoom control field property editor',
    },
    showAttributionField: {
      '10.2.0': 'Map controls Show attribution field property editor',
    },
    showScaleField: {
      '10.2.0': 'Map controls Show scale field property editor',
    },
    showMeasureField: {
      '10.2.0': 'Map controls Show measure tools field property editor',
    },
    showDebugField: {
      '10.2.0': 'Map controls Show debug field property editor',
    },

    measureButton: {
      '9.2.0': 'show measure tools',
    },
  },
  PanelInspector: {
    Data: {
      content: {
        '8.5.0': 'Panel inspector Data content',
      },
    },
    Stats: {
      content: {
        '8.5.0': 'Panel inspector Stats content',
      },
    },
    Json: {
      content: {
        '11.1.0': 'data-testid Panel inspector Json content',
        '8.5.0': 'Panel inspector Json content',
      },
    },
    Query: {
      content: {
        '8.5.0': 'Panel inspector Query content',
      },
      refreshButton: {
        '8.5.0': 'Panel inspector Query refresh button',
      },
      jsonObjectKeys: {
        '8.5.0': () => '.json-formatter-key',
      },
    },
  },
  Tab: {
    title: {
      '11.2.0': (title: string) => `data-testid Tab ${title}`,
    },
    active: { '8.5.0': () => '[class*="-activeTabStyle"]' },
  },
  RefreshPicker: {
    /**
     * @deprecated use runButtonV2 from Grafana 8.3 instead
     */
    runButton: {
      '8.5.0': 'RefreshPicker run button',
    },
    /**
     * @deprecated use intervalButtonV2 from Grafana 8.3 instead
     */
    intervalButton: {
      '8.5.0': 'RefreshPicker interval button',
    },
    runButtonV2: {
      '8.5.0': 'data-testid RefreshPicker run button',
    },
    intervalButtonV2: {
      '8.5.0': 'data-testid RefreshPicker interval button',
    },
  },
  QueryTab: {
    content: {
      '8.5.0': 'Query editor tab content',
    },
    queryInspectorButton: {
      '8.5.0': 'Query inspector button',
    },
    queryHistoryButton: {
      '10.2.0': 'data-testid query-history-button',
      '8.5.0': 'query-history-button',
    },
    addQuery: {
      '10.2.0': 'data-testid query-tab-add-query',
    },
    queryGroupTopSection: {
      '11.2.0': 'data-testid query group top section',
    },
    addExpression: {
      '11.2.0': 'data-testid query-tab-add-expression',
    },
  },
  QueryHistory: {
    queryText: {
      '9.0.0': 'Query text',
    },
  },
  QueryEditorRows: {
    rows: {
      '8.5.0': 'Query editor row',
    },
  },
  QueryEditorRow: {
    actionButton: {
      '10.4.0': (title: string) => `data-testid ${title}`,
    },
    title: (refId: string) => `Query editor row title ${refId}`,
    container: (refId: string) => `Query editor row ${refId}`,
  },
  AlertTab: {
    content: 'data-testid Alert editor tab content',
  },
  AlertRules: {
    groupToggle: {
      '11.0.0': 'data-testid group-collapse-toggle',
    },
    toggle: {
      '11.0.0': 'data-testid collapse-toggle',
    },
    expandedContent: {
      '11.0.0': 'data-testid expanded-content',
    },
    previewButton: {
      '11.1.0': 'data-testid alert-rule preview-button',
    },
    ruleNameField: {
      '11.1.0': 'data-testid alert-rule name-field',
    },
    newFolderButton: {
      '11.1.0': 'data-testid alert-rule new-folder-button',
    },
    newFolderNameField: {
      '11.1.0': 'data-testid alert-rule name-folder-name-field',
    },
    newFolderNameCreateButton: {
      '11.1.0': 'data-testid alert-rule name-folder-name-create-button',
    },
    newEvaluationGroupButton: {
      '11.1.0': 'data-testid alert-rule new-evaluation-group-button',
    },
    newEvaluationGroupName: {
      '11.1.0': 'data-testid alert-rule new-evaluation-group-name',
    },
    newEvaluationGroupInterval: {
      '11.1.0': 'data-testid alert-rule new-evaluation-group-interval',
    },
    newEvaluationGroupCreate: {
      '11.1.0': 'data-testid alert-rule new-evaluation-group-create-button',
    },
  },
  Alert: {
    /**
     * @deprecated use alertV2 from Grafana 8.3 instead
     */
    alert: {
      '8.5.0': (severity: string) => `Alert ${severity}`,
    },
    alertV2: {
      '8.5.0': (severity: string) => `data-testid Alert ${severity}`,
    },
  },
  TransformTab: {
    content: {
      '10.1.0': 'data-testid Transform editor tab content',
      '8.5.0': 'Transform editor tab content',
    },
    newTransform: {
      '10.1.0': (name: string) => `data-testid New transform ${name}`,
    },
    transformationEditor: {
      '10.1.0': (name: string) => `data-testid Transformation editor ${name}`,
    },
    transformationEditorDebugger: {
      '10.1.0': (name: string) => `data-testid Transformation editor debugger ${name}`,
    },
  },
  Transforms: {
    card: {
      '10.1.0': (name: string) => `data-testid New transform ${name}`,
    },
    disableTransformationButton: {
      '10.4.0': 'data-testid Disable transformation button',
    },
    Reduce: {
      modeLabel: {
        '10.2.3': 'data-testid Transform mode label',
        '8.5.0': 'Transform mode label',
      },
      calculationsLabel: {
        '10.2.3': 'data-testid Transform calculations label',
        '8.5.0': 'Transform calculations label',
      },
    },
    SpatialOperations: {
      actionLabel: {
        '9.1.2': 'root Action field property editor',
      },
      locationLabel: {
        '10.2.0': 'root Location Mode field property editor',
      },
      location: {
        autoOption: {
          '9.1.2': 'Auto location option',
        },
        coords: {
          option: {
            '9.1.2': 'Coords location option',
          },
          latitudeFieldLabel: {
            '9.1.2': 'root Latitude field field property editor',
          },
          longitudeFieldLabel: {
            '9.1.2': 'root Longitude field field property editor',
          },
        },
        geohash: {
          option: {
            '9.1.2': 'Geohash location option',
          },
          geohashFieldLabel: {
            '9.1.2': 'root Geohash field field property editor',
          },
        },
        lookup: {
          option: {
            '9.1.2': 'Lookup location option',
          },
          lookupFieldLabel: {
            '9.1.2': 'root Lookup field field property editor',
          },
          gazetteerFieldLabel: {
            '9.1.2': 'root Gazetteer field property editor',
          },
        },
      },
    },
    searchInput: {
      '10.2.3': 'data-testid search transformations',
      '8.5.0': 'search transformations',
    },
    noTransformationsMessage: {
      '10.2.3': 'data-testid no transformations message',
    },
    addTransformationButton: {
      '10.1.0': 'data-testid add transformation button',
      '8.5.0': 'add transformation button',
    },
    removeAllTransformationsButton: {
      '10.4.0': 'data-testid remove all transformations button',
    },
  },
  NavBar: {
    Configuration: {
      button: {
        '9.5.0': 'Configuration',
      },
    },
    Toggle: {
      button: {
        '10.2.3': 'data-testid Toggle menu',
        '8.5.0': 'Toggle menu',
      },
    },
    Reporting: {
      button: {
        '9.5.0': 'Reporting',
      },
    },
  },
  NavMenu: {
    Menu: {
      '10.2.3': 'data-testid navigation mega-menu',
    },
    item: {
      '9.5.0': 'data-testid Nav menu item',
    },
  },
  NavToolbar: {
    container: {
      '9.4.0': 'data-testid Nav toolbar',
    },
    shareDashboard: {
      '11.1.0': 'data-testid Share dashboard',
    },
    markAsFavorite: {
      '11.1.0': 'data-testid Mark as favorite',
    },
    editDashboard: {
      editButton: {
        '11.1.0': 'data-testid Edit dashboard button',
      },
      saveButton: {
        '11.1.0': 'data-testid Save dashboard button',
      },
      exitButton: {
        '11.1.0': 'data-testid Exit edit mode button',
      },
      settingsButton: {
        '11.1.0': 'data-testid Dashboard settings',
      },
      addRowButton: {
        '11.1.0': 'data-testid Add row button',
      },
      addLibraryPanelButton: {
        '11.1.0': 'data-testid Add a panel from the panel library button',
      },
      addVisualizationButton: {
        '11.1.0': 'data-testid Add new visualization menu item',
      },
      pastePanelButton: {
        '11.1.0': 'data-testid Paste panel button',
      },
      discardChangesButton: {
        '11.1.0': 'data-testid Discard changes button',
      },
      discardLibraryPanelButton: {
        '11.1.0': 'data-testid Discard library panel button',
      },
      unlinkLibraryPanelButton: {
        '11.1.0': 'data-testid Unlink library panel button',
      },
      saveLibraryPanelButton: {
        '11.1.0': 'data-testid Save library panel button',
      },
      backToDashboardButton: {
        '11.1.0': 'data-testid Back to dashboard button',
      },
    },
  },

  PageToolbar: {
    container: { '8.5.0': () => '.page-toolbar' },
    item: {
      '8.5.0': (tooltip: string) => `${tooltip}`,
    },
    itemButton: {
      '9.5.0': (title: string) => `data-testid ${title}`,
    },
  },
  QueryEditorToolbarItem: {
    button: {
      '8.5.0': (title: string) => `QueryEditor toolbar item button ${title}`,
    },
  },
  BackButton: {
    backArrow: {
      '10.3.0': 'data-testid Go Back',
      '8.5.0': 'Go Back',
    },
  },
  OptionsGroup: {
    group: {
      '11.1.0': (title?: string) => (title ? `data-testid Options group ${title}` : 'data-testid Options group'),
      '8.5.0': (title?: string) => (title ? `Options group ${title}` : 'Options group'),
    },
    toggle: (title?: string) =>
      title
        ? `data-testid Options group ${title} toggle`
        : {
            '11.1.0': 'data-testid Options group toggle',
            '8.5.0': 'Options group toggle',
          },
  },
  PluginVisualization: {
    item: {
      '8.5.0': (title: string) => `Plugin visualization item ${title}`,
    },
    current: {
      '8.5.0': () => '[class*="-currentVisualizationItem"]',
    },
  },
  Select: {
    option: {
      '11.1.0': 'data-testid Select option',
      '8.5.0': 'Select option',
    },
    input: {
      '8.5.0': () => 'input[id*="time-options-input"]',
    },
    singleValue: {
      '8.5.0': () => 'div[class*="-singleValue"]',
    },
  },
  FieldConfigEditor: {
    content: {
      '8.5.0': 'Field config editor content',
    },
  },
  OverridesConfigEditor: {
    content: {
      '8.5.0': 'Field overrides editor content',
    },
  },
  FolderPicker: {
    /**
     * @deprecated use containerV2 from Grafana 8.3 instead
     */
    container: {
      '8.5.0': 'Folder picker select container',
    },
    containerV2: {
      '8.5.0': 'data-testid Folder picker select container',
    },
    input: {
      '10.4.0': 'data-testid folder-picker-input',
    },
  },
  ReadonlyFolderPicker: {
    container: {
      '8.5.0': 'data-testid Readonly folder picker select container',
    },
  },
  DataSourcePicker: {
    container: {
      '10.1.0': 'data-testid Data source picker select container',
      '8.5.0': 'Data source picker select container',
    },
    /**
     * @deprecated use inputV2 instead
     */
    input: {
      '8.5.0': () => 'input[id="data-source-picker"]',
    },
    inputV2: {
      '10.1.0': 'data-testid Select a data source',
      '8.5.0': 'Select a data source',
    },
    dataSourceList: {
      '10.4.0': 'data-testid Data source list dropdown',
    },
    advancedModal: {
      dataSourceList: {
        '10.4.0': 'data-testid Data source list',
      },
      builtInDataSourceList: {
        '10.4.0': 'data-testid Built in data source list',
      },
    },
  },
  TimeZonePicker: {
    /**
     * @deprecated use TimeZonePicker.containerV2 from Grafana 8.3 instead
     */
    container: {
      '8.5.0': 'Time zone picker select container',
    },
    containerV2: {
      '8.5.0': 'data-testid Time zone picker select container',
    },
    changeTimeSettingsButton: {
      '11.0.0': 'data-testid Time zone picker Change time settings button',
    },
  },
  WeekStartPicker: {
    /**
     * @deprecated use WeekStartPicker.containerV2 from Grafana 8.3 instead
     */
    container: {
      '8.5.0': 'Choose starting day of the week',
    },
    containerV2: {
      '8.5.0': 'data-testid Choose starting day of the week',
    },
    placeholder: {
      '8.5.0': 'Choose starting day of the week',
    },
  },
  TraceViewer: {
    spanBar: {
      '9.0.0': 'data-testid SpanBar--wrapper',
    },
  },
  QueryField: {
    container: {
      '10.3.0': 'data-testid Query field',
      '8.5.0': 'Query field',
    },
  },
  QueryBuilder: {
    queryPatterns: {
      '10.3.0': 'data-testid Query patterns',
      '8.5.0': 'Query patterns',
    },
    labelSelect: {
      '10.3.0': 'data-testid Select label',
      '8.5.0': 'Select label',
    },
    inputSelect: 'data-testid Select label-input',
    valueSelect: {
      '10.3.0': 'data-testid Select value',
      '8.5.0': 'Select value',
    },
    matchOperatorSelect: {
      '10.3.0': 'data-testid Select match operator',
      '8.5.0': 'Select match operator',
    },
  },
  ValuePicker: {
    button: {
      '10.3.0': (name: string) => `data-testid Value picker button ${name}`,
    },
    select: {
      '10.3.0': (name: string) => `data-testid Value picker select ${name}`,
    },
  },
  Search: {
    /**
     * @deprecated use sectionV2 from Grafana 8.3 instead
     */
    section: {
      '8.5.0': 'Search section',
    },
    sectionV2: {
      '8.5.0': 'data-testid Search section',
    },
    /**
     * @deprecated use itemsV2 from Grafana 8.3 instead
     */
    items: {
      '8.5.0': 'Search items',
    },
    itemsV2: {
      '8.5.0': 'data-testid Search items',
    },
    cards: {
      '8.5.0': 'data-testid Search cards',
    },
    collapseFolder: {
      '8.5.0': (sectionId: string) => `data-testid Collapse folder ${sectionId}`,
    },
    expandFolder: {
      '8.5.0': (sectionId: string) => `data-testid Expand folder ${sectionId}`,
    },
    dashboardItem: {
      '8.5.0': (item: string) => `${Components.Search.dashboardItems} ${item}`,
    },
    dashboardCard: {
      '8.5.0': (item: string) => `data-testid Search card ${item}`,
    },
    folderHeader: {
      '9.3.0': (folderName: string) => `data-testid Folder header ${folderName}`,
    },
    folderContent: {
      '9.3.0': (folderName: string) => `data-testid Folder content ${folderName}`,
    },
    dashboardItems: 'data-testid Dashboard search item',
  },
  DashboardLinks: {
    container: {
      '8.5.0': 'data-testid Dashboard link container',
    },
    dropDown: {
      '8.5.0': 'data-testid Dashboard link dropdown',
    },
    link: {
      '8.5.0': 'data-testid Dashboard link',
    },
  },
  LoadingIndicator: {
    icon: {
      '10.4.0': 'data-testid Loading indicator',
      '8.5.0': 'Loading indicator',
    },
  },
  CallToActionCard: {
    /**
     * @deprecated use buttonV2 from Grafana 8.3 instead
     */
    button: {
      '8.5.0': (name: string) => `Call to action button ${name}`,
    },
    buttonV2: {
      '8.5.0': (name: string) => `data-testid Call to action button ${name}`,
    },
  },
  DataLinksContextMenu: {
    singleLink: {
      '10.3.0': 'data-testid Data link',
      '8.5.0': 'Data link',
    },
  },
  CodeEditor: {
    container: {
      '10.2.3': 'data-testid Code editor container',
      '8.5.0': 'Code editor container',
    },
  },
  ReactMonacoEditor: {
    editorLazy: {
      '11.1.0': 'data-testid ReactMonacoEditor editorLazy',
    },
  },
  DashboardImportPage: {
    textarea: {
      '8.5.0': 'data-testid-import-dashboard-textarea',
    },
    submit: {
      '8.5.0': 'data-testid-load-dashboard',
    },
  },
  ImportDashboardForm: {
    name: {
      '8.5.0': 'data-testid-import-dashboard-title',
    },
    submit: {
      '8.5.0': 'data-testid-import-dashboard-submit',
    },
  },
  PanelAlertTabContent: {
    content: {
      '10.2.3': 'data-testid Unified alert editor tab content',
      '8.5.0': 'Unified alert editor tab content',
    },
  },
  VisualizationPreview: {
    card: {
      '8.5.0': (name: string) => `data-testid suggestion-${name}`,
    },
  },
  ColorSwatch: {
    name: `data-testid-colorswatch`, //*
  },
  DashboardRow: {
    title: {
      '8.5.0': (title: string) => `data-testid dashboard-row-title-${title}`,
    },
  },
  UserProfile: {
    profileSaveButton: {
      '8.5.0': 'data-testid-user-profile-save',
    },
    preferencesSaveButton: {
      '8.5.0': 'data-testid-shared-prefs-save',
    },
    orgsTable: {
      '8.5.0': 'data-testid-user-orgs-table',
    },
    sessionsTable: {
      '8.5.0': 'data-testid-user-sessions-table',
    },
    extensionPointTabs: {
      '10.2.3': 'data-testid-extension-point-tabs',
    },
    extensionPointTab: {
      '10.2.3': (tabId: string) => `data-testid-extension-point-tab-${tabId}`,
    },
  },
  FileUpload: {
    inputField: {
      '9.0.0': 'data-testid-file-upload-input-field',
    },
    fileNameSpan: {
      '9.0.0': 'data-testid-file-upload-file-name',
    },
  },
  DebugOverlay: {
    wrapper: {
      '9.2.0': 'debug-overlay',
    },
  },
  OrgRolePicker: {
    input: {
      '9.5.0': 'Role',
    },
  },
  AnalyticsToolbarButton: {
    button: {
      '9.5.0': 'Dashboard insights',
    },
  },
  Variables: {
    variableOption: {
      '9.5.0': 'data-testid variable-option',
    },
    variableLinkWrapper: {
      '11.1.1': 'data-testid variable-link-wrapper',
    },
  },
  Annotations: {
    annotationsTypeInput: {
      '11.1.0': 'data-testid annotations-type-input',
      '8.5.0': 'annotations-type-input',
    },
    annotationsChoosePanelInput: {
      '11.1.0': 'data-testid choose-panels-input',
      '8.5.0': 'choose-panels-input',
    },
    editor: {
      testButton: {
        '11.0.0': 'data-testid annotations-test-button',
      },
      resultContainer: {
        '11.0.0': 'data-testid annotations-query-result-container',
      },
    },
  },
  Tooltip: {
    container: {
      '10.2.0': 'data-testid tooltip',
    },
  },
  ReturnToPrevious: {
    buttonGroup: {
      '11.0.0': 'data-testid dismissable button group',
    },
    backButton: {
      '11.0.0': 'data-testid back',
    },
    dismissButton: {
      '11.0.0': 'data-testid dismiss',
    },
  },
  SQLQueryEditor: {
    selectColumn: {
      '11.0.0': 'data-testid select-column',
    },
    selectAggregation: {
      '11.0.0': 'data-testid select-aggregation',
    },
    selectAlias: {
      '11.0.0': 'data-testid select-alias',
    },
    filterConjunction: {
      '11.0.0': 'data-testid filter-conjunction',
    },
    filterField: {
      '11.0.0': 'data-testid filter-field',
    },
    filterOperator: {
      '11.0.0': 'data-testid filter-operator',
    },
    headerTableSelector: {
      '11.0.0': 'data-testid header-table-selector',
    },
    headerFilterSwitch: {
      '11.0.0': 'data-testid header-filter-switch',
    },
    headerGroupSwitch: {
      '11.0.0': 'data-testid header-group-switch',
    },
    headerOrderSwitch: {
      '11.0.0': 'data-testid header-order-switch',
    },
    headerPreviewSwitch: {
      '11.0.0': 'data-testid header-preview-switch',
    },
  },
  EntityNotFound: {
    container: {
      '11.2.0': 'data-testid entity-not-found',
    },
  },
};
