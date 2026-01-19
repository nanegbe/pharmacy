'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { UserRole } from '@/types/user';

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export default function UserManagementDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: UserRole.SALES,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', password: '', role: UserRole.SALES });
    setMessage(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: 'User created successfully!' });
        // Reset form after successful submission
        setFormData({ name: '', email: '', password: '', role: UserRole.SALES });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while creating the user' });
    } finally {
      setLoading(false);
    }
  };

  // Only show dropdown if user is admin
  if (session?.user?.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 dark:bg-zinc-800">
          <button
            onClick={() => {
              setShowModal(true);
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700"
          >
            Create New User
          </button>
          <Link href="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-zinc-700">
            Manage Users
          </Link>
        </div>
      )}

      {/* Modal for creating new user */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 dark:bg-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New User</h2>
            
            {message && (
              <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} dark:bg-opacity-20`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-zinc-500 focus:border-zinc-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                >
                  <option value={UserRole.SALES}>SALES</option>
                  <option value={UserRole.ADMIN}>ADMIN</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-zinc-600 dark:text-white dark:hover:bg-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-md hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}