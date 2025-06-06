import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads', 'cv');

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
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

    try {
      // File is already saved by Multer, just return the filename
      return file.filename;
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

  async deleteFile(filepath: string): Promise<void> {
    if (!filepath) return;
    
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Don't throw error if file doesn't exist
    }
  }
} 