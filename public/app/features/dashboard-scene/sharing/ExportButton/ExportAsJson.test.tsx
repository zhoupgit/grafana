// import { selectors as e2eSelectors } from '@grafana/e2e-selectors';

// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { ExportAsJson, ExportAsJsonRenderer } from './ExportAsJson';
// import { notifyApp } from 'app/core/actions';
// import { createSuccessNotification } from 'app/core/copy/appNotification';
// import { dispatch } from 'app/store/store';
// import { CancelActivationHandler, SceneActivationHandler, SceneComponentProps, SceneObject, SceneObjectBase, SceneObjectRef, SceneStateChangedHandler } from '@grafana/scenes';
// import { BusEvent, BusEventType, BusEventHandler } from '@grafana/data';
// import { ReactElement } from 'react';
// import { Unsubscribable } from 'rxjs';
// import { ShareExportTabState } from '../ShareExportTab';
// import { TestProvider } from 'test/helpers/TestProvider';
// import { SaveDashboardDrawer } from '../../saving/SaveDashboardDrawer';
// import { transformSaveModelToScene } from '../../serialization/transformSaveModelToScene';
// import { transformSceneToSaveModel } from '../../serialization/transformSceneToSaveModel';
// // import { useAsync } from 'react-use';

// const selector = e2eSelectors.pages.ExportDashboardDrawer.ExportAsJson;

// const mockGetExportableDashboardJson = jest.fn();
// const mockOnSaveAsFile = jest.fn();
// const mockOnShareExternallyChange = jest.fn();
// const mockOnDismiss = jest.fn();

// const defaultModel = {
//   useState: () => ({
//     isSharingExternally: false,
//     onShareExternallyChange: mockOnShareExternallyChange,
//     onDismiss: mockOnDismiss,
//   }),
//   getExportableDashboardJson: mockGetExportableDashboardJson,
//   onSaveAsFile: mockOnSaveAsFile,
// };
// // exportAsJson = new ExportAsJson({})

// describe('ExportAsJson', () => {

//   it('should render the component correctly', async () => {
//     // setup();
//     render(new ExportAsJson({model:defaultModel}));
//     expect(await screen.getByText('Copy or download a JSON file containing the JSON of your dashboard')).toBeInTheDocument();
//     expect(screen.getByTestId(selector.exportExternallyToggle)).toBeInTheDocument();
//     expect(screen.getByTestId(selector.codeEditor)).toBeInTheDocument();
//     expect(screen.getByTestId(selector.saveToFileButton)).toBeInTheDocument();
//     expect(screen.getByTestId(selector.copyToClipboardButton)).toBeInTheDocument();
//     expect(screen.getByTestId(selector.cancelButton)).toBeInTheDocument();
//   });

// //   it('should call the model onSaveAsFile when download button is clicked', async () => {
// //     fireEvent.click(screen.getByTestId(selector.saveToFileButton));

// //     await waitFor(() => {
// //       expect(mockOnSaveAsFile).toHaveBeenCalled();
// //       expect(dispatch).toHaveBeenCalledWith(notifyApp(createSuccessNotification('Your JSON has been downloaded')));
// //     });
// //   });

// //   it('should copy JSON to clipboard when copy button is clicked', async () => {
// //     const clipboardButton = screen.getByTestId(selector.copyToClipboardButton);
// //     expect(clipboardButton).not.toBeDisabled();
// //     fireEvent.click(clipboardButton);
// //     // Additional assertions can be made if mockClipboard is set up
// //   });

// //   it('should toggle export externally when switch is clicked', () => {
// //     fireEvent.click(screen.getByTestId('export-externally-toggle'));
// //     expect(mockOnShareExternallyChange).toHaveBeenCalled();
// //   });

// //   it('should call onDismiss when cancel button is clicked', () => {
// //     fireEvent.click(screen.getByTestId(selector.cancelButton));
// //     expect(mockOnDismiss).toHaveBeenCalled();
// //   });
// });

// let cleanUp = () => {};

// function setup() {
//   const dashboard = transformSaveModelToScene({
//     dashboard: {
//       title: 'hello',
//       uid: 'my-uid',
//       schemaVersion: 30,
//       panels: [],
//       version: 10,
//     },
//     meta: {},
//   });

//   // Clear any data layers
//   dashboard.setState({ $data: undefined });

//   const initialSaveModel = transformSceneToSaveModel(dashboard);
//   dashboard.setInitialSaveModel(initialSaveModel);

//   cleanUp();
//   cleanUp = dashboard.activate();

//   const drawer = dashboard.state.overlay as ExportAsJson;
//   // render(
//   //     <drawer.Component model={drawer} />
//   // );
//   render(
//     <TestProvider>
//       <drawer.Component model={drawer} />
//     </TestProvider>
//   );

//   return drawer;
// };
