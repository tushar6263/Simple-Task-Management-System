import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../api';

export default function TaskForm({ editMode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ title:'', description:'', dueDate:'', priority:'medium' });

  useEffect(()=>{
    if (editMode && id) {
      (async ()=>{
        try {
          const data = await authFetch(`/tasks/${id}`);
          setForm({
            title: data.title || '',
            description: data.description || '',
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString().slice(0,10) : '',
            priority: data.priority || 'medium'
          });
        } catch (err) { alert(err.msg || 'Load failed'); }
      })();
    }
  }, [editMode, id]);

  const submit = async e => {
    e.preventDefault();
    try {
      if (editMode) {
        await authFetch(`/tasks/${id}`, { method:'PUT', body: JSON.stringify(form) });
      } else {
        await authFetch('/tasks', { method:'POST', body: JSON.stringify(form) });
      }
      navigate('/');
    } catch (err) { alert(err.msg || 'Save failed'); }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">{editMode ? 'Edit Task' : 'New Task'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" className="w-full border p-2 rounded" />
        <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="w-full border p-2 rounded"></textarea>
        <div className="flex space-x-2">
          <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} className="border p-2 rounded" />
          <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} className="border p-2 rounded">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={()=>navigate('/')} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
