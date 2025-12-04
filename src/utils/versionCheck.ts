const CURRENT_VERSION = '1.0.0';
const VERSION_KEY = 'app_version';
const VERSION_CHECK_INTERVAL = 5 * 60 * 1000;

export const checkForUpdates = async (): Promise<boolean> => {
  try {
    const response = await fetch('/version.json?' + Date.now());
    
    if (!response.ok) {
      return false;
    }
    
    const text = await response.text();
    
    if (!text || text.includes('Preview not found')) {
      return false;
    }
    
    const data = JSON.parse(text);
    const serverVersion = data.version;
    const storedVersion = localStorage.getItem(VERSION_KEY);

    if (storedVersion && storedVersion !== serverVersion) {
      return true;
    }

    localStorage.setItem(VERSION_KEY, serverVersion);
    return false;
  } catch (error) {
    return false;
  }
};

export const getCurrentVersion = (): string => {
  return localStorage.getItem(VERSION_KEY) || CURRENT_VERSION;
};

export const startVersionChecking = (onUpdateAvailable: () => void) => {
  checkForUpdates().then(hasUpdate => {
    if (hasUpdate) {
      onUpdateAvailable();
    }
  });

  setInterval(async () => {
    const hasUpdate = await checkForUpdates();
    if (hasUpdate) {
      onUpdateAvailable();
    }
  }, VERSION_CHECK_INTERVAL);
};

export const reloadApp = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  }
  
  window.location.reload();
};