import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards, Query, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../prisma';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Contact } from '../../types/contact.types';
import { Public } from '../auth/decorators/public.decorator';

interface ErrorResponse {
  message: string;
  status: number;
}

@ApiTags('contacts')
@Controller('contacts')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiBearerAuth()
  async findAll(): Promise<Contact[]> {
    try {
      this.logger.debug('Finding all contacts');
      return await this.contactService.findAll();
    } catch (error) {
      this.logger.error('Error finding all contacts:', error);
      const err = error as ErrorResponse;
      throw new HttpException(
        err.message || 'Internal server error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a contact by id' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<Contact> {
    try {
      return await this.contactService.findOne(id);
    } catch (error) {
      this.logger.error(`Error finding contact with id ${id}:`, error);
      const err = error as ErrorResponse;
      throw new HttpException(
        err.message || 'Internal server error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  async create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    try {
      return await this.contactService.create(createContactDto);
    } catch (error) {
      this.logger.error('Error creating contact:', error);
      const err = error as ErrorResponse;
      throw new HttpException(
        err.message || 'Internal server error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a contact' })
  @ApiBearerAuth()
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto): Promise<Contact> {
    try {
      return await this.contactService.update(id, updateContactDto);
    } catch (error) {
      this.logger.error(`Error updating contact with id ${id}:`, error);
      const err = error as ErrorResponse;
      throw new HttpException(
        err.message || 'Internal server error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiBearerAuth()
  async remove(@Param('id') id: string): Promise<Contact> {
    try {
      return await this.contactService.remove(id);
    } catch (error) {
      this.logger.error(`Error deleting contact with id ${id}:`, error);
      const err = error as ErrorResponse;
      throw new HttpException(
        err.message || 'Internal server error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.HR)
  @ApiOperation({ summary: 'Reply to a contact' })
  @ApiBearerAuth()
  async reply(
    @Param('id') id: string,
    @Body('message') message: string
  ) {
    try {
      return await this.contactService.reply(id, message);
    } catch (error) {
      this.logger.error(`Error replying to contact with id ${id}:`, error);
      const err = error as ErrorResponse;
      throw new HttpException(
        err.message || 'Internal server error',
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 