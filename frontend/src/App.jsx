import { useState } from 'react';

import RoleSelectPage from './pages/role/RoleSelectPage';
import SplashPage from './pages/splash/SplashPage';

function App() {
  const [page, setPage] = useState('splash');

  if (page === 'splash') {
    return <SplashPage onNext={() => setPage('role')} />;
  }

  if (page === 'role') {
    return <RoleSelectPage />;
  }

  return null;
}

export default App;
