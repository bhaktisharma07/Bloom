import { DEFAULT_SEEDS } from './seeds';

export const STORAGE_KEY = 'bloom_completed_seeds';
export const HABITS_KEY = 'bloom_habits';

export const getStoredHabits = () => {
  try {
    const saved = localStorage.getItem(HABITS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error reading habits:", e);
  }
  // Initialize with default habits
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(DEFAULT_SEEDS));
  } catch (e) {
    console.error("Error writing default habits:", e);
  }
  return DEFAULT_SEEDS;
};

export const saveStoredHabits = (habits) => {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error("Error saving habits:", e);
  }
};
