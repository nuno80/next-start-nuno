// src/app/dashboard/users-table.tsx
"use client";

import { useState, useEffect } from "react";
import { Avatar } from "@heroui/react";

type User = {
  id: string;
  email: string;
  name: string | null;
  image: string;
  role: string;
};

// Definizione dei ruoli
export const ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
};

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  async function updateUserRole(userId: string, newRole: string) {
    try {
      const response = await fetch("/api/admin/users/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      // Update local state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">User</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-3 text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Avatar src={user.image} alt={user.name || ""} className="w-8 h-8 mr-2" />
                    <span>{user.name || "Unknown"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      user.role === ROLES.ADMIN
                        ? "bg-red-100 text-red-800"
                        : user.role === ROLES.MODERATOR
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role || ROLES.USER}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={user.role || ROLES.USER}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value={ROLES.USER}>{ROLES.USER}</option>
                    <option value={ROLES.MODERATOR}>{ROLES.MODERATOR}</option>
                    <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}