import { useState, useEffect } from 'react';
import { StoreContext, INITIAL_STATE, STORAGE_KEY } from './StoreContext';

export function StoreProvider({ children }) {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addPoints = (amount) => {
    setData(prev => {
      const newPoints = prev.user.points + amount;
      const newExp = prev.user.exp + amount;
      let newLevel = prev.user.level;
      let nextLevelExp = prev.user.nextLevelExp;

      // Simple level up logic
      if (newExp >= nextLevelExp) {
        newLevel += 1;
        nextLevelExp = Math.floor(nextLevelExp * 1.5);
      }

      return {
        ...prev,
        user: {
          ...prev.user,
          points: newPoints,
          level: newLevel,
          exp: newExp,
          nextLevelExp
        }
      };
    });
  };

  const addGoal = (goal) => {
    setData(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: crypto.randomUUID(), systems: [] }]
    }));
  };

  const addSystem = (goalId, system) => {
    const newSystem = { ...system, id: crypto.randomUUID(), goalId };
    
    setData(prev => ({
      ...prev,
      systems: [...prev.systems, newSystem]
    }));
  };

  const editSystem = (id, updates) => {
    setData(prev => ({
      ...prev,
      systems: prev.systems.map(sys => 
        sys.id === id ? { ...sys, ...updates } : sys
      )
    }));
  };

  const deleteSystem = (id) => {
    setData(prev => ({
      ...prev,
      systems: prev.systems.filter(sys => sys.id !== id)
    }));
  };
  
  const logSession = (systemId, duration) => {
      const points = 10; // Fixed points for now or based on duration
      addPoints(points);
      setData(prev => ({
          ...prev,
          logs: [...prev.logs, { 
              id: crypto.randomUUID(), 
              systemId, 
              timestamp: Date.now(), 
              duration,
              pointsEarned: points 
          }]
      }));
  };
  
  // Data Management
  const exportData = () => {
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `goal_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };
  
  const clearData = () => {
      if(confirm("Are you sure you want to wipe all progress?")) {
          setData(INITIAL_STATE);
      }
  };

  return (
    <StoreContext.Provider value={{ 
        data, 
        addGoal, 
        addSystem,
        editSystem, 
        deleteSystem, 
        logSession,
        exportData,
        clearData
    }}>
      {children}
    </StoreContext.Provider>
  );
}
