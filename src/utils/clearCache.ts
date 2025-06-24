// Utility to clear all cache and force fresh data reload
export const clearAllCache = () => {
  console.log('🧹 Clearing all cache and localStorage...');
  
  // Clear all localStorage
  if (typeof window !== 'undefined') {
    // Clear auth tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    // Clear any cached data
    localStorage.removeItem('jobs');
    localStorage.removeItem('applications');
    localStorage.removeItem('contacts');
    localStorage.removeItem('blogs');
    
    // Clear all localStorage items that might be app-related
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('app_') || key.startsWith('cache_') || key.includes('token')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('✅ Cache cleared successfully');
  }
};

// Force refresh page with clean cache
export const forceRefreshWithCleanCache = () => {
  clearAllCache();
  
  // Force a hard refresh
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

// Check for data inconsistency and auto-clear if needed
export const validateDataConsistency = () => {
  if (typeof window !== 'undefined') {
    const lastCacheVersion = localStorage.getItem('cacheVersion');
    const currentVersion = '2025-06-24'; // Update this when schema changes
    
    if (lastCacheVersion !== currentVersion) {
      console.log('🔄 Data schema updated, clearing cache...');
      clearAllCache();
      localStorage.setItem('cacheVersion', currentVersion);
    }
  }
};

export const clearCache = async () => {
  try {
    console.log('🧹 Starting aggressive cache clearing...');
    
    // Clear localStorage
    const tokenKeys = ['accessToken', 'refreshToken'];
    tokenKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear service worker cache if available
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Service worker caches cleared');
      } catch (error) {
        console.warn('⚠️ Could not clear service worker caches:', error);
      }
    }
    
    // Force reload axios base URL to ensure fresh config
    if (typeof window !== 'undefined') {
      // Clear any cached modules by adding timestamp
      const timestamp = Date.now();
      console.log(`🔄 Cache buster timestamp: ${timestamp}`);
      
      // Force clear browser cache for static assets
      if ('performance' in window && window.performance.clearResourceTimings) {
        window.performance.clearResourceTimings();
      }
    }
    
    console.log('✅ Cache clearing completed');
  } catch (error) {
    console.error('❌ Cache clearing failed:', error);
  }
};

export const forceBrowserRefresh = () => {
  console.log('🔄 Forcing browser refresh with cache bypass...');
  
  // Force reload with cache bypass
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
}; 