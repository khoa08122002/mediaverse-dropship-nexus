// Centralized environment detection utility

export const getEnvironment = () => {
  // Check multiple indicators for production
  const isProductionByHostname = typeof window !== 'undefined' && (
    window.location.hostname === 'phg2.vercel.app' ||
    window.location.hostname.includes('vercel.app')
  );
  
  const isProductionByNodeEnv = process.env.NODE_ENV === 'production';
  
  // If we're on Vercel domain, it's definitely production
  const isVercelDomain = typeof window !== 'undefined' && 
    window.location.hostname.includes('vercel.app');
  
  const isProduction = isProductionByHostname || isProductionByNodeEnv || isVercelDomain;
  
  return {
    isProduction,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
    nodeEnv: process.env.NODE_ENV,
    isVercelDomain
  };
};

export const getAPIBaseURL = () => {
  const env = getEnvironment();
  
  // USE PRODUCTION API ENDPOINT  
  // Backend API is available at /api/* routes via nginx proxy
  if (env.isProduction || env.isVercelDomain) {
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