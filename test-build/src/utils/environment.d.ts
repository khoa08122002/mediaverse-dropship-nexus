export declare const getEnvironment: () => {
    isProduction: boolean;
    hostname: string;
    nodeEnv: string;
    isVercelDomain: boolean;
};
export declare const getAPIBaseURL: () => "http://localhost:3002/api" | "https://phg2.vercel.app/api/comprehensive";
export declare const logEnvironmentInfo: (source: string) => void;
