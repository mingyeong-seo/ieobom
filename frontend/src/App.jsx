import { useState } from 'react';

import GuardianHomePage from './pages/guardian/GuardianHomePage';
import ParentHomePage from './pages/parent/ParentHomePage';
import RoleSelectPage from './pages/role/RoleSelectPage';
import SplashPage from './pages/splash/SplashPage';
import ParentStoryPage from './pages/parent/ParentStoryPage';

function App() {
  const [page, setPage] = useState('splash');

  if (page === 'splash') {
    return <SplashPage onNext={() => setPage('role')} />;
  }

  if (page === 'role') {
    return (
      <RoleSelectPage
        onSelectParent={() => setPage('parentHome')}
        onSelectGuardian={() => setPage('guardianHome')}
      />
    );
  }

  if (page === 'parentHome') {
    return <ParentHomePage />;
  }

  if (page === 'guardianHome') {
    return (
      <GuardianHomePage
        onGoStory={() => setPage('story')}
      />
    );
  }

  if (page === 'story') {
    return (
      <ParentStoryPage
        isCompleted={false}
        onGoHome={() => setPage('guardianHome')}
      />
    );
  }

  return null;
}

export default App;