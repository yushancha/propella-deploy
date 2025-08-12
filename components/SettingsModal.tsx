"use client";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeType } from '../contexts/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [quality, setQuality] = useState('high');
  const [isAnimating, setIsAnimating] = useState(false);

  // 焦点陷阱和键盘事件处理
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
          '#settings-modal button, #settings-modal input, #settings-modal select'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleFocusTrap);
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 延迟聚焦以确保模态框已渲染
    setTimeout(() => {
      const closeButton = document.querySelector('.modal-close-btn') as HTMLElement;
      closeButton?.focus();
      setIsAnimating(true);
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleFocusTrap);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // 加载设置
  useEffect(() => {
    if (isOpen) {
      const savedNotifications = localStorage.getItem('notifications') === 'true';
      const savedAutoSave = localStorage.getItem('autoSave') !== 'false';
      const savedQuality = localStorage.getItem('quality') || 'high';
      
      setNotifications(savedNotifications);
      setAutoSave(savedAutoSave);
      setQuality(savedQuality);
    }
  }, [isOpen]);

  // 导出数据功能
  const handleExportData = () => {
    try {
      const history = localStorage.getItem('history') || '[]';
      const settings = {
        notifications,
        autoSave,
        quality,
        theme
      };
      
      const exportData = {
        history: JSON.parse(history),
        settings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `propella-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败，请重试');
    }
  };

  // 清除数据功能
  const handleClearData = () => {
    if (confirm('确定要清除所有历史记录吗？此操作不可撤销。')) {
      localStorage.removeItem('history');
      alert('历史记录已清除');
    }
  };

  const saveSettings = () => {
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('autoSave', autoSave.toString());
    localStorage.setItem('quality', quality);
  };

  useEffect(() => {
    saveSettings();
  }, [notifications, autoSave, quality]);

  // 关闭动画
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  };

  if (!isOpen) return null;

  const menuItems = [
    { id: 'general', label: '通用', icon: '⚙️' },
    { id: 'personalization', label: '个性化', icon: '🎨' },
    { id: 'data-controls', label: '数据控制', icon: '🔒' },
    { id: 'about', label: '关于', icon: 'ℹ️' },
  ];

  return (
    <div 
      id="settings-modal" 
      className={`modal-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog" 
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`modal-container bg-surface-secondary rounded-2xl w-[90%] max-w-4xl max-h-[85vh] relative overflow-hidden border border-border-primary shadow-2xl transition-all duration-300 ${
        isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* 关闭按钮 */}
        <button 
          className="modal-close-btn absolute top-4 right-4 text-text-medium hover:text-text-high text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-tertiary transition-all duration-200 z-10"
          aria-label="Close settings"
          onClick={handleClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="modal-layout flex h-[85vh]">
          {/* 左侧导航 */}
          <nav className="modal-nav flex-shrink-0 w-56 bg-surface-primary border-r border-border-primary p-6">
            <h2 id="settings-title" className="text-xl font-bold mb-6 text-text-high">设置</h2>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-200 text-left group ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-text-medium hover:text-text-high hover:bg-surface-secondary'
                    }`}
                  >
                    <span className="mr-3 text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* 主内容区 */}
          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-text-high">通用设置</h3>
                  
                  <div className="space-y-6">
                    {/* 主题设置 */}
                    <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-text-high">主题</h4>
                          <p className="text-sm text-text-medium">选择界面主题</p>
                        </div>
                        <select
                          value={theme}
                          onChange={(e) => setTheme(e.target.value as ThemeType)}
                          className="bg-surface-secondary border border-border-primary rounded-lg px-4 py-2 text-text-high hover:bg-surface-primary focus:bg-surface-primary transition-colors"
                        >
                          <option value="light">浅色</option>
                          <option value="dark">深色</option>
                        </select>
                      </div>
                    </div>

                    {/* 生成质量 */}
                    <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-text-high">生成质量</h4>
                          <p className="text-sm text-text-medium">选择图像生成质量</p>
                        </div>
                        <select
                          value={quality}
                          onChange={(e) => setQuality(e.target.value)}
                          className="bg-surface-secondary border border-border-primary rounded-lg px-4 py-2 text-text-high hover:bg-surface-primary focus:bg-surface-primary transition-colors"
                        >
                          <option value="standard">标准</option>
                          <option value="high">高质量</option>
                          <option value="ultra">超高质量</option>
                        </select>
                      </div>
                    </div>

                    {/* 自动保存 */}
                    <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-text-high">自动保存</h4>
                          <p className="text-sm text-text-medium">自动保存生成的作品到历史记录</p>
                        </div>
                        <button
                          onClick={() => setAutoSave(!autoSave)}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                            autoSave ? 'bg-primary' : 'bg-surface-secondary border border-border-primary'
                          }`}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                            autoSave ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    {/* 通知设置 */}
                    <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-text-high">桌面通知</h4>
                          <p className="text-sm text-text-medium">生成完成时显示桌面通知</p>
                        </div>
                        <button
                          onClick={() => setNotifications(!notifications)}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                            notifications ? 'bg-primary' : 'bg-surface-secondary border border-border-primary'
                          }`}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                            notifications ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'personalization' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-text-high">个性化设置</h3>
                  <div className="bg-surface-tertiary rounded-xl p-8 border border-border-primary text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-surface-secondary rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h4 className="text-lg font-semibold text-text-high mb-2">个性化功能即将推出</h4>
                    <p className="text-text-medium">我们正在开发更多个性化选项，敬请期待！</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data-controls' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-text-high">数据控制</h3>
                  
                  <div className="space-y-4">
                    {/* 导出数据 */}
                    <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                      <h4 className="text-lg font-semibold text-text-high mb-2">导出数据</h4>
                      <p className="text-sm text-text-medium mb-4">
                        下载您的所有历史记录和设置数据
                      </p>
                      <button
                        onClick={handleExportData}
                        className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium hover:shadow-glow hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        导出数据
                      </button>
                    </div>

                    {/* 清除数据 */}
                    <div className="bg-surface-tertiary rounded-xl p-6 border border-red-500/20">
                      <h4 className="text-lg font-semibold text-red-400 mb-2">清除历史记录</h4>
                      <p className="text-sm text-text-medium mb-4">
                        删除所有本地存储的历史记录，此操作不可撤销
                      </p>
                      <button
                        onClick={handleClearData}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium hover:-translate-y-0.5 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        清除数据
                      </button>
                    </div>

                    {/* 账户操作 */}
                    {session && (
                      <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                        <h4 className="text-lg font-semibold text-text-high mb-2">账户操作</h4>
                        <p className="text-sm text-text-medium mb-4">
                          退出当前账户
                        </p>
                        <button
                          onClick={() => signOut()}
                          className="bg-surface-secondary hover:bg-surface-primary border border-border-primary text-text-high px-6 py-3 rounded-lg transition-all duration-200 font-medium hover:-translate-y-0.5 flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          退出登录
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-text-high">关于 Propella</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                          P
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-text-high">Propella AI</h4>
                          <p className="text-text-medium">版本 1.0.0</p>
                        </div>
                      </div>
                      <p className="text-text-medium leading-relaxed">
                        Propella 是一个专业的 AI 游戏道具生成工具，帮助游戏开发者和设计师快速创建高质量的游戏道具图像。
                        使用最先进的 AI 技术，支持多种艺术风格和稀有度等级。
                      </p>
                    </div>

                    <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                      <h4 className="text-lg font-semibold text-text-high mb-3">技术栈</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-text-medium">Next.js 14</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          <span className="text-text-medium">React 18</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span className="text-text-medium">TypeScript</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-text-medium">Tailwind CSS</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface-tertiary rounded-xl p-6 border border-border-primary">
                      <h4 className="text-lg font-semibold text-text-high mb-3">联系我们</h4>
                      <div className="space-y-2 text-sm">
                        <p className="text-text-medium">如有问题或建议，请联系我们：</p>
                        <p className="text-text-medium">📧 support@propella.ai</p>
                        <p className="text-text-medium">🌐 www.propella.ai</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}






