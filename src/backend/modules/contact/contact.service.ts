import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Contact } from '../../types/contact.types';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Prisma, ContactStatus, ContactPriority } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  private mapPrismaContactToContact(prismaContact: any): Contact {
    return {
      ...prismaContact,
      createdAt: new Date(prismaContact.createdAt),
      updatedAt: new Date(prismaContact.updatedAt)
    };
  }

  async findAll(): Promise<Contact[]> {
    const contacts = await this.prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return contacts.map(this.mapPrismaContactToContact);
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.prisma.contact.findUnique({
      where: { id }
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return this.mapPrismaContactToContact(contact);
  }

  async create(data: CreateContactDto): Promise<Contact> {
    const contact = await this.prisma.contact.create({
      data: {
        ...data,
        status: ContactStatus.NEW,
        priority: ContactPriority.MEDIUM
      }
    });
    return this.mapPrismaContactToContact(contact);
  }

  async update(id: string, data: UpdateContactDto): Promise<Contact> {
    await this.findOne(id);

    const updateData: Prisma.ContactUpdateInput = {};
    
    if (data.status !== undefined) {
      const validStatuses = Object.values(ContactStatus);
      if (!validStatuses.includes(data.status as ContactStatus)) {
        throw new Error(`Invalid status value: ${data.status}. Valid values are: ${validStatuses.join(', ')}`);
      }
      updateData.status = data.status as ContactStatus;
    }
    
    if (data.priority !== undefined) {
      const validPriorities = Object.values(ContactPriority);
      if (!validPriorities.includes(data.priority as ContactPriority)) {
        throw new Error(`Invalid priority value: ${data.priority}. Valid values are: ${validPriorities.join(', ')}`);
      }
      updateData.priority = data.priority as ContactPriority;
    }

    // Add other fields if they exist
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.company) updateData.company = data.company;
    if (data.service) updateData.service = data.service;
    if (data.budget) updateData.budget = data.budget;
    if (data.subject) updateData.subject = data.subject;
    if (data.message) updateData.message = data.message;

    const contact = await this.prisma.contact.update({
      where: { id },
      data: updateData,
    });

    return this.mapPrismaContactToContact(contact);
  }

  async remove(id: string): Promise<Contact> {
    await this.findOne(id);
    const contact = await this.prisma.contact.delete({
      where: { id }
    });
    return this.mapPrismaContactToContact(contact);
  }

  async reply(id: string, message: string): Promise<Contact> {
    const contact = await this.findOne(id);
    return this.update(id, { status: ContactStatus.REPLIED });
  }
} 