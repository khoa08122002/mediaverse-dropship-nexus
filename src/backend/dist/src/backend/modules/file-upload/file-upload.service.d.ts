export declare class FileUploadService {
    private readonly uploadDir;
    constructor();
    private ensureUploadDir;
    saveCV(file: Express.Multer.File): Promise<string>;
    deleteCV(filename: string): Promise<void>;
    getCVPath(filename: string): string;
    fileExists(filename: string): Promise<boolean>;
    deleteFile(filepath: string): Promise<void>;
}
