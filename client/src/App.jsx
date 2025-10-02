import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import TaskDetails from './pages/TaskDetails';
import Navbar from './components/Navbar';

const Private = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App(){
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Private><Dashboard/></Private>} />
          <Route path="/tasks/new" element={<Private><TaskForm/></Private>} />
          <Route path="/tasks/:id/edit" element={<Private><TaskForm editMode/></Private>} />
          <Route path="/tasks/:id" element={<Private><TaskDetails/></Private>} />
        </Routes>
      </div>
    </div>
  );
}
