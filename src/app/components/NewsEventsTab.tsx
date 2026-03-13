import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Newspaper } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { ClassData, NewsEvent } from "../types";

interface NewsEventsTabProps {
  classData: ClassData;
  onUpdate: (data: ClassData) => void;
}

export default function NewsEventsTab({ classData, onUpdate }: NewsEventsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    type: "news" as "news" | "event",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ title: "", description: "", date: "", type: "news" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: NewsEvent) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date,
      type: item.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedNews = classData.news.filter((item) => item.id !== id);
    onUpdate({ ...classData, news: updatedNews });
    toast.success("Item deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingItem) {
      const updatedNews = classData.news.map((item) =>
        item.id === editingItem.id
          ? { ...item, ...formData }
          : item
      );
      onUpdate({ ...classData, news: updatedNews });
      toast.success("Item updated successfully");
    } else {
      const newItem: NewsEvent = {
        id: Date.now().toString(),
        ...formData,
      };
      onUpdate({ ...classData, news: [...classData.news, newItem] });
      toast.success("Item added successfully");
    }

    setIsDialogOpen(false);
  };

  const sortedNews = [...classData.news].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl text-gray-900">News & Events</h2>
          <p className="text-sm text-gray-500">Manage class news and upcoming events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add"} News/Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "news" | "event") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

      <div className="space-y-4">
        {sortedNews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No news or events yet. Click "Add New" to create one.
            </CardContent>
          </Card>
        ) : (
          sortedNews.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={item.type === "news" ? "default" : "secondary"}>
                        {item.type === "news" ? (
                          <Newspaper className="w-3 h-3 mr-1" />
                        ) : (
                          <Calendar className="w-3 h-3 mr-1" />
                        )}
                        {item.type}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
