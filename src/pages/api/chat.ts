import { Configuration, OpenAIApi } from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are Anorak, a wise and mysterious guide in the virtual world. You speak in a manner that combines wisdom with playful references to gaming and virtual reality. Keep responses concise but engaging."
        },
        {
          role: "user",
          content: message
        }
      ],
    });

    const reply = completion.data.choices[0]?.message?.content || "Hmm... the virtual winds are strange today.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: "My virtual circuits are a bit scrambled. Try again?" });
  }
}