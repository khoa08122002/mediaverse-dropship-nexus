import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    check(): Promise<{
        checks: {
            database: string;
        };
        status: string;
        timestamp: string;
        service: string;
        env: string;
    }>;
}
