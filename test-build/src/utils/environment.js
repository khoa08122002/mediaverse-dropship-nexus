"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEnvironmentInfo = exports.getAPIBaseURL = exports.getEnvironment = void 0;
const getEnvironment = () => {
    const isProductionByHostname = typeof window !== 'undefined' && (window.location.hostname === 'phg2.vercel.app' ||
        window.location.hostname.includes('vercel.app'));
    const isProductionByNodeEnv = process.env.NODE_ENV === 'production';
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
exports.getEnvironment = getEnvironment;
const getAPIBaseURL = () => {
    const env = (0, exports.getEnvironment)();
    if (env.isVercelDomain) {
        return 'https://phg2.vercel.app/api/comprehensive';
    }
    return env.isProduction
        ? 'https://phg2.vercel.app/api/comprehensive'
        : 'http://localhost:3002/api';
};
exports.getAPIBaseURL = getAPIBaseURL;
const logEnvironmentInfo = (source) => {
    const env = (0, exports.getEnvironment)();
    const baseURL = (0, exports.getAPIBaseURL)();
    console.log(`${source} Environment Detection:`, {
        ...env,
        baseURL,
        source
    });
};
exports.logEnvironmentInfo = logEnvironmentInfo;
//# sourceMappingURL=environment.js.map