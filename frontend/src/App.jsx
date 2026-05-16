import { useEffect, useState } from "react";

import ComingSoonPage from "./pages/comingSoon/ComingSoonPage";
import GuardianHomePage from "./pages/guardian/GuardianHomePage";
import GuardianSettingsPage from "./pages/guardian/GuardianSettingsPage";
import GuardianStoryPage from "./pages/guardian/GuardianStoryPage";
import ParentChatPage from "./pages/parent/ParentChatPage";
import ParentHomePage from "./pages/parent/ParentHomePage";
import ParentStoryPage from "./pages/parent/ParentStoryPage";
import RoleSelectPage from "./pages/role/RoleSelectPage";
import SplashPage from "./pages/splash/SplashPage";
import StoryGeneratingPage from "./pages/story/StoryGeneratingPage";

const STORAGE_KEY = "ieobom-app-state";

const getSavedAppState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
};

function App() {
  const savedAppState = getSavedAppState();

  const [page, setPage] = useState(savedAppState.page || "role");
  const [selectedRole, setSelectedRole] = useState(
    savedAppState.selectedRole || null,
  );

  const [isParentStoryReady, setIsParentStoryReady] = useState(
    savedAppState.isParentStoryReady || false,
  );
  const [isRoutineCompleted, setIsRoutineCompleted] = useState(
    savedAppState.isRoutineCompleted || false,
  );
  const [comingSoon, setComingSoon] = useState({
    feature: savedAppState.comingSoon?.feature || "album",
    returnPage: savedAppState.comingSoon?.returnPage || "parentHome",
  });

  const handleBackToRole = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSelectedRole(null);
    setIsParentStoryReady(false);
    setIsRoutineCompleted(false);
    setComingSoon({
      feature: "album",
      returnPage: "parentHome",
    });
    setPage("role");
  };

  const requestBackToRole = () => {
    const shouldReset = window.confirm(
      "처음 화면으로 돌아가면 현재 진행 상태가 초기화돼요.\n돌아갈까요?",
    );

    if (shouldReset) {
      handleBackToRole();
    }
  };

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

  const handleGuardianTabChange = (tab) => {
    if (tab === "home") {
      setPage("guardianHome");
    }

    if (tab === "story") {
      setPage("guardianStory");
    }

    if (tab === "settings") {
      setPage("guardianSettings");
    }
  };

  const getRoleHomePage = () =>
    selectedRole === "guardian" ? "guardianHome" : "parentHome";

  const openComingSoon = (feature, returnPage = page) => {
    setComingSoon({
      feature,
      returnPage,
    });
    setPage("comingSoon");
  };

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        page,
        selectedRole,
        isParentStoryReady,
        isRoutineCompleted,
        comingSoon,
      }),
    );
  }, [page, selectedRole, isParentStoryReady, isRoutineCompleted, comingSoon]);

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
          handleBackToRole();
        }}
      />
    );
  }

  if (page === "parentHome") {
    return (
      <ParentHomePage
        onStartChat={() => setPage("parentChat")}
        onBackToRole={requestBackToRole}
        onComingSoon={(feature) => openComingSoon(feature, "parentHome")}
        onTabChange={handleParentTabChange}
        isRoutineCompleted={isRoutineCompleted}
      />
    );
  }

  if (page === "parentChat") {
    return (
      <ParentChatPage
        onBack={() => setPage("parentHome")}
        onComingSoon={(feature) => openComingSoon(feature, "parentChat")}
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
        onComingSoon={(feature) => openComingSoon(feature, "parentStory")}
        onTabChange={handleParentTabChange}
      />
    );
  }

  if (page === "guardianHome") {
    return (
      <GuardianHomePage
        onBackToRole={requestBackToRole}
        onGoStory={() => setPage("guardianStory")}
        onComingSoon={(feature) => openComingSoon(feature, "guardianHome")}
        onTabChange={handleGuardianTabChange}
      />
    );
  }

  if (page === "guardianStory") {
    return (
      <GuardianStoryPage
        onBackToRole={handleBackToRole}
        onTabChange={handleGuardianTabChange}
      />
    );
  }

  if (page === "guardianSettings") {
    return (
      <GuardianSettingsPage
        onBackToRole={handleBackToRole}
        onComingSoon={(feature) => openComingSoon(feature, "guardianSettings")}
        onTabChange={handleGuardianTabChange}
      />
    );
  }

  if (page === "comingSoon") {
    return (
      <ComingSoonPage
        feature={comingSoon.feature}
        onBack={() => setPage(comingSoon.returnPage)}
        onHome={() => setPage(getRoleHomePage())}
      />
    );
  }

  if (page === "storyGenerating") {
    return (
      <StoryGeneratingPage
        onDone={() => setPage("parentStory")}
      />
    );
  }

  return null;
}

export default App;
