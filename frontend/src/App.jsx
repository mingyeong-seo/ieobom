import './App.css';

import batteryIcon from './assets/icons/battery.png';
import networkIcon from './assets/icons/network.png';
import wifiIcon from './assets/icons/wifi.png';

import symbol from './assets/logos/symbol.png';

function App() {
  const currentTime = '2:53';
  const currentDate = '5월 14일 (목)';

  return (
    <main className="app">
      <div className="phone-stage">
        <section className="phone-frame">
          <div className="phone-notch" />

          <div className="phone-screen">
            <header className="status-bar">
              <span className="carrier">SKT</span>

              <div className="status-icons" aria-label="상태 아이콘">
                <img
                  src={networkIcon}
                  alt="네트워크"
                  className="network-icon"
                />

                <img src={wifiIcon} alt="와이파이" className="wifi-icon" />

                <img src={batteryIcon} alt="배터리" className="battery-icon" />
              </div>
            </header>

            <section className="lock-screen">
              <p className="lock-date">{currentDate}</p>

              <h1 className="lock-time">{currentTime}</h1>

              <button type="button" className="notification-card">
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

              <div className="home-indicator" />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
