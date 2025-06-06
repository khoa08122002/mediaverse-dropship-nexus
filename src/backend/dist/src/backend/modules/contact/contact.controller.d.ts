import { ContactService } from './contact.service';
import { Contact } from '../../types/contact.types';
export declare class ContactController {
    private readonly contactService;
    private readonly logger;
    constructor(contactService: ContactService);
    findAll(): Promise<Contact[]>;
    findOne(id: string): Promise<Contact>;
    create(data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact>;
    update(id: string, data: Partial<Contact>): Promise<Contact>;
    remove(id: string): Promise<Contact>;
    reply(id: string, message: string): Promise<Contact>;
}
