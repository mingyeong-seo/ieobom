import './SplashPage.css';

import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';
import symbol from '../../assets/logos/symbol.png';

function SplashPage({ onNext }) {
  const currentTime = '2:53';
  const currentDate = '5월 14일 (목)';

  return (
    <PhoneLayout leftStatus="SKT" showHomeIndicator>
      <section className="lock-screen">
        <p className="lock-date">{currentDate}</p>

        <h1 className="lock-time">{currentTime}</h1>

        <button type="button" className="notification-card" onClick={onNext}>
          <div className="notification-icon">
            <img src={symbol} alt="이어봄 아이콘" />
          </div>

          <div className="notification-content">
            <strong>이어봄</strong>
            <p>약 드실 시간이에요 💊</p>
          </div>
        </button>

        <div className="notification-guide">
          <p>화면의 알림을 누르면 시작돼요!</p>
          <span aria-hidden="true">⌄</span>
        </div>
      </section>
    </PhoneLayout>
  );
}

export default SplashPage;
