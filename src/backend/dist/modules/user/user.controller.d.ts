import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<any>;
    getProfile(req: any): Promise<any>;
    getUserById(id: string): Promise<any>;
    updateProfile(req: any, updateUserDto: UpdateUserDto): Promise<any>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    changePassword(req: any, changePasswordDto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
}
