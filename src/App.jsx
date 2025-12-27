import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import GoalForm from './components/GoalForm'
import GoalDetails from './components/GoalDetails'

function App() {
  const [view, setView] = useState('dashboard'); // dashboard, create-goal, goal-details
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setView('goal-details');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Goal Quest
        </h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
            <button 
                className="btn" 
                style={{ background: view === 'dashboard' ? 'var(--surface-color)' : 'transparent' }}
                onClick={() => setView('dashboard')}
            >
                Dashboard
            </button>
            <button 
                className="btn"
                onClick={() => setView('create-goal')}
            >
                + New Goal
            </button>
        </nav>
      </header>
      
      <main>
        {view === 'dashboard' && <Dashboard onGoalSelect={handleGoalSelect} />}
        {view === 'create-goal' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
                <button 
                    onClick={() => setView('dashboard')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', marginBottom: '1rem', cursor: 'pointer' }}
                >
                    ← Back to Dashboard
                </button>
                <GoalForm onSuccess={() => setView('dashboard')} />
            </div>
        )}
        {view === 'goal-details' && selectedGoal && (
            <GoalDetails goal={selectedGoal} onBack={() => setView('dashboard')} />
        )}
      </main>
    </div>
  )
}

export default App
