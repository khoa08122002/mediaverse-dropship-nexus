import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { join } from 'path';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
  private upload: any;

  constructor() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, join(process.cwd(), 'uploads', 'cv'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      }
    });

    const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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
    }).single('file');
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.upload(req, res, (err: any) => {
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