export default function Pagination({page, pages, onChange}) {
  if (pages <= 1) return null;
  const arr = [];
  for (let i=1;i<=pages;i++) arr.push(i);
  return (
    <div className="flex space-x-2 mt-4">
      {arr.map(n => (
        <button key={n} onClick={()=>onChange(n)} className={`px-3 py-1 rounded ${n===page ? 'bg-blue-600 text-white' : 'bg-white border'}`}>{n}</button>
      ))}
    </div>
  );
}
