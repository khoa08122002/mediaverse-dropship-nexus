import { Injectable, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'cv');

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
      throw new BadRequestException('Could not create upload directory');
    }
  }

  async saveCV(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only PDF, DOC, and DOCX files are allowed');
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size must be less than 5MB');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.originalname.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
    const filepath = join(this.uploadDir, filename);

    try {
      // Save file
      await fs.writeFile(filepath, file.buffer);
      return filename;
    } catch (error) {
      console.error('Error saving file:', error);
      throw new BadRequestException('Could not save file');
    }
  }

  async deleteCV(filename: string): Promise<void> {
    if (!filename) return;
    
    const filepath = join(this.uploadDir, filename);
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error if file doesn't exist
    }
  }

  getFilePath(fileName: string): string {
    if (!fileName) return null;
    return join(this.uploadDir, fileName);
  }

  async getCVPath(filename: string): Promise<string> {
    if (!filename) return null;
    
    const filepath = join(this.uploadDir, filename);
    try {
      // Check if file exists
      await fs.access(filepath);
      return filepath;
    } catch (error) {
      console.error('Error accessing file:', error);
      return null;
    }
  }
} 