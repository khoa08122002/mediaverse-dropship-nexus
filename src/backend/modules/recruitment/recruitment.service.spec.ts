import { Test, TestingModule } from '@nestjs/testing';
import { RecruitmentService } from './recruitment.service';
import { PrismaService } from '../prisma/prisma.service';
import { JobTypeValues, JobStatusValues } from './dto/job.dto';
import { ApplicationStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dtos/create-job.dto';
import { CreateApplicationDto } from './dtos/create-application.dto';

describe('RecruitmentService', () => {
  let service: RecruitmentService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    job: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    application: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruitmentService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RecruitmentService>(RecruitmentService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createJob', () => {
    it('should create a new job', async () => {
      const createJobDto = {
        title: 'Software Engineer',
        department: 'Engineering',
        location: 'Ho Chi Minh City',
        type: JobTypeValues.fulltime,
        description: 'Job description',
        requirements: 'Job requirements',
        benefits: 'Job benefits',
        salary: '1000-2000 USD',
        status: JobStatusValues.active
      };

      const mockJob = {
        id: 1,
        ...createJobDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.job.create.mockResolvedValue(mockJob);

      const result = await service.createJob(createJobDto);
      expect(result).toEqual(mockJob);
      expect(mockPrismaService.job.create).toHaveBeenCalledWith({
        data: createJobDto,
      });
    });
  });

  describe('updateJob', () => {
    it('should update an existing job', async () => {
      const jobId = 1;
      const updateJobDto = {
        title: 'Updated Software Engineer',
        department: 'Engineering',
        location: 'Ho Chi Minh City',
        type: JobTypeValues.fulltime,
        description: 'Updated job description',
        requirements: 'Updated job requirements',
        benefits: 'Updated job benefits',
        salary: '2000-3000 USD',
        status: JobStatusValues.active
      };

      const mockUpdatedJob = {
        id: jobId,
        ...updateJobDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.job.update.mockResolvedValue(mockUpdatedJob);

      const result = await service.updateJob(jobId, updateJobDto);
      expect(result).toEqual(mockUpdatedJob);
      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: jobId },
        data: updateJobDto,
      });
    });
  });

  describe('getAllJobs', () => {
    it('should return all jobs', async () => {
      const mockJobs = [
        {
          id: 1,
          title: 'Frontend Developer',
          department: 'Engineering',
          location: 'Ho Chi Minh City',
          type: JobTypeValues.fulltime,
          description: 'Description',
          requirements: 'Requirements',
          benefits: 'Benefits',
          salary: 'Salary',
          status: JobStatusValues.active,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.job.findMany.mockResolvedValue(mockJobs);

      const result = await service.getAllJobs();
      expect(result).toEqual(mockJobs);
      expect(mockPrismaService.job.findMany).toHaveBeenCalled();
    });
  });

  describe('getJobById', () => {
    it('should return a job by id', async () => {
      const mockJob = {
        id: 1,
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'Ho Chi Minh City',
        type: JobTypeValues.fulltime,
        description: 'Description',
        requirements: 'Requirements',
        benefits: 'Benefits',
        salary: 'Salary',
        status: JobStatusValues.active,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);

      const result = await service.getJobById(1);
      expect(result).toEqual(mockJob);
      expect(mockPrismaService.job.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.getJobById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createApplication', () => {
    it('should create a new application', async () => {
      const mockJob = {
        id: 1,
        title: 'Frontend Developer',
        status: JobStatusValues.active,
      };

      const createApplicationDto = {
        jobId: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        coverLetter: 'I am interested in this position...',
      };

      const expectedApplication = {
        id: 1,
        ...createApplicationDto,
        status: ApplicationStatus.pending,  
        cvFile: '',
        cvFileName: '',
        appliedDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.job.findUnique.mockResolvedValue(mockJob);
      mockPrismaService.application.create.mockResolvedValue(expectedApplication);

      const result = await service.createApplication(createApplicationDto);

      expect(result).toEqual(expectedApplication);
      expect(prismaService.application.create).toHaveBeenCalledWith({
        data: {
          ...createApplicationDto,
          status: ApplicationStatus.pending,
        },
      });
    });
  });

  describe('getStats', () => {
    it('should return application statistics', async () => {
      // Mock data
      const mockApplications = [
        { status: ApplicationStatus.pending, _count: 10 },
        { status: ApplicationStatus.reviewed, _count: 5 },
        { status: ApplicationStatus.accepted, _count: 5 },
      ];

      const mockStatusCounts = {
        [ApplicationStatus.pending]: 10,
        [ApplicationStatus.reviewed]: 5,
        [ApplicationStatus.accepted]: 5,
      };

      mockPrismaService.job.count.mockResolvedValueOnce(10);
      mockPrismaService.job.count.mockResolvedValueOnce(5);
      mockPrismaService.application.count.mockResolvedValue(20);
      mockPrismaService.application.groupBy.mockResolvedValue(mockApplications);

      const result = await service.getStats();

      expect(result).toEqual({
        totalJobs: 10,
        activeJobs: 5,
        totalApplications: 20,
        applicationsByStatus: mockStatusCounts,
      });
    });
  });
}); 