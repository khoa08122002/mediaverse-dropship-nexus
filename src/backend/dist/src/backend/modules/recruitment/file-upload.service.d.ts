export declare class FileUploadService {
    private readonly uploadDir;
    constructor();
    private ensureUploadDir;
    saveCV(file: Express.Multer.File): Promise<string>;
    deleteCV(filename: string): Promise<void>;
    getFilePath(fileName: string): string;
    getCVPath(filename: string): Promise<string>;
}
