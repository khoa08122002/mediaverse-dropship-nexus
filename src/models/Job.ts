import { Schema, model } from 'mongoose';

export interface IJob {
  title: string;
  department: string;
  location: string;
  type: 'FULLTIME' | 'PARTTIME' | 'CONTRACT' | 'INTERNSHIP';
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: Date;
  updatedDate: Date;
  applications: number;
}

const jobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['FULLTIME', 'PARTTIME', 'CONTRACT', 'INTERNSHIP']
  },
  status: { 
    type: String, 
    required: true,
    enum: ['ACTIVE', 'CLOSED', 'DRAFT'],
    default: 'DRAFT'
  },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String, required: true }],
  benefits: [{ type: String }],
  postedDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  applications: { type: Number, default: 0 }
}, {
  timestamps: true
});

export default model<IJob>('Job', jobSchema); 