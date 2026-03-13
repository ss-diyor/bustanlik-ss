import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Calendar, Newspaper, Clock, Phone, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { ClassData } from "../types";
import { loadData, saveData } from "../utils/storage";
import NewsEventsTab from "../components/NewsEventsTab";
import TimetableTab from "../components/TimetableTab";
import ContactsTab from "../components/ContactsTab";
import LinksTab from "../components/LinksTab";

export default function ClassView() {
  const { classId } = useParams<{ classId: string }>();
  const [classData, setClassData] = useState<ClassData | null>(null);

  useEffect(() => {
    const allData = loadData();
    const found = allData.find((c) => c.id === classId);
    setClassData(found || null);
  }, [classId]);

  const updateClassData = (updatedData: ClassData) => {
    const allData = loadData();
    const index = allData.findIndex((c) => c.id === classId);
    if (index !== -1) {
      allData[index] = updatedData;
      saveData(allData);
      setClassData(updatedData);
    }
  };

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Class not found</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl text-gray-900">{classData.name}</h1>
              <p className="text-sm text-gray-500">Mentor: {classData.mentor}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              <span className="hidden sm:inline">News</span>
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Timetable</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Links</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-6">
            <NewsEventsTab classData={classData} onUpdate={updateClassData} />
          </TabsContent>

          <TabsContent value="timetable" className="mt-6">
            <TimetableTab classData={classData} onUpdate={updateClassData} />
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <ContactsTab classData={classData} onUpdate={updateClassData} />
          </TabsContent>

          <TabsContent value="links" className="mt-6">
            <LinksTab classData={classData} onUpdate={updateClassData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}