import { Request, Response } from 'express';
import Job, { IJob } from '../models/Job';
import { isValidObjectId } from 'mongoose';

export const jobController = {
  // Get all jobs with optional filters
  getAllJobs: async (req: Request, res: Response) => {
    try {
      const { status, department, type } = req.query;
      const filter: Partial<IJob> = {};
      
      if (status) filter.status = status as IJob['status'];
      if (department) filter.department = department as string;
      if (type) filter.type = type as IJob['type'];

      const jobs = await Job.find(filter).sort({ postedDate: -1 });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching jobs', error });
    }
  },

  // Get single job by ID
  getJobById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid job ID' });
      }

      const job = await Job.findById(id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json(job);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching job', error });
    }
  },

  // Create new job
  createJob: async (req: Request, res: Response) => {
    try {
      const jobData: IJob = req.body;
      const newJob = new Job(jobData);
      await newJob.save();
      res.status(201).json(newJob);
    } catch (error) {
      res.status(400).json({ message: 'Error creating job', error });
    }
  },

  // Update job
  updateJob: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid job ID' });
      }

      const jobData: Partial<IJob> = req.body;
      jobData.updatedDate = new Date();

      const updatedJob = await Job.findByIdAndUpdate(
        id,
        { $set: jobData },
        { new: true, runValidators: true }
      );

      if (!updatedJob) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json(updatedJob);
    } catch (error) {
      res.status(400).json({ message: 'Error updating job', error });
    }
  },

  // Delete job
  deleteJob: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid job ID' });
      }

      const deletedJob = await Job.findByIdAndDelete(id);
      if (!deletedJob) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting job', error });
    }
  },

  // Get job statistics
  getJobStats: async (req: Request, res: Response) => {
    try {
      const stats = await Job.aggregate([
        {
          $group: {
            _id: null,
            totalJobs: { $sum: 1 },
            activeJobs: {
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
            },
            totalApplications: { $sum: '$applications' },
            departmentStats: {
              $push: {
                department: '$department',
                count: 1
              }
            }
          }
        }
      ]);

      res.json(stats[0] || { totalJobs: 0, activeJobs: 0, totalApplications: 0 });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching job statistics', error });
    }
  }
}; 