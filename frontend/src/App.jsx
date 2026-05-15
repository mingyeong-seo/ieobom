import { useState } from "react";

import GuardianHomePage from "./pages/guardian/GuardianHomePage";
import ParentChatPage from "./pages/parent/ParentChatPage";
import ParentHomePage from "./pages/parent/ParentHomePage";
import ParentStoryPage from "./pages/parent/ParentStoryPage";
import RoleSelectPage from "./pages/role/RoleSelectPage";
import SplashPage from "./pages/splash/SplashPage";

function App() {
  const [page, setPage] = useState("role");
  const [selectedRole, setSelectedRole] = useState(null);

  const [isParentStoryReady, setIsParentStoryReady] = useState(false);
  const [isRoutineCompleted, setIsRoutineCompleted] = useState(false);

  const handleParentTabChange = (tab) => {
    if (tab === "home") {
      setPage("parentHome");
    }

    if (tab === "chat") {
      setPage("parentChat");
    }

    if (tab === "story") {
      setPage("parentStory");
    }
  };

  if (page === "role") {
    return (
      <RoleSelectPage
        onSelectParent={() => {
          setSelectedRole("parent");
          setPage("splash");
        }}
        onSelectGuardian={() => {
          setSelectedRole("guardian");
          setPage("splash");
        }}
      />
    );
  }

  if (page === "splash") {
    return (
      <SplashPage
        role={selectedRole}
        onNext={() => {
          if (selectedRole === "parent") {
            setPage("parentHome");
          }

          if (selectedRole === "guardian") {
            setPage("guardianHome");
          }
        }}
        onBackToRole={() => {
          setSelectedRole(null);
          setPage("role");
        }}
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
          setPage("parentStory");
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

  return null;
}

export default App;
