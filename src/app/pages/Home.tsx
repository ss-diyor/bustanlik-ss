import { Link } from "react-router";
import { GraduationCap, Calendar, Newspaper, Plus, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { loadData } from "../utils/storage";
import { useState } from "react";
import ClassManagementDialog from "../components/ClassManagementDialog";

export default function Home() {
  const [classes, setClasses] = useState(loadData());
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

  const handleDataUpdate = () => {
    setClasses(loadData());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl mb-2 text-gray-900">School Hub</h1>
          <p className="text-gray-600">News, Events & Timetables for Every Class</p>
        </div>

        <div className="max-w-6xl mx-auto mb-6 flex justify-end">
          <Button onClick={() => setIsManageDialogOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Manage Classes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {classes.map((classData) => (
            <Link key={classData.id} to={`/class/${classData.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-2 hover:border-indigo-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    {classData.name}
                  </CardTitle>
                  <CardDescription>Mentor: {classData.mentor}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Newspaper className="w-4 h-4" />
                      <span>{classData.news.length} News & Events</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{classData.timetable.length} Timetable Entries</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <ClassManagementDialog
          open={isManageDialogOpen}
          onOpenChange={setIsManageDialogOpen}
          onUpdate={handleDataUpdate}
        />
      </div>
    </div>
  );
}