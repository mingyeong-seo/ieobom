import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import "./ParentStoryPage.css";

import { pendingStory, todayStory } from "../../mocks/stories";

function ParentStoryPage({ isStoryReady = false, onTabChange, onGoHome }) {
  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }

    if (tab === "home" && onGoHome) {
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
          <span>{"< 어제"}</span>
          <span className="today">오늘</span>
          <span>{"내일 >"}</span>
        </div>

        {!isStoryReady ? (
          <div className="story-card empty">
            <p className="label">AI가 정리한 어머니의 하루</p>

            <h2>{pendingStory.title}</h2>

            <p className="desc">{pendingStory.message}</p>

            <div className="disabled-btn">
              대화를 마치면 AI가 하루를 요약해 드려요
            </div>
          </div>
        ) : (
          <>
            <div className="story-card">
              <p className="label">AI가 정리한 어머니의 하루</p>

              <h2>{todayStory.title}</h2>

              <p className="desc">{todayStory.summary}</p>

              <button className="primary-btn">
                오늘 하루 이야기 전체 화면으로 이동 →
              </button>
            </div>

            <div className="reaction-row">
              <span className="badge orange">잘했어요 (1)</span>
              <span className="badge yellow">보고싶어요</span>
              <span className="badge green">전화할게요 (1)</span>
            </div>

            <div className="family-section">
              <p className="section-title">가족 반응</p>

              <div className="reaction-item">
                <div className="avatar" />
                <div>
                  <strong>딸</strong>
                  <p>— 잘했어요! 오늘도 건강하게</p>
                  <span>25/05/14 9:00</span>
                </div>
              </div>

              <div className="reaction-item">
                <div className="avatar green" />
                <div>
                  <strong>아들</strong>
                  <p>— 전화할게요!</p>
                  <span>25/05/14 9:03</span>
                </div>
              </div>
            </div>
          </>
        )}

        <BottomTab currentTab="story" onTabChange={handleTabChange} />
      </div>
    </PhoneLayout>
  );
}

export default ParentStoryPage;
