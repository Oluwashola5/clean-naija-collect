import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data: profiles } = await supabase.from("profiles").select("user_id, name, created_at");
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");

      if (profiles && roles) {
        const roleMap = Object.fromEntries(roles.map((r) => [r.user_id, r.role]));
        setUsers(
          profiles.map((p) => ({
            id: p.user_id,
            name: p.name,
            email: "",
            role: roleMap[p.user_id] || "unknown",
            created_at: p.created_at?.split("T")[0] || "",
          }))
        );
      }
    }
    fetchUsers();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell><span className="capitalize text-sm font-medium">{u.role}</span></TableCell>
                    <TableCell>{u.created_at}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
