import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'I am Anorak, stay a while and listen...' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(msgs => [...msgs, userMessage]);
    setInput('');

    // TODO: Add API call here
    // For now, just echo a response
    const botMessage = { role: 'assistant' as const, content: `[Response placeholder]` };
    setMessages(msgs => [...msgs, botMessage]);
  };

  return (
    <div className={`w-96 mx-auto rounded-lg overflow-hidden shadow-lg`}>
      {/* Chat messages */}
      <div className="h-96 overflow-y-auto p-4 bg-opacity-50 bg-gray-800">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === 'assistant' ? 'text-blue-400' : 'text-green-400'
            }`}
          >
            <span className="font-bold">
              {msg.role === 'assistant' ? 'Anorak: ' : 'You: '}
            </span>
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 bg-gray-900 bg-opacity-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}