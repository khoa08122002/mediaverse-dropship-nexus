export type ContactStatusType = 'NEW' | 'PROCESSING' | 'REPLIED' | 'COMPLETED' | 'REJECTED';
export type ContactPriorityType = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
} 