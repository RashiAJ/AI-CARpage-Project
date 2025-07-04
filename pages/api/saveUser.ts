import { NextApiRequest, NextApiResponse } from 'next';
import { saveUserData } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name } = req.body;
      await saveUserData(name);
      res.status(200).json({ message: 'User data saved successfully' });
    } catch (error) {
      console.error('Error in saveUser API:', error);
      res.status(500).json({ error: 'Failed to save user data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}