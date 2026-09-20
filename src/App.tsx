import { useAuth } from './firebase/AuthProvider';
import Loader from './components/Loaders/Loader';

import { RouterProvider } from 'react-router';
import router from './routes/Router';

function App() {
  const { loading } = useAuth();
  if (loading) return <Loader />;
  return <RouterProvider router={router} />;
}

export default App;
