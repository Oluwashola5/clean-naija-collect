import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { households } from "@/data/seed";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function ReportIssue() {
  const { user } = useAuth();
  const { addIssue } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const household = households.find((h) => h.userId === user?.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    addIssue({
      householdId: household?.id || "h1",
      householdName: user?.name || "",
      address: household?.address || "",
      serviceAreaId: "sa1",
      title,
      description,
      imageUrl: imagePreview || undefined,
      status: "New",
    });
    toast({ title: "Issue Reported", description: "Your issue report has been submitted." });
    navigate("/household");
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Report Waste Issue</h1>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input id="title" placeholder="e.g., Overflowing dumpster" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the issue in detail..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Upload Photo (optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  <label htmlFor="image" className="cursor-pointer flex flex-col items-center gap-2">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg object-cover" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload an image</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={household?.address || "N/A"} disabled />
              </div>
              <Button type="submit" className="w-full">Submit Report</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
