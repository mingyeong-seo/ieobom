import childProfile1 from '../assets/images/child-profle1.jpg';
import childProfile2 from '../assets/images/child-profle2.jpg';

export const todayStory = {
  id: 1,
  date: '2026-05-17',
  title: '오늘 하루 · 5월 17일',
  isReady: true,

  summary:
    '오전엔 병원에 다녀오시고, 점심엔 전에 드시고 싶다고 하셨던 비빔밥을 드셨어요. 오후에는 날씨가 좋아 동네 산책을 다녀오시고 사진도 남기셨어요. 저녁에는 약도 잘 챙겨 드시며 하루 루틴을 마무리하셨어요.',

  keywords: ['병원', '식사', '산책', '약 복용'],

  aiSuggestion:
    '어제 산책 이야기가 기록됐어요. 오늘은 사진 이야기를 함께 나눠보는 건 어떨까요?',

  images: [],
};

export const reactions = [
  {
    id: 1,
    type: 'love',
    label: '보고싶어요',
    emoji: '❤️',
    count: 2,
  },
  {
    id: 2,
    type: 'miss',
    label: '고마워요',
    emoji: '😊',
    count: 1,
  },
  {
    id: 3,
    type: 'call',
    label: '전화할게요',
    emoji: '📞',
    count: 2,
  },
];

export const reactionComments = [
  {
    id: 1,
    writer: '딸',
    message: '오늘도 약 잘 챙겨 드셨네요😁',
    time: '2026/05/17 21:32',
    profileImage: childProfile1,
  },
  {
    id: 2,
    writer: '아들',
    message: '다음엔 비빔밥 같이 먹으러 가요!',
    time: '2026/05/17 21:47',
    profileImage: childProfile2,
  },
];

export const pendingStory = {
  id: null,
  isReady: false,

  title: 'AI 하루 요약',

  message:
    '오늘의 이야기는 하루가 조금 더 쌓인 뒤 완성돼요. 대화를 시작해 오늘 하루를 마무리해 보세요😊',
};

export const storyCreateCondition = {
  conditions: ['24시간 동안의 대화 기록 수집', '하루 완료 후 AI 요약 생성'],
};
