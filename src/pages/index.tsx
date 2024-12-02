import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const { connected } = useWallet();

  // Apply dark mode on initial load and when isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827'; // dark gray
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f3f4f6'; // light gray
    }
  }, [isDark]);

  return (
    <main className={`min-h-screen ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Header with buttons */}
      <div className="fixed top-0 right-0 p-4 flex gap-4 items-center">
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-2 rounded-lg ${
            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label="Toggle theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <WalletMultiButton />
      </div>

      {/* Centered content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Temple of Anorak
        </h1>
        <p className="text-xl text-center mb-8">
          The Great Challenge Awaits
        </p>
        <p className={`text-lg text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {connected 
            ? 'Wallet connected - prepare for the challenge'
            : 'Connect your wallet to begin the journey'}
        </p>
      </div>
    </main>
  );
}