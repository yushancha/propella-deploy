'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function ErrorMessageContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    setError(errorParam || 'Unknown error');
  }, [searchParams]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Configuration':
        return '服务器配置错误';
      case 'AccessDenied':
        return '访问被拒绝';
      case 'Verification':
        return '验证失败';
      default:
        return '登录时发生错误';
    }
  };

  return (
    <div>
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        登录失败
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {getErrorMessage(error)}
      </p>
      <a
        href="/login"
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        重新登录
      </a>
    </div>
  );
}

export default function ErrorMessage() {
  return (
    <Suspense fallback={<div className="text-gray-500">加载中...</div>}>
      <ErrorMessageContent />
    </Suspense>
  );
}
