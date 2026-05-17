import { useState } from "react";

import AppHeader from "../../components/common/AppHeader/AppHeader";
import BottomTab from "../../components/common/BottomTab/BottomTab";
import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";

import daughterProfile from "../../assets/images/daughter-profile.png";
import photo1 from "../../assets/img/story1.png";
import photo2 from "../../assets/img/story2.png";
import photo3 from "../../assets/img/story3.png";

import { reactionComments, reactions, todayStory } from "../../mocks/stories";
import { guardianTabs } from "./guardianTabs";

import "./GuardianStoryPage.css";

function GuardianStoryPage({
  isStoryReady = true,
  onBackToRole,
  onComingSoon,
  parentReactionCounts = {},
  onTabChange,
  onReactionClick,
  story,
  reactionSummary,
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const displayStory = story?.is_ready ? story : todayStory;
  const displayIsStoryReady = Boolean(story?.is_ready ?? isStoryReady);
  const apiReactionCounts = reactionSummary?.reactions?.reduce((counts, item) => {
    counts[item.type] = item.count;
    return counts;
  }, {});
  const displayComments = reactionSummary?.comments?.length
    ? reactionSummary.comments
    : reactionComments;
  const [reactionCounts, setReactionCounts] = useState(() =>
    reactions.reduce((counts, item) => {
      counts[item.id] = item.count + (parentReactionCounts[item.id] || 0);
      return counts;
    }, {}),
  );

  const handleReactionClick = (id) => {
    setReactionCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    onReactionClick?.(id);
  };

  const handleDateMoveClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onComingSoon?.("storyCalendar");
  };

  return (
    <PhoneLayout leftStatus="6:30">
      <section className="guardian-story">
        <AppHeader
          className="parent-home-header"
          profileImage={daughterProfile}
          onLogoClick={onBackToRole}
          onProfileClick={() => onComingSoon?.("profile")}
        />

        <div className="date-nav">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={handleDateMoveClick}
          >
            {"< 어제"}
          </button>
          <span className="today">오늘 기록</span>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={handleDateMoveClick}
          >
            {"내일 >"}
          </button>
        </div>

        <div className="scroll-area">
          {!displayIsStoryReady ? (
            <div className="empty-guardian">
              <h2>오늘 하루의 이야기가 없어요</h2>
              <p>아직 오늘의 기록이 생성되지 않았어요</p>
              <p>하루가 끝나면 따뜻한 순간들을 전해드릴게요</p>
            </div>
          ) : (
            <>
              <div className="story-card">
                <p className="label">AI가 정리한 김옥자 님의 하루</p>

                <h2>{displayStory.title}</h2>

                <p className="desc">{displayStory.summary}</p>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => onComingSoon?.("storyFull")}
                >
                  오늘 하루 이야기 전체 화면으로 이동 →
                </button>
              </div>

              <p className="section-title">오늘의 사진</p>
              <div className="photo-grid">
                {[
                  { src: photo1, alt: "오늘의 사진 1" },
                  { src: photo2, alt: "오늘의 사진 2" },
                  { src: photo3, alt: "오늘의 사진 3" },
                ].map((photo) => (
                  <button
                    key={photo.src}
                    type="button"
                    className="photo-item photo-image-button"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img src={photo.src} alt={photo.alt} />
                  </button>
                ))}
                <button
                  type="button"
                  className="photo-item photo-placeholder"
                  onClick={() => onComingSoon?.("imageSave")}
                  aria-label="사진 더보기"
                />
              </div>

              <div className="reaction-row">
                {reactions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`badge ${item.type}`}
                    onClick={() => handleReactionClick(item.id)}
                  >
                    {item.label} <br />(
                    {apiReactionCounts?.[item.type] ?? reactionCounts[item.id]})
                  </button>
                ))}
              </div>

              <div className="family-section">
                <p className="section-title">가족 반응</p>

                {displayComments.map((item) => (
                  <div key={item.id} className="comment-item">
                    <div className="avatar">
                      {item.profileImage && (
                        <img src={item.profileImage} alt={`${item.writer} 프로필`} />
                      )}
                    </div>
                    <div className="comment-bubble">
                      <strong>{item.writer}</strong>
                      <p>{item.message}</p>
                      <span>
                        {typeof item.time === "string"
                          ? item.time
                          : new Intl.DateTimeFormat("ko-KR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            }).format(new Date(item.time))}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {selectedPhoto && (
          <div
            className="photo-viewer"
            role="dialog"
            aria-modal="true"
            aria-label="사진 크게 보기"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              type="button"
              className="photo-viewer-close"
              onClick={() => setSelectedPhoto(null)}
              aria-label="닫기"
            >
              ×
            </button>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
          </div>
        )}

        {/* ✅ 보호자 전용 */}
        {displayIsStoryReady && (
          <div className="reaction-input">
            <button type="button" onClick={() => onComingSoon?.("reactionAdd")}>
              오늘 하루 안부 남기기...
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
