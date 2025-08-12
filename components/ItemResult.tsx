export default function ItemResult({ result }: { result: any }) {
  // 兼容多种数据格式
  const url = result?.imageUrl || result?.data?.[0]?.url || result?.url;
  
  if (!url) {
    return (
      <div className="flex flex-col items-center gap-2 mt-4 p-4 border border-gray-200 rounded-xl">
        <div className="text-gray-400 text-4xl">❌</div>
        <p className="text-gray-600">图片生成失败</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <img 
        src={url} 
        alt="生成的道具" 
        className="rounded-xl border max-w-xs shadow"
        onError={(e) => {
          console.error('图片加载失败:', url);
          e.currentTarget.src = '/placeholder-error.png'; // 可选：添加错误占位图
        }}
      />
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-600 underline hover:text-blue-800"
      >
        查看原图
      </a>
    </div>
  );
}
