import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if user is authenticated for all methods except POST
  if (req.method !== 'POST') {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  switch (req.method) {
    case 'GET':
      try {
        const contacts = await prisma.contact.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
        return res.status(200).json(contacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'POST':
      try {
        const { name, email, phone, company, service, budget, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
          return res.status(400).json({ message: 'Missing required fields' });
        }

        const contact = await prisma.contact.create({
          data: {
            name,
            email,
            phone: phone || null,
            company: company || null,
            service: service || null,
            budget: budget || null,
            subject,
            message,
            status: 'NEW',
            priority: 'MEDIUM'
          }
        });

        return res.status(201).json(contact);
      } catch (error) {
        console.error('Error creating contact:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
} 