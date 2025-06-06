import { Request, Response } from 'express';
import Applicant, { IApplicant } from '../models/Applicant';
import Job from '../models/Job';
import { isValidObjectId } from 'mongoose';

export const applicantController = {
  // Get all applicants for a job
  getJobApplicants: async (req: Request, res: Response) => {
    try {
      const { jobId } = req.params;
      if (!isValidObjectId(jobId)) {
        return res.status(400).json({ message: 'Invalid job ID' });
      }

      const applicants = await Applicant.find({ jobId })
        .sort({ appliedDate: -1 });
      res.json(applicants);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applicants', error });
    }
  },

  // Get single applicant
  getApplicant: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid applicant ID' });
      }

      const applicant = await Applicant.findById(id).populate('jobId');
      if (!applicant) {
        return res.status(404).json({ message: 'Applicant not found' });
      }

      res.json(applicant);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applicant', error });
    }
  },

  // Create new application
  createApplication: async (req: Request, res: Response) => {
    try {
      const applicationData: IApplicant = req.body;
      
      // Validate job exists
      const job = await Job.findById(applicationData.jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      // Check if job is still active
      if (job.status !== 'active') {
        return res.status(400).json({ message: 'This position is no longer accepting applications' });
      }

      // Check for duplicate applications
      const existingApplication = await Applicant.findOne({
        jobId: applicationData.jobId,
        email: applicationData.email
      });

      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this position' });
      }

      // Create application
      const newApplicant = new Applicant(applicationData);
      await newApplicant.save();

      // Update job applications count
      await Job.findByIdAndUpdate(applicationData.jobId, {
        $inc: { applications: 1 }
      });

      res.status(201).json(newApplicant);
    } catch (error) {
      res.status(400).json({ message: 'Error creating application', error });
    }
  },

  // Update applicant status
  updateApplicantStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, notes, interviewDate } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid applicant ID' });
      }

      const updateData: Partial<IApplicant> = { status };
      if (notes) updateData.notes = notes;
      if (interviewDate) updateData.interviewDate = new Date(interviewDate);

      const updatedApplicant = await Applicant.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedApplicant) {
        return res.status(404).json({ message: 'Applicant not found' });
      }

      res.json(updatedApplicant);
    } catch (error) {
      res.status(400).json({ message: 'Error updating applicant status', error });
    }
  },

  // Get application statistics
  getApplicationStats: async (req: Request, res: Response) => {
    try {
      const stats = await Applicant.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const formattedStats = stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {
        pending: 0,
        reviewed: 0,
        interviewed: 0,
        rejected: 0,
        accepted: 0
      });

      res.json(formattedStats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching application statistics', error });
    }
  },

  // Search applicants
  searchApplicants: async (req: Request, res: Response) => {
    try {
      const { query, status } = req.query;
      const searchFilter: any = {};

      if (query) {
        searchFilter.$or = [
          { fullName: new RegExp(query as string, 'i') },
          { email: new RegExp(query as string, 'i') }
        ];
      }

      if (status) {
        searchFilter.status = status;
      }

      const applicants = await Applicant.find(searchFilter)
        .populate('jobId', 'title department')
        .sort({ appliedDate: -1 });

      res.json(applicants);
    } catch (error) {
      res.status(500).json({ message: 'Error searching applicants', error });
    }
  }
}; 