// pages/api/openai.ts
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in your .env.local file
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message },
        ],
      });

      const responseText = completion.choices[0]?.message?.content || 'No response from OpenAI';
      res.status(200).json({ response: responseText });
    } catch (error) {
      res.status(500).json({ error: 'Failed to communicate with OpenAI' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
