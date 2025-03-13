// src/app/dashboard/sessions-table.tsx
"use client";

import { useState, useEffect } from "react";

type Session = {
  sessionToken: string;
  userId: string;
  expires: string;
  userEmail: string;
  userName: string | null;
  userRole: string;
};

export default function SessionsTable() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await fetch("/api/admin/sessions");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        setSessions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  async function revokeSession(sessionToken: string) {
    try {
      const response = await fetch("/api/admin/sessions/revoke", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to revoke session");
      }

      // Remove from local state
      setSessions((prev) => prev.filter((session) => session.sessionToken !== sessionToken));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (loading) {
    return <div>Loading sessions...</div>;
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
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Expires</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sessions.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-3 text-center">
                No active sessions found
              </td>
            </tr>
          ) : (
            sessions.map((session) => (
              <tr key={session.sessionToken}>
                <td className="px-4 py-3">
                  <div>
                    <div>{session.userName || "Unknown"}</div>
                    <div className="text-sm text-gray-500">
                      {session.userEmail}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{session.userRole}</td>
                <td className="px-4 py-3">
                  {new Date(session.expires).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => revokeSession(session.sessionToken)}
                    className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}