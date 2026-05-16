export const chatMessages = [
  {
    id: 1,
    sender: 'ai',
    text: '오늘 점심은 전에 말했던 비빔밥 드셨어요?',
    time: '09:03 AM',
  },
  {
    id: 2,
    sender: 'parent',
    text: '응, 전에 담근 김치랑 같이 먹어서 더 맛있었어.',
    time: '09:04 AM',
  },
  {
    id: 3,
    sender: 'ai',
    text: '오늘 산책은 다녀오셨어요?',
    time: '09:04 AM',
  },
  {
    id: 4,
    sender: 'parent',
    text: '응, 날씨가 좋아서 동네 한 바퀴 돌고 왔어.',
    time: '09:05 AM',
  },
  {
    id: 5,
    sender: 'ai',
    text: '와~ 잘하셨어요!\n이제 약 드실 시간이에요 💊\n복용하셨다면 아래 버튼을 눌러주세요!',
    time: '09:06 AM',
  },
];

export const nextAiMessage = {
  id: 7,
  sender: 'ai',
  text: '좋아요. 오늘 약 복용까지 기록됐어요.\n이제 하루 이야기를 정리해볼게요.',
  time: '09:07 AM',
};

export const medicineAnswerMessage = {
  id: 6,
  sender: 'parent',
  text: '응, 방금 물이랑 같이 먹었어.',
  time: '09:07 AM',
};
