// Centralized environment detection utility

export const getEnvironment = () => {
  // Check multiple indicators for production
  const isProductionByHostname = typeof window !== 'undefined' && (
    window.location.hostname === 'phgcorporation.com' ||
    window.location.hostname === 'www.phgcorporation.com'
  );
  
  const isProductionByNodeEnv = process.env.NODE_ENV === 'production';
  
  // If we're on production domain, it's definitely production
  const isProductionDomain = typeof window !== 'undefined' && 
    (window.location.hostname === 'phgcorporation.com' || 
     window.location.hostname === 'www.phgcorporation.com');
  
  const isProduction = isProductionByHostname || isProductionByNodeEnv || isProductionDomain;
  
  return {
    isProduction,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    nodeEnv: process.env.NODE_ENV,
    isProductionDomain
  };
};

export const getAPIBaseURL = () => {
  const env = getEnvironment();
  
  // USE PRODUCTION API ENDPOINT  
  // Backend API is available at /api/* routes via nginx proxy
  if (env.isProduction || env.isProductionDomain) {
    return `${window.location.origin}/api`;
  }
  
  return 'http://localhost:3000/api';
};

export const logEnvironmentInfo = (source: string) => {
  const env = getEnvironment();
  const baseURL = getAPIBaseURL();
  
  console.log(`${source} Environment Detection:`, {
    ...env,
    baseURL,
    source,
    apiType: 'database-only'
  });
}; 