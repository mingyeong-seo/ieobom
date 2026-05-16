export const routineSummary = {
  completed: 3,
  total: 4,
};

export const routines = [
  {
    id: 1,
    title: '아침 약',
    time: '08:12',
    status: 'completed',
    statusText: '완료',
    statusClass: 'done',
    colorClass: 'green',
  },
  {
    id: 3,
    title: '병원',
    time: '11:00',
    status: 'completed',
    statusText: '완료',
    statusClass: 'done',
    colorClass: '',
  },
  {
    id: 2,
    title: '점심',
    time: '12:30',
    status: 'completed',
    statusText: '완료',
    statusClass: 'done',
    colorClass: 'yellow',
  },
  {
    id: 4,
    title: '저녁 약',
    time: '21:00',
    status: 'pending',
    statusText: '대기',
    statusClass: 'pending active',
    colorClass: 'pink',
  },
];

export const completedRoutineSummary = {
  completed: 4,
  total: 4,
};

export const completedRoutines = routines.map((routine) =>
  routine.id === 4
    ? {
        ...routine,
        status: 'completed',
        statusText: '완료',
        statusClass: 'done',
      }
    : routine,
);

export const todayRoutines = routines;
