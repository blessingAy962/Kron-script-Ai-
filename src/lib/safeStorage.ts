export const safeGetItem = (key: string, defaultValueIfMissing: string = ""): string => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key) || defaultValueIfMissing;
    }
  } catch (e) {
    console.warn(`localStorage.getItem restricted for key "${key}":`, e);
  }
  return defaultValueIfMissing;
};

export const safeSetItem = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`localStorage.setItem restricted for key "${key}":`, e);
  }
};

export const safeRemoveItem = (key: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn(`localStorage.removeItem restricted for key "${key}":`, e);
  }
};
