import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const reminders = await prisma.reminder.findMany({
        where: {
          groupId: parseInt(id),
        },
      });

      res.status(200).json(reminders);
    } catch (err) {
      res.status(500).json({ message: 'Failed to retrieve reminders', error: err });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
