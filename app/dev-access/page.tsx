import React from 'react';

export default function DevAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            开发访问页面
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            此页面仅用于开发环境
          </p>
        </div>
      </div>
    </div>
  );
}