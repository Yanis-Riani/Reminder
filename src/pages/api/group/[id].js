import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const groupId = parseInt(req.query.id);

  if (req.method === 'GET') {
    try {
      const group = await prisma.group.findUnique({
        where: {
          id: groupId
        },
        include: {
          users: true,
          reminders: true
        }
      });

      if (!group) {
        return res.status(404).json({ message: `Group with ID ${groupId} not found` });
      }

      return res.status(200).json(group);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error getting group' });
    }
  }
  if (req.method === 'PUT') {
    try {
      const { name, userIds } = req.body;
      let data = {};

      if (name) {
        data.name = name;
      }

      if (userIds) {
        data.users = {
          set: userIds.map((userId) => ({ id: userId }))
        }
      }

      const updatedGroup = await prisma.group.update({
        where: {
          id: Number(groupId)
        },
        data,
        include: {
          users: true
        }
      });

      return res.status(200).json(updatedGroup);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error updating group' });
    }
  }
  if (req.method === 'DELETE') {
    try {
      // Supprime tous les rappels associés au groupe
      await prisma.reminder.deleteMany({
        where: { groupId: parseInt(groupId) }
      });

      // Supprime le groupe
      await prisma.group.delete({
        where: { id: parseInt(groupId) }
      });

      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting group' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
