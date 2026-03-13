import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { loadData, saveData } from "../utils/storage";
import { ClassData } from "../types";

interface ClassManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export default function ClassManagementDialog({
  open,
  onOpenChange,
  onUpdate,
}: ClassManagementDialogProps) {
  const [classes, setClasses] = useState(loadData());
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mentor: "",
  });

  const handleAdd = () => {
    setEditingClass(null);
    setFormData({ name: "", mentor: "" });
    setShowForm(true);
  };

  const handleEdit = (classData: ClassData) => {
    setEditingClass(classData);
    setFormData({ name: classData.name, mentor: classData.mentor });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const allData = loadData();
    const updatedData = allData.filter((c) => c.id !== id);
    saveData(updatedData);
    setClasses(updatedData);
    onUpdate();
    toast.success("Class deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.mentor.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const allData = loadData();

    if (editingClass) {
      const updatedData = allData.map((c) =>
        c.id === editingClass.id ? { ...c, name: formData.name, mentor: formData.mentor } : c
      );
      saveData(updatedData);
      setClasses(updatedData);
      toast.success("Class updated successfully");
    } else {
      const newClass: ClassData = {
        id: `class-${Date.now()}`,
        name: formData.name,
        mentor: formData.mentor,
        news: [],
        timetable: [],
        contacts: [],
        links: [],
      };
      const updatedData = [...allData, newClass];
      saveData(updatedData);
      setClasses(updatedData);
      toast.success("Class added successfully");
    }

    setShowForm(false);
    onUpdate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Classes</DialogTitle>
        </DialogHeader>

        {!showForm ? (
          <div>
            <div className="mb-4">
              <Button onClick={handleAdd} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Class
              </Button>
            </div>

            <div className="space-y-3">
              {classes.map((classData) => (
                <Card key={classData.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900 mb-1">{classData.name}</div>
                        <div className="text-sm text-gray-500">Mentor: {classData.mentor}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(classData)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(classData.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Class 5A, Class 11B"
              />
            </div>
            <div>
              <Label htmlFor="mentor">Class Mentor</Label>
              <Input
                id="mentor"
                value={formData.mentor}
                onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                placeholder="e.g., Mr. John Smith"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Back
              </Button>
              <Button type="submit">{editingClass ? "Update" : "Add"} Class</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
