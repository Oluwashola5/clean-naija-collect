import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { households } from "@/data/seed";

export default function HouseholdHistory() {
  const { user } = useAuth();
  const { pickups, issues } = useData();
  const household = households.find((h) => h.userId === user?.id);
  const myPickups = pickups.filter((p) => p.householdId === household?.id);
  const myIssues = issues.filter((i) => i.householdId === household?.id);

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">History</h1>
        <Tabs defaultValue="pickups">
          <TabsList>
            <TabsTrigger value="pickups">Pickups ({myPickups.length})</TabsTrigger>
            <TabsTrigger value="issues">Issues ({myIssues.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pickups">
            <Card>
              <CardContent className="pt-6">
                {myPickups.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pickup history</p>
                ) : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Company</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {myPickups.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.wasteType}</TableCell>
                          <TableCell>{p.scheduledDate}</TableCell>
                          <TableCell>{p.companyName || "—"}</TableCell>
                          <TableCell><StatusBadge status={p.status} type="pickup" /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="issues">
            <Card>
              <CardContent className="pt-6">
                {myIssues.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No issues reported</p>
                ) : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {myIssues.map((i) => (
                        <TableRow key={i.id}>
                          <TableCell className="font-medium">{i.title}</TableCell>
                          <TableCell>{i.createdAt}</TableCell>
                          <TableCell><StatusBadge status={i.status} type="issue" /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
