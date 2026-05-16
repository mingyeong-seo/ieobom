import { useEffect, useRef, useState } from 'react';

import './ParentChatPage.css';

import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';
import {
  chatMessages,
  medicineAnswerMessage,
  nextAiMessage,
} from '../../mocks/chats';

const routineSteps = [
  {
    id: 1,
    title: '아침 약',
    statusText: '완료',
    colorClass: 'green',
    statusClass: 'done',
  },
  {
    id: 2,
    title: '점심',
    statusText: '완료',
    colorClass: 'yellow',
    statusClass: 'done',
  },
  {
    id: 3,
    title: '병원',
    statusText: '완료',
    colorClass: 'neutral',
    statusClass: 'done',
  },
  {
    id: 4,
    title: '저녁 약',
    statusText: '대기',
    colorClass: 'pink',
    statusClass: 'pending',
  },
];

function ParentChatPage({ onBack, onComingSoon, onCompleteRoutine }) {
  const [chatStep, setChatStep] = useState('waiting');
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
  const [toastKey, setToastKey] = useState(0);

  const chatBodyRef = useRef(null);
  const guideTimerRef = useRef(null);

  const displayRoutines =
    chatStep === 'completed'
      ? routineSteps.map((routine) =>
          routine.id === 4
            ? {
                ...routine,
                statusText: '완료',
                statusClass: 'done',
              }
            : routine,
        )
      : routineSteps;

  const displayMessages =
    chatStep === 'completed'
      ? [...chatMessages, medicineAnswerMessage, nextAiMessage]
      : chatStep === 'answered'
        ? [...chatMessages, medicineAnswerMessage]
        : chatMessages;

  const handleVoiceInput = () => {
    if (chatStep !== 'waiting') {
      return;
    }

    setShowVoiceGuide(false);
    setChatStep('listening');

    setTimeout(() => {
      setChatStep('answered');

      setTimeout(() => {
        setChatStep('completed');

        setTimeout(() => {
          onCompleteRoutine?.();
        }, 3200);
      }, 1100);
    }, 1600);
  };

  const handleUnavailableInput = () => {
    if (guideTimerRef.current) {
      clearTimeout(guideTimerRef.current);
    }

    setShowVoiceGuide(false);

    requestAnimationFrame(() => {
      setToastKey((prev) => prev + 1);
      setShowVoiceGuide(true);
    });

    guideTimerRef.current = setTimeout(() => {
      setShowVoiceGuide(false);
    }, 1800);
  };

  useEffect(() => {
    const chatBody = chatBodyRef.current;

    if (!chatBody) {
      return;
    }

    requestAnimationFrame(() => {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: 'smooth',
      });
    });
  }, [displayMessages.length, chatStep]);

  useEffect(() => {
    return () => {
      if (guideTimerRef.current) {
        clearTimeout(guideTimerRef.current);
      }
    };
  }, []);

  return (
    <PhoneLayout leftStatus="9:00">
      <section className="parent-chat-page page-enter">
        <header className="chat-header">
          <button type="button" className="chat-exit-button" onClick={onBack}>
            나가기
          </button>

          <h1>오늘의 대화</h1>

          <button
            type="button"
            className="chat-icon-button settings"
            aria-label="대화 설정"
            onClick={() => onComingSoon?.('chatSettings')}
          >
            ⚙
          </button>
        </header>

        <section className="chat-routine-summary">
          <div className="chat-routine-list">
            {displayRoutines.map((routine) => (
              <div
                key={routine.id}
                className={`chat-routine-chip ${routine.colorClass} ${routine.statusClass}`}
              >
                <strong>{routine.title}</strong>
                <span>{routine.statusText}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="chat-body" aria-label="대화 내용" ref={chatBodyRef}>
          {displayMessages.map((message) => {
            const isParent = message.sender === 'parent';

            return (
              <div
                key={message.id}
                className={`message-row ${isParent ? 'parent' : 'ai'}`}
              >
                {!isParent && <div className="message-avatar" />}

                <div>
                  <div
                    className={`message-bubble ${
                      isParent ? 'parent-bubble' : 'ai-bubble'
                    }`}
                  >
                    {message.text}
                  </div>

                  <span className={`message-time ${isParent ? 'right' : ''}`}>
                    {message.time}
                  </span>
                </div>
              </div>
            );
          })}

          {chatStep === 'listening' && (
            <div className="message-row ai">
              <div className="message-avatar" />

              <div>
                <div className="message-bubble ai-bubble thinking-bubble">
                  듣고 있어요. 천천히 말씀해 주세요...
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="chat-input-area">
          {showVoiceGuide && (
            <div key={toastKey} className="voice-guide-toast" role="status">
              가운데 말하기 버튼을 눌러 답해주세요.
            </div>
          )}

          <div className="quick-action-grid">
            <button
              type="button"
              className="quick-action"
              onClick={handleUnavailableInput}
            >
              <span>💊</span>
              방금 약을 먹었어요
            </button>

            <button
              type="button"
              className="quick-action"
              onClick={handleUnavailableInput}
            >
              <span>🕘</span>
              조금 있다 먹을게요
            </button>
          </div>

          <button
            type="button"
            className="voice-input-button"
            disabled={chatStep !== 'waiting'}
            onClick={handleVoiceInput}
          >
            <span className="voice-ring" aria-hidden="true" />
            <span className="voice-core" aria-hidden="true">
              <span className="mic-shape" />
            </span>
            <strong>말하기</strong>
          </button>

          <div className="quick-action-grid">
            <button
              type="button"
              className="quick-action"
              onClick={handleUnavailableInput}
            >
              <span>💧</span>
              물이랑 같이 먹었어요
            </button>

            <button
              type="button"
              className="quick-action"
              onClick={handleUnavailableInput}
            >
              <span>💬</span>
              다른 이야기
            </button>
          </div>

          <button
            type="button"
            className="text-input-button"
            onClick={handleUnavailableInput}
          >
            대화 내용을 직접 입력하기
          </button>
        </section>
      </section>
    </PhoneLayout>
  );
}

export default ParentChatPage;
