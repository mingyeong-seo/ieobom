import "./ParentHomePage.css";

import BottomTab from "../../components/common/BottomTab/BottomTab";
import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import { chatMessages } from "../../mocks/chats";
import { parentHome } from "../../mocks/home";
import { reactionComments } from "../../mocks/reactions";
import { routineSummary, routines } from "../../mocks/routines";
import { pendingStory } from "../../mocks/stories";

function ParentHomePage({ onStartChat, onTabChange, isRoutineCompleted }) {
  const firstQuestion = chatMessages[0];
  const recentReaction = reactionComments[0];

  const heroTitle = isRoutineCompleted
    ? "오늘 하루 기록이 완성됐어요"
    : "오늘 하루가 잘 기록되고 있어요";

  const heroDescription = isRoutineCompleted
    ? "가족에게 오늘의 이야기가 전달될 준비를 마쳤어요."
    : "저녁 약만 확인하면 오늘 이야기가 완성돼요.";

  const displaySummary = isRoutineCompleted
    ? {
        completed: routineSummary.total,
        total: routineSummary.total,
      }
    : routineSummary;

  const displayRoutines = isRoutineCompleted
    ? routines.map((routine) =>
        routine.title === "저녁 약"
          ? {
              ...routine,
              status: "completed",
              statusText: "완료",
            }
          : routine,
      )
    : routines;

  return (
    <PhoneLayout leftStatus="10:41">
      <section className="parent-home page-enter">
        <header className="parent-home-header">
          <h1>이어봄</h1>
          <div className="profile-circle" aria-label="프로필" />
        </header>

        <section className="home-hero">
          <p className="home-greeting">{heroTitle}</p>
          <p className="home-date">{parentHome.date}</p>
          <p className="home-weather">{heroDescription}</p>
        </section>

        <section className="first-question">
          <p className="section-label">오늘의 첫 질문</p>
          <div className="question-card">{firstQuestion.text}</div>
        </section>

        <button
          type="button"
          className="chat-start-button"
          onClick={onStartChat}
        >
          대화 시작하기
        </button>

        <section className="routine-section">
          <div className="section-header">
            <h2>오늘 루틴</h2>
            <span>
              {displaySummary.completed} / {displaySummary.total} 완료
            </span>
          </div>

          <div className="routine-list">
            {displayRoutines.map((routine) => (
              <div key={routine.id} className="routine-item">
                <div className={`routine-icon ${routine.status}`} />

                <div>
                  <strong>{routine.title}</strong>
                  <p>{routine.time}</p>
                </div>

                <span className={`routine-status ${routine.status}`}>
                  {routine.status === "completed" ? "완료" : "대기"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {!isRoutineCompleted && (
          <section className="story-ready-card">
            <p>{pendingStory.message}</p>
          </section>
        )}

        <section className="family-reaction">
          <p className="section-label">최근 자녀 반응</p>
          <p>
            {recentReaction.writer}님이 “{recentReaction.message}”
          </p>
        </section>

        <BottomTab currentTab="home" onTabChange={onTabChange} />
      </section>
    </PhoneLayout>
  );
}

export default ParentHomePage;
