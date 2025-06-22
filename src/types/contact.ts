export type ContactStatusType = 'NEW' | 'REPLIED' | 'ARCHIVED';
export type ContactPriorityType = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string;
  budget: string | null;
  subject: string;
  message: string;
  status: ContactStatusType;
  priority: ContactPriorityType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactDTO {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  subject: string;
  message: string;
} 