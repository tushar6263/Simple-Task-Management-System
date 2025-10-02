import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import PriorityBadge from '../components/PriorityBadge';
import { authFetch } from '../api';

export default function Dashboard(){
  const [data, setData] = useState({tasks:[], total:0, page:1, pages:1});
  const [filters, setFilters] = useState({page:1, limit:6, status:'', priority:''});

  const fetchTasks = async () => {
    try {
      const q = new URLSearchParams(filters).toString();
      const res = await authFetch(`/tasks?${q}`);
      setData(res);
    } catch (err) { console.error(err); alert(err.msg || 'Fetch failed'); }
  };

  useEffect(()=>{ fetchTasks(); }, [filters.page, filters.status, filters.priority]);

  const changePage = (p) => setFilters(f=>({...f,page:p}));

  const deleteTask = async (id) => {
    if(!confirm('Delete this task?')) return;
    try {
      await authFetch(`/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (err) { alert(err.msg || 'Delete failed'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await authFetch(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
      fetchTasks();
    } catch (err) { alert(err.msg || 'Update failed'); }
  };

  const updatePriority = async (id, priority) => {
    try {
      await authFetch(`/tasks/${id}/priority`, { method: 'PATCH', body: JSON.stringify({ priority }) });
      fetchTasks();
    } catch (err) { alert(err.msg || 'Priority change failed'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">My Tasks</h1>
        <div className="space-x-2">
          <select onChange={e=>setFilters(f=>({...f,status:e.target.value,page:1}))} className="p-2 border rounded">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select onChange={e=>setFilters(f=>({...f,priority:e.target.value,page:1}))} className="p-2 border rounded">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.tasks.map(task => (
          <div key={task._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <div className="text-sm text-gray-500">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</div>
                <div className="mt-2">{task.description?.slice(0,120)}</div>
              </div>
              <div className="text-right">
                <PriorityBadge priority={task.priority} />
                <div className="mt-2 text-sm">{task.status}</div>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="space-x-2">
                <Link to={`/tasks/${task._id}`} className="px-2 py-1 border rounded">View</Link>
                <Link to={`/tasks/${task._id}/edit`} className="px-2 py-1 border rounded">Edit</Link>
                <button onClick={()=>deleteTask(task._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
              <div className="flex items-center space-x-2">
                {task.status !== 'completed' && <button onClick={()=>updateStatus(task._id, 'completed')} className="px-2 py-1 bg-green-500 text-white rounded">Mark Done</button>}
                <select value={task.priority} onChange={e=>updatePriority(task._id, e.target.value)} className="p-1 border rounded">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={data.page} pages={data.pages} onChange={changePage} />
    </div>
  );
}
