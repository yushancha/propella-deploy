import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function HistoryModal({ item, onClose }: { item: any, onClose: () => void }) {
  // 禁止页面滚动，防止背景滚动穿透
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const modal = (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full relative">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={onClose}>×</button>
        <img src={item.url} alt="Historical item" className="rounded-xl border max-w-full mb-4" />
        <div className="font-bold text-lg mb-2">{item.name}</div>
        <div className="text-sm text-gray-500 mb-2">{item.style} / {item.level}</div>
        <div className="text-xs text-gray-400">{new Date(item.time).toLocaleString()}</div>
      </div>
    </div>
  );

  // 用 Portal 渲染到 body，避免 DOM 层级混乱
  if (typeof window !== "undefined") {
    return createPortal(modal, document.body);
  }
  return null;
} 