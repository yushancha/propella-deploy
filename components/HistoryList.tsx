export default function HistoryList({ history, onSelect }: { history: any[], onSelect: (item: any) => void }) {
  if (!history.length) return <div className="text-center text-gray-400">No history records</div>;
  return (
    <ul className="divide-y rounded-xl bg-white shadow">
      {history.map((item, i) => (
        <li key={i} className="p-4 flex items-center justify-between hover:bg-blue-50 transition cursor-pointer" onClick={() => onSelect(item)}>
          <div>
            <div className="font-semibold">{item.name}</div>
            <div className="text-xs text-gray-500">{item.style} / {item.level}</div>
          </div>
          <div className="text-xs text-gray-400">{new Date(item.time).toLocaleString()}</div>
        </li>
      ))}
    </ul>
  );
} 