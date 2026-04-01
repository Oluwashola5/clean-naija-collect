import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, MapPin, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Address } from "@/hooks/useAddresses";

interface Props {
  addresses: Address[];
  onSave: (address: Partial<Address> & { street: string; city: string; lga: string; state: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  readOnly?: boolean;
}

export function AddressManager({ addresses, onSave, onDelete, readOnly }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [editAddr, setEditAddr] = useState<Partial<Address>>({});
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditAddr({ label: "home", street: "", city: "", lga: "", state: "", postal_code: "" });
    setEditOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditAddr({ ...addr });
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!editAddr.street?.trim() || !editAddr.city?.trim() || !editAddr.lga?.trim() || !editAddr.state?.trim()) {
      toast({ title: "Validation Error", description: "Street, city, LGA, and state are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await onSave(editAddr as any);
      toast({ title: editAddr.id ? "Address updated" : "Address added" });
      setEditOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast({ title: "Address removed" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" /> Addresses
        </h3>
        {!readOnly && (
          <Button variant="outline" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        )}
      </div>

      {addresses.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">No addresses added yet.</p>
      )}

      {addresses.map((addr) => (
        <Card key={addr.id} className="relative">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase text-muted-foreground bg-muted px-2 py-0.5 rounded">{addr.label}</span>
                  {addr.is_default && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                </div>
                <p className="text-sm truncate">{addr.street}</p>
                <p className="text-xs text-muted-foreground">{addr.city}, {addr.lga}, {addr.state} {addr.postal_code || ""}</p>
              </div>
              {!readOnly && (
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(addr)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(addr.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editAddr.id ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input value={editAddr.label || ""} onChange={(e) => setEditAddr({ ...editAddr, label: e.target.value })} placeholder="e.g. home, office" />
            </div>
            <div className="space-y-2">
              <Label>Street Address</Label>
              <Input value={editAddr.street || ""} onChange={(e) => setEditAddr({ ...editAddr, street: e.target.value })} placeholder="Street address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={editAddr.city || ""} onChange={(e) => setEditAddr({ ...editAddr, city: e.target.value })} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>LGA</Label>
                <Input value={editAddr.lga || ""} onChange={(e) => setEditAddr({ ...editAddr, lga: e.target.value })} placeholder="LGA" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={editAddr.state || ""} onChange={(e) => setEditAddr({ ...editAddr, state: e.target.value })} placeholder="State" />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input value={editAddr.postal_code || ""} onChange={(e) => setEditAddr({ ...editAddr, postal_code: e.target.value })} placeholder="Optional" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
