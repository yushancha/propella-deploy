"use client";
import { useState } from "react";

const styles = [
  { value: "pixel", label: "Pixel Art" },
  { value: "cyberpunk", label: "Cyberpunk" },
  { value: "fantasy", label: "Fantasy" },
  { value: "scifi", label: "Sci-Fi" },
  { value: "cartoon", label: "Cartoon" },
];
const levels = [
  { value: "normal", label: "Common" },
  { value: "elite", label: "Rare" },
  { value: "epic", label: "Epic" },
];

export default function ItemForm({ onResult }: { onResult: (r: any) => void }) {
  const [name, setName] = useState("");
  const [style, setStyle] = useState(styles[0].value);
  const [level, setLevel] = useState(levels[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    onResult(null);
    
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, style, level }),
      });
      
      const data = await res.json();
      console.log('API响应:', data); // 调试日志
      
      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      // 修复数据传递格式
      const resultData = {
        imageUrl: data.imageUrl,
        data: data.data,
        name, 
        style, 
        level, 
        time: Date.now()
      };
      
      onResult(resultData);
      
      // 保存历史记录 - 修复URL获取
      const history = JSON.parse(localStorage.getItem("history") || "[]");
      history.unshift({ 
        name, 
        style, 
        level, 
        time: Date.now(), 
        url: data.imageUrl || data.data?.[0]?.url 
      });
      localStorage.setItem("history", JSON.stringify(history.slice(0, 50)));
      
    } catch (e: any) {
      setError(e.message);
      console.error('生成错误:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-base">Item Name</label>
        <input
          className="border border-gray-200 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50"
          placeholder="e.g. Potion, Sword, Shield..."
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-base">Style</label>
        <select
          className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
          value={style}
          onChange={e => setStyle(e.target.value)}
        >
          {styles.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-base">Rarity</label>
        <select
          className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50"
          value={level}
          onChange={e => setLevel(e.target.value)}
        >
          {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
        </select>
      </div>
      <button
        type="submit"
        className="btn-primary text-lg mt-2 w-full"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Item"}
      </button>
      {error && <div className="text-red-500 text-center">{error}</div>}
    </form>
  );
}
