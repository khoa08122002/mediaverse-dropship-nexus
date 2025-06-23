import { PrismaService } from '../../prisma/prisma.service';
export declare class HealthService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
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
