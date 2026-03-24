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
import { useHouseholdProfile } from "@/hooks/useHouseholdProfile";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ReportIssue() {
  const { user } = useAuth();
  const { addIssue, serviceAreas } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { household } = useHouseholdProfile();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !household) {
      toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    let imageUrl: string | undefined;
    if (imageFile) {
      const fileName = `${user?.id}/${Date.now()}-${imageFile.name}`;
      const { data, error } = await supabase.storage.from("issue-images").upload(fileName, imageFile);
      if (!error && data) {
        const { data: urlData } = supabase.storage.from("issue-images").getPublicUrl(data.path);
        imageUrl = urlData.publicUrl;
      }
    }

    await addIssue({
      household_id: household.id,
      household_name: user?.name || "",
      address: household.address,
      service_area_id: serviceAreas[0]?.id || null,
      title,
      description,
      image_url: imageUrl || null,
      status: "New",
    });

    toast({ title: "Issue Reported", description: "Your issue report has been submitted." });
    setSubmitting(false);
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
                <Textarea id="description" placeholder="Describe the issue..." value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
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
                <Input value={household?.address || "Loading..."} disabled />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Submitting..." : "Submit Report"}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
