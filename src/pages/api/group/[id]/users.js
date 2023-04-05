import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const groupId = parseInt(req.query.id);

  if (req.method === 'GET') {
    try {
      const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: { users: true },
      });

      if (!group) {
        return res.status(404).json({ message: `Group with ID ${groupId} not found.` });
      }

      return res.status(200).json(group.users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error getting users for group.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
