import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class UploadMiddleware implements NestMiddleware {
    private upload;
    constructor();
    use(req: Request, res: Response, next: NextFunction): void;
}
