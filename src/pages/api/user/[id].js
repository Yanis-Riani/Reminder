import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const userId = parseInt(req.query.id);

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
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

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error retrieving user data' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}