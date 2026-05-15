import { useState } from "react";

import GuardianHomePage from "./pages/guardian/GuardianHomePage";
import ParentChatPage from "./pages/parent/ParentChatPage";
import ParentHomePage from "./pages/parent/ParentHomePage";
import ParentStoryPage from "./pages/parent/ParentStoryPage";
import RoleSelectPage from "./pages/role/RoleSelectPage";
import SplashPage from "./pages/splash/SplashPage";
import StoryGeneratingPage from "./pages/story/StoryGeneratingPage";

function App() {
  const [page, setPage] = useState("splash");
  const [isParentStoryReady, setIsParentStoryReady] = useState(false);
  const [isRoutineCompleted, setIsRoutineCompleted] = useState(false);

  const handleParentTabChange = (tab) => {
    if (tab === "home") setPage("parentHome");
    if (tab === "chat") setPage("parentChat");
    if (tab === "story") setPage("parentStory");
  };

  if (page === "splash") {
    return <SplashPage onNext={() => setPage("role")} />;
  }

  if (page === "role") {
    return (
      <RoleSelectPage
        onSelectParent={() => setPage("parentHome")}
        onSelectGuardian={() => setPage("guardianHome")}
      />
    );
  }

  if (page === "parentHome") {
    return (
      <ParentHomePage
        onStartChat={() => setPage("parentChat")}
        onTabChange={handleParentTabChange}
        isRoutineCompleted={isRoutineCompleted}
      />
    );
  }

  if (page === "parentChat") {
    return (
      <ParentChatPage
        onBack={() => setPage("parentHome")}
        onCompleteRoutine={() => {
          setIsRoutineCompleted(true);
          setIsParentStoryReady(true);
          setPage("storyGenerating");
        }}
        onTabChange={handleParentTabChange}
      />
    );
  }

  if (page === "parentStory") {
    return (
      <ParentStoryPage
        isStoryReady={isParentStoryReady}
        onTabChange={handleParentTabChange}
      />
    );
  }

  if (page === "guardianHome") {
    return <GuardianHomePage />;
  }

  if (page === "storyGenerating") {
    return (
      <StoryGeneratingPage
        onDone={() => setPage("parentStory")} // ✅ 여기서 기록으로 이동
      />
    );
  }

  return null;
}

export default App;
