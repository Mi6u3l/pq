export const localStorageUtil = {
    setItem: (key: string, value: string): boolean => {
      try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
        return true;
      } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
        return false;
      }
    },
  
    getItem: (key: string): string | null => {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error(`Error reading from localStorage key "${key}":`, error);
        return null;
      }
    },
  
    removeItem: (key: string): boolean => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error(`Error removing from localStorage key "${key}":`, error);
        return false;
      }
    },
  
    isAvailable: (): boolean => {
      try {
        const testKey = '__pokebloq__test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
      } catch (error) {
        console.warn('localStorage is not available:', error);
        return false;
      }
    },
  };
  