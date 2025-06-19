// "use client";

// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Calendar, Clock, Plus, Search, Trash2, Users } from "lucide-react";
// import TimetableGrid from "@/components/teacher/schedules/TimetableGrid";

// interface Schedule {
//   id: string;
//   courseName: string;
//   courseCode: string;
//   instructor: string;
//   day: string;
//   startTime: string;
//   endTime: string;
//   room: string;
//   capacity: number;
//   enrolled: number;
// }

// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
// const timeSlots = [
//   "08:00",
//   "09:00",
//   "10:00",
//   "11:00",
//   "12:00",
//   "13:00",
//   "14:00",
//   "15:00",
//   "16:00",
//   "17:00",
// ];

// const AdminSchedules = () => {
//   const [schedules, setSchedules] = useState<Schedule[]>([
//     {
//       id: "1",
//       courseName: "Mathematics",
//       courseCode: "MTH101",
//       instructor: "Dr. Smith",
//       day: "Monday",
//       startTime: "09:00",
//       endTime: "10:30",
//       room: "Room 101",
//       capacity: 40,
//       enrolled: 35,
//     },
//     {
//       id: "2",
//       courseName: "English Language",
//       courseCode: "ENG101",
//       instructor: "Mrs. Johnson",
//       day: "Tuesday",
//       startTime: "11:00",
//       endTime: "12:30",
//       room: "Room 202",
//       capacity: 45,
//       enrolled: 40,
//     },
//     {
//       id: "3",
//       courseName: "Physics",
//       courseCode: "PHY101",
//       instructor: "Dr. Brown",
//       day: "Wednesday",
//       startTime: "14:00",
//       endTime: "15:30",
//       room: "Lab 301",
//       capacity: 35,
//       enrolled: 30,
//     },
//   ]);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedDay, setSelectedDay] = useState<string>("all");
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [newSchedule, setNewSchedule] = useState<Partial<Schedule>>({
//     courseName: "",
//     courseCode: "",
//     instructor: "",
//     day: "",
//     startTime: "",
//     endTime: "",
//     room: "",
//     capacity: 40,
//     enrolled: 0,
//   });

//   const handleAddSchedule = () => {
//     if (
//       !newSchedule.courseName ||
//       !newSchedule.courseCode ||
//       !newSchedule.day ||
//       !newSchedule.startTime ||
//       !newSchedule.endTime
//     ) {
//       alert("Please fill in all required fields");
//       return;
//     }

//     const schedule: Schedule = {
//       ...(newSchedule as Schedule),
//       id: Date.now().toString(),
//     };
//     setSchedules([...schedules, schedule]);
//     setIsAddModalOpen(false);
//     setNewSchedule({
//       courseName: "",
//       courseCode: "",
//       instructor: "",
//       day: "",
//       startTime: "",
//       endTime: "",
//       room: "",
//       capacity: 40,
//       enrolled: 0,
//     });
//   };

//   const handleDeleteSchedule = (id: string) => {
//     setSchedules(schedules.filter((schedule) => schedule.id !== id));
//   };

//   // Filter schedules based on search query and day filter
//   const filteredSchedules = schedules.filter((schedule) => {
//     const matchesSearch =
//       schedule.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       schedule.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       schedule.instructor.toLowerCase().includes(searchQuery.toLowerCase());

//     const matchesDay = selectedDay === "all" || schedule.day === selectedDay;

//     return matchesSearch && matchesDay;
//   });

//   return (
//     <div className="py-6 space-y-6 bg-brand-bg">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold">Schedule Management</h2>
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//             <Input
//               placeholder="Search schedules..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 w-64"
//             />
//           </div>
//           <Select value={selectedDay} onValueChange={setSelectedDay}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Filter by day" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Days</SelectItem>
//               {days.map((day) => (
//                 <SelectItem key={day} value={day}>
//                   {day}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add Schedule
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[600px]">
//               <DialogHeader>
//                 <DialogTitle>Add New Schedule</DialogTitle>
//                 <DialogDescription>
//                   Fill in the schedule information below
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid gap-4 py-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="courseName">Course Name*</Label>
//                     <Input
//                       id="courseName"
//                       value={newSchedule.courseName}
//                       onChange={(e) =>
//                         setNewSchedule({
//                           ...newSchedule,
//                           courseName: e.target.value,
//                         })
//                       }
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="courseCode">Course Code*</Label>
//                     <Input
//                       id="courseCode"
//                       value={newSchedule.courseCode}
//                       onChange={(e) =>
//                         setNewSchedule({
//                           ...newSchedule,
//                           courseCode: e.target.value,
//                         })
//                       }
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="instructor">Instructor</Label>
//                     <Input
//                       id="instructor"
//                       value={newSchedule.instructor}
//                       onChange={(e) =>
//                         setNewSchedule({
//                           ...newSchedule,
//                           instructor: e.target.value,
//                         })
//                       }
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label>Day*</Label>
//                     <Select
//                       value={newSchedule.day}
//                       onValueChange={(value) =>
//                         setNewSchedule({ ...newSchedule, day: value })
//                       }
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select day" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {days.map((day) => (
//                           <SelectItem key={day} value={day}>
//                             {day}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label>Start Time*</Label>
//                     <Select
//                       value={newSchedule.startTime}
//                       onValueChange={(value) =>
//                         setNewSchedule({ ...newSchedule, startTime: value })
//                       }
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select start time" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {timeSlots.map((time) => (
//                           <SelectItem key={time} value={time}>
//                             {time}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label>End Time*</Label>
//                     <Select
//                       value={newSchedule.endTime}
//                       onValueChange={(value) =>
//                         setNewSchedule({ ...newSchedule, endTime: value })
//                       }
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select end time" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {timeSlots.map((time) => (
//                           <SelectItem key={time} value={time}>
//                             {time}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="room">Room</Label>
//                     <Input
//                       id="room"
//                       value={newSchedule.room}
//                       onChange={(e) =>
//                         setNewSchedule({ ...newSchedule, room: e.target.value })
//                       }
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="capacity">Capacity</Label>
//                     <Input
//                       id="capacity"
//                       type="number"
//                       value={newSchedule.capacity}
//                       onChange={(e) =>
//                         setNewSchedule({
//                           ...newSchedule,
//                           capacity: parseInt(e.target.value),
//                         })
//                       }
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button onClick={handleAddSchedule}>Add Schedule</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="pt-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-500">Total Classes</p>
//                 <h3 className="text-2xl font-bold">{schedules.length}</h3>
//               </div>
//               <Calendar className="h-8 w-8 text-gray-400" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-500">Total Hours</p>
//                 <h3 className="text-2xl font-bold text-blue-600">
//                   {schedules.reduce((total, schedule) => {
//                     const start = parseInt(schedule.startTime.split(":")[0]);
//                     const end = parseInt(schedule.endTime.split(":")[0]);
//                     return total + (end - start);
//                   }, 0)}
//                 </h3>
//               </div>
//               <Clock className="h-8 w-8 text-blue-400" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="pt-4">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm text-gray-500">Total Students</p>
//                 <h3 className="text-2xl font-bold text-green-600">
//                   {schedules.reduce(
//                     (sum, schedule) => sum + schedule.enrolled,
//                     0
//                   )}
//                 </h3>
//               </div>
//               <Users className="h-8 w-8 text-green-400" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Schedule Table */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Course</TableHead>
//                 <TableHead>Instructor</TableHead>
//                 <TableHead>Day & Time</TableHead>
//                 <TableHead>Room</TableHead>
//                 <TableHead>Enrollment</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredSchedules.map((schedule) => (
//                 <TableRow key={schedule.id}>
//                   <TableCell>
//                     <div>
//                       <div className="font-medium">{schedule.courseName}</div>
//                       <div className="text-sm text-gray-500">
//                         {schedule.courseCode}
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>{schedule.instructor}</TableCell>
//                   <TableCell>
//                     <div>
//                       <Badge variant="outline">{schedule.day}</Badge>
//                       <div className="text-sm mt-1">
//                         {schedule.startTime} - {schedule.endTime}
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>{schedule.room}</TableCell>
//                   <TableCell>
//                     <div className="space-y-1">
//                       <div className="text-sm">
//                         {schedule.enrolled} / {schedule.capacity}
//                       </div>
//                       <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div
//                           className="bg-blue-600 h-2 rounded-full"
//                           style={{
//                             width: `${
//                               (schedule.enrolled / schedule.capacity) * 100
//                             }%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <Button
//                       variant="destructive"
//                       size="icon"
//                       onClick={() => handleDeleteSchedule(schedule.id)}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminSchedules;

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Edit3 } from "lucide-react";
import TimetableGrid from "@/components/teacher/schedules/TimetableGrid";
import AddPeriodDialog from "@/components/teacher/schedules/AddPeriodDialog";

// Define a type for a period
type Period = {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
};

const classes = [
  { id: "jss1", name: "JSS1" },
  { id: "jss2", name: "JSS2" },
  { id: "jss3", name: "JSS3" },
  { id: "ss1", name: "SS1" },
  { id: "ss2", name: "SS2" },
  { id: "ss3", name: "SS3" },
];

const subjects = [
  { id: "math", name: "Mathematics", color: "#3B82F6" },
  { id: "english", name: "English Language", color: "#10B981" },
  { id: "physics", name: "Physics", color: "#8B5CF6" },
  { id: "chemistry", name: "Chemistry", color: "#F59E0B" },
  { id: "biology", name: "Biology", color: "#EF4444" },
  { id: "history", name: "History", color: "#6B7280" },
];

const teachers = [
  { id: "teacher1", name: "Mr. Johnson" },
  { id: "teacher2", name: "Mrs. Smith" },
  { id: "teacher3", name: "Dr. Williams" },
  { id: "teacher4", name: "Ms. Brown" },
];

// Mock timetable data
const mockTimetableData: Period[] = [
  {
    id: "1",
    classId: "jss1",
    day: "Monday",
    timeSlot: "08:00-09:00",
    subjectId: "math",
    teacherId: "teacher1",
  },
  {
    id: "2",
    classId: "jss1",
    day: "Monday",
    timeSlot: "09:00-10:00",
    subjectId: "english",
    teacherId: "teacher2",
  },
  {
    id: "3",
    classId: "jss1",
    day: "Tuesday",
    timeSlot: "08:00-09:00",
    subjectId: "physics",
    teacherId: "teacher3",
  },
];

const TeacherSchedulesPage = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  const handleAddPeriod = (periodData: Period) => {
    console.log("Adding period:", periodData);
    // Here you would make an API call to save the period
    setIsAddDialogOpen(false);
  };

  const handleEditPeriod = (period: Period) => {
    setEditingPeriod(period);
    setIsAddDialogOpen(true);
  };

  const selectedClassData = classes.find((c) => c.id === selectedClass);
  const classSchedule = mockTimetableData.filter(
    (item) => item.classId === selectedClass
  );

  return (
    <div className="min-h-screen py-6 space-y-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">
              Class Schedules
            </h1>
            <p className="text-brand-light-accent-1 mt-1">
              Manage and view class timetables
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            disabled={!selectedClass}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </Button>
        </div>

        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Select Class
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a class..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClassData && (
                <div className="text-sm text-muted-foreground">
                  Viewing timetable for{" "}
                  <strong>{selectedClassData.name}</strong>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        {selectedClass && (
          <Card>
            <CardHeader>
              <CardTitle>
                Weekly Timetable - {selectedClassData?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableGrid
                periods={classSchedule}
                subjects={subjects}
                teachers={teachers}
                onEdit={handleEditPeriod}
              />
            </CardContent>
          </Card>
        )}

        {!selectedClass && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a class to view its timetable</p>
                <p className="text-sm">
                  Choose from the dropdown above to get started
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Period Dialog */}
        <AddPeriodDialog
          isOpen={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingPeriod(null);
          }}
          onSubmit={handleAddPeriod}
          subjects={subjects}
          teachers={teachers}
          editingPeriod={editingPeriod ?? undefined}
          selectedClass={selectedClass}
        />
      </div>
    </div>
  );
};

export default TeacherSchedulesPage;
