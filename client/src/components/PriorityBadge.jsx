export default function PriorityBadge({priority}) {
  const map = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };
  return <span className={`px-2 py-1 rounded text-xs ${map[priority] || map.medium}`}>{priority}</span>;
}
