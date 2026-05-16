import './BottomTab.css';

const defaultTabs = [
  {
    id: 'home',
    icon: '🏠',
    label: '홈',
  },
  {
    id: 'chat',
    icon: '💬',
    label: '대화',
  },
  {
    id: 'story',
    icon: '📝',
    label: '기록',
  },
];

function BottomTab({
  currentTab = 'home',
  onTabChange = () => {},
  tabs = defaultTabs,
}) {
  return (
    <nav className="bottom-tab" aria-label="하단 탭">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            className={`tab-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomTab;
