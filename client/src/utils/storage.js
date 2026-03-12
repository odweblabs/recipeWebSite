// client/src/utils/storage.js
/**
 * Safely accesses localStorage.
 * If localStorage is unavailable (e.g. SecurityError due to third-party cookie blocking),
 * it returns null or fails gracefully without crashing the app.
 */
export const safeGetStorage = (key, fallback = null) => {
    try {
        const item = window.localStorage.getItem(key);
        return item !== null ? item : fallback;
    } catch (error) {
        console.warn('localStorage is not accessible:', error);
        return fallback;
    }
};

export const safeSetStorage = (key, value) => {
    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        console.warn('localStorage is not accessible:', error);
    }
};

export const safeRemoveStorage = (key) => {
    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.warn('localStorage is not accessible:', error);
    }
};

export const safeClearStorage = () => {
    try {
        window.localStorage.clear();
    } catch (error) {
        console.warn('localStorage is not accessible:', error);
    }
};

export const safeGetSessionStorage = (key, fallback = null) => {
    try {
        const item = window.sessionStorage.getItem(key);
        return item !== null ? item : fallback;
    } catch (error) {
        console.warn('sessionStorage is not accessible:', error);
        return fallback;
    }
};

export const safeSetSessionStorage = (key, value) => {
    try {
        window.sessionStorage.setItem(key, value);
    } catch (error) {
        console.warn('sessionStorage is not accessible:', error);
    }
};

export const safeGetToken = () => {
    return safeGetStorage('token') || safeGetSessionStorage('token');
};

export const safeClearAuth = () => {
    safeRemoveStorage('token');
    try { window.sessionStorage.removeItem('token'); } catch(e) {}
};
