import './ParentHomePage.css';

import AppHeader from '../../components/common/AppHeader/AppHeader';
import BottomTab from '../../components/common/BottomTab/BottomTab';
import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';

import PastTodaySection from '../home/PastTodaySection';
import RoutineList from '../home/RoutineList';

import { parentHome } from '../../mocks/home';
import { reactionComments as profileReactionComments } from '../../mocks/reactions';
import { routineSummary, routines } from '../../mocks/routines';
import { reactionComments as storyReactionComments } from '../../mocks/stories';

function ParentHomePage({
  onBackToRole,
  onStartChat,
  onComingSoon,
  onTabChange,
  isRoutineCompleted,
}) {
  const displaySummary = isRoutineCompleted
    ? {
        completed: routineSummary.total,
        total: routineSummary.total,
      }
    : routineSummary;

  const displayRoutines = isRoutineCompleted
    ? routines.map((routine) =>
        routine.title === '저녁 약'
          ? {
              ...routine,
              status: 'completed',
              statusText: '완료',
            }
          : routine,
      )
    : routines;

  const displayReactionComments = storyReactionComments.map((comment) => {
    const profile = profileReactionComments.find((item) => item.id === comment.id);

    return {
      ...comment,
      profileImage: profile?.profileImage,
    };
  });

  return (
    <PhoneLayout leftStatus="9:00">
      <section className="parent-home page-enter">
        <AppHeader
          className="parent-home-header"
          logoClassName="parent-home-logo"
          onLogoClick={onBackToRole}
          onProfileClick={() => onComingSoon?.('profile')}
        />

        <main className="parent-home-scroll">
          <section className="home-hero">
            <p className="home-greeting">좋은 저녁이에요!</p>
            <h2>오늘 하루는 어떠셨어요?</h2>
            <p className="home-date">{parentHome.date}</p>

            <button
              type="button"
              className="home-chat-start-button"
              onClick={onStartChat}
            >
              오늘의 대화 시작하기
            </button>
          </section>

          <RoutineList
            title="오늘의 기록"
            routines={displayRoutines}
            summary={`${displaySummary.completed} / ${displaySummary.total} 완료`}
          />

          <section className="reaction-section">
            <div className="section-header">
              <h2>최근 반응</h2>
              <button
                type="button"
                className="more-button"
                onClick={() => onComingSoon?.('reactionManage')}
              >
                더보기 &gt;
              </button>
            </div>

            <div className="reaction-card">
              {displayReactionComments.map((comment) => (
                <button key={comment.id} type="button" className="reaction-row">
                  <div className="reaction-avatar">
                    {comment.profileImage && (
                      <img src={comment.profileImage} alt={comment.writer} />
                    )}
                  </div>

                  <div className="reaction-content">
                    <p>{comment.message}</p>
                    <span>{comment.time}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <PastTodaySection
            subtitle="지난 기록을 다시 확인해보세요"
            onMore={() => onComingSoon?.('album')}
            onItemClick={() => onComingSoon?.('storyFull')}
          />
        </main>

        <BottomTab currentTab="home" onTabChange={onTabChange} />
      </section>
    </PhoneLayout>
  );
}

export default ParentHomePage;
