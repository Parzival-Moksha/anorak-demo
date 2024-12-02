import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import '@solana/wallet-adapter-react-ui/styles.css';

export default function Home() {
  // Default to dark mode
  const [isDark, setIsDark] = useState(true);
  const { connected } = useWallet();

  // Apply dark mode on initial load
  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

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
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-4xl font-bold mb-8">
          Temple of Anorak
        </h1>
        <p className="text-xl mb-8">
          The Great Challenge Awaits
        </p>
        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {connected 
            ? 'Wallet connected - prepare for the challenge'
            : 'Connect your wallet to begin the journey'}
        </p>
      </div>
    </main>
  );
}