"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function BatchGeneratePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [items, setItems] = useState([
    { id: 1, name: '', style: 'fantasy', level: 'common' },
    { id: 2, name: '', style: 'fantasy', level: 'common' },
    { id: 3, name: '', style: 'fantasy', level: 'common' },
    { id: 4, name: '', style: 'fantasy', level: 'common' },
    { id: 5, name: '', style: 'fantasy', level: 'common' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<string | null>(null);

  // 模拟检查订阅状态
  useState(() => {
    // 在实际应用中，这里会从API获取用户的订阅状态
    // 现在我们只是模拟一个免费用户
    setSubscription('free');
  });

  const handleItemChange = (id: number, field: string, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 检查订阅限制
    if (subscription === 'free') {
      setError('Batch generation requires a Pro or Enterprise subscription. Please upgrade your plan.');
      return;
    }
    
    // 验证所有项目都有名称
    const emptyItems = items.filter(item => !item.name.trim());
    if (emptyItems.length > 0) {
      setError(`Please provide names for all items (Items ${emptyItems.map(i => i.id).join(', ')} are empty)`);
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      // 在实际应用中，这里会批量调用API
      // 现在我们只是模拟API调用
      const batchResults = [];
      
      for (const item of items) {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟结果
        batchResults.push({
          id: item.id,
          name: item.name,
          style: item.style,
          level: item.level,
          imageUrl: `/placeholder-${Math.floor(Math.random() * 5) + 1}.png`, // 模拟不同的图片
          success: Math.random() > 0.1, // 90%成功率
        });
      }
      
      setResults(batchResults);
    } catch (err) {
      setError('Failed to generate items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Batch Generation
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
            Generate multiple game assets at once
          </p>
          
          {subscription === 'free' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">
                Batch generation is a premium feature. 
                <Link href="/pricing" className="font-medium underline ml-1">
                  Upgrade your plan
                </Link>
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md p-6">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                  <div className="sm:col-span-2">
                    <label htmlFor={`item-name-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item Name {item.id}
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id={`item-name-${item.id}`}
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                        placeholder="Sword of Truth"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor={`item-style-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Style
                    </label>
                    <div className="mt-1">
                      <select
                        id={`item-style-${item.id}`}
                        value={item.style}
                        onChange={(e) => handleItemChange(item.id, 'style', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      >
                        <option value="fantasy">Fantasy</option>
                        <option value="medieval">Medieval</option>
                        <option value="scifi">Sci-Fi</option>
                        <option value="cartoon">Cartoon</option>
                        <option value="steampunk">Steampunk</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor={`item-level-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rarity
                    </label>
                    <div className="mt-1">
                      <select
                        id={`item-level-${item.id}`}
                        value={item.level}
                        onChange={(e) => handleItemChange(item.id, 'level', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      >
                        <option value="common">Common</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="rare">Rare</option>
                        <option value="epic">Epic</option>
                        <option value="legendary">Legendary</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading || subscription === 'free'}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${loading || subscription === 'free' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
              >
                {loading ? 'Generating...' : 'Generate All Items'}
              </button>
            </div>
          </div>
        </form>

        {results.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Generated Items</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <div key={result.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{result.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Style: {result.style} | Rarity: {result.level}
                    </p>
                  </div>
                  <div className="h-48 w-full relative bg-gray-200 dark:bg-gray-700">
                    {result.success ? (
                      <Image 
                        src={result.imageUrl} 
                        alt={result.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-red-500 dark:text-red-400">Generation failed</p>
                      </div>
                    )}
                  </div>
                  <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900">
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() => {
                        // 在实际应用中，这里会下载图片
                        alert('Download functionality will be implemented in production');
                      }}
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}