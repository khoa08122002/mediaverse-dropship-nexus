import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { join } from 'path';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private upload: multer.Multer;

  constructor() {
    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, join(process.cwd(), 'uploads', 'cv'));
      },
      filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      }
    });

    const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
        return cb(null, false);
      }
      cb(null, true);
    };

    this.upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.upload.single('file')(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({
          message: 'File upload error',
          error: err.message
        });
      }
      next();
    });
  }
} 