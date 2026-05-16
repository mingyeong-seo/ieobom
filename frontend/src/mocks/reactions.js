import daughterProfile from '../assets/images/daughter-profile.png';
import sonProfile from '../assets/images/son-profile.jpg';

export const reactions = [
  {
    id: 1,
    type: 'love',
    label: '잘했어요',
    emoji: '❤️',
    count: 2,
  },
  {
    id: 2,
    type: 'miss',
    label: '보고싶어요',
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
    profileImage: daughterProfile,
    message: '오늘도 약 잘 챙겨 드셨네요😁',
  },
  {
    id: 2,
    writer: '아들',
    profileImage: sonProfile,
    message: '다음엔 비빔밥 같이 먹으러 가요!',
  },
];
