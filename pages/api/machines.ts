import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import Machine from '../../models/Machine';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    const { ip, username, password } = req.body;

    try {
      const machine = await Machine.create({ ip, username, password });
      res.status(201).json(machine);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else if (req.method === 'GET') {
    const machines = await Machine.find();
    res.status(200).json(machines);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
