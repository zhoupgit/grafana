import { versionedComponents as Components } from '../generated/components.gen';

/**
 * Selectors grouped/defined in Pages
 *
 * @alpha
 */
export const Pages = {
  Login: {
    url: {
      '8.5.0': '/login',
    },
    username: {
      '10.2.3': 'data-testid Username input field',
      '8.5.0': 'Username input field',
    },
    password: {
      '10.2.3': 'data-testid Password input field',
      '8.5.0': 'Password input field',
    },
    submit: {
      '10.2.3': 'data-testid Login button',
      '8.5.0': 'Login button',
    },
    skip: {
      '10.2.3': {
        '10.2.3': 'data-testid Skip change password button',
      },
    },
  },
  Home: {
    url: {
      '8.5.0': '/',
    },
  },
  DataSource: {
    name: {
      '10.3.0': 'data-testid Data source settings page name input field',
      '8.5.0': 'Data source settings page name input field',
    },
    delete: {
      '8.5.0': 'Data source settings page Delete button',
    },
    readOnly: {
      '10.3.0': 'data-testid Data source settings page read only message',
      '8.5.0': 'Data source settings page read only message',
    },
    saveAndTest: {
      '10.0.0': 'data-testid Data source settings page Save and Test button',
    },
    alert: {
      '10.3.0': 'data-testid Data source settings page Alert',
      '8.5.0': 'Data source settings page Alert',
    },
  },
  DataSources: {
    url: {
      '8.5.0': '/datasources',
    },
    dataSources: {
      '8.5.0': (dataSourceName: string) => `Data source list item ${dataSourceName}`,
    },
  },
  EditDataSource: {
    url: {
      '9.5.0': (dataSourceUid: string) => `/datasources/edit/${dataSourceUid}`,
    },
    settings: {
      '9.5.0': 'Datasource settings page basic settings',
    },
  },
  AddDataSource: {
    url: {
      '8.5.0': '/datasources/new',
    },
    /** @deprecated Use dataSourcePluginsV2 */
    dataSourcePlugins: {
      '8.5.0': (pluginName: string) => `Data source plugin item ${pluginName}`,
    },
    dataSourcePluginsV2: {
      '9.3.1': (pluginName: string) => `Add new data source ${pluginName}`,
    },
  },
  ConfirmModal: {
    delete: {
      '10.0.0': 'data-testid Confirm Modal Danger Button',
      '8.5.0': 'Confirm Modal Danger Button',
    },
  },
  AddDashboard: {
    url: {
      '8.5.0': '/dashboard/new',
    },
    itemButton: {
      '9.5.0': (title: string) => `data-testid ${title}`,
    },
    addNewPanel: {
      '11.1.0': 'data-testid Add new panel',
      '8.5.0': 'Add new panel',
    },
    addNewRow: {
      '11.1.0': 'data-testid Add new row',
      '8.5.0': 'Add new row',
    },
    addNewPanelLibrary: {
      '11.1.0': 'data-testid Add new panel from panel library',
      '8.5.0': 'Add new panel from panel library',
    },
  },
  Dashboard: {
    url: {
      '8.5.0': (uid: string) => `/d/${uid}`,
    },
    DashNav: {
      nav: {
        '8.5.0': 'Dashboard navigation',
      },
      navV2: {
        '8.5.0': 'data-testid Dashboard navigation',
      },
      publicDashboardTag: {
        '9.1.0': 'data-testid public dashboard tag',
      },
      shareButton: 'data-testid share-button',
      scrollContainer: {
        '11.1.0': 'data-testid Dashboard canvas scroll container',
      },
      newShareButton: {
        container: {
          '11.1.0': 'data-testid new share button',
        },
        shareLink: {
          '11.1.0': 'data-testid new share link-button',
        },
        arrowMenu: {
          '11.1.0': 'data-testid new share button arrow menu',
        },
        menu: {
          container: {
            '11.1.0': 'data-testid new share button menu',
          },
          shareInternally: {
            '11.1.0': 'data-testid new share button share internally',
          },
          shareExternally: {
            '11.1.1': 'data-testid new share button share externally',
          },
          shareSnapshot: {
            '11.2.0': 'data-testid new share button share snapshot',
          },
        },
      },
      NewExportButton: {
        container: {
          '11.2.0': 'data-testid new export button',
        },
        arrowMenu: {
          '11.2.0': 'data-testid new export button arrow menu',
        },
        Menu: {
          container: {
            '11.2.0': 'data-testid new export button menu',
          },
          exportAsJson: {
            '11.2.0': 'data-testid new export button export as json',
          },
        },
      },
      playlistControls: {
        prev: {
          '11.0.0': 'data-testid playlist previous dashboard button',
        },
        stop: {
          '11.0.0': 'data-testid playlist stop dashboard button',
        },
        next: {
          '11.0.0': 'data-testid playlist next dashboard button',
        },
      },
    },
    Controls: {
      '11.1.0': 'data-testid dashboard controls',
    },
    SubMenu: {
      submenu: {
        '8.5.0': 'Dashboard submenu',
      },
      submenuItem: {
        '8.5.0': 'data-testid template variable',
      },
      submenuItemLabels: {
        '8.5.0': (item: string) => `data-testid Dashboard template variables submenu Label ${item}`,
      },
      submenuItemValueDropDownValueLinkTexts: {
        '8.5.0': (item: string) =>
          `data-testid Dashboard template variables Variable Value DropDown value link text ${item}`,
      },
      submenuItemValueDropDownDropDown: {
        '8.5.0': 'Variable options',
      },
      submenuItemValueDropDownOptionTexts: {
        '8.5.0': (item: string) =>
          `data-testid Dashboard template variables Variable Value DropDown option text ${item}`,
      },
      Annotations: {
        annotationsWrapper: {
          '10.0.0': 'data-testid annotation-wrapper',
        },
        annotationLabel: {
          '10.0.0': (label: string) => `data-testid Dashboard annotations submenu Label ${label}`,
        },
        annotationToggle: {
          '10.0.0': (label: string) => `data-testid Dashboard annotations submenu Toggle ${label}`,
        },
      },
    },
    Settings: {
      Actions: {
        close: {
          '9.5.0': 'data-testid dashboard-settings-close',
        },
      },
      General: {
        deleteDashBoard: {
          '11.1.0': 'data-testid Dashboard settings page delete dashboard button',
        },
        sectionItems: {
          '8.5.0': (item: string) => `Dashboard settings section item ${item}`,
        },
        saveDashBoard: {
          '8.5.0': 'Dashboard settings aside actions Save button',
        },
        saveAsDashBoard: {
          '8.5.0': 'Dashboard settings aside actions Save As button',
        },
        /**
         * @deprecated use components.TimeZonePicker.containerV2 from Grafana 8.3 instead
         */
        timezone: {
          '8.5.0': 'Time zone picker select container',
        },
        title: {
          '11.2.0': 'General',
        },
      },
      Annotations: {
        List: {
          addAnnotationCTAV2: {
            '8.5.0': Components.CallToActionCard.buttonV2('Add annotation query'),
          },
          annotations: {
            '10.4.0': 'data-testid list-annotations',
          },
        },
        Settings: {
          name: {
            '11.1.0': 'data-testid Annotations settings name input',
            '8.5.0': 'Annotations settings name input',
          },
        },
        NewAnnotation: {
          panelFilterSelect: {
            '10.0.0': 'data-testid annotations-panel-filter',
          },
          showInLabel: {
            '11.1.0': 'data-testid show-in-label',
          },
          previewInDashboard: {
            '10.0.0': 'data-testid annotations-preview',
          },
          delete: {
            '10.4.0': 'data-testid annotations-delete',
          },
          apply: {
            '10.4.0': 'data-testid annotations-apply',
          },
          enable: {
            '10.4.0': 'data-testid annotation-enable',
          },
          hide: {
            '10.4.0': 'data-testid annotation-hide',
          },
        },
      },
      Variables: {
        List: {
          addVariableCTAV2: {
            '8.5.0': Components.CallToActionCard.buttonV2('Add variable'),
          },
          newButton: {
            '8.5.0': 'Variable editor New variable button',
          },
          table: {
            '8.5.0': 'Variable editor Table',
          },
          tableRowNameFields: {
            '8.5.0': (variableName: string) => `Variable editor Table Name field ${variableName}`,
          },
          tableRowDefinitionFields: {
            '10.1.0': (variableName: string) => `Variable editor Table Definition field ${variableName}`,
          },
          tableRowArrowUpButtons: {
            '8.5.0': (variableName: string) => `Variable editor Table ArrowUp button ${variableName}`,
          },
          tableRowArrowDownButtons: {
            '8.5.0': (variableName: string) => `Variable editor Table ArrowDown button ${variableName}`,
          },
          tableRowDuplicateButtons: {
            '8.5.0': (variableName: string) => `Variable editor Table Duplicate button ${variableName}`,
          },
          tableRowRemoveButtons: {
            '8.5.0': (variableName: string) => `Variable editor Table Remove button ${variableName}`,
          },
        },
        Edit: {
          General: {
            headerLink: {
              '8.5.0': 'Variable editor Header link',
            },
            modeLabelNew: {
              '8.5.0': 'Variable editor Header mode New',
            },
            /**
             * @deprecated
             */
            modeLabelEdit: {
              '8.5.0': 'Variable editor Header mode Edit',
            },
            generalNameInput: {
              '8.5.0': 'Variable editor Form Name field',
            },
            generalNameInputV2: {
              '8.5.0': 'data-testid Variable editor Form Name field',
            },
            generalTypeSelect: {
              '8.5.0': 'Variable editor Form Type select',
            },
            generalTypeSelectV2: {
              '8.5.0': 'data-testid Variable editor Form Type select',
            },
            generalLabelInput: {
              '8.5.0': 'Variable editor Form Label field',
            },
            generalLabelInputV2: {
              '8.5.0': 'data-testid Variable editor Form Label field',
            },
            generalHideSelect: {
              '8.5.0': 'Variable editor Form Hide select',
            },
            generalHideSelectV2: {
              '8.5.0': 'data-testid Variable editor Form Hide select',
            },
            selectionOptionsMultiSwitch: {
              '10.4.0': 'data-testid Variable editor Form Multi switch',
              '8.5.0': 'Variable editor Form Multi switch',
            },
            selectionOptionsIncludeAllSwitch: {
              '10.4.0': 'data-testid Variable editor Form IncludeAll switch',
              '8.5.0': 'Variable editor Form IncludeAll switch',
            },
            selectionOptionsCustomAllInput: {
              '10.4.0': 'data-testid Variable editor Form IncludeAll field',
              '8.5.0': 'Variable editor Form IncludeAll field',
            },
            previewOfValuesOption: {
              '10.4.0': 'data-testid Variable editor Preview of Values option',
              '8.5.0': 'Variable editor Preview of Values option',
            },
            submitButton: {
              '10.4.0': 'data-testid Variable editor Run Query button',
              '8.5.0': 'Variable editor Run Query button',
            },
            applyButton: {
              '9.3.0': 'data-testid Variable editor Apply button',
            },
          },
          QueryVariable: {
            queryOptionsDataSourceSelect: {
              '10.4.0': Components.DataSourcePicker.inputV2,
              '8.5.0': Components.DataSourcePicker.container,
            },
            queryOptionsRefreshSelect: {
              '8.5.0': 'Variable editor Form Query Refresh select',
            },
            queryOptionsRefreshSelectV2: {
              '8.5.0': 'data-testid Variable editor Form Query Refresh select',
            },
            queryOptionsRegExInput: {
              '8.5.0': 'Variable editor Form Query RegEx field',
            },
            queryOptionsRegExInputV2: {
              '8.5.0': 'data-testid Variable editor Form Query RegEx field',
            },
            queryOptionsSortSelect: {
              '8.5.0': 'Variable editor Form Query Sort select',
            },
            queryOptionsSortSelectV2: {
              '8.5.0': 'data-testid Variable editor Form Query Sort select',
            },
            queryOptionsQueryInput: {
              '10.4.0': 'data-testid Variable editor Form Default Variable Query Editor textarea',
            },
            valueGroupsTagsEnabledSwitch: {
              '8.5.0': 'Variable editor Form Query UseTags switch',
            },
            valueGroupsTagsTagsQueryInput: {
              '8.5.0': 'Variable editor Form Query TagsQuery field',
            },
            valueGroupsTagsTagsValuesQueryInput: {
              '8.5.0': 'Variable editor Form Query TagsValuesQuery field',
            },
          },
          ConstantVariable: {
            constantOptionsQueryInput: {
              '8.5.0': 'Variable editor Form Constant Query field',
            },
            constantOptionsQueryInputV2: {
              '8.5.0': 'data-testid Variable editor Form Constant Query field',
            },
          },
          DatasourceVariable: {
            datasourceSelect: {
              '8.5.0': 'data-testid datasource variable datasource type',
            },
          },
          TextBoxVariable: {
            textBoxOptionsQueryInput: {
              '8.5.0': 'Variable editor Form TextBox Query field',
            },
            textBoxOptionsQueryInputV2: {
              '8.5.0': 'data-testid Variable editor Form TextBox Query field',
            },
          },
          CustomVariable: {
            customValueInput: {
              '8.5.0': 'data-testid custom-variable-input',
            },
          },
          IntervalVariable: {
            intervalsValueInput: {
              '8.5.0': 'data-testid interval variable intervals input',
            },
            autoEnabledCheckbox: {
              '10.4.0': 'data-testid interval variable auto value checkbox',
            },
            stepCountIntervalSelect: {
              '10.4.0': 'data-testid interval variable step count input',
            },
            minIntervalInput: {
              '10.4.0': 'data-testid interval variable mininum interval input',
            },
          },
          GroupByVariable: {
            dataSourceSelect: Components.DataSourcePicker.inputV2, //10.4.0*
            infoText: {
              '10.4.0': 'data-testid group by variable info text',
            },
            modeToggle: {
              '10.4.0': 'data-testid group by variable mode toggle',
            },
          },
          AdHocFiltersVariable: {
            datasourceSelect: { '10.4.0': Components.DataSourcePicker.inputV2 },
            infoText: {
              '10.4.0': 'data-testid ad-hoc filters variable info text',
            },
            modeToggle: {
              '11.0.0': 'data-testid ad-hoc filters variable mode toggle',
            },
          },
        },
      },
    },
    Annotations: {
      marker: {
        '10.0.0': 'data-testid annotation-marker',
      },
    },
    Rows: {
      Repeated: {
        ConfigSection: {
          warningMessage: {
            '10.2.0': 'data-testid Repeated rows warning message',
          },
        },
      },
    },
  },
  Dashboards: {
    url: {
      '8.5.0': '/dashboards',
    },
    /**
     * @deprecated use components.Search.dashboardItem from Grafana 8.3 instead
     */
    dashboards: {
      '10.2.0': (title: string) => `Dashboard search item ${title}`,
    },
  },
  SaveDashboardAsModal: {
    newName: {
      '10.2.0': 'Save dashboard title field',
    },
    save: {
      '10.2.0': 'Save dashboard button',
    },
  },
  SaveDashboardModal: {
    save: {
      '10.2.0': 'Dashboard settings Save Dashboard Modal Save button',
    },
    saveVariables: {
      '10.2.0': 'Dashboard settings Save Dashboard Modal Save variables checkbox',
    },
    saveTimerange: {
      '10.2.0': 'Dashboard settings Save Dashboard Modal Save timerange checkbox',
    },
    saveRefresh: {
      '11.1.0': 'Dashboard settings Save Dashboard Modal Save refresh checkbox',
    },
  },
  SharePanelModal: {
    linkToRenderedImage: {
      '8.5.0': 'Link to rendered image',
    },
  },
  ShareDashboardModal: {
    PublicDashboard: {
      WillBePublicCheckbox: {
        '9.1.0': 'data-testid public dashboard will be public checkbox',
      },
      LimitedDSCheckbox: {
        '9.1.0': 'data-testid public dashboard limited datasources checkbox',
      },
      CostIncreaseCheckbox: {
        '9.1.0': 'data-testid public dashboard cost may increase checkbox',
      },
      PauseSwitch: {
        '9.5.0': 'data-testid public dashboard pause switch',
      },
      EnableAnnotationsSwitch: {
        '9.3.0': 'data-testid public dashboard on off switch for annotations',
      },
      CreateButton: {
        '9.5.0': 'data-testid public dashboard create button',
      },
      DeleteButton: {
        '9.3.0': 'data-testid public dashboard delete button',
      },
      CopyUrlInput: {
        '9.1.0': 'data-testid public dashboard copy url input',
      },
      CopyUrlButton: {
        '9.1.0': 'data-testid public dashboard copy url button',
      },
      SettingsDropdown: 'data-testid public dashboard settings dropdown',
      TemplateVariablesWarningAlert: {
        '9.1.0': 'data-testid public dashboard disabled template variables alert',
      },
      UnsupportedDataSourcesWarningAlert: {
        '9.5.0': 'data-testid public dashboard unsupported data sources alert',
      },
      NoUpsertPermissionsWarningAlert: {
        '9.5.0': 'data-testid public dashboard no upsert permissions alert',
      },
      EnableTimeRangeSwitch: {
        '9.4.0': 'data-testid public dashboard on off switch for time range',
      },
      EmailSharingConfiguration: {
        Container: {
          '9.5.0': 'data-testid email sharing config container',
        },
        ShareType: {
          '9.5.0': 'data-testid public dashboard share type',
        },
        EmailSharingInput: {
          '9.5.0': 'data-testid public dashboard email sharing input',
        },
        EmailSharingInviteButton: {
          '9.5.0': 'data-testid public dashboard email sharing invite button',
        },
        EmailSharingList: {
          '9.5.0': 'data-testid public dashboard email sharing list',
        },
        DeleteEmail: {
          '9.5.0': 'data-testid public dashboard delete email button',
        },
        ReshareLink: {
          '9.5.0': 'data-testid public dashboard reshare link button',
        },
      },
    },
    SnapshotScene: {
      url: {
        '11.1.0': (key: string) => `/dashboard/snapshot/${key}`,
      },
      PublishSnapshot: {
        '11.1.0': 'data-testid publish snapshot button',
      },
      CopyUrlButton: {
        '11.1.0': 'data-testid snapshot copy url button',
      },
      CopyUrlInput: {
        '11.1.0': 'data-testid snapshot copy url input',
      },
    },
  },
  ShareDashboardDrawer: {
    ShareExternally: {
      container: {
        '11.1.1': 'data-testid share externally drawer container',
      },
      copyUrlButton: {
        '11.1.1': 'data-testid share externally copy url button',
      },
      shareTypeSelect: {
        '11.1.1': 'data-testid share externally share type select',
      },
    },
    ShareSnapshot: {
      container: {
        '11.2.0': 'data-testid share snapshot drawer container',
      },
    },
  },
  ExportDashboardDrawer: {
    ExportAsJson: {
      container: {
        '11.2.0': 'data-testid export as Json drawer container',
      },
      codeEditor: {
        '11.2.0': 'data-testid export as Json code editor',
      },
      exportExternallyToggle: {
        '11.2.0': 'data-testid export externally toggle type select',
      },
      saveToFileButton: {
        '11.2.0': 'data-testid save to file button',
      },
      copyToClipboardButton: {
        '11.2.0': 'data-testid copy to clipboard button',
      },
      cancelButton: {
        '11.2.0': 'data-testid cancel button',
      },
    },
  },
  PublicDashboard: {
    page: {
      '9.5.0': 'public-dashboard-page',
    },
    NotAvailable: {
      container: {
        '9.5.0': 'public-dashboard-not-available',
      },
      title: {
        '9.5.0': 'public-dashboard-title',
      },
      pausedDescription: {
        '9.5.0': 'public-dashboard-paused-description',
      },
    },
    footer: {
      '11.0.0': 'public-dashboard-footer',
    },
  },
  PublicDashboardScene: {
    loadingPage: {
      '11.0.0': 'public-dashboard-scene-loading-page',
    },
    page: {
      '11.0.0': 'public-dashboard-scene-page',
    },
    controls: {
      '11.0.0': 'public-dashboard-controls',
    },
  },
  RequestViewAccess: {
    form: {
      '9.5.0': 'request-view-access-form',
    },
    recipientInput: {
      '9.5.0': 'request-view-access-recipient-input',
    },
    submitButton: {
      '9.5.0': 'request-view-access-submit-button',
    },
  },
  PublicDashboardConfirmAccess: {
    submitButton: {
      '10.2.0': 'data-testid confirm-access-submit-button',
    },
  },
  Explore: {
    url: {
      '8.5.0': '/explore',
    },
    General: {
      container: {
        '8.5.0': 'data-testid Explore',
      },
      graph: {
        '8.5.0': 'Explore Graph',
      },
      table: {
        '8.5.0': 'Explore Table',
      },
      scrollView: {
        '9.0.0': 'data-testid explorer scroll view',
      },
    },
    QueryHistory: {
      container: {
        '11.1.0': 'data-testid QueryHistory',
      },
    },
  },
  SoloPanel: {
    url: {
      '8.5.0': (page: string) => `/d-solo/${page}`,
    },
  },
  PluginsList: {
    page: {
      '8.5.0': 'Plugins list page',
    },
    list: {
      '8.5.0': 'Plugins list',
    },
    listItem: {
      '8.5.0': 'Plugins list item',
    },
    signatureErrorNotice: {
      '10.3.0': 'data-testid Unsigned plugins notice',
      '8.5.0': 'Unsigned plugins notice',
    },
  },
  PluginPage: {
    page: {
      '8.5.0': 'Plugin page',
    },
    signatureInfo: {
      '10.3.0': 'data-testid Plugin signature info',
      '8.5.0': 'Plugin signature info',
    },
    disabledInfo: {
      '10.3.0': 'data-testid Plugin disabled info',
      '8.5.0': 'Plugin disabled info',
    },
  },
  PlaylistForm: {
    name: {
      '8.5.0': 'Playlist name',
    },
    interval: {
      '8.5.0': 'Playlist interval',
    },
    itemDelete: {
      '10.2.0': 'data-testid playlist-form-delete-item',
    },
  },
  BrowseDashboards: {
    table: {
      body: {
        '10.2.0': 'data-testid browse-dashboards-table',
      },
      row: {
        '10.2.0': (name: string) => `data-testid browse dashboards row ${name}`,
      },
      checkbox: {
        '10.0.0': (uid: string) => `data-testid ${uid} checkbox`,
      },
    },
    NewFolderForm: {
      form: {
        '10.2.0': 'data-testid new folder form',
      },
      nameInput: {
        '10.2.0': 'data-testid new-folder-name-input',
      },
      createButton: {
        '10.2.0': 'data-testid new-folder-create-button',
      },
    },
  },
  Search: {
    url: {
      '9.3.0': '/?search=openn',
    },
    FolderView: {
      url: {
        '9.3.0': '/?search=open&layout=folders',
      },
    },
  },
  PublicDashboards: {
    ListItem: {
      linkButton: {
        '9.3.0': 'public-dashboard-link-button',
      },
      configButton: {
        '9.3.0': 'public-dashboard-configuration-button',
      },
      trashcanButton: {
        '9.3.0': 'public-dashboard-remove-button',
      },
      pauseSwitch: {
        '10.1.0': 'data-testid public dashboard pause switch',
      },
    },
  },
  UserListPage: {
    tabs: {
      allUsers: {
        '10.0.0': 'data-testid all-users-tab',
      },
      orgUsers: {
        '10.0.0': 'data-testid org-users-tab',
      },
      anonUserDevices: {
        '10.2.3': 'data-testid anon-user-devices-tab',
      },
      publicDashboardsUsers: {
        '10.0.0': 'data-testid public-dashboards-users-tab',
      },
      users: {
        '10.0.0': 'data-testid users-tab',
      },
    },
    org: {
      url: {
        '9.5.0': '/org/users',
      },
    },
    admin: {
      url: {
        '9.5.0': '/admin/users',
      },
    },
    publicDashboards: {
      container: {
        '11.1.0': 'data-testid public-dashboards-users-list',
      },
    },
    UserListAdminPage: {
      container: {
        '10.0.0': 'data-testid user-list-admin-page',
      },
    },
    UsersListPage: {
      container: {
        '10.0.0': 'data-testid users-list-page',
      },
    },
    UserAnonListPage: {
      container: 'data-testid user-anon-list-page',
    },
    UsersListPublicDashboardsPage: {
      container: {
        '10.0.0': 'data-testid users-list-public-dashboards-page',
      },
      DashboardsListModal: {
        listItem: {
          '10.0.0': (uid: string) => `data-testid dashboards-list-item-${uid}`,
        },
      },
    },
  },
  ProfilePage: {
    url: {
      '10.2.0': '/profile',
    },
  },
};
