import { useState } from 'react';
import { useStore } from '../context/StoreContext';
import PomodoroTimer from './PomodoroTimer';

export default function GoalDetails({ goal, onBack }) {
  const { addSystem, editSystem, deleteSystem, data } = useStore();
  const goalSystems = data.systems.filter(s => s.goalId === goal.id);
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [editingSystemId, setEditingSystemId] = useState(null);
  const [activeSystem, setActiveSystem] = useState(null); // System being executed
  
  // Form State
  const [sysTitle, setSysTitle] = useState('');
  const [sysDuration, setSysDuration] = useState(25);
  const [sysFreq, setSysFreq] = useState('Daily');

  const handleSaveSystem = (e) => {
    e.preventDefault();
    if (!sysTitle.trim()) return;

    if (editingSystemId) {
        editSystem(editingSystemId, {
            title: sysTitle,
            duration: parseInt(sysDuration),
            frequency: sysFreq
        });
    } else {
        addSystem(goal.id, {
            title: sysTitle,
            duration: parseInt(sysDuration),
            frequency: sysFreq
        });
    }

    resetForm();
  };

  const startEdit = (sys) => {
      setSysTitle(sys.title);
      setSysDuration(sys.duration);
      setSysFreq(sys.frequency);
      setEditingSystemId(sys.id);
      setShowAddSystem(true);
  };

  const handleDelete = (id) => {
      if(confirm('Delete this system?')) {
          deleteSystem(id);
      }
  };

  const resetForm = () => {
    setSysTitle('');
    setSysDuration(25);
    setSysFreq('Daily');
    setEditingSystemId(null);
    setShowAddSystem(false);
  };

  if (activeSystem) {
      return (
        <PomodoroTimer 
            system={activeSystem} 
            onComplete={() => setActiveSystem(null)} 
            onCancel={() => setActiveSystem(null)} 
        />
      );
  }

  // Filter systems for this goal (assuming systems stored in goal or separately?)
  // StoreContext `addSystem` impl: `systems: [...prev.systems, newSystem]`
  // We need to fetch systems and filter by goalId from StoreContext
  // Wait, I need to subscribe to updated store data.
  // The `goal` prop passed might be stale if I don't use `useStore` to get fresh systems.
  
  // Let's get data from store


  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
        <button 
            onClick={onBack}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', marginBottom: '1rem', cursor: 'pointer' }}
        >
            ← Back to Dashboard
        </button>

        <div className="card" style={{ marginBottom: '2rem' }}>
            <h1 style={{ marginTop: 0 }}>{goal.title}</h1>
            
            <h3 style={{ color: 'var(--primary-color)' }}>Why this matters:</h3>
            <ul style={{ color: 'var(--text-muted)' }}>
                {goal.whys.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Systems</h2>
            <button className="btn" onClick={() => {
                if (showAddSystem) resetForm();
                else setShowAddSystem(true);
            }}>
                {showAddSystem ? 'Cancel' : '+ Add System'}
            </button>
        </div>

        {showAddSystem && (
            <form onSubmit={handleSaveSystem} className="card" style={{ marginBottom: '2rem', border: '1px dashed var(--primary-color)' }}>
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>System Name (What implies success?)</label>
                        <input 
                            style={{ width: '100%', padding: '0.5rem', background: 'var(--surface-color-hover)', border: '1px solid var(--border-color)', color: 'white' }}
                            value={sysTitle}
                            onChange={e => setSysTitle(e.target.value)}
                            placeholder="e.g. Read 10 pages, Run 5km"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Duration (min)</label>
                        <input 
                            type="number"
                            style={{ width: '100%', padding: '0.5rem', background: 'var(--surface-color-hover)', border: '1px solid var(--border-color)', color: 'white' }}
                            value={sysDuration}
                            onChange={e => setSysDuration(e.target.value)}
                        />
                    </div>
                    <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Frequency</label>
                            <select 
                            style={{ width: '100%', padding: '0.5rem', background: 'var(--surface-color-hover)', border: '1px solid var(--border-color)', color: 'white' }}
                            value={sysFreq}
                            onChange={e => setSysFreq(e.target.value)}
                            >
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Custom</option>
                            </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn" style={{ width: '100%' }}>
                            {editingSystemId ? 'Save Changes' : 'Add System'}
                        </button>
                    </div>
                </div>
            </form>
        )}

        <div style={{ display: 'grid', gap: '1rem' }}>
            {goalSystems.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No systems built yet. A goal without a system is just a wish.</p>
            ) : (
                goalSystems.map(sys => (
                    <div key={sys.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{sys.title}</h4>
                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                <span>⏱ {sys.duration}m</span>
                                <span>📅 {sys.frequency}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn" style={{ background: 'var(--surface-color-hover)', fontSize: '0.9rem' }} onClick={() => startEdit(sys)}>
                                ✎
                            </button>
                            <button className="btn" style={{ background: 'rgba(255, 50, 50, 0.2)', color: '#ff6b6b', fontSize: '0.9rem' }} onClick={() => handleDelete(sys.id)}>
                                🗑
                            </button>
                            <button className="btn" onClick={() => setActiveSystem(sys)}>
                                Start Session
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}
