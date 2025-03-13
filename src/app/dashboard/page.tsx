// src/app/dashboard/page.tsx
import { requireAuth, ROLES } from "@/utils/require-auth";
import { Card, CardHeader, CardBody } from "@heroui/react";
import UsersTable from "./users-table";
import SessionsTable from "./sessions-table";

export default async function AdminDashboard() {
  // Verifica che l'utente sia admin
  const session = await requireAuth(ROLES.ADMIN);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="mb-4">
        <p>Logged in as: <strong>{session.user.email}</strong> (Admin)</p>
      </div>
      
      <div className="space-y-10">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Users Management</h2>
          </CardHeader>
          <CardBody>
            <UsersTable />
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Active Sessions</h2>
          </CardHeader>
          <CardBody>
            <SessionsTable />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}