export declare class FileUploadService {
    private readonly uploadDir;
    constructor();
    private ensureUploadDir;
    saveCV(file: Express.Multer.File): Promise<string>;
    deleteCV(filename: string): Promise<void>;
    getCVPath(filename: string): Promise<string>;
    deleteFile(filepath: string): Promise<void>;
}
