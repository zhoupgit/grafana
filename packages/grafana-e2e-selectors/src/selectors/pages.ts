import { Components } from './components';

/**
 * Selectors grouped/defined in Pages
 *
 * @alpha
 */
export const Pages = {
  Login: {
    url: '/login', //*
    username: 'data-testid Username input field', //10.2.3 dti*
    password: 'data-testid Password input field', //10.2.3 dti*
    submit: 'data-testid Login button', //10.2.3 dti*
    skip: 'data-testid Skip change password button', //10.2.3 dti*
  },
  Home: {
    url: '/', //*
  },
  DataSource: {
    name: 'data-testid Data source settings page name input field', //10.3.0 dti*
    delete: 'Data source settings page Delete button', //*
    readOnly: 'data-testid Data source settings page read only message', //10.3.0 dti*
    saveAndTest: 'data-testid Data source settings page Save and Test button', //10.0.0*
    alert: 'data-testid Data source settings page Alert', //10.3.0 dti*
  },
  DataSources: {
    url: '/datasources', //*
    dataSources: (dataSourceName: string) => `Data source list item ${dataSourceName}`, //*
  },
  EditDataSource: {
    url: (dataSourceUid: string) => `/datasources/edit/${dataSourceUid}`, //9.5.0 new*
    settings: 'Datasource settings page basic settings', //9.5.0 new*
  },
  AddDataSource: {
    url: '/datasources/new', //*
    /** @deprecated Use dataSourcePluginsV2 */
    dataSourcePlugins: (pluginName: string) => `Data source plugin item ${pluginName}`, //*
    dataSourcePluginsV2: (pluginName: string) => `Add new data source ${pluginName}`, //9.3.1 '(pluginName: string) => `Add new data source ${pluginName}`' before that*
  },
  ConfirmModal: {
    delete: 'data-testid Confirm Modal Danger Button', //10.0.0 dti*
  },
  AddDashboard: {
    url: '/dashboard/new', //*
    itemButton: (title: string) => `data-testid ${title}`, //9.5.0*
    addNewPanel: 'data-testid Add new panel', //11.1.0 dti*
    addNewRow: 'data-testid Add new row', //11.1.0 dti*
    addNewPanelLibrary: 'data-testid Add new panel from panel library', //11.1.0 dti*
  },
  Dashboard: {
    url: (uid: string) => `/d/${uid}`, //*
    DashNav: {
      nav: 'Dashboard navigation', //*
      navV2: 'data-testid Dashboard navigation', //*
      publicDashboardTag: 'data-testid public dashboard tag', //9.1.0*
      shareButton: 'data-testid share-button',
      scrollContainer: 'data-testid Dashboard canvas scroll container', //11.1.0*
      newShareButton: {
        container: 'data-testid new share button', //11.1.0*
        shareLink: 'data-testid new share link-button', //11.1.0*
        arrowMenu: 'data-testid new share button arrow menu', //11.1.0*
        menu: {
          container: 'data-testid new share button menu', //11.1.0*
          shareInternally: 'data-testid new share button share internally', //11.1.0*
          shareExternally: 'data-testid new share button share externally', //11.1.1*
          shareSnapshot: 'data-testid new share button share snapshot', //11.2.0*
        },
      },
      NewExportButton: {
        container: 'data-testid new export button', //11.2.0*
        arrowMenu: 'data-testid new export button arrow menu', //11.2.0*
        Menu: {
          container: 'data-testid new export button menu', //11.2.0*
          exportAsJson: 'data-testid new export button export as json', //11.2.0*
        },
      },
      playlistControls: {
        prev: 'data-testid playlist previous dashboard button', //11.0.0*
        stop: 'data-testid playlist stop dashboard button', //11.0.0*
        next: 'data-testid playlist next dashboard button', //11.0.0*
      },
    },
    Controls: 'data-testid dashboard controls', //11.1.0*
    SubMenu: {
      submenu: 'Dashboard submenu', //*
      submenuItem: 'data-testid template variable', //*
      submenuItemLabels: (item: string) => `data-testid Dashboard template variables submenu Label ${item}`, //*
      submenuItemValueDropDownValueLinkTexts: (item: string) =>
        `data-testid Dashboard template variables Variable Value DropDown value link text ${item}`, //*
      submenuItemValueDropDownDropDown: 'Variable options', //*
      submenuItemValueDropDownOptionTexts: (item: string) =>
        `data-testid Dashboard template variables Variable Value DropDown option text ${item}`, //*
      Annotations: {
        annotationsWrapper: 'data-testid annotation-wrapper', //10.0.0*
        annotationLabel: (label: string) => `data-testid Dashboard annotations submenu Label ${label}`, //10.0.0*
        annotationToggle: (label: string) => `data-testid Dashboard annotations submenu Toggle ${label}`, //10.0.0*
      },
    },
    Settings: {
      Actions: {
        close: 'data-testid dashboard-settings-close', //9.5.0*
      },
      General: {
        deleteDashBoard: 'data-testid Dashboard settings page delete dashboard button', //11.1.0*
        sectionItems: (item: string) => `Dashboard settings section item ${item}`, //*
        saveDashBoard: 'Dashboard settings aside actions Save button', //*
        saveAsDashBoard: 'Dashboard settings aside actions Save As button', //*
        /**
         * @deprecated use components.TimeZonePicker.containerV2 from Grafana 8.3 instead
         */
        timezone: 'Time zone picker select container', //*
        title: 'General', //11.2.0 'Tab General' before that*
      },
      Annotations: {
        List: {
          addAnnotationCTAV2: Components.CallToActionCard.buttonV2('Add annotation query'), //*
          annotations: 'data-testid list-annotations', //10.4.0*
        },
        Settings: {
          name: 'data-testid Annotations settings name input', //11.1.0 dti*
        },
        NewAnnotation: {
          panelFilterSelect: 'data-testid annotations-panel-filter', //10.0.0*
          showInLabel: 'data-testid show-in-label', //11.1.0 dti 10.0.0*
          previewInDashboard: 'data-testid annotations-preview', //10.0.0*
          delete: 'data-testid annotations-delete', //10.4.0*
          apply: 'data-testid annotations-apply', //10.4.0*
          enable: 'data-testid annotation-enable', //10.4.0*
          hide: 'data-testid annotation-hide', //10.4.0*
        },
      },
      Variables: {
        List: {
          addVariableCTAV2: Components.CallToActionCard.buttonV2('Add variable'), //*
          newButton: 'Variable editor New variable button', //*
          table: 'Variable editor Table', //*
          tableRowNameFields: (variableName: string) => `Variable editor Table Name field ${variableName}`, //*
          tableRowDefinitionFields: (variableName: string) => `Variable editor Table Definition field ${variableName}`, //10.1.0 (variableName: string) => `Variable editor Table Description field ${variableName}` before that*
          tableRowArrowUpButtons: (variableName: string) => `Variable editor Table ArrowUp button ${variableName}`, //*
          tableRowArrowDownButtons: (variableName: string) => `Variable editor Table ArrowDown button ${variableName}`, //*
          tableRowDuplicateButtons: (variableName: string) => `Variable editor Table Duplicate button ${variableName}`, //*
          tableRowRemoveButtons: (variableName: string) => `Variable editor Table Remove button ${variableName}`, //*
        },
        Edit: {
          General: {
            headerLink: 'Variable editor Header link', //*
            modeLabelNew: 'Variable editor Header mode New', //*
            /**
             * @deprecated
             */
            modeLabelEdit: 'Variable editor Header mode Edit', //*
            generalNameInput: 'Variable editor Form Name field', //*
            generalNameInputV2: 'data-testid Variable editor Form Name field', //*
            generalTypeSelect: 'Variable editor Form Type select', //*
            generalTypeSelectV2: 'data-testid Variable editor Form Type select', //*
            generalLabelInput: 'Variable editor Form Label field', //*
            generalLabelInputV2: 'data-testid Variable editor Form Label field', //*
            generalHideSelect: 'Variable editor Form Hide select', //*
            generalHideSelectV2: 'data-testid Variable editor Form Hide select', //*
            selectionOptionsMultiSwitch: 'data-testid Variable editor Form Multi switch', //10.4.0 dti*
            selectionOptionsIncludeAllSwitch: 'data-testid Variable editor Form IncludeAll switch', //10.4.0 dti*
            selectionOptionsCustomAllInput: 'data-testid Variable editor Form IncludeAll field', //10.4.0 dti*
            previewOfValuesOption: 'data-testid Variable editor Preview of Values option', //10.4.0 dti*
            submitButton: 'data-testid Variable editor Run Query button', //10.4.0 dti*
            applyButton: 'data-testid Variable editor Apply button', //9.3.0*
          },
          QueryVariable: {
            queryOptionsDataSourceSelect: Components.DataSourcePicker.inputV2, //10.4.0 Components.DataSourcePicker.container before that*
            queryOptionsRefreshSelect: 'Variable editor Form Query Refresh select', //*
            queryOptionsRefreshSelectV2: 'data-testid Variable editor Form Query Refresh select', //*
            queryOptionsRegExInput: 'Variable editor Form Query RegEx field', //*
            queryOptionsRegExInputV2: 'data-testid Variable editor Form Query RegEx field', //*
            queryOptionsSortSelect: 'Variable editor Form Query Sort select', //*
            queryOptionsSortSelectV2: 'data-testid Variable editor Form Query Sort select', //*
            queryOptionsQueryInput: 'data-testid Variable editor Form Default Variable Query Editor textarea', //10.4.0*
            valueGroupsTagsEnabledSwitch: 'Variable editor Form Query UseTags switch', //*
            valueGroupsTagsTagsQueryInput: 'Variable editor Form Query TagsQuery field', //*
            valueGroupsTagsTagsValuesQueryInput: 'Variable editor Form Query TagsValuesQuery field', //*
          },
          ConstantVariable: {
            constantOptionsQueryInput: 'Variable editor Form Constant Query field', //*
            constantOptionsQueryInputV2: 'data-testid Variable editor Form Constant Query field', //*
          },
          DatasourceVariable: {
            datasourceSelect: 'data-testid datasource variable datasource type', //*
          },
          TextBoxVariable: {
            textBoxOptionsQueryInput: 'Variable editor Form TextBox Query field', //*
            textBoxOptionsQueryInputV2: 'data-testid Variable editor Form TextBox Query field', //*
          },
          CustomVariable: {
            customValueInput: 'data-testid custom-variable-input', //*
          },
          IntervalVariable: {
            intervalsValueInput: 'data-testid interval variable intervals input', //*
            autoEnabledCheckbox: 'data-testid interval variable auto value checkbox', //10.4.0*
            stepCountIntervalSelect: 'data-testid interval variable step count input', //10.4.0*
            minIntervalInput: 'data-testid interval variable mininum interval input', //10.4.0*
          },
          GroupByVariable: {
            dataSourceSelect: Components.DataSourcePicker.inputV2, //10.4.0*
            infoText: 'data-testid group by variable info text', //10.4.0*
            modeToggle: 'data-testid group by variable mode toggle', //10.4.0*
          },
          AdHocFiltersVariable: {
            datasourceSelect: Components.DataSourcePicker.inputV2, //10.4.0*
            infoText: 'data-testid ad-hoc filters variable info text', //10.4.0*
            modeToggle: 'data-testid ad-hoc filters variable mode toggle', //11.0.0*
          },
        },
      },
    },
    Annotations: {
      marker: 'data-testid annotation-marker', //10.0.0*
    },
    Rows: {
      Repeated: {
        ConfigSection: {
          warningMessage: 'data-testid Repeated rows warning message', //10.2.0*
        },
      },
    },
  },
  Dashboards: {
    url: '/dashboards', //*
    /**
     * @deprecated use components.Search.dashboardItem from Grafana 8.3 instead
     */
    dashboards: (title: string) => `Dashboard search item ${title}`, //10.2.0*
  },
  SaveDashboardAsModal: {
    newName: 'Save dashboard title field', //10.2.0*
    save: 'Save dashboard button', //10.2.0*
  },
  SaveDashboardModal: {
    save: 'Dashboard settings Save Dashboard Modal Save button', //10.2.0*
    saveVariables: 'Dashboard settings Save Dashboard Modal Save variables checkbox', //10.2.0*
    saveTimerange: 'Dashboard settings Save Dashboard Modal Save timerange checkbox', //10.2.0*
    saveRefresh: 'Dashboard settings Save Dashboard Modal Save refresh checkbox', //11.1.0*
  },
  SharePanelModal: {
    linkToRenderedImage: 'Link to rendered image', //*
  },
  ShareDashboardModal: {
    PublicDashboard: {
      WillBePublicCheckbox: 'data-testid public dashboard will be public checkbox', //9.1.0*
      LimitedDSCheckbox: 'data-testid public dashboard limited datasources checkbox', //9.1.0*
      CostIncreaseCheckbox: 'data-testid public dashboard cost may increase checkbox', //9.1.0*
      PauseSwitch: 'data-testid public dashboard pause switch', //9.5.0*
      EnableAnnotationsSwitch: 'data-testid public dashboard on off switch for annotations', //9.3.0*
      CreateButton: 'data-testid public dashboard create button', //9.5.0*
      DeleteButton: 'data-testid public dashboard delete button', //9.3.0*
      CopyUrlInput: 'data-testid public dashboard copy url input', //9.1.0*
      CopyUrlButton: 'data-testid public dashboard copy url button', //9.1.0*
      SettingsDropdown: 'data-testid public dashboard settings dropdown',
      TemplateVariablesWarningAlert: 'data-testid public dashboard disabled template variables alert', //9.1.0*
      UnsupportedDataSourcesWarningAlert: 'data-testid public dashboard unsupported data sources alert', //9.5.0*
      NoUpsertPermissionsWarningAlert: 'data-testid public dashboard no upsert permissions alert', //9.5.0*
      EnableTimeRangeSwitch: 'data-testid public dashboard on off switch for time range', //9.4.0*
      EmailSharingConfiguration: {
        Container: 'data-testid email sharing config container', //9.5.0*
        ShareType: 'data-testid public dashboard share type', //9.5.0*
        EmailSharingInput: 'data-testid public dashboard email sharing input', //9.5.0*
        EmailSharingInviteButton: 'data-testid public dashboard email sharing invite button', //9.5.0*
        EmailSharingList: 'data-testid public dashboard email sharing list', //9.5.0*
        DeleteEmail: 'data-testid public dashboard delete email button', //9.5.0*
        ReshareLink: 'data-testid public dashboard reshare link button', //9.5.0*
      },
    },
    SnapshotScene: {
      url: (key: string) => `/dashboard/snapshot/${key}`, //11.1.0*
      PublishSnapshot: 'data-testid publish snapshot button', //11.1.0*
      CopyUrlButton: 'data-testid snapshot copy url button', //11.1.0*
      CopyUrlInput: 'data-testid snapshot copy url input', //11.1.0*
    },
  },
  ShareDashboardDrawer: {
    ShareExternally: {
      container: 'data-testid share externally drawer container', //11.1.1*
      copyUrlButton: 'data-testid share externally copy url button', //11.1.1*
      shareTypeSelect: 'data-testid share externally share type select', //11.1.1*
    },
    ShareSnapshot: {
      container: 'data-testid share snapshot drawer container', //11.2.0*
    },
  },
  ExportDashboardDrawer: {
    ExportAsJson: {
      container: 'data-testid export as Json drawer container', //11.2.0*
      codeEditor: 'data-testid export as Json code editor', //11.2.0*
      exportExternallyToggle: 'data-testid export externally toggle type select', //11.2.0*
      saveToFileButton: 'data-testid save to file button', //11.2.0*
      copyToClipboardButton: 'data-testid copy to clipboard button', //11.2.0*
      cancelButton: 'data-testid cancel button', //11.2.0*
    },
  },
  PublicDashboard: {
    page: 'public-dashboard-page', //9.5.0*
    NotAvailable: {
      container: 'public-dashboard-not-available', //9.5.0*
      title: 'public-dashboard-title', //9.5.0*
      pausedDescription: 'public-dashboard-paused-description', //9.5.0*
    },
    footer: 'public-dashboard-footer', //11.0.0*
  },
  PublicDashboardScene: {
    loadingPage: 'public-dashboard-scene-loading-page', //11.0.0*
    page: 'public-dashboard-scene-page', //11.0.0*
    controls: 'public-dashboard-controls', //11.0.0*
  },
  RequestViewAccess: {
    form: 'request-view-access-form', //9.5.0*
    recipientInput: 'request-view-access-recipient-input', //9.5.0*
    submitButton: 'request-view-access-submit-button', //9.5.0*
  },
  PublicDashboardConfirmAccess: {
    submitButton: 'data-testid confirm-access-submit-button', //10.2.0*
  },
  Explore: {
    url: '/explore', //*
    General: {
      container: 'data-testid Explore', //*
      graph: 'Explore Graph', //*
      table: 'Explore Table', //*
      scrollView: 'data-testid explorer scroll view', //9.0.0 '.scrollbar-view' before that*
    },
    QueryHistory: {
      container: 'data-testid QueryHistory', //11.1.0*
    },
  },
  SoloPanel: {
    url: (page: string) => `/d-solo/${page}`, //*
  },
  PluginsList: {
    page: 'Plugins list page', //*
    list: 'Plugins list', //*
    listItem: 'Plugins list item', //*
    signatureErrorNotice: 'data-testid Unsigned plugins notice', //10.3.0 dti*
  },
  PluginPage: {
    page: 'Plugin page', //*
    signatureInfo: 'data-testid Plugin signature info', //10.3.0 dti*
    disabledInfo: 'data-testid Plugin disabled info', //10.3.0 dti*
  },
  PlaylistForm: {
    name: 'Playlist name', //*
    interval: 'Playlist interval', //*
    itemDelete: 'data-testid playlist-form-delete-item', //10.2.0 'Delete playlist item' before that*
  },
  BrowseDashboards: {
    table: {
      body: 'data-testid browse-dashboards-table', //10.2.0*
      row: (name: string) => `data-testid browse dashboards row ${name}`, //10.2.0 (uid: string) => `data-testid ${uid} row` before that*
      checkbox: (uid: string) => `data-testid ${uid} checkbox`, //10.0.0*
    },
    NewFolderForm: {
      form: 'data-testid new folder form', //10.2.0*
      nameInput: 'data-testid new-folder-name-input', //10.2.0*
      createButton: 'data-testid new-folder-create-button', //10.2.0*
    },
  },
  Search: {
    url: '/?search=openn', //9.3.0*
    FolderView: {
      url: '/?search=open&layout=folders', //9.3.0*
    },
  },
  PublicDashboards: {
    ListItem: {
      linkButton: 'public-dashboard-link-button', //9.3.0*
      configButton: 'public-dashboard-configuration-button', //9.3.0*
      trashcanButton: 'public-dashboard-remove-button', //9.3.0*
      pauseSwitch: 'data-testid public dashboard pause switch', //10.1.0*
    },
  },
  UserListPage: {
    tabs: {
      allUsers: 'data-testid all-users-tab', //10.0.0*
      orgUsers: 'data-testid org-users-tab', //10.0.0*
      anonUserDevices: 'data-testid anon-user-devices-tab', //10.2.3*
      publicDashboardsUsers: 'data-testid public-dashboards-users-tab', //10.0.0*
      users: 'data-testid users-tab', //10.0.0*
    },
    org: {
      url: '/org/users', //9.5.0 new*
    },
    admin: {
      url: '/admin/users', //9.5.0 new*
    },
    publicDashboards: {
      container: 'data-testid public-dashboards-users-list', //11.1.0*
    },
    UserListAdminPage: {
      container: 'data-testid user-list-admin-page', //10.0.0*
    },
    UsersListPage: {
      container: 'data-testid users-list-page', //10.0.0*
    },
    UserAnonListPage: {
      container: 'data-testid user-anon-list-page',
    },
    UsersListPublicDashboardsPage: {
      container: 'data-testid users-list-public-dashboards-page', //10.0.0*
      DashboardsListModal: {
        listItem: (uid: string) => `data-testid dashboards-list-item-${uid}`, //10.0.0*
      },
    },
  },
  ProfilePage: {
    url: '/profile', //10.2.0*
  },
};
