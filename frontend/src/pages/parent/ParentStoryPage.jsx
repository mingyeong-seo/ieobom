import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import "./ParentStoryPage.css";

function ParentStoryPage({ isCompleted = false, onGoHome }) {
  return (
    <PhoneLayout>
      <div className="parent-story">
        {/* 헤더 */}
        <header className="parent-home-header">
          <h1>기록</h1>
          <span className="date">5월 12일</span>
        </header>

        {/* 날짜 네비 */}
        <div className="date-nav">
          <span>{"< 어제"}</span>
          <span className="today">오늘</span>
          <span>{"내일 >"}</span>
        </div>

        {/* ✅ 상태에 따라 분기 */}
        {!isCompleted ? (
          <div className="story-card empty">
            <p className="label">AI가 정리한 어머니의 하루</p>

            <h2>
              오늘의 이야기는 하루가 조금 더 <br />
              쌓인 뒤 완성돼요.
            </h2>

            <p className="desc">
              대화를 시작해 오늘 하루를 마무리해 보세요 😊
            </p>

            <div className="disabled-btn">
              대화를 마치면 AI가 하루를 요약해 드려요
            </div>
          </div>
        ) : (
          <>
            <div className="story-card">
              <p className="label">AI가 정리한 어머니의 하루</p>

              <h2>오늘 하루 · 5월 12일</h2>

              <p className="desc">
                오전엔 병원에 다녀오시고, 점심엔 된장찌개를 드셨어요.
                <br />
                오후엔 공원 산책 중에 코스모스 사진을 남기셨어요 🌸
              </p>

              <button className="primary-btn">
                오늘 하루 이야기 전체 화면으로 이동 →
              </button>
            </div>

            {/* 반응 */}
            <div className="reaction-row">
              <span className="badge orange">잘했어요 (1)</span>
              <span className="badge yellow">보고싶어요</span>
              <span className="badge green">전화할게요 (1)</span>
            </div>

            {/* 가족 반응 */}
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

        <BottomTab
          currentTab="story"
          onTabChange={(tab) => {
            if (tab === "home") {
              onGoHome();
            }
          }}
        />
      </div>
    </PhoneLayout>
  );
}

export default ParentStoryPage;