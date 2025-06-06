import { Role, Status } from '../../prisma';
export declare class CreateUserDto {
    email: string;
    password: string;
    fullName: string;
    role?: Role;
    status?: Status;
}
