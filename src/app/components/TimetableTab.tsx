import { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { ClassData, TimetableEntry } from "../types";

interface TimetableTabProps {
  classData: ClassData;
  onUpdate: (data: ClassData) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetableTab({ classData, onUpdate }: TimetableTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState({
    day: "Monday",
    time: "",
    subject: "",
    teacher: "",
    room: "",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ day: "Monday", time: "", subject: "", teacher: "", room: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: TimetableEntry) => {
    setEditingItem(item);
    setFormData({
      day: item.day,
      time: item.time,
      subject: item.subject,
      teacher: item.teacher,
      room: item.room,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedTimetable = classData.timetable.filter((item) => item.id !== id);
    onUpdate({ ...classData, timetable: updatedTimetable });
    toast.success("Timetable entry deleted");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.day || !formData.time || !formData.subject || !formData.teacher || !formData.room) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingItem) {
      const updatedTimetable = classData.timetable.map((item) =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      onUpdate({ ...classData, timetable: updatedTimetable });
      toast.success("Timetable entry updated");
    } else {
      const newEntry: TimetableEntry = {
        id: Date.now().toString(),
        ...formData,
      };
      onUpdate({ ...classData, timetable: [...classData.timetable, newEntry] });
      toast.success("Timetable entry added");
    }

    setIsDialogOpen(false);
  };

  const getTimetableByDay = () => {
    const byDay: Record<string, TimetableEntry[]> = {};
    DAYS.forEach((day) => {
      byDay[day] = classData.timetable
        .filter((entry) => entry.day === day)
        .sort((a, b) => a.time.localeCompare(b.time));
    });
    return byDay;
  };

  const timetableByDay = getTimetableByDay();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl text-gray-900">Class Timetable</h2>
          <p className="text-sm text-gray-500">Manage weekly schedule</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add"} Timetable Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="day">Day</Label>
                <Select
                  value={formData.day}
                  onValueChange={(value) => setFormData({ ...formData, day: value })}
                >
                  <SelectTrigger id="day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g., 08:00 - 09:00"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter subject name"
                />
              </div>
              <div>
                <Label htmlFor="teacher">Teacher</Label>
                <Input
                  id="teacher"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  placeholder="Enter teacher name"
                />
              </div>
              <div>
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Enter room number"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {DAYS.map((day) => (
          <div key={day}>
            <h3 className="mb-3 px-1 text-gray-900">{day}</h3>
            <div className="space-y-3">
              {timetableByDay[day].length === 0 ? (
                <Card className="bg-gray-50">
                  <CardContent className="py-8 text-center text-sm text-gray-400">
                    No classes
                  </CardContent>
                </Card>
              ) : (
                timetableByDay[day].map((entry) => (
                  <Card key={entry.id} className="relative group">
                    <CardContent className="pt-4 pb-3">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{entry.time}</div>
                      <div className="text-sm mb-1">{entry.subject}</div>
                      <div className="text-xs text-gray-600">{entry.teacher}</div>
                      <div className="text-xs text-gray-500">{entry.room}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
