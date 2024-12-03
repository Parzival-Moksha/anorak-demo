import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  // Initialize dark mode state
  const [isDark, setIsDark] = useState(true);
  const { connected } = useWallet();
  const [time, setTime] = useState(3600);

  // Force dark mode on mount and when isDark changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.body.style.backgroundColor = isDark ? '#111827' : '#f3f4f6';
  }, [isDark]);

  // Initial dark mode setup
  useEffect(() => {
    setIsDark(true);
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#111827';
  }, []);

  useEffect(() => {
    const timer = time > 0 && setInterval(() => setTime(time - 1), 1000);
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [time]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Top bar with wallet and theme controls - fixed position and right alignment */}
      <div className="fixed top-0 right-0 p-4 flex items-center gap-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-lg ${
            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {connected && (
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Wallet connected
          </span>
        )}
        <WalletMultiButton />
      </div>

      {/* Center content using table */}
      <table style={{ width: '100%', height: '100vh' }}>
        <tbody>
          <tr>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
<div className="space-y-8">
    <h1 className="text-4xl font-bold">
      Temple of Anorak
    </h1>
    
    <p className="text-xl">
      The Great Challenge Awaits
    </p>

    <div>
      <p className="text-3xl font-mono mb-4">{formatTime(time)}</p>
      <button 
        onClick={() => setTime(3600)}
        className={`px-4 py-2 rounded-lg ${
          isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
        }`}
      >
        Reset Timer
      </button>
    </div>

    {!connected && (
      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
        Connect your wallet to begin the journey
      </p>
    )}

    {/* Add the chat window */}
    <div className="mt-8">
      <ChatWindow />
    </div>
  </div>
</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}