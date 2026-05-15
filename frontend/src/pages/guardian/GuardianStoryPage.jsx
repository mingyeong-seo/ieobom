import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import photo1 from "../../assets/img/story1.png";
import photo2 from "../../assets/img/story2.png";
import photo3 from "../../assets/img/story3.png";

import "./GuardianStoryPage.css";

import { reactions, reactionComments, todayStory } from "../../mocks/stories";

function GuardianStoryPage({ isStoryReady = false, onTabChange }) {
  return (
    <PhoneLayout>
      <div className="guardian-story">
        {/* ✅ 헤더 */}
        <header className="parent-home-header">
          <h1>이어봄</h1>
          <div className="profile-circle" />
        </header>

        <div className="date-nav">
          <span>{"< 어제"}</span>
          <span className="today">오늘 기록</span>
          <span>{"내일 >"}</span>
        </div>

        <div className="scroll-area">
          {!isStoryReady ? (
            <div className="empty-guardian">
              <h2>오늘 하루의 이야기가 없어요</h2>
              <p>아직 오늘의 기록이 생성되지 않았어요</p>
              <p>하루가 끝나면 따뜻한 순간들을 전해드릴게요</p>
            </div>
          ) : (
            <>
              {/* ✅ 부모 페이지 그대로 재사용 */}
              <div className="story-card">
                <p className="label">AI가 정리한 어머니의 하루</p>

                <h2>{todayStory.title}</h2>

                <p className="desc">{todayStory.summary}</p>

                <button className="primary-btn">
                  오늘 하루 이야기 전체 화면으로 이동 →
                </button>
              </div>

              <p className="section-title">오늘의 사진</p>
              <div className="photo-grid">
                <img src={photo1} className="photo-item" />
                <img src={photo2} className="photo-item" />
                <img src={photo3} className="photo-item" />
                <div className="photo-item" />
              </div>

              <div className="reaction-row">
                {reactions.map((item) => (
                  <span key={item.id} className={`badge ${item.type}`}>
                    {item.label} ({item.count})
                  </span>
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
                      <span>25/05/14 20:30</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ✅ 핵심: 입력창 */}
        {isStoryReady && (
          <div className="reaction-input">
            <input placeholder="오늘 하루에 반응 남기기..." />
            <button>전송</button>
          </div>
        )}

        <BottomTab currentTab="story" onTabChange={onTabChange} />
      </div>
    </PhoneLayout>
  );
}

export default GuardianStoryPage;
