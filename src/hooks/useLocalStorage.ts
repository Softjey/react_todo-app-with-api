import { useCallback, useState } from 'react';

export function useLocalStorage<T extends string>(key: string) {
  const [value, setValue] = useState<T | null>(() => {
    const item = localStorage.getItem(key);

    return item as T | null;
  });

  const setLocalStorageValue = useCallback((newValue: T | null) => {
    if (newValue === null) {
      localStorage.removeItem(key);
      setValue(null);

      return;
    }

    localStorage.setItem(key, newValue);
    setValue(newValue);
  }, [key]);

  return [value, setLocalStorageValue] as const;
}
