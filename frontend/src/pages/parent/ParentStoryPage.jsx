import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';
import BottomTab from '../../components/common/BottomTab/BottomTab';
import './ParentStoryPage.css';

import {
  reactions,
  reactionComments,
  pendingStory,
  todayStory,
} from '../../mocks/stories';

function ParentStoryPage({
  isStoryReady = false,
  onComingSoon,
  onTabChange,
  onGoHome,
}) {
  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }

    if (tab === 'home' && onGoHome) {
      onGoHome();
    }
  };

  return (
    <PhoneLayout>
      <div className="parent-story">
        <header className="parent-home-header">
          <h1>기록</h1>
          <span className="date">5월 12일</span>
        </header>

        <div className="date-nav">
          <span>{'< 어제'}</span>
          <span className="today">오늘</span>
          <span>{'내일 >'}</span>
        </div>

        <div className="scroll-area">
          {!isStoryReady ? (
            <>
              <div className="story-card empty">
                <p className="label">AI가 정리한 어머니의 하루</p>

                <h2>{pendingStory.title}</h2>

                <p className="desc">{pendingStory.message}</p>

                <div className="disabled-btn">
                  대화를 마치면 AI가 하루를 요약해 드려요
                </div>
              </div>
              <div className="empty-family">
                <div className="empty-icon" />

                <p className="empty-title">아직 가족의 이야기가 없어요.</p>

                <p className="empty-desc">
                  오늘의 하루가 쌓이면 <br />
                  가족들의 반응도 함께 기록돼요.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="story-card">
                <p className="label">AI가 정리한 어머니의 하루</p>

                <h2>{todayStory.title}</h2>

                <p className="desc">{todayStory.summary}</p>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => onComingSoon?.('storyFull')}
                >
                  오늘 하루 이야기 전체 화면으로 이동 →
                </button>
              </div>
              <p className="section-title">오늘의 사진</p>
              <div className="photo-grid">
                <div className="photo-item" />
                <div className="photo-item" />
                <div className="photo-item" />
                <div className="photo-item" />
              </div>

              <div className="reaction-row">
                {reactions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`badge ${item.type}`}
                    onClick={() => onComingSoon?.('reactionStats')}
                  >
                    {item.label} ({item.count})
                  </button>
                ))}
              </div>

              <div className="family-section">
                <p className="section-title">가족 반응</p>

                {reactionComments.map((item) => (
                  <div key={item.id} className="comment-item">
                    <div className="avatar" />

                    <div className="comment-bubble">
                      <strong>{item.writer}</strong>
                      <p>{item.message}</p>
                      <span>2026/05/16 22:30</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <BottomTab currentTab="story" onTabChange={handleTabChange} />
      </div>
    </PhoneLayout>
  );
}

export default ParentStoryPage;
