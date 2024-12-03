import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  onMessageSent: () => void;  // Add this prop
}

export default function ChatWindow({ onMessageSent }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'I am Anorak, stay a while and listen...' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(msgs => [...msgs, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call our API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      // Add Anorak's response
      setMessages(msgs => [...msgs, {
        role: 'assistant',
        content: data.reply
      }]);

      // Call the callback to reset timer
      onMessageSent();

    } catch (error) {
      console.error('Error:', error);
      setMessages(msgs => [...msgs, {
        role: 'assistant',
        content: 'My virtual circuits are a bit scrambled. Try again?'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-96 mx-auto rounded-lg overflow-hidden shadow-lg`}>
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
        {isLoading && (
          <div className="text-blue-400">
            <span className="font-bold">Anorak is typing...</span>
          </div>
        )}
      </div>

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
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}