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

          return (
            <div key={routine.id} className="routine-item">
              <div className={`routine-icon ${routine.colorClass}`} />

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
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RoutineList;
