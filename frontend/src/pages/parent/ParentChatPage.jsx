import { useState } from "react";

import "./ParentChatPage.css";

import BottomTab from "../../components/common/BottomTab/BottomTab";
import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import { chatMessages, nextAiMessage } from "../../mocks/chats";
import { todayRoutines } from "../../mocks/routines";

function ParentChatPage({ onBack, onCompleteRoutine, onTabChange }) {
  const [chatStep, setChatStep] = useState("waiting");

  const aiFirstMessage = chatMessages[0];
  const parentMessage = chatMessages[1];
  const aiSecondMessage = chatMessages[2];

  const displayRoutines =
    chatStep === "completed"
      ? todayRoutines.map((routine) =>
        routine.title === "저녁 약"
          ? {
            ...routine,
            status: "completed",
            statusText: "완료",
            statusClass: "done",
          }
          : routine,
      )
      : todayRoutines;

  const handleCompleteRoutine = () => {
    setChatStep("thinking");

    setTimeout(() => {
      setChatStep("completed");

      setTimeout(() => {
        onCompleteRoutine(); // ✅ 메시지 보여주고 바로 이동
      }, 1000); // ✅ 메시지 읽을 최소 시간
    }, 2000);
  };

  return (
    <PhoneLayout leftStatus="9:41">
      <section className="parent-chat-page page-enter">
        <header className="chat-header">
          <button type="button" className="chat-back-button" onClick={onBack}>
            &lt;
          </button>

          <h1>오늘의 대화</h1>
        </header>

        <section className="chat-routine-summary">
          <p>오늘 루틴</p>

          <div className="chat-routine-list">
            {displayRoutines.map((routine) => (
              <div
                key={routine.id}
                className={`chat-routine-chip ${routine.statusClass} ${routine.colorClass}`}
              >
                <strong>{routine.title}</strong>
                <span>{routine.statusText}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="chat-progress">
          <div className="progress-bar" />
          <span className="progress-count">오늘의 마지막 대화</span>
        </section>

        <section className="chat-body">
          <div className="message-row ai previous">
            <div className="message-avatar" />

            <div className="message-bubble previous-bubble">
              이전에 비빔밥 이야기를 나눴어요.
            </div>
          </div>

          <div className="message-row ai">
            <div className="message-avatar" />

            <div className="message-bubble ai-bubble large-bubble">
              {aiFirstMessage.text}
            </div>
          </div>

          <div className="message-row parent">
            <div className="message-bubble parent-bubble">
              {parentMessage.text}
            </div>
          </div>

          <div className="message-row ai">
            <div className="message-avatar" />

            <div className="message-bubble ai-bubble large-bubble">
              {aiSecondMessage.text}
            </div>
          </div>

          {chatStep === "thinking" && (
            <div className="message-row ai">
              <div className="message-avatar" />

              <div className="message-bubble ai-bubble thinking-bubble">
                오늘 하루를 정리하고 있어요...
              </div>
            </div>
          )}

          {chatStep === "completed" && (
            <div className="message-row ai">
              <div className="message-avatar" />

              <div className="message-bubble ai-bubble large-bubble">
                {nextAiMessage.text}
              </div>
            </div>
          )}

          {chatStep === "waiting" && (
            <button
              type="button"
              className="routine-complete-button"
              onClick={handleCompleteRoutine}
            >
              응, 먹었어😊
            </button>
          )}
        </section>

        <BottomTab currentTab="chat" onTabChange={onTabChange} />
      </section>
    </PhoneLayout>
  );
}

export default ParentChatPage;
