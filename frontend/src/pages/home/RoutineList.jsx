const routineEmojiById = {
  1: '💊',
  2: '🍚',
  3: '🏥',
  4: '🌙',
};

function RoutineList({ title, action, summary, routines }) {
  return (
    <section className="routine-section">
      <div className="section-header">
        <h2>{title}</h2>

        {action}
        {summary && <span>{summary}</span>}
      </div>

      <div className="routine-list">
        {routines.map((routine) => {
          const isCompleted = routine.status === 'completed';
          const emoji = routine.emoji || routineEmojiById[routine.id] || '✓';

          return (
            <button key={routine.id} type="button" className="routine-item">
              <div className={`routine-icon ${routine.colorClass}`}>
                <span className="routine-emoji">{emoji}</span>
              </div>

              <div className="routine-info">
                <strong>{routine.title}</strong>
                <p>{routine.time}</p>
              </div>

              <span
                className={`routine-check ${
                  isCompleted ? 'completed' : 'pending'
                }`}
                aria-label={isCompleted ? '완료' : '대기'}
              >
                {isCompleted ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default RoutineList;
