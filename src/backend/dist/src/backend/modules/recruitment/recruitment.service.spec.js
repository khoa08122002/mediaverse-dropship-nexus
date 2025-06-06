"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const recruitment_service_1 = require("./recruitment.service");
const prisma_service_1 = require("../prisma/prisma.service");
const job_dto_1 = require("./dto/job.dto");
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
describe('RecruitmentService', () => {
    let service;
    let prismaService;
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                recruitment_service_1.RecruitmentService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(recruitment_service_1.RecruitmentService);
        prismaService = module.get(prisma_service_1.PrismaService);
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
                type: job_dto_1.JobTypeValues.fulltime,
                description: 'Job description',
                requirements: 'Job requirements',
                benefits: 'Job benefits',
                salary: '1000-2000 USD',
                status: job_dto_1.JobStatusValues.active
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
                type: job_dto_1.JobTypeValues.fulltime,
                description: 'Updated job description',
                requirements: 'Updated job requirements',
                benefits: 'Updated job benefits',
                salary: '2000-3000 USD',
                status: job_dto_1.JobStatusValues.active
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
                    type: job_dto_1.JobTypeValues.fulltime,
                    description: 'Description',
                    requirements: 'Requirements',
                    benefits: 'Benefits',
                    salary: 'Salary',
                    status: job_dto_1.JobStatusValues.active,
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
                type: job_dto_1.JobTypeValues.fulltime,
                description: 'Description',
                requirements: 'Requirements',
                benefits: 'Benefits',
                salary: 'Salary',
                status: job_dto_1.JobStatusValues.active,
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
            await expect(service.getJobById(1)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('createApplication', () => {
        it('should create a new application', async () => {
            const mockJob = {
                id: 1,
                title: 'Frontend Developer',
                status: job_dto_1.JobStatusValues.active,
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
                status: client_1.ApplicationStatus.pending,
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
                    status: client_1.ApplicationStatus.pending,
                },
            });
        });
    });
    describe('getStats', () => {
        it('should return application statistics', async () => {
            const mockApplications = [
                { status: client_1.ApplicationStatus.pending, _count: 10 },
                { status: client_1.ApplicationStatus.reviewed, _count: 5 },
                { status: client_1.ApplicationStatus.accepted, _count: 5 },
            ];
            const mockStatusCounts = {
                [client_1.ApplicationStatus.pending]: 10,
                [client_1.ApplicationStatus.reviewed]: 5,
                [client_1.ApplicationStatus.accepted]: 5,
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
//# sourceMappingURL=recruitment.service.spec.js.map