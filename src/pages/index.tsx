import { useState } from 'react';

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  return (
    <main className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="container mx-auto px-4">
        {/* Theme Toggle Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Main Content */}
        <div className="py-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            Temple of Anorak
          </h1>
          <p className="text-center text-xl mb-8">
            The Great Challenge Awaits
          </p>
          <div className="text-center">
            <p className="text-gray-400">
              Connect your wallet to begin the journey
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}