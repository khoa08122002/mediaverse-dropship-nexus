import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid contact ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const contact = await prisma.contact.findUnique({
          where: { id }
        });

        if (!contact) {
          return res.status(404).json({ message: 'Contact not found' });
        }

        return res.status(200).json(contact);
      } catch (error) {
        console.error('Error fetching contact:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'PUT':
      try {
        const { status, priority } = req.body;

        const contact = await prisma.contact.update({
          where: { id },
          data: {
            ...(status && { status }),
            ...(priority && { priority }),
            updatedAt: new Date()
          }
        });

        return res.status(200).json(contact);
      } catch (error) {
        console.error('Error updating contact:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    case 'DELETE':
      try {
        await prisma.contact.delete({
          where: { id }
        });

        return res.status(204).end();
      } catch (error) {
        console.error('Error deleting contact:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
} 