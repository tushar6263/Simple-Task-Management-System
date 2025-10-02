import React, {useEffect, useState} from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authFetch } from '../api';

export default function TaskDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [task,setTask] = useState(null);

  useEffect(()=>{ (async ()=>{
    try { const data = await authFetch(`/tasks/${id}`); setTask(data); } catch (err) { alert(err.msg || 'Failed'); navigate('/'); }
  })(); },[id]);

  if (!task) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-2">{task.title}</h2>
      <div className="text-sm text-gray-500 mb-2">Status: {task.status} • Priority: {task.priority}</div>
      <div className="mb-4">{task.description}</div>
      <div className="text-sm text-gray-600">Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'No date'}</div>
      <div className="mt-4">
        <Link to={`/tasks/${task._id}/edit`} className="px-3 py-1 border rounded mr-2">Edit</Link>
        <Link to={`/`} className="px-3 py-1 border rounded">Back</Link>
      </div>
    </div>
  );
}
