import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../context/StoreContext';

export default function PomodoroTimer({ system, onComplete, onCancel }) {
  const { logSession } = useStore();
  const [timeLeft, setTimeLeft] = useState(system.duration * 60);
  const [isActive, setIsActive] = useState(false);
  
  const handleComplete = useCallback(() => {
    setIsActive(false);
    logSession(system.id, system.duration); 
    
    // Play sound
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play().catch(e => console.log('Audio play failed', e));
    alert("System Completed! +10 XP");
    if (onComplete) onComplete();
  }, [system.id, system.duration, logSession, onComplete]);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        if (timeLeft <= 1) { // Check captured timeLeft (since effect re-runs on change)
             clearInterval(interval);
             setTimeLeft(0);
             handleComplete();
        } else {
             setTimeLeft(timeLeft - 1);
        }
      }, 1000);
    } 

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((system.duration * 60 - timeLeft) / (system.duration * 60)) * 100;

  return (
    <div className="card" style={{ textAlign: 'center', maxWidth: '400px', margin: '2rem auto', border: '2px solid var(--primary-color)' }}>
      <h3 style={{ marginTop: 0 }}>Executing System</h3>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{system.title}</div>
      
      <div style={{ 
        fontSize: '4rem', 
        fontWeight: 'bold', 
        fontVariantNumeric: 'tabular-nums',
        margin: '1rem 0',
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)'
      }}>
        {formatTime(timeLeft)}
      </div>

      {/* Visual Progress Bar */}
      <div style={{ height: '8px', background: 'var(--surface-color-hover)', borderRadius: '4px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ 
            height: '100%', 
            width: `${progress}%`, 
            background: 'var(--primary-color)',
            transition: 'width 1s linear'
        }} />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
            className="btn" 
            onClick={toggleTimer}
            style={{ 
                background: isActive ? 'var(--surface-color-hover)' : 'var(--primary-color)',
                minWidth: '100px'
            }}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
            className="btn" 
            onClick={onCancel}
            style={{ background: 'transparent', border: '1px solid var(--border-color)' }}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
