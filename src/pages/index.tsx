import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const { connected } = useWallet();
  const [time, setTime] = useState(3600); // 1 hour in seconds
  
  // Timer logic
  useEffect(() => {
    const timer = time > 0 && setInterval(() => setTime(time - 1), 1000);
    return () => clearInterval(timer as NodeJS.Timeout);
  }, [time]);

  // Format time to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Header with buttons */}
      <div className="fixed top-0 right-0 p-4 flex gap-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-lg ${
            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <WalletMultiButton />
      </div>

      {/* Centered content */}
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold mb-8">
          Temple of Anorak
        </h1>
        <p className="text-xl mb-8">
          The Great Challenge Awaits
        </p>
        
        {/* Timer Display */}
        <div className="mb-8">
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

        <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
          {connected 
            ? 'Wallet connected - prepare for the challenge'
            : 'Connect your wallet to begin the journey'}
        </p>
      </div>
    </main>
  );
}