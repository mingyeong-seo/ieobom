import BottomTab from "../../components/common/BottomTab/BottomTab";
import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";
import { pendingStory, todayStory } from "../../mocks/stories";

function ParentStoryPage({ isStoryReady, onTabChange }) {
  return (
    <PhoneLayout leftStatus="9:41">
      <section className="parent-home page-enter">
        <section>
          {isStoryReady ? (
            <div>
              <h1>{todayStory.title}</h1>
              <p>{todayStory.summary}</p>
            </div>
          ) : (
            <div>
              <h1>{pendingStory.title}</h1>
              <p>{pendingStory.message}</p>
            </div>
          )}

          <BottomTab currentTab="story" onTabChange={onTabChange} />
        </section>
      </section>
    </PhoneLayout>
  );
}

export default ParentStoryPage;
