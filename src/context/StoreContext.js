import { createContext, useContext } from 'react';

export const StoreContext = createContext();

export const STORAGE_KEY = 'goal_tracker_data';

export const INITIAL_STATE = {
  user: {
    name: 'Player 1',
    points: 0,
    level: 1,
    exp: 0, 
    nextLevelExp: 100,
  },
  goals: [], // { id, title, whys: [], systems: [] }
  systems: [], // { id, title, duration: 25 }
  logs: [], // { id, systemId, timestamp, pointsEarned }
};

export function useStore() {
  return useContext(StoreContext);
}
