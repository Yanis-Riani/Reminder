import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
        },
      });

      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error fetching users' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
