import { PrismaService } from '../prisma/prisma.service';
import { Contact } from '../../types/contact.types';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    private mapPrismaContactToContact;
    findAll(): Promise<Contact[]>;
    findOne(id: string): Promise<Contact>;
    create(data: CreateContactDto): Promise<Contact>;
    update(id: string, data: UpdateContactDto): Promise<Contact>;
    remove(id: string): Promise<Contact>;
    reply(id: string, message: string): Promise<Contact>;
}
