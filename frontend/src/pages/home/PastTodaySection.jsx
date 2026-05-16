import { useRef } from 'react';

import { pastTodayItems } from './homeSharedData';

function PastTodaySection({
  items = pastTodayItems,
  subtitle,
  onMore,
  onItemClick,
}) {
  const listRef = useRef(null);

  const handleScroll = (direction) => {
    listRef.current?.scrollBy({
      left: direction * 176,
      behavior: 'smooth',
    });
  };

  return (
    <section className="past-today-section">
      <div className="section-header">
        <div>
          <h2>과거의 오늘</h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>

        <button type="button" className="more-button" onClick={onMore}>
          더보기 &gt;
        </button>
      </div>

      <div className="past-today-carousel">
        <button
          type="button"
          className="past-today-nav-button previous"
          aria-label="이전 기록 보기"
          onClick={() => handleScroll(-1)}
        >
          &lt;
        </button>

        <div className="past-today-list" ref={listRef}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="past-today-card"
              onClick={() => onItemClick?.(item)}
            >
              <div className="past-today-image">
                <img src={item.image} alt={item.title} />
              </div>

              <p>{item.title}</p>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="past-today-nav-button next"
          aria-label="다음 기록 보기"
          onClick={() => handleScroll(1)}
        >
          &gt;
        </button>
      </div>
    </section>
  );
}

export default PastTodaySection;
