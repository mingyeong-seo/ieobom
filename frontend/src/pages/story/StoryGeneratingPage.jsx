import { useEffect } from "react";
import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import "./StoryGeneratingPage.css";

function StoryGeneratingPage({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone(); // ✅ 일정 시간 후 이동
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <PhoneLayout>
      <div className="story-generating">
        <div className="loading-wrapper">
          <div className="loading-circle">
            <span className="wave w1"></span>
            <span className="wave w2"></span>
            <span className="wave w3"></span>

            <div className="inner-circle" />
          </div>
          <h2>오늘 하루를</h2>
          <h2>정리하고 있어요</h2>

          <p>잠시만 기다려 주세요...</p>
        </div>
      </div>
    </PhoneLayout>
  );
}

export default StoryGeneratingPage;