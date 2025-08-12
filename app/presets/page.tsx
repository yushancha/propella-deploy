"use client";
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PresetPack {
  id: string;
  name: string;
  description: string;
  items: string[];
  style: string;
  price: number;
  image: string;
  category: string;
}

export default function PresetsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const presetPacks: PresetPack[] = [
    {
      id: 'rpg-weapons',
      name: 'RPG武器包',
      description: '经典RPG游戏武器合集，包含剑、法杖、弓箭等',
      items: ['传说之剑', '火焰法杖', '精灵弓', '战锤', '匕首'],
      style: 'Fantasy',
      price: 0,
      image: '/presets/rpg-weapons.png',
      category: 'weapons'
    },
    {
      id: 'sci-fi-gear',
      name: '科幻装备集',
      description: '未来科技装备，激光武器、能量护甲等',
      items: ['等离子步枪', '能量护盾', '动力装甲', '光剑', '重力手雷'],
      style: 'Sci-Fi',
      price: 0,
      image: '/presets/sci-fi-gear.png',
      category: 'weapons'
    },
    {
      id: 'magic-potions',
      name: '魔法药水包',
      description: '各种神奇的魔法药水和炼金物品',
      items: ['生命药水', '魔法药水', '隐身药剂', '力量药水', '解毒剂'],
      style: 'Fantasy',
      price: 0,
      image: '/presets/magic-potions.png',
      category: 'consumables'
    },
    {
      id: 'cyberpunk-tech',
      name: '赛博朋克科技',
      description: '赛博朋克风格的高科技道具',
      items: ['神经接口', '全息投影仪', '数据芯片', '义体部件', '黑客工具'],
      style: 'Cyberpunk',
      price: 0,
      image: '/presets/cyberpunk-tech.png',
      category: 'tech'
    },
    {
      id: 'pixel-classics',
      name: '像素经典包',
      description: '复古像素风格的经典游戏道具',
      items: ['像素剑', '金币', '宝石', '钥匙', '药草'],
      style: 'Pixel Art',
      price: 0,
      image: '/presets/pixel-classics.png',
      category: 'collectibles'
    }
  ];

  const categories = [
    { id: 'all', name: '全部', icon: '🎮' },
    { id: 'weapons', name: '武器', icon: '⚔️' },
    { id: 'consumables', name: '消耗品', icon: '🧪' },
    { id: 'tech', name: '科技', icon: '🔧' },
    { id: 'collectibles', name: '收藏品', icon: '💎' }
  ];

  const filteredPacks = selectedCategory === 'all' 
    ? presetPacks 
    : presetPacks.filter(pack => pack.category === selectedCategory);

  const handleGeneratePack = async (pack: PresetPack) => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsGenerating(pack.id);
    
    try {
      // 批量生成道具
      const results = [];
      for (const item of pack.items) {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: item, 
            style: pack.style, 
            level: 'Epic' 
          }),
        });
        
        if (res.ok) {
          const data = await res.json();
          results.push({
            name: item,
            imageUrl: data.imageUrl,
            style: pack.style,
            level: 'Epic'
          });
        }
      }
      
      // 保存到历史记录
      const history = JSON.parse(localStorage.getItem("history") || "[]");
      results.forEach(result => {
        history.unshift({
          ...result,
          time: Date.now(),
          url: result.imageUrl,
          packName: pack.name
        });
      });
      localStorage.setItem("history", JSON.stringify(history.slice(0, 100)));
      
      // 跳转到历史页面查看结果
      router.push('/history');
      
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            预设资产包
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            精心策划的道具合集，一键生成完整的游戏资产包
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-full transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* 资产包网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPacks.map(pack => (
            <div key={pack.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* 预览图 */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-6xl">🎮</div>
              </div>
              
              {/* 内容 */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {pack.name}
                  </h3>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    {pack.style}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {pack.description}
                </p>
                
                {/* 道具列表 */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    包含道具 ({pack.items.length}个):
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pack.items.map((item, index) => (
                      <span 
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* 价格和按钮 */}
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    {pack.price === 0 ? '免费' : `¥${pack.price}`}
                  </div>
                  <button
                    onClick={() => handleGeneratePack(pack)}
                    disabled={isGenerating === pack.id}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    {isGenerating === pack.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        生成中...
                      </>
                    ) : (
                      '一键生成'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-12">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 使用说明
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              点击&quot;一键生成&quot;将批量生成该资产包中的所有道具，生成完成后可在历史记录中查看和下载。
              每个资产包都经过精心设计，确保风格统一、质量优秀。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}