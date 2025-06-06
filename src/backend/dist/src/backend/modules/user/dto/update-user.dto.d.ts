import { Role, Status } from '../../prisma';
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    fullName?: string;
    role?: Role;
    status?: Status;
}
