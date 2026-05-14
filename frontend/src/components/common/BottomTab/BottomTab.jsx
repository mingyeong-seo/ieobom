import "./BottomTab.css";

function BottomTab({ currentTab = "home", onTabChange = () => {} }) {
  return (
    <nav className="bottom-tab">
      <button
        type="button"
        className={`tab-item ${currentTab === "home" ? "active" : ""}`}
        onClick={() => onTabChange("home")}
      >
        <span className="tab-icon">🏠</span>
        <span className="tab-label">홈</span>
      </button>

      <button
        type="button"
        className={`tab-item ${currentTab === "chat" ? "active" : ""}`}
        onClick={() => onTabChange("chat")}
      >
        <span className="tab-icon">💬</span>
        <span className="tab-label">대화</span>
      </button>

      <button
        type="button"
        className={`tab-item ${currentTab === "story" ? "active" : ""}`}
        onClick={() => onTabChange("story")}
      >
        <span className="tab-icon">📖</span>
        <span className="tab-label">기록</span>
      </button>
    </nav>
  );
}

export default BottomTab;
