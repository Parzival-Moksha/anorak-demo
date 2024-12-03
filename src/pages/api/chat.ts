import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ASSISTANT_ID = process.env.ASSISTANT_ID;

if (!ASSISTANT_ID) {
  throw new Error('ASSISTANT_ID is not defined in environment variables');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    // Use your existing Assistant
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
        assistant_id: ASSISTANT_ID // Now TypeScript knows this is definitely a string
      }
    );

    // Wait for the run to complete
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

    // Get the messages
    const messages = await openai.beta.threads.messages.list(
      thread.id
    );

    // Get the last assistant message
    const lastMessage = messages.data
      .filter(msg => msg.role === 'assistant')[0];

    const reply = lastMessage?.content[0]?.text?.value || 
      "Hmm... the virtual winds are strange today.";

    res.status(200).json({ reply });

  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ message: "My virtual circuits are a bit scrambled. Try again?" });
  }
}