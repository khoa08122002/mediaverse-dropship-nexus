import { Schema, model, Types } from 'mongoose';

export interface IApplicant {
  jobId: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  cvFile?: {
    fileName: string;
    fileUrl: string;
    uploadDate: Date;
  };
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted';
  appliedDate: Date;
  notes?: string;
  interviewDate?: Date;
}

const applicantSchema = new Schema<IApplicant>({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  coverLetter: { type: String },
  cvFile: {
    fileName: String,
    fileUrl: String,
    uploadDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'interviewed', 'rejected', 'accepted'],
    default: 'pending'
  },
  appliedDate: { type: Date, default: Date.now },
  notes: { type: String },
  interviewDate: { type: Date }
}, {
  timestamps: true
});

// Index for faster queries
applicantSchema.index({ jobId: 1, status: 1 });
applicantSchema.index({ email: 1 });

export default model<IApplicant>('Applicant', applicantSchema); 