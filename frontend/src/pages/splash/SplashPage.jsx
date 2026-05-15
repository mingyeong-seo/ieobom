import "./SplashPage.css";

import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import symbol from "../../assets/logos/symbol.png";

function SplashPage({ role, onNext, onBackToRole }) {
  const currentTime = "2:53";
  const currentDate = "5월 14일 (목)";

  const notificationMessage =
    role === "guardian"
      ? "오늘 부모님의 하루가 도착했어요 📖"
      : "저녁 약 드실 시간이에요 💊";

  return (
    <PhoneLayout leftStatus="SKT" showHomeIndicator>
      <section className="lock-screen page-enter">
        <p className="lock-date">{currentDate}</p>

        <h1 className="lock-time">{currentTime}</h1>

        <button type="button" className="notification-card" onClick={onNext}>
          <div className="notification-icon">
            <img src={symbol} alt="이어봄 아이콘" />
          </div>

          <div className="notification-content">
            <strong>이어봄</strong>
            <p>{notificationMessage}</p>
          </div>
        </button>

        <div className="notification-guide">
          <p>화면의 알림을 누르면 시작됩니다.</p>

          <button
            type="button"
            className="role-back-text-button"
            onClick={onBackToRole}
          >
            뒤로 가려면 여기를 누르세요
          </button>
        </div>
      </section>
    </PhoneLayout>
  );
}

export default SplashPage;
