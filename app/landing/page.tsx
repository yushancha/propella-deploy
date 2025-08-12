"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

export default function LandingPage() {
  const [currentExample, setCurrentExample] = useState(0);
  const { data: session } = useSession();
  
  const examples = [
    { style: "Pixel Art", item: "Legendary Sword", image: "/samples/pixel-sword.png" },
    { style: "Cyberpunk", item: "Plasma Rifle", image: "/samples/cyberpunk-gun.png" },
    { style: "Fantasy", item: "Magic Potion", image: "/samples/fantasy-potion.png" },
    { style: "Sci-Fi", item: "Power Helmet", image: "/samples/scifi-helmet.png" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentExample((prev) => (prev + 1) % examples.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [examples.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PropGen.AI
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-300 mt-4 font-light">
            Create Epic Game Items with AI Magic
          </p>
        </div>

        {/* Rotating example showcase */}
        <div className="mb-12 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-6xl">🎮</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-blue-300 font-semibold">{examples[currentExample].style}</div>
              <div className="text-xl font-bold">{examples[currentExample].item}</div>
              <div className="text-sm text-gray-400">Generated in 3 seconds</div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {session ? (
            <Link href="/generate" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Creating →
            </Link>
          ) : (
            <button 
              onClick={() => signIn("google")}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Free →
            </button>
          )}
          <Link href="/demo" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl font-bold text-lg transition-all duration-300 border border-white/20">
            Watch Demo
          </Link>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-400">Generate in seconds</p>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold mb-2">Multiple Styles</h3>
            <p className="text-sm text-gray-400">5+ art styles available</p>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
            <div className="text-3xl mb-3">💾</div>
            <h3 className="font-bold mb-2">Save & Organize</h3>
            <p className="text-sm text-gray-400">Track your creations</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}