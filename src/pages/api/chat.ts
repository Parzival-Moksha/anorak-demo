import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

if (!process.env.ASSISTANT_ID) {
  throw new Error('ASSISTANT_ID is not defined in environment variables');
}

const ASSISTANT_ID: string = process.env.ASSISTANT_ID as string;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    const run = await openai.beta.threads.runs.create(
      thread.id,
      {
        assistant_id: ASSISTANT_ID
      }
    );

    let runStatus = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );

    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      
      if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
    }

    const messages = await openai.beta.threads.messages.list(
      thread.id
    );

    const lastMessage = messages.data
      .filter(msg => msg.role === 'assistant')[0];

    let reply = "Hmm... the virtual winds are strange today.";
    
    if (lastMessage?.content[0]?.type === 'text') {
      reply = lastMessage.content[0].text.value;
    }

    res.status(200).json({ reply });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: "My virtual circuits are a bit scrambled. Try again?" });
  }
}