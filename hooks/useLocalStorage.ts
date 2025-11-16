import { useState, useEffect } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      alert(`Error reading data for "${key}". Using default values. Your saved data might be corrupted.`);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      alert(`Error saving data. Your changes might not be saved. This could be due to browser restrictions (e.g., private mode) or lack of storage space.`);
    }
  };
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
            try {
                const item = window.localStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item) : initialValue);
            } catch (error) {
                console.error('Error handling storage change:', error);
                // Avoid alerting on storage events to prevent potential feedback loops or annoying popups.
            }
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);


  return [storedValue, setValue];
}

export default useLocalStorage;