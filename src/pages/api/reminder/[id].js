import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
  const reminderId = req.query.id;

  if (req.method === 'GET') {
    try {
      const reminder = await prisma.reminder.findUnique({
        where: {
          id: parseInt(reminderId),
        },
      });

      if (!reminder) {
        return res.status(404).json({ message: `Reminder ${reminderId} not found` });
      }

      return res.status(200).json({ reminder });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }

  if (req.method === 'POST') {
    const { title, description, color, photo, dueDate, groupId } = req.body;

    try {
      const reminder = await prisma.reminder.create({
        data: {
          title,
          description,
          color,
          photo,
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

  if (req.method === 'PUT') {
    const { title, description, color, photo, dueDate } = req.body;

    try {
      const updatedReminder = await prisma.reminder.update({
        where: {
          id: Number(reminderId),
        },
        data: {
          title,
          description,
          color : color || null,
          photo : photo || null,
          dueDate,
        },
      });

      return res.status(200).json({ reminder: updatedReminder });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  }
  if (req.method === 'DELETE') {
    try {
      const deletedReminder = await prisma.reminder.delete({
        where: { id: parseInt(reminderId) },
      });
      return res.status(200).json(deletedReminder);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error deleting reminder' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
