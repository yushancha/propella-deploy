"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface GenerationRecord {
  id: string;
  name: string;
  style: string;
  level: string;
  imageUrl: string;
  timestamp: number;
}

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const [itemName, setItemName] = useState('');
  const [style, setStyle] = useState('pixel');
  const [level, setLevel] = useState('normal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);
  const [activeTab, setActiveTab] = useState('item-generation');

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
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create mock generation record
      const newGeneration: GenerationRecord = {
        id: crypto.randomUUID(),
        name: itemName,
        style,
        level,
        imageUrl: '/pixel-sword.svg', // Use placeholder image
        timestamp: Date.now()
      };

      setGenerations(prev => [newGeneration, ...prev]);
      setItemName('');
    } finally {
      setIsGenerating(false);
    }
  };

  // Tab options
  const tabs = [
    { id: 'item-generation', label: 'Item Generation', icon: '🎮' },
    { id: 'asset-preview', label: 'Asset Preview', icon: '👁️' },
    { id: 'export-options', label: 'Export Options', icon: '📤' },
    { id: 'batch-create', label: 'Batch Create', icon: '⚡' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          {/* Tab Bar */}
          <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1 max-w-md mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Page title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create Game Items</h1>
            <p className="text-gray-600 text-sm sm:text-base">Describe your item and let AI bring it to life</p>
          </div>

          {/* Input area */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Main input field */}
            <div className="relative">
              <textarea
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Describe the game item you want to create... (e.g., A legendary sword with glowing blue runes, pixel art style)"
                className="w-full h-40 text-lg placeholder:text-gray-400 resize-none text-center border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isGenerating}
                maxLength={500}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                <div className="text-xs text-gray-400">
                  {itemName.length}/500
                </div>
                {itemName.length > 0 && (
                  <button
                    onClick={() => setItemName('')}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-3 items-center justify-center">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isGenerating}
              >
                <option value="pixel">Pixel Art</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="fantasy">Fantasy</option>
                <option value="scifi">Sci‑Fi</option>
                <option value="cartoon">Cartoon</option>
              </select>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate Item'
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {generations.length === 0 ? (
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
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Creations ({generations.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generations.map((gen) => (
                  <div key={gen.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <img src={gen.imageUrl} alt={gen.name} className="w-3/4 h-3/4 object-contain" />
                    </div>
                    <div className="p-4">
                      <div className="text-lg font-semibold text-gray-900 mb-1">{gen.name}</div>
                      <div className="text-sm text-gray-600 mb-3">Style: {gen.style} · Rarity: {gen.level}</div>
                      <div className="flex items-center gap-2">
                        <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          View
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 