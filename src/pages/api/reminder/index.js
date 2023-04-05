import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, color, photo, dueDate, groupId } = req.body;

    try {
      const reminder = await prisma.reminder.create({
        data: {
          title,
          description,
          color: color || null,
          photo: photo || null,
          dueDate,
          group: {
            connect: {
              id: parseInt(groupId),
            },
          },
        },
      });

      return res.status(201).json({ reminder });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
  return res.status(405).json({ message: 'Method not allowed' });
}
