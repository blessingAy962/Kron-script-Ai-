let isLocalStorageSupported = false;
const memoryStorage: Record<string, string> = {};

try {
  if (typeof window !== "undefined") {
    // Accessing window.localStorage will throw an error immediately if blocked
    const storage = window.localStorage;
    if (storage) {
      const testKey = "__storage_test__";
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      isLocalStorageSupported = true;
    }
  }
} catch (e) {
  // Safe block
}

export const safeGetItem = (key: string, defaultValueIfMissing: string = ""): string => {
  if (isLocalStorageSupported) {
    try {
      return window.localStorage.getItem(key) || defaultValueIfMissing;
    } catch (e) {
      // Fallback
    }
  }
  return key in memoryStorage ? memoryStorage[key] : defaultValueIfMissing;
};

export const safeSetItem = (key: string, value: string): void => {
  if (isLocalStorageSupported) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch (e) {
      // Fallback
    }
  }
  memoryStorage[key] = String(value);
};

export const safeRemoveItem = (key: string): void => {
  if (isLocalStorageSupported) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch (e) {
      // Fallback
    }
  }
  delete memoryStorage[key];
};
