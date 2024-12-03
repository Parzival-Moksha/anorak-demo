import OpenAI from 'openai';
import type { NextApiRequest, NextApiResponse } from 'next';

if (!process.env.ASSISTANT_ID) {
  throw new Error('ASSISTANT_ID is not defined in environment variables');
}

// Type assertion for ASSISTANT_ID
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

    // Create thread
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    // Create run with explicitly typed ASSISTANT_ID
    const run = await openai.beta.threads.runs.create(
      thread.id,
      {
        assistant_id: ASSISTANT_ID
      }
    );

    // Wait for completion
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

    // Get messages
    const messages = await openai.beta.threads.messages.list(
      thread.id
    );

    // Get last assistant message
    const lastMessage = messages.data
      .filter(msg => msg.role === 'assistant')[0];

    const reply = lastMessage?.content[0]?.text?.value || 
      "Hmm... the virtual winds are strange today.";

    res.status(200).json({ reply });