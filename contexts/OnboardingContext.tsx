"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  studentClass: string;
}

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface OnboardingData {
  classes: string[];
  teachers: Teacher[];
  students: Student[];
  admins: Admin[];
}

interface OnboardingContextType {
  data: OnboardingData;
  updateClasses: (classes: string[]) => void;
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
  removeTeacher: (id: string) => void;
  addStudent: (student: Omit<Student, "id">) => void;
  removeStudent: (id: string) => void;
  addAdmin: (admin: Omit<Admin, "id">) => void;
  removeAdmin: (id: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<OnboardingData>({
    classes: [],
    teachers: [],
    students: [],
    admins: [],
  });

  const updateClasses = (classes: string[]) => {
    setData((prev) => ({ ...prev, classes }));
  };

  const addTeacher = (teacher: Omit<Teacher, "id">) => {
    const newTeacher = { ...teacher, id: Date.now().toString() };
    setData((prev) => ({ ...prev, teachers: [...prev.teachers, newTeacher] }));
  };

  const removeTeacher = (id: string) => {
    setData((prev) => ({
      ...prev,
      teachers: prev.teachers.filter((t) => t.id !== id),
    }));
  };

  const addStudent = (student: Omit<Student, "id">) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setData((prev) => ({ ...prev, students: [...prev.students, newStudent] }));
  };

  const removeStudent = (id: string) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
    }));
  };

  const addAdmin = (admin: Omit<Admin, "id">) => {
    const newAdmin = { ...admin, id: Date.now().toString() };
    setData((prev) => ({ ...prev, admins: [...prev.admins, newAdmin] }));
  };

  const removeAdmin = (id: string) => {
    setData((prev) => ({
      ...prev,
      admins: prev.admins.filter((a) => a.id !== id),
    }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateClasses,
        addTeacher,
        removeTeacher,
        addStudent,
        removeStudent,
        addAdmin,
        removeAdmin,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
