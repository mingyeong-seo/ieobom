import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import Card from "../../components/common/Card/Card";
import "./GuardianHomePage.css";

function GuardianHomePage({ onGoStory }) {
  const todayList = [
    { title: "아침 인사", time: "08:12", done: true },
    { title: "공원 사진 1장", time: "14:22", done: true },
    { title: "혈압약 복용", time: "21:00", done: true },
    { title: "저녁 안부", time: "21:30", done: false },
  ];

  return (
    <PhoneLayout>
      <div className="guardian-home">
        {/* 상단 헤더 */}
        <header className="parent-home-header">
          <h1>이어봄</h1>
          <div className="profile-circle" />
        </header>

        {/* 인사 영역 */}
        <div className="greeting">
          <h2>안녕하세요!</h2>
          <h3>오늘 하루는 어떠셨어요?</h3>
          <p>2025년 5월 12일 월요일</p>
        </div>

        {/* 리스트 */}
        <div className="section">
          <div className="section-header">
            <span>오늘의 안부</span>
            <span className="edit">수정하기</span>
          </div>

          <div className="card-list">
            {todayList.map((item, idx) => (
              <Card key={idx}>
                <div className="card-content">
                  <div>
                    <div className="title">{item.title}</div>
                    <div className="time">{item.time}</div>
                  </div>

                  <div className={`check ${item.done ? "done" : ""}`}>
                    {item.done && "✓"}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <BottomTab
          currentTab="home"
          onTabChange={(tab) => {
            if (tab === "story") {
              onGoStory();
            }
          }}
        />
      </div>

    </PhoneLayout>
  );
}

export default GuardianHomePage;
