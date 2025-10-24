// Local Storage Utilities
const STORAGE_KEYS = {
  TODOS: 'retrodash_todos',
  TIMER: 'retrodash_timer',
  WEATHER: 'retrodash_weather'
};

export function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return null;
  }
}

export { STORAGE_KEYS };
