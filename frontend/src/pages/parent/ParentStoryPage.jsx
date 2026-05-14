import BottomTab from "../../components/common/BottomTab/BottomTab";
import PhoneLayout from "../../components/common/PhoneLayout/PhoneLayout";

function ParentStoryPage({ onTabChange }) {
  return (
    <PhoneLayout leftStatus="9:41">
      <section>
        <div>부모님 기록 화면</div>

        <BottomTab currentTab="story" onTabChange={onTabChange} />
      </section>
    </PhoneLayout>
  );
}

export default ParentStoryPage;
