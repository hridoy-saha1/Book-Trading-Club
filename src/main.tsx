import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './firebase/AuthProvider'; // <-- import AuthProvider
import { ThemeProvider } from './pages/Theme/ThemeProvider.tsx';
import ChatPopup from './components/Modals/ChatPopup.tsx';

const querclient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={querclient}>
          <App />
          <ChatPopup></ChatPopup>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            limit={1}
          />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);

// done
