import { useState } from "react";

import BottomTab from "../../components/common/BottomTab/BottomTab";
import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import AppHeader from "../../components/common/AppHeader/AppHeader";
import profileImg from "../../assets/images/grandma-profile.png";

import storyIcon from "../../assets/icons/story.png";
import photo1 from "../../assets/img/story1.png";
import photo2 from "../../assets/img/story2.png";
import photo3 from "../../assets/img/story3.png";

import {
  pendingStory,
  reactions,
  todayStory,
} from "../../mocks/stories";

import "./ParentStoryPage.css";

function ParentStoryPage({
  isStoryReady = false,
  onBackToRole,
  onComingSoon,
  reactionCounts,
  onReactionClick,
  onTabChange,
  onGoHome,
  story,
  reactionSummary,
  reactedReactionIds = {},
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const displayStory = story?.is_ready ? story : todayStory;
  const displayPendingStory = story && !story.is_ready ? story : pendingStory;
  const displayIsStoryReady = Boolean(story?.is_ready ?? isStoryReady);
  const apiReactionCounts = reactionSummary?.reactions?.reduce((counts, item) => {
    counts[item.type] = item.count;
    return counts;
  }, {});
  const getReactionCount = (item) =>
    Math.max(0, (apiReactionCounts?.[item.type] ?? item.count) + (reactionCounts?.[item.id] || 0));

  const handleTabChange = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
      return;
    }

    if (tab === "home" && onGoHome) {
      onGoHome();
    }
  };

  const handleDateMoveClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onComingSoon?.("storyCalendar");
  };

  return (
    <PhoneLayout leftStatus="9:00">
      <section className="parent-story">
        <AppHeader
          className="parent-home-header"
          logoClassName="parent-home-logo"
          profileImage={profileImg}
          onLogoClick={onBackToRole}
          onProfileClick={() => onComingSoon?.('profile')}
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
            <>
              <div className="story-card empty">
                <p className="label">AI가 정리한 어머니의 하루</p>

                <h2>{displayPendingStory.title}</h2>

                <p className="desc">{displayPendingStory.message}</p>

                <div className="disabled-btn">
                  대화를 마치면 AI가 하루를 요약해 드려요
                </div>
              </div>

              <p className="section-title">가족 반응</p>
              <div className="empty-family">
                <div className="empty-icon">
                  <img src={storyIcon} alt="이야기" />
                </div>

                <p className="empty-title">아직 가족의 이야기가 없어요.</p>

                <p className="empty-desc">
                  오늘의 하루가 쌓이면 <br />
                  가족들의 반응도 함께 기록돼요.
                </p>
              </div>

              <button
                type="button"
                className="empty-action-btn"
                onClick={() => handleTabChange("chat")}
              >
                대화 시작하기
              </button>
            </>
          ) : (
            <>
              <div className="story-card">
                <p className="label">AI가 정리한 어머니의 하루</p>

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

              <p className="section-title">간단 반응</p>
              <div className="reaction-row">
                {reactions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`badge ${item.type} ${
                      reactedReactionIds[item.id] ? "selected" : ""
                    }`}
                    aria-pressed={Boolean(reactedReactionIds[item.id])}
                    onClick={() => onReactionClick?.(item.id)}
                  >
                    {item.label}
                    {getReactionCount(item) > 0 && (
                      <>
                        <br />({getReactionCount(item)})
                      </>
                    )}
                  </button>
                ))}
              </div>

              <div className="family-section">
                <p className="section-title">가족 반응</p>

                <div className="family-waiting-card">
                  <div className="family-waiting-icon">💌</div>
                  <strong>가족의 반응을 기다리고 있어요</strong>
                  <p>
                    오늘 기록이 가족에게 전달되면
                    <br />
                    따뜻한 반응이 이곳에 표시돼요.
                  </p>
                </div>
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

        <BottomTab currentTab="story" onTabChange={handleTabChange} />
      </section>
    </PhoneLayout>
  );
}

export default ParentStoryPage;
