import { useState } from "react";
import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { ClassData, Contact } from "../types";

interface ContactsTabProps {
  classData: ClassData;
  onUpdate: (data: ClassData) => void;
}

export default function ContactsTab({ classData, onUpdate }: ContactsTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ name: "", role: "", phone: "", email: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Contact) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      role: item.role,
      phone: item.phone,
      email: item.email,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updatedContacts = classData.contacts.filter((item) => item.id !== id);
    onUpdate({ ...classData, contacts: updatedContacts });
    toast.success("Contact deleted successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.phone || !formData.email) {
      toast.error("Please fill in all fields");
      return;
    }

    if (editingItem) {
      const updatedContacts = classData.contacts.map((item) =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      onUpdate({ ...classData, contacts: updatedContacts });
      toast.success("Contact updated successfully");
    } else {
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
      };
      onUpdate({ ...classData, contacts: [...classData.contacts, newContact] });
      toast.success("Contact added successfully");
    }

    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl text-gray-900">Contacts</h2>
          <p className="text-sm text-gray-500">Important contacts for the class</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit" : "Add"} Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Class Mentor, Parent Representative"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., (555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@school.edu"
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
        {classData.contacts.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-gray-500">
              No contacts yet. Click "Add Contact" to create one.
            </CardContent>
          </Card>
        ) : (
          classData.contacts.map((contact) => (
            <Card key={contact.id} className="relative group">
              <CardContent className="pt-4">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(contact)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="pr-16">
                  <h3 className="text-gray-900 mb-1">{contact.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{contact.role}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${contact.phone}`} className="hover:text-indigo-600">
                        {contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${contact.email}`} className="hover:text-indigo-600">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
