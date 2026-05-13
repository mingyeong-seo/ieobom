import './PhoneLayout.css';

import batteryIcon from '../../../assets/icons/battery.png';
import networkIcon from '../../../assets/icons/network.png';
import wifiIcon from '../../../assets/icons/wifi.png';

function PhoneLayout({
  children,
  // 상단 왼쪽 시간 표시 값(화면별 시간 값 변경 가능)
  leftStatus = '9:41',
  showHomeIndicator = false,
}) {
  return (
    <main className="phone-layout-app">
      <div className="phone-stage">
        <section className="phone-frame">
          <div className="phone-notch" />

          <div className="phone-screen">
            <header className="phone-status-bar">
              <span className="phone-carrier">{leftStatus}</span>

              <div className="phone-status-icons" aria-label="상태 아이콘">
                <img
                  src={networkIcon}
                  alt="네트워크"
                  className="phone-network-icon"
                />
                <img
                  src={wifiIcon}
                  alt="와이파이"
                  className="phone-wifi-icon"
                />
                <img
                  src={batteryIcon}
                  alt="배터리"
                  className="phone-battery-icon"
                />
              </div>
            </header>

            <div className="phone-content">{children}</div>

            {showHomeIndicator && <div className="phone-home-indicator" />}
          </div>
        </section>
      </div>
    </main>
  );
}

export default PhoneLayout;
