import { useState, useEffect } from 'react';

const USER_PREFERENCES_KEY = 'user-preferences';

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

// LocalStorage hooks specific for user preferences
function getUserPreferencesStorageValue(key: string, defaultValue: string | number | boolean) {
  const storedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
  if (storedPreferences) {
    const parsed = JSON.parse(storedPreferences);
    if (parsed.expiration && Date.now() > parsed.expiration) {
      localStorage.removeItem(USER_PREFERENCES_KEY);
      return defaultValue;
    }
    return parsed[key] ?? defaultValue;
  }
  return defaultValue;
}

export const useUserPreferencesLocalStorage = (
  key: string,
  defaultValue: string | number | boolean,
  expirationTime?: number
) => {
  const [value, setValue] = useState(() => {
    return getUserPreferencesStorageValue(key, defaultValue);
  });

  useEffect(() => {
    const storedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
    const preferences = storedPreferences ? JSON.parse(storedPreferences) : {};
    if (value === null) {
      delete preferences[key];
    } else {
      preferences[key] = value;
    }

    preferences.expiration = expirationTime ? new Date().getTime() + expirationTime : null;

    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  }, [key, value, expirationTime]);

  return [value, setValue];
};
