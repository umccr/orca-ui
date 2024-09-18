import { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getStorageValue(key: string, defaultValue: any) {
  const saved = localStorage.getItem(key);
  // getting stored value
  if (saved) {
    const parsed = JSON.parse(saved);

    // Check if expiration time is present and if it has expired.  If expired, remove the item from localStorage
    if (parsed.expiration && Date.now() > parsed.expiration) {
      localStorage.removeItem(key);
      return defaultValue;
    }

    // If not expired, return the stored value
    return parsed.value;
  }

  return defaultValue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLocalStorage = (key: string, defaultValue: any, expirationTime?: number) => {
  // Add type annotation for key
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    if (value === null) {
      // remove item from localStorage if value is null
      localStorage.removeItem(key);
      return;
    }

    const itemToStore = {
      value,
      expiry: expirationTime ? new Date().getTime() + expirationTime : null,
    };

    // storing input name
    localStorage.setItem(key, JSON.stringify(itemToStore));
  }, [expirationTime, key, value]);

  return [value, setValue];
};
