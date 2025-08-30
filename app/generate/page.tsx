"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// Task 3a: Define the data structure for 2x2 grid display
interface HistoryItem {
  id: string;
  prompt: string;
  style: string;
  rarity: string;
  timestamp: string;
  results: { url: string }[]; // Array of 4 images
}

// Task 3b: Prompt optimization function
const enrichPrompt = (basePrompt: string, style: string, rarity: string): string => {
  let finalPrompt = basePrompt;

  // Style-based enhancements
  switch (style) {
    case 'pixel':
      finalPrompt += ', pixel art, 8-bit, 16-bit, retro game asset, detailed pixels, vibrant color palette, game sprite';
      break;
    case 'cyberpunk':
      finalPrompt += ', cyberpunk style, neon colors, futuristic, high tech, glowing elements, dystopian aesthetic';
      break;
    case 'fantasy':
      finalPrompt += ', fantasy art, magical, mystical, detailed fantasy illustration, rich colors, epic fantasy style';
      break;
    case 'scifi':
      finalPrompt += ', sci-fi, futuristic, technological, sleek design, advanced materials, space age aesthetic';
      break;
    case 'cartoon':
      finalPrompt += ', cartoon style, vibrant colors, clean lines, fun design, animated look, playful aesthetic';
      break;
  }

  // Rarity-based enhancements
  switch (rarity) {
    case 'normal':
      finalPrompt += ', standard quality, clean design, good detail';
      break;
    case 'elite':
      finalPrompt += ', enhanced quality, superior design, enhanced details, premium look';
      break;
    case 'epic':
      finalPrompt += ', epic quality, exceptional design, intricate details, legendary appearance';
      break;
    case 'legendary':
      finalPrompt += ', legendary quality, masterwork design, extremely detailed, glowing effects, magical aura, masterpiece, 4k, high detail, intricate design';
      break;
  }

  return finalPrompt;
};

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const [itemName, setItemName] = useState('');
  const [style, setStyle] = useState('pixel');
  const [rarity, setRarity] = useState('normal');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Task 3a: Persistent history with localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem('generationHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      return [];
    }
  });

  // Task 3a: Auto-save history to localStorage
  useEffect(() => {
    localStorage.setItem('generationHistory', JSON.stringify(history));
  }, [history]);

  // Early return for loading and auth
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (status === 'unauthenticated' || !session) {
    if (typeof window !== 'undefined') {
      redirect('/login');
    }
    return null;
  }

  const handleGenerate = async () => {
    if (!itemName.trim()) return;
    
    setIsGenerating(true);
    try {
      // Task 3b: Use enriched prompt for better generation quality
      const enrichedPrompt = enrichPrompt(itemName, style, rarity);
      console.log('Enriched prompt:', enrichedPrompt);
      
      // Simulate API call with delay (in real app, this would call your image generation API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Task 4: Generate 4 images per prompt (mock data for now)
      const mockResults = [
        { url: '/pixel-sword.svg' },
        { url: '/pixel-sword.svg' },
        { url: '/pixel-sword.svg' },
        { url: '/pixel-sword.svg' }
      ];
      
      // Create new history item with 2x2 grid structure
      const newHistoryItem: HistoryItem = {
        id: crypto.randomUUID(),
        prompt: itemName,
        style,
        rarity,
        timestamp: new Date().toISOString(),
        results: mockResults
      };

      setHistory(prev => [newHistoryItem, ...prev]);
      setItemName('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Task 1: Compact input bar with unified styling */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-6">
          {/* Page title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Game Items</h1>
            <p className="text-gray-600 text-sm sm:text-base">Describe your item and let AI bring it to life</p>
          </div>

          {/* Task 1: Compact horizontal input bar */}
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50 border border-gray-200 rounded-xl p-4">
              {/* Main textarea - takes most space */}
              <div className="flex-1 w-full">
                <textarea
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Describe the game item you want to create... (e.g., A legendary sword with glowing blue runes)"
                  className="w-full h-20 text-base placeholder:text-gray-400 resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                  maxLength={500}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {itemName.length}/500
                </div>
              </div>

              {/* Compact controls - horizontal layout */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                >
                  <option value="pixel">Pixel Art</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="scifi">Sci‑Fi</option>
                  <option value="cartoon">Cartoon</option>
                </select>
                
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                >
                  <option value="normal">Normal</option>
                  <option value="elite">Elite</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !itemName.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </div>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task 2: Unified scrolling content area */}
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {history.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto space-y-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Ready to create something amazing?
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Describe any game item you can imagine and watch AI bring it to life.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {['Weapons', 'Armor', 'Potions', 'Artifacts', 'Tools', 'Accessories'].map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-900">Your Creations ({history.length})</h2>
              
              {/* Task 4: Midjourney-style 2x2 grid layout */}
              {history.map((item) => (
                <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  {/* Prompt title */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.prompt}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Style: {item.style}</span>
                      <span>Rarity: {item.rarity}</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* 2x2 image grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {item.results.map((result, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={result.url} 
                          alt={`Generated image ${index + 1}`} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-3 mt-4">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      View All
                    </button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Download All
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 