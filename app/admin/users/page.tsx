'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserRole } from '@/types/user';
import DashboardLayout from '@/components/DashboardLayout';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export default function UserManagementPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (session?.user?.role === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch users' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while fetching users' });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!confirm('Are you sure you want to change this user\'s role?')) {
      return;
    }

    setUpdatingRole(userId);
    setMessage(null);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'User role updated successfully!' });
        // Update the user in the local state
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update user role' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while updating user role' });
    } finally {
      setUpdatingRole(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (session?.user?.role !== UserRole.ADMIN) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-lg">Access denied. Admin access required.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            User Management
          </h1>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} dark:bg-opacity-20`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-zinc-900">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-zinc-200 dark:bg-zinc-900 dark:divide-zinc-800">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-900 dark:text-white">
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        disabled={updatingRole === user.id}
                        className="rounded-md border border-zinc-300 px-3 py-1 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      >
                        <option value={UserRole.SALES}>SALES</option>
                        <option value={UserRole.ADMIN}>ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {users.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-600 dark:text-zinc-400">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}