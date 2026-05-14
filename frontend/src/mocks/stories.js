export const todayStory = {
  id: 1,
  date: "2026-05-14",
  title: "오늘 하루 · 5월 14일",
  isReady: true,

  summary:
    "오전엔 병원에 다녀오시고, 점심엔 전에 드시고 싶다고 하셨던 비빔밥을 드셨어요. 저녁에는 약도 잘 챙겨 드시며 하루 루틴을 마무리하셨어요.",

  keywords: ["병원", "식사", "약 복용"],

  images: [],
};

export const reactions = [
  {
    id: 1,
    type: "love",
    label: "잘했어요",
    emoji: "❤️",
    count: 2,
  },
  {
    id: 2,
    type: "miss",
    label: "보고싶어요",
    emoji: "😊",
    count: 1,
  },
  {
    id: 3,
    type: "call",
    label: "전화할게요",
    emoji: "📞",
    count: 1,
  },
];

export const reactionComments = [
  {
    id: 1,
    writer: "누나",
    message: "오늘도 약 잘 챙겨 드셨네요😁",
  },
  {
    id: 2,
    writer: "동생",
    message: "다음엔 비빔밥 같이 먹으러 가요!",
  },
];

export const pendingStory = {
  id: null,
  isReady: false,

  title: "AI 하루 요약",

  message:
    "오늘의 이야기는 하루가 조금 더 쌓인 뒤 완성돼요. 대화를 시작해 오늘 하루를 마무리해 보세요😊",
};

export const storyCreateCondition = {
  conditions: ["루틴 일정 비율 이상 완료", "특정 시간 이후"],
};
