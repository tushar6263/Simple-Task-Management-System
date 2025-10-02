import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { setToken } from "../api";
import { Menu, X } from "lucide-react"; // icons

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    setToken(null);
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
      className="backdrop-blur-lg bg-white/20 border-b border-white/30 shadow-lg shadow-blue-500/20"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <motion.div
          whileHover={{ scale: 1.1, rotateX: 10, rotateY: -10 }}
          className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-md"
        >
          Task Manager
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 items-center">
          {token ? (
            <>
              <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                <Link
                  to="/"
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-medium shadow-md shadow-blue-500/40 hover:shadow-lg hover:shadow-blue-500/60 transition-all"
                >
                  Dashboard
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                <Link
                  to="/tasks/new"
                  className="px-4 py-2 rounded-2xl bg-white/20 border border-white/30 text-gray-900 font-medium hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all shadow-md"
                >
                  New Task
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-2xl bg-gradient-to-r from-red-500 to-red-700 text-white font-medium shadow-md shadow-red-500/40 hover:shadow-lg hover:shadow-red-500/60 transition-all"
                >
                  Logout
                </button>
              </motion.div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-2xl bg-white/20 border border-white/30 text-gray-900 font-medium hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white transition-all shadow-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-2xl bg-white/20 border border-white/30 text-gray-900 font-medium hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg bg-white/30">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden flex flex-col space-y-3 px-6 pb-4"
        >
          {token ? (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks/new"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white font-medium"
              >
                New Task
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-pink-500 text-white font-medium"
              >
                Register
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
}
