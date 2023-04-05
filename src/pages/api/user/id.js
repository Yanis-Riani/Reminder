import prisma from '../../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const { email } = req.query;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          groups: {
            include: {
              reminders: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const reminders = user.groups.reduce((acc, group) => {
        return [...acc, ...group.reminders];
      }, []);

      return res.status(200).json({ user, reminders });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching user' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
