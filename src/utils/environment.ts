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
  
  // Use current domain with backend endpoint for real database
  if (env.isVercelDomain) {
    return `${window.location.origin}/api/backend`;
  }
  
  return env.isProduction 
    ? `${window.location.origin}/api/backend`
    : 'http://localhost:3000/api';
};

export const logEnvironmentInfo = (source: string) => {
  const env = getEnvironment();
  const baseURL = getAPIBaseURL();
  
  console.log(`${source} Environment Detection:`, {
    ...env,
    baseURL,
    source
  });
}; 