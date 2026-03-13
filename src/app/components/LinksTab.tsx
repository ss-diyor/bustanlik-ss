import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { ClassData, Link as LinkType } from "../types";

interface LinksTabProps {
  classData: ClassData;
  onUpdate: (data: ClassData) => void;
}

export default function LinksTab({ classData, onUpdate }: LinksTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LinkType | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ title: "", url: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: LinkType) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      url: item.url,
      description: item.description,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedLinks = classData.links.filter((item) => item.id !== id);
    onUpdate({ ...classData, links: updatedLinks });
    toast.success("Link deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.url || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingItem) {
      const updatedLinks = classData.links.map((item) =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      onUpdate({ ...classData, links: updatedLinks });
      toast.success("Link updated successfully");
    } else {
      const newLink: LinkType = {
        id: Date.now().toString(),
        ...formData,
      };
      onUpdate({ ...classData, links: [...classData.links, newLink] });
      toast.success("Link added successfully");
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl text-gray-900">Useful Links</h2>
          <p className="text-sm text-gray-500">Important resources and websites</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add"} Link</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter link title"
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the link"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingItem ? "Update" : "Add"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classData.links.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-gray-500">
              No links yet. Click "Add Link" to create one.
            </CardContent>
          </Card>
        ) : (
          classData.links.map((link) => (
            <Card key={link.id} className="relative group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-indigo-600" />
                    {link.title}
                  </CardTitle>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(link)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
                >
                  Visit Link
                  <ExternalLink className="w-3 h-3" />
                </a>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
