import './GuardianHomePage.css';

import AppHeader from '../../components/common/AppHeader/AppHeader';
import BottomTab from '../../components/common/BottomTab/BottomTab';
import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';

import PastTodaySection from '../home/PastTodaySection';
import RoutineList from '../home/RoutineList';

import daughterProfile from '../../assets/images/daughter-profile.png';
import { completedRoutines } from '../../mocks/routines';
import { todayStory } from '../../mocks/stories';
import { guardianPastTodayItems } from '../home/homeSharedData';
import { guardianTabs } from './guardianTabs';

function GuardianHomePage({
  onBackToRole,
  onGoStory,
  onComingSoon,
  onTabChange,
}) {
  return (
    <PhoneLayout leftStatus="6:30">
      <section className="guardian-home page-enter">
        <AppHeader
          className="guardian-home-header"
          logoClassName="guardian-home-logo"
          profileImage={daughterProfile}
          profileAlt="보호자 프로필"
          onLogoClick={onBackToRole}
          onProfileClick={() => onComingSoon?.('profile')}
        />

        <main className="guardian-home-scroll">
          <section className="guardian-hero">
            <p className="guardian-greeting">부모님의 하루가 도착했어요</p>
            <h2>오늘의 안부를 확인해보세요</h2>
            <p className="guardian-date">2026년 5월 18일 월요일</p>

            <button
              type="button"
              className="home-chat-start-button"
              onClick={onGoStory}
            >
              기록 보러가기
            </button>
          </section>

          <RoutineList
            title="어제의 기록"
            routines={completedRoutines}
            action={
              <button
                type="button"
                className="more-button"
                onClick={() => onComingSoon?.('analytics')}
              >
                더보기 &gt;
              </button>
            }
          />

          <section className="ai-suggestion-section">
            <div className="section-header">
              <h2>
                AI 제안 <span aria-hidden="true">💌</span>
              </h2>
            </div>

            <div className="ai-suggestion-card">
              <strong>한번 안부를 전해보세요</strong>
              <p>{todayStory.aiSuggestion}</p>

              <button type="button" onClick={() => onComingSoon?.('call')}>
                전화하기
              </button>
            </div>
          </section>

          <PastTodaySection
            items={guardianPastTodayItems}
            subtitle="부모님의 지난 기록을 다시 확인해보세요"
            onMore={() => onComingSoon?.('album')}
            onItemClick={() => onComingSoon?.('storyFull')}
          />
        </main>

        <BottomTab
          currentTab="home"
          tabs={guardianTabs}
          onTabChange={onTabChange}
        />
      </section>
    </PhoneLayout>
  );
}

export default GuardianHomePage;
