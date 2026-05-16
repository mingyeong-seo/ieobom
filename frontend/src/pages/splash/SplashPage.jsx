import './SplashPage.css';

import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';
import symbol from '../../assets/logos/symbol.png';

import guardianScreen from '../../assets/images/guardianScreen.jpg';
import parentScreen from '../../assets/images/parentScreen.jpg';

function SplashPage({ role, onNext, onBackToRole }) {
  const isGuardian = role === 'guardian';

  const currentTime = isGuardian ? '6:30' : '9:00';
  const currentDate = isGuardian ? '5월 18일 월요일' : '5월 17일 일요일';
  const notificationTime = isGuardian ? '30분 전' : '지금';

  const notificationMessage = isGuardian
    ? '부모님의 하루 이야기가 도착했어요'
    : '저녁 약 드실 시간이에요';

  const lockBackgroundImage = isGuardian ? guardianScreen : parentScreen;

  const handleNext = () => {
    setTimeout(() => {
      onNext();
    }, 140);
  };

  const handleBack = () => {
    setTimeout(() => {
      onBackToRole();
    }, 120);
  };

  const lockTone = isGuardian ? 'guardian-lock' : 'parent-lock';

  return (
    <PhoneLayout
      leftStatus=""
      statusTone={lockTone}
      navTone={lockTone}
      fullScreenContent
    >
      <section
        className={`lock-screen page-enter ${
          isGuardian ? 'guardian-lock' : 'parent-lock'
        }`}
      >
        <div
          className="lock-background"
          style={{ backgroundImage: `url(${lockBackgroundImage})` }}
        />

        <div className="lock-overlay" />

        <div className="galaxy-lock-info">
          <p className="lock-date">{currentDate}</p>
          <h1 className="lock-time">{currentTime}</h1>
        </div>

        <button
          type="button"
          className="notification-card"
          onClick={handleNext}
        >
          <div className="notification-icon">
            <img src={symbol} alt="이어봄 아이콘" />
          </div>

          <div className="notification-content">
            <div className="notification-title-row">
              <strong>이어봄</strong>
              <span>{notificationTime}</span>
            </div>

            <p>{notificationMessage}</p>
          </div>
        </button>

        <div className="notification-guide">
          <p>알림을 눌러 이어봄을 시작해보세요.</p>

          <button
            type="button"
            className="role-back-text-button"
            onClick={handleBack}
          >
            역할 선택으로 돌아가기
          </button>
        </div>
      </section>
    </PhoneLayout>
  );
}

export default SplashPage;
