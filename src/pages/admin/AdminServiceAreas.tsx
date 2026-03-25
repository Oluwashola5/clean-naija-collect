import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pause, Play, Trash2 } from "lucide-react";

export default function AdminServiceAreas() {
  const { serviceAreas, refresh } = useData();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", lga: "", state: "" });

  const handleAdd = async () => {
    if (!form.name || !form.lga || !form.state) {
      toast({ title: "Validation", description: "All fields required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("service_areas").insert(form as any);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Service Area Added" });
      setOpen(false);
      setForm({ name: "", lga: "", state: "" });
      refresh();
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    await supabase.from("service_areas").update({ status: newStatus } as any).eq("id", id);
    toast({ title: newStatus === "paused" ? "Service Area Paused" : "Service Area Resumed" });
    refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete service area "${name}"?`)) return;
    await supabase.from("service_areas").delete().eq("id", id);
    toast({ title: "Service Area Deleted" });
    refresh();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Service Areas</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Area</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Service Area</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Area Name</Label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Lekki Phase 1" />
                </div>
                <div className="space-y-2">
                  <Label>LGA</Label>
                  <Input value={form.lga} onChange={e => setForm(f => ({ ...f, lga: e.target.value }))} placeholder="e.g., Eti-Osa" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="e.g., Lagos" />
                </div>
                <Button onClick={handleAdd} className="w-full">Add Service Area</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardContent className="pt-6">
            {serviceAreas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No service areas yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area Name</TableHead>
                    <TableHead>LGA</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceAreas.map((sa: any) => (
                    <TableRow key={sa.id}>
                      <TableCell className="font-medium">{sa.name}</TableCell>
                      <TableCell>{sa.lga}</TableCell>
                      <TableCell>{sa.state}</TableCell>
                      <TableCell>
                        <Badge variant={sa.status === "active" ? "default" : "secondary"}>
                          {sa.status || "active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => toggleStatus(sa.id, sa.status || "active")}>
                            {(sa.status || "active") === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(sa.id, sa.name)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
