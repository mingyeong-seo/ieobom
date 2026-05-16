import AppHeader from '../../components/common/AppHeader/AppHeader';
import BottomTab from '../../components/common/BottomTab/BottomTab';
import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';

import './GuardianStoryPage.css';
import { guardianTabs } from './guardianTabs';

function GuardianStoryPage({ onBackToRole, onTabChange }) {
  return (
    <PhoneLayout leftStatus="">
      <section className="guardian-story page-enter">
        <AppHeader
          className="guardian-home-header"
          logoClassName="guardian-home-logo"
          onLogoClick={onBackToRole}
        />

        <main className="guardian-story-scroll">
          <header className="guardian-story-hero">
            <p>부모님의 기록</p>
            <h1>오늘의 이야기를 확인해보세요</h1>
          </header>
        </main>

        <BottomTab
          currentTab="story"
          onTabChange={onTabChange}
          tabs={guardianTabs}
        />
      </section>
    </PhoneLayout>
  );
}

export default GuardianStoryPage;
