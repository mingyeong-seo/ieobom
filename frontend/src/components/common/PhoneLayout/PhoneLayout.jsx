import './PhoneLayout.css';

import batteryIcon from '../../../assets/icons/battery.png';
import networkIcon from '../../../assets/icons/network.png';
import wifiIcon from '../../../assets/icons/wifi.png';

function PhoneLayout({
  children,
  leftStatus = '9:41',
  showAndroidNav = true,
  statusTone = 'default',
  navTone = 'default',
  fullScreenContent = false,
}) {
  return (
    <main className="phone-layout-app">
      <div className="orientation-blocker" role="status">
        <strong>세로 화면으로 이용해주세요</strong>
        <span>이어봄은 휴대폰 세로 화면에 맞춰져 있어요.</span>
      </div>

      <div className="phone-stage">
        <section className="phone-frame">
          <div className="phone-screen">
            <header className={`phone-status-bar ${statusTone}`}>
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

            <div className={`phone-content ${fullScreenContent ? 'full-screen' : ''}`}>
              {children}
            </div>

            {showAndroidNav && (
              <div className={`android-nav-bar ${navTone}`} aria-hidden="true">
                <span>|||</span>
                <span>○</span>
                <span>‹</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default PhoneLayout;
