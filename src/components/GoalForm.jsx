import { useState } from 'react';
import { useStore } from '../context/StoreContext';

export default function GoalForm({ onSuccess }) {
  const { addGoal } = useStore();
  const [title, setTitle] = useState('');
  const [whys, setWhys] = useState(['']);

  const handleWhyChange = (index, value) => {
    const newWhys = [...whys];
    newWhys[index] = value;
    setWhys(newWhys);
  };

  const addWhyField = () => {
    setWhys([...whys, '']);
  };

  const removeWhyField = (index) => {
    const newWhys = whys.filter((_, i) => i !== index);
    setWhys(newWhys);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Filter out empty whys
    const cleanWhys = whys.filter(w => w.trim());

    addGoal({
      title,
      whys: cleanWhys,
      createdAt: Date.now()
    });

    setTitle('');
    setWhys(['']);
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>Create New Goal</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          What is your goal?
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Master React, Learn Guitar"
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-color)',
            color: 'white',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          Why is this important? (The "Whys")
        </label>
        {whys.map((why, index) => (
          <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={why}
              onChange={(e) => handleWhyChange(index, e.target.value)}
              placeholder={`Reason #${index + 1}`}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-color)',
                color: 'white'
              }}
            />
            {whys.length > 1 && (
              <button
                type="button"
                onClick={() => removeWhyField(index)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-md)',
                  padding: '0 0.75rem'
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addWhyField}
          style={{
            background: 'transparent',
            border: '1px dashed var(--border-color)',
            color: 'var(--primary-color)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          + Add Another Reason
        </button>
      </div>

      <button type="submit" className="btn" style={{ width: '100%' }}>
        Create Goal
      </button>
    </form>
  );
}
