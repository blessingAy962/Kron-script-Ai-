import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import posthog from 'posthog-js';

// Initialize PostHog safely with fail-safes for sandboxed iframes
try {
  posthog.init('phc_zgsiEkQq8SCJe3CHy8wxA7Vc4irEtMzvhDNKnKZnoEe8', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
  });
} catch (e) {
  console.warn("PostHog analytics failed to initialize or was blocked by sandbox constraints:", e);
}

// Intercept browser environment localStorage/sessionStorage SecurityErrors inside sandbox/iframes
try {
  const testKey = "__storage_test__";
  window.localStorage.setItem(testKey, testKey);
  window.localStorage.removeItem(testKey);
} catch (e) {
  console.warn("localStorage is blocked or restricted. Activating virtual in-memory store fallback:", e);
  const memoryStorage: Record<string, string> = {
    "auratech_touch_sound": "true",
    "auratech_glass_bubbles": "true",
    "auratech_cinematic_float": "false",
    "auratech_float_intensity": "cinematic"
  };
  const mockStorage: Storage = {
    length: Object.keys(memoryStorage).length,
    clear() {
      for (const k in memoryStorage) {
        delete memoryStorage[k];
      }
      this.length = 0;
    },
    getItem(key: string) {
      return key in memoryStorage ? memoryStorage[key] : null;
    },
    key(index: number) {
      const keys = Object.keys(memoryStorage);
      return keys[index] || null;
    },
    removeItem(key: string) {
      delete memoryStorage[key];
      this.length = Object.keys(memoryStorage).length;
    },
    setItem(key: string, value: string) {
      memoryStorage[key] = String(value);
      this.length = Object.keys(memoryStorage).length;
    }
  };
  
  try {
    Object.defineProperty(window, "localStorage", {
      value: mockStorage,
      writable: true,
      configurable: true
    });
  } catch (err) {
    // If window.localStorage is strictly read-only, patch safeStorage functions
    console.error("Failed to redefine window.localStorage. Fail-safe system active.", err);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
