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
import {
  bootstrapDemo,
  createStoryReaction,
  generateStory,
  getLatestStory,
  getStoryReactions,
  getTodaySession,
  sendConversationMessage,
} from "./api/ieobomApi";
import { medicineAnswerMessage } from "./mocks/chats";
import { reactions } from "./mocks/stories";

if (typeof window !== "undefined") {
  localStorage.removeItem("ieobom-app-state");
  sessionStorage.removeItem("ieobom-app-state");
}

function App() {
  const [page, setPage] = useState("role");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isParentStoryReady, setIsParentStoryReady] = useState(false);
  const [isRoutineCompleted, setIsRoutineCompleted] = useState(false);
  const [demoData, setDemoData] = useState(null);
  const [todaySession, setTodaySession] = useState(null);
  const [latestStory, setLatestStory] = useState(null);
  const [reactionSummary, setReactionSummary] = useState(null);
  const [apiError, setApiError] = useState("");
  const [isCompletingRoutine, setIsCompletingRoutine] = useState(false);
  const [reactedReactionIds, setReactedReactionIds] = useState({});
  const [parentReactionCounts, setParentReactionCounts] = useState(() =>
    reactions.reduce((counts, item) => {
      counts[item.id] = 0;
      return counts;
    }, {}),
  );
  const [comingSoon, setComingSoon] = useState({
    feature: "album",
    returnPage: "parentHome",
  });

  const parentToken = demoData?.parent_token;
  const guardianToken = demoData?.guardian_token;
  const activeToken = selectedRole === "guardian" ? guardianToken : parentToken;

  useEffect(() => {
    let ignore = false;

    async function initializeDemo() {
      try {
        const bootstrap = await bootstrapDemo();

        if (ignore) {
          return;
        }

        setDemoData(bootstrap);
        setLatestStory(bootstrap.latest_story);
        setIsParentStoryReady(Boolean(bootstrap.latest_story?.is_ready));

        const session = await getTodaySession(bootstrap.parent_token);

        if (ignore) {
          return;
        }

        setTodaySession(session);
        setIsRoutineCompleted(
          ["completed", "story_created"].includes(session.status),
        );
      } catch (error) {
        if (!ignore) {
          setApiError(error.message);
        }
      }
    }

    initializeDemo();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!activeToken || !latestStory?.id) {
      return;
    }

    let ignore = false;

    async function loadReactions() {
      try {
        const summary = await getStoryReactions(activeToken, latestStory.id);

        if (!ignore) {
          setReactionSummary(summary);
        }
      } catch (error) {
        if (!ignore) {
          setApiError(error.message);
        }
      }
    }

    loadReactions();

    return () => {
      ignore = true;
    };
  }, [activeToken, latestStory?.id]);

  const handleBackToRole = () => {
    localStorage.removeItem("ieobom-app-state");
    sessionStorage.removeItem("ieobom-app-state");
    setSelectedRole(null);
    setIsParentStoryReady(Boolean(latestStory?.is_ready));
    setIsRoutineCompleted(false);
    setReactedReactionIds({});
    setParentReactionCounts(
      reactions.reduce((counts, item) => {
        counts[item.id] = 0;
        return counts;
      }, {}),
    );
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

  const getRoleStatusTime = () =>
    selectedRole === "guardian" ? "6:30" : "9:00";

  const openComingSoon = (feature, returnPage = page) => {
    setComingSoon({
      feature,
      returnPage,
    });
    setPage("comingSoon");
  };

  const handleCompleteRoutine = async () => {
    if (!parentToken || !todaySession?.id) {
      setIsRoutineCompleted(true);
      setIsParentStoryReady(true);
      setPage("storyGenerating");
      return;
    }

    setIsCompletingRoutine(true);
    setApiError("");

    try {
      const parentReplyCount = todaySession.messages.filter(
        (message) => message.sender === "parent",
      ).length;
      const cannedReplies = [
        "밥 맛있게 먹었어.",
        "산책도 하고 기분이 좋았어.",
        medicineAnswerMessage.text,
      ].slice(parentReplyCount);

      let sessionStatus = todaySession.status;
      let shouldGenerateStory = false;

      for (const text of cannedReplies) {
        const reply = await sendConversationMessage(parentToken, todaySession.id, {
          text,
          response_type: "text",
        });

        sessionStatus = reply.session_status;
        shouldGenerateStory = reply.should_generate_story;
      }

      const refreshedSession = await getTodaySession(parentToken);
      setTodaySession(refreshedSession);
      setIsRoutineCompleted(
        ["completed", "story_created"].includes(sessionStatus),
      );

      if (shouldGenerateStory || sessionStatus === "completed") {
        const story = await generateStory(parentToken, todaySession.id);
        setLatestStory(story);
        setIsParentStoryReady(Boolean(story.is_ready));
      } else {
        const story = await getLatestStory(parentToken);
        setLatestStory(story);
        setIsParentStoryReady(Boolean(story.is_ready));
      }

      setPage("storyGenerating");
    } catch (error) {
      setApiError(error.message);
      setIsRoutineCompleted(true);
      setIsParentStoryReady(true);
      setPage("storyGenerating");
    } finally {
      setIsCompletingRoutine(false);
    }
  };

  const handleParentReactionClick = async (id) => {
    const reaction = reactions.find((item) => item.id === id);
    const isCancelling = Boolean(reactedReactionIds[id]);

    setReactedReactionIds((prev) => ({
      ...prev,
      [id]: !isCancelling,
    }));
    setParentReactionCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + (isCancelling ? -1 : 1)),
    }));

    if (isCancelling || !activeToken || !latestStory?.id || !reaction?.type) {
      return;
    }

    try {
      await createStoryReaction(activeToken, latestStory.id, {
        type: reaction.type,
      });
    } catch (error) {
      setApiError(error.message);
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
        onBackToRole={handleBackToRole}
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
        onCompleteRoutine={handleCompleteRoutine}
        session={todaySession}
        apiError={apiError}
        isCompleting={isCompletingRoutine}
      />
    );
  }

  if (page === "parentStory") {
    return (
      <ParentStoryPage
        isStoryReady={isParentStoryReady}
        onBackToRole={requestBackToRole}
        onComingSoon={(feature) => openComingSoon(feature, "parentStory")}
        reactionCounts={parentReactionCounts}
        onReactionClick={handleParentReactionClick}
        reactedReactionIds={reactedReactionIds}
        onTabChange={handleParentTabChange}
        story={latestStory}
        reactionSummary={reactionSummary}
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
        isStoryReady
        onBackToRole={requestBackToRole}
        onComingSoon={(feature) => openComingSoon(feature, "guardianStory")}
        parentReactionCounts={parentReactionCounts}
        onReactionClick={handleParentReactionClick}
        reactedReactionIds={reactedReactionIds}
        onTabChange={handleGuardianTabChange}
        story={latestStory}
        reactionSummary={reactionSummary}
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
        leftStatus={getRoleStatusTime()}
        onBack={() => setPage(comingSoon.returnPage)}
        onHome={() => setPage(getRoleHomePage())}
      />
    );
  }

  if (page === "storyGenerating") {
    return (
      <StoryGeneratingPage
        leftStatus={getRoleStatusTime()}
        onDone={() => setPage("parentStory")}
      />
    );
  }

  return null;
}

export default App;
