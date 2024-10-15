import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
}
