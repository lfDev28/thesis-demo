import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './error-page';
import App from './App';
import RunExperiment from './routes/smu/RunExperiment';
import AppContextProviders from './components/Context/AppContextProviders';
import MuiThemeProvider from './components/Context/MuiThemeProvider';
import QueryProvider from './components/Context/QueryProvider';
import ToastProvider from './components/Context/ToastContext';
import DeviceConnectionProvider from './components/Context/SmuProvider';
import ReadIVFile from './routes/iv/ReadIVFile';
import ReadElFile from './routes/spectrometer/ReadElFile';
import RootLayout from './routes/RootLayout';
import SmuConnectionProvider from './components/Context/SmuProvider';
import WriteIVFile from './routes/iv/WriteIVFile';
import IvList from './routes/iv/IvList';
import ModalProvider from './components/Context/ModalContext';
import IvExperiment from './routes/iv/IvExperiment';
import ElExperiment from './routes/el/ElExperiment';
import ElList from './routes/el/ElList';
import Calibration from './routes/spectrometer/Calibration';
import McuConnectionProvider from './components/Context/McuProvider';
import CalibrationList from './routes/spectrometer/CalibrationList';
import Automation from './routes/automations/Automation';
import Login from './routes/auth/Login';
import PrivateRoute from './routes/auth/PrivateRoute';


// Router configuration
const router = createBrowserRouter([
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
        path: '/',
        element: <PrivateRoute />,
        children: [
          {
            path: '/',
            element: <App />,
          },
          {
            path: '/experiment',
            element: <RunExperiment />,
          },
          {
            path: '/file-management/iv',
            element: <ReadIVFile />,
          },
          {
            path: '/file-management/el',
            element: <ReadElFile />,
          },
          {
            path: '/write-iv-file',
            element: <WriteIVFile />,
          },
          {
            path: '/experiment/iv',
            element: <IvList />,
          },
    
          {
            path: '/experiment/el',
            element: <ElList />,
          },
          {
            path: '/experiment/iv/:id',
            element: <IvExperiment />,
          },
          {
            path: '/experiment/el/:id',
            element: <ElExperiment />,
          },
          {
            path: '/calibration/:id',
            element: <Calibration />,
          },
          {
            path: '/calibration',
            element: <CalibrationList />,
          },
          {
            path: '/experiment/automation',
            element: <Automation />,
          },
        ],
      },
        
      {
        path: '*',
        element: <ErrorPage />,
      },
  

]);
  
    
// Array of context providers for the AppContextProvider
const providers = [
  MuiThemeProvider,
  QueryProvider,
  ToastProvider,
  SmuConnectionProvider,
  ModalProvider,
  McuConnectionProvider,
];

// Entry point to application - Do not modify
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppContextProviders components={providers}>
      <main>
        <RouterProvider router={router} />
      </main>
    </AppContextProviders>
  </React.StrictMode>
);
