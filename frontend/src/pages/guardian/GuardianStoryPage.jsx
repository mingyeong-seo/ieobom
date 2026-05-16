import AppHeader from '../../components/common/AppHeader/AppHeader';
import BottomTab from '../../components/common/BottomTab/BottomTab';
import PhoneLayout from '../../components/common/PhoneLayout/PhoneLayout';

import daughterProfile from '../../assets/images/daughter-profile.png';
import photo1 from '../../assets/img/story1.png';
import photo2 from '../../assets/img/story2.png';
import photo3 from '../../assets/img/story3.png';
import { reactionComments, reactions, todayStory } from '../../mocks/stories';
import { guardianTabs } from './guardianTabs';

import './GuardianStoryPage.css';

function GuardianStoryPage({
  isStoryReady = true,
  onBackToRole,
  onComingSoon,
  onTabChange,
}) {
  return (
    <PhoneLayout leftStatus="6:30">
      <section className="guardian-story">
        <AppHeader
          className="guardian-story-header"
          profileImage={daughterProfile}
          profileAlt="보호자 프로필"
          onLogoClick={onBackToRole}
        />

        <div className="date-nav">
          <span>{'< 어제'}</span>
          <span className="today">오늘 기록</span>
          <span>{'내일 >'}</span>
        </div>

        <div className="scroll-area">
          {!isStoryReady ? (
            <div className="empty-guardian">
              <h2>오늘 하루의 이야기가 없어요</h2>
              <p>아직 오늘의 기록이 생성되지 않았어요</p>
              <p>하루가 끝나면 따뜻한 순간들을 전해드릴게요</p>
            </div>
          ) : (
            <>
              <div className="story-card">
                <p className="label">AI가 정리한 김옥자 님의 하루</p>

                <h2>{todayStory.title}</h2>

                <p className="desc">{todayStory.summary}</p>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => onComingSoon?.('storyFull')}
                >
                  오늘 하루 이야기 전체 화면으로 이동 →
                </button>
              </div>

              <p className="section-title">오늘의 사진</p>
              <div className="photo-grid">
                <img src={photo1} className="photo-item" alt="오늘의 사진 1" />
                <img src={photo2} className="photo-item" alt="오늘의 사진 2" />
                <img src={photo3} className="photo-item" alt="오늘의 사진 3" />
                <button
                  type="button"
                  className="photo-item photo-placeholder"
                  onClick={() => onComingSoon?.('imageSave')}
                  aria-label="사진 더보기"
                />
              </div>

              <div className="reaction-row">
                {reactions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`badge ${item.type}`}
                    onClick={() => onComingSoon?.('reactionStats')}
                  >
                    {item.label} ({item.count})
                  </button>
                ))}
              </div>

              <div className="family-section">
                <p className="section-title">가족 반응</p>

                {reactionComments.map((item) => (
                  <div key={item.id} className="comment-item">
                    <div className="avatar" />

                    <div className="comment-bubble">
                      <strong>{item.writer}</strong>
                      <p>{item.message}</p>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {isStoryReady && (
          <div className="reaction-input">
            <button type="button" onClick={() => onComingSoon?.('reactionAdd')}>
              오늘 하루에 반응 남기기...
            </button>
          </div>
        )}

        <BottomTab
          currentTab="story"
          tabs={guardianTabs}
          onTabChange={onTabChange}
        />
      </section>
    </PhoneLayout>
  );
}

export default GuardianStoryPage;
