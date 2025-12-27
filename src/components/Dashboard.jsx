import { useStore } from '../context/StoreContext';

export default function Dashboard({ onGoalSelect }) {
  const { data } = useStore();
  const { user, goals } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* User Stats Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Level {user.level} Goal Crusher
            </div>
        </div>
        <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                {user.points} XP
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Next Level: {user.nextLevelExp} XP
            </div>
        </div>
      </div>

      {/* Goals Section */}
      <div>
        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Your Quests</h3>
        {goals.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No goals defined yet. Start your journey!</p>
        ) : (
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {goals.map(goal => (
                    <div 
                        key={goal.id} 
                        className="card" 
                        onClick={() => onGoalSelect && onGoalSelect(goal)}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}
                    >
                        <h4 style={{ marginTop: 0 }}>{goal.title}</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <small style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem' }}>MOTIVATION:</small>
                            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {goal.whys.slice(0, 2).map((why, i) => <li key={i}>{why}</li>)}
                                {goal.whys.length > 2 && <li>...</li>}
                            </ul>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', fontSize: '0.875rem' }}>
                            Systems: {data?.systems?.filter(s => s.goalId === goal.id).length || 0}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
