import { Role, Status } from '../../../prisma/types';
export declare class CreateUserDto {
    email: string;
    password: string;
    fullName: string;
    role?: Role;
    status?: Status;
}
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    fullName?: string;
    role?: Role;
    status?: Status;
}
