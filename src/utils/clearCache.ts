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