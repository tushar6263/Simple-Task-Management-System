import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [form,setForm] = useState({name:'',email:'',password:''});
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register',{
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form)
      });
      if(!res.ok) throw await res.json();
      const data = await res.json();
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      alert(err.msg || 'Registration error');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full border p-2 rounded" />
        <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full border p-2 rounded" />
        <input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" className="w-full border p-2 rounded" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
