import { UserService } from '../modules/user/user.service';
import { CreateUserDto, UpdateUserDto } from '../modules/user/dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<any>;
    getProfile(req: any): Promise<any>;
    changePassword(req: any, changePasswordDto: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    findOne(id: string): Promise<any>;
    create(createUserDto: CreateUserDto): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: string): Promise<any>;
    adminChangePassword(id: string, newPassword: string): Promise<any>;
    search(query: string): Promise<any>;
}
