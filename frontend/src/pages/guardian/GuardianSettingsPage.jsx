import BottomTab from '../../components/common/BottomTab/BottomTab';
import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';

import daughterProfile from '../../assets/images/daughter-profile.png';
import { guardianTabs } from './guardianTabs';

import './GuardianSettingsPage.css';

function SettingRow({ icon, title, description, rightText, toggle, onClick }) {
  return (
    <button type="button" className="setting-row" onClick={onClick}>
      <span className="setting-row-icon">{icon}</span>

      <span className="setting-row-content">
        <strong>{title}</strong>
        {description && <small>{description}</small>}
      </span>

      {rightText && <span className="setting-row-value">{rightText}</span>}
      {toggle && <span className="setting-toggle" aria-hidden="true" />}
      {!toggle && <span className="setting-chevron">›</span>}
    </button>
  );
}

function GuardianSettingsPage({ onBackToRole, onComingSoon, onTabChange }) {
  return (
    <PhoneLayout leftStatus="6:30">
      <section className="guardian-settings page-enter">
        <main className="guardian-settings-scroll">
          <h1>설정</h1>

          <button
            type="button"
            className="settings-profile-card"
            onClick={() => onComingSoon?.('familyManage')}
          >
            <img src={daughterProfile} alt="보호자 프로필" />

            <span>
              <strong>배윤정</strong>
              <small>김옥자 님의 딸</small>
            </span>

            <span className="setting-chevron">›</span>
          </button>

          <section className="setting-section">
            <h2>알림 설정</h2>

            <div className="setting-card">
              <SettingRow
                icon="🗓"
                title="부모님 기록 도착 알림"
                description="부모님의 하루가 도착했어요"
                rightText="오전 6:30"
                onClick={() => onComingSoon?.('notificationDetail')}
              />
              <SettingRow
                icon="🔔"
                title="새로운 반응 알림"
                description="가족이 남긴 반응을 알려드려요"
                toggle
                onClick={() => onComingSoon?.('notificationDetail')}
              />
              <SettingRow
                icon="🕘"
                title="주간 요약 알림"
                description="부모님의 한 주를 요약해드려요"
                rightText="매주 일요일"
                onClick={() => onComingSoon?.('notificationDetail')}
              />
            </div>
          </section>

          <section className="setting-section">
            <h2>기타 설정</h2>

            <div className="setting-card">
              <SettingRow
                icon="👨‍👩‍👧"
                title="연결된 가족 관리"
                onClick={() => onComingSoon?.('familyManage')}
              />
              <SettingRow
                icon="📖"
                title="앱 사용 안내"
                onClick={() => onComingSoon?.('appGuide')}
              />
              <SettingRow
                icon="?"
                title="자주 묻는 질문"
                onClick={() => onComingSoon?.('faq')}
              />
            </div>
          </section>

          <button
            type="button"
            className="settings-logout-button"
            onClick={onBackToRole}
          >
            로그아웃
          </button>
        </main>

        <BottomTab
          currentTab="settings"
          onTabChange={onTabChange}
          tabs={guardianTabs}
        />
      </section>
    </PhoneLayout>
  );
}

export default GuardianSettingsPage;
