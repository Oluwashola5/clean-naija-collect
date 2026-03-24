import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminServiceAreas() {
  const { serviceAreas } = useData();
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Service Areas</h1>
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Area Name</TableHead>
                  <TableHead>LGA</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serviceAreas.map((sa) => (
                  <TableRow key={sa.id}>
                    <TableCell className="font-medium">{sa.name}</TableCell>
                    <TableCell>{sa.lga}</TableCell>
                    <TableCell>{sa.state}</TableCell>
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
