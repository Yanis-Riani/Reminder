import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
    
  if (req.method === 'POST') {      
    try {
      const { name, userIds } = req.body;

    if (!userIds) {
        return res.status(400).json({ message: 'User IDs missing' });
    }

      const group = await prisma.group.create({
        data: {
          name: name,
          users: {
            connect: userIds.map((userId) => ({ id: userId }))
          }
        },
        include: {
          users: true
        }
      });

      return res.status(201).json(group);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error creating group' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
