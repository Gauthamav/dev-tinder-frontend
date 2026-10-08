import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import appStore from './utils/appStore.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={appStore}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
