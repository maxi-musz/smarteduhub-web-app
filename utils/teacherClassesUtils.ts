export interface ClassItem {
  id: string;
  subject: string;
  subjectCode: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
}

export interface WeekDay {
  name: string;
  displayName: string;
  isToday: boolean;
  iconColor: string;
}

export function getWeekDays(): WeekDay[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Define weekdays (excluding Sunday)
  const weekdays = [
    { name: "Monday", iconColor: "text-blue-500" },
    { name: "Tuesday", iconColor: "text-cyan-500" },
    { name: "Wednesday", iconColor: "text-green-500" },
    { name: "Thursday", iconColor: "text-yellow-500" },
    { name: "Friday", iconColor: "text-purple-500" },
  ];

  // Create array starting from today
  const orderedDays: WeekDay[] = [];

  // First, add today if it's a weekday
  if (currentDay >= 1 && currentDay <= 5) {
    const todayIndex = currentDay - 1; // Convert to 0-based index
    orderedDays.push({
      ...weekdays[todayIndex],
      displayName: "Today's Classes",
      isToday: true,
    });

    // Add remaining days
    for (let i = 1; i < weekdays.length; i++) {
      const nextDayIndex = (todayIndex + i) % weekdays.length;
      orderedDays.push({
        ...weekdays[nextDayIndex],
        displayName: `${weekdays[nextDayIndex].name}'s Classes`,
        isToday: false,
      });
    }
  } else {
    // If today is weekend, start from Monday
    weekdays.forEach((day) => {
      orderedDays.push({
        ...day,
        displayName: `${day.name}'s Classes`,
        isToday: false,
      });
    });
  }

  return orderedDays;
}

export function getClassesForDay(dayName: string): ClassItem[] {
  const classesData: Record<string, ClassItem[]> = {
    Monday: [
      {
        id: "1",
        subject: "Mathematics",
        subjectCode: "MATH101",
        startTime: "09:00",
        endTime: "10:30",
        room: "Room 201",
        color: "#3b82f6",
      },
      {
        id: "2",
        subject: "Science",
        subjectCode: "SCI102",
        startTime: "11:00",
        endTime: "12:30",
        room: "Lab 102",
        color: "#10b981",
      },
    ],
    Tuesday: [
      {
        id: "3",
        subject: "History",
        subjectCode: "HIS103",
        startTime: "09:00",
        endTime: "10:30",
        room: "Room 305",
        color: "#f59e0b",
      },
      {
        id: "4",
        subject: "English",
        subjectCode: "ENG104",
        startTime: "11:00",
        endTime: "12:30",
        room: "Room 203",
        color: "#ef4444",
      },
    ],
    Wednesday: [
      {
        id: "5",
        subject: "Physics",
        subjectCode: "PHY201",
        startTime: "10:00",
        endTime: "11:30",
        room: "Lab 201",
        color: "#8b5cf6",
      },
      {
        id: "6",
        subject: "Chemistry",
        subjectCode: "CHE202",
        startTime: "14:00",
        endTime: "15:30",
        room: "Lab 203",
        color: "#06b6d4",
      },
    ],
    Thursday: [
      {
        id: "7",
        subject: "Biology",
        subjectCode: "BIO301",
        startTime: "09:30",
        endTime: "11:00",
        room: "Lab 301",
        color: "#84cc16",
      },
      {
        id: "8",
        subject: "Geography",
        subjectCode: "GEO205",
        startTime: "13:00",
        endTime: "14:30",
        room: "Room 405",
        color: "#f97316",
      },
    ],
    Friday: [
      {
        id: "9",
        subject: "Art",
        subjectCode: "ART101",
        startTime: "08:00",
        endTime: "09:30",
        room: "Art Studio",
        color: "#ec4899",
      },
      {
        id: "10",
        subject: "Music",
        subjectCode: "MUS102",
        startTime: "15:00",
        endTime: "16:30",
        room: "Music Room",
        color: "#6366f1",
      },
    ],
  };

  return classesData[dayName] || [];
}
