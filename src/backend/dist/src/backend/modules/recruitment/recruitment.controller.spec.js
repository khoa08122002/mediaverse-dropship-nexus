"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const recruitment_controller_1 = require("./recruitment.controller");
const recruitment_service_1 = require("./recruitment.service");
const file_upload_service_1 = require("../file-upload/file-upload.service");
const job_dto_1 = require("./dto/job.dto");
const client_1 = require("@prisma/client");
describe('RecruitmentController', () => {
    let controller;
    let service;
    const mockRecruitmentService = {
        createJob: jest.fn(),
        getAllJobs: jest.fn(),
        getJobById: jest.fn(),
        updateJob: jest.fn(),
        deleteJob: jest.fn(),
        createApplication: jest.fn(),
        getJobApplications: jest.fn(),
        getApplicationsByJob: jest.fn(),
        getStats: jest.fn(),
    };
    const mockFileUploadService = {
        saveCV: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [recruitment_controller_1.RecruitmentController],
            providers: [
                {
                    provide: recruitment_service_1.RecruitmentService,
                    useValue: mockRecruitmentService,
                },
                {
                    provide: file_upload_service_1.FileUploadService,
                    useValue: mockFileUploadService,
                },
            ],
        }).compile();
        controller = module.get(recruitment_controller_1.RecruitmentController);
        service = module.get(recruitment_service_1.RecruitmentService);
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
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
            mockRecruitmentService.createJob.mockResolvedValue(mockJob);
            const result = await controller.createJob(createJobDto);
            expect(result).toBe(mockJob);
            expect(mockRecruitmentService.createJob).toHaveBeenCalledWith(createJobDto);
        });
    });
    describe('updateJob', () => {
        it('should update an existing job', async () => {
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
                id: 1,
                ...updateJobDto,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockRecruitmentService.updateJob.mockResolvedValue(mockUpdatedJob);
            const result = await controller.updateJob('1', updateJobDto);
            expect(result).toBe(mockUpdatedJob);
            expect(mockRecruitmentService.updateJob).toHaveBeenCalledWith(1, updateJobDto);
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
            mockRecruitmentService.getAllJobs.mockResolvedValue(mockJobs);
            const result = await controller.getAllJobs();
            expect(result).toEqual(mockJobs);
            expect(mockRecruitmentService.getAllJobs).toHaveBeenCalled();
        });
    });
    describe('createApplication', () => {
        it('should create a new application', async () => {
            const createApplicationDto = {
                jobId: 1,
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890',
                coverLetter: 'Cover letter content',
            };
            const mockApplication = {
                id: 1,
                ...createApplicationDto,
                status: client_1.ApplicationStatus.pending,
                cvFile: 'cv.pdf',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockRecruitmentService.createApplication.mockResolvedValue(mockApplication);
            const result = await controller.createApplication(createApplicationDto);
            expect(result).toBe(mockApplication);
            expect(mockRecruitmentService.createApplication).toHaveBeenCalledWith({
                jobId: createApplicationDto.jobId,
                fullName: createApplicationDto.fullName,
                email: createApplicationDto.email,
                phone: createApplicationDto.phone,
                coverLetter: createApplicationDto.coverLetter,
                status: client_1.ApplicationStatus.pending,
            });
        });
    });
    describe('getStats', () => {
        it('should return recruitment statistics', async () => {
            const mockStats = {
                totalApplications: 10,
                totalJobs: 5,
                activeJobs: 3,
                statusCounts: {
                    PENDING: 4,
                    REVIEWED: 2,
                    INTERVIEWED: 2,
                    ACCEPTED: 1,
                    REJECTED: 1,
                },
            };
            mockRecruitmentService.getStats.mockResolvedValue(mockStats);
            const result = await controller.getStats();
            expect(result).toEqual(mockStats);
            expect(mockRecruitmentService.getStats).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=recruitment.controller.spec.js.map