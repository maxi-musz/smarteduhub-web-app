export interface Textbook {
  id: string;
  title: string;
  publisher: string;
  coverImage: string;
  isbn?: string;
  grade?: string;
  subject?: string;
  syllabus?: string;
  hasIBookGPT: boolean;
  isAccessible: boolean;
  badgeNumber?: number;
}

export const mockTextbooks: Textbook[] = [
  {
    id: "1",
    title: "Progress In Mathematics - SS1",
    publisher: "ACCESSIBLE PUBLISHERS LTD",
    coverImage: "https://via.placeholder.com/200x280/4A90E2/FFFFFF?text=Math+SS1",
    isbn: "978-1234567890",
    grade: "SS1",
    subject: "Mathematics",
    syllabus: "Nigerian",
    hasIBookGPT: true,
    isAccessible: true,
    badgeNumber: 1,
  },
  {
    id: "2",
    title: "Progress In Chemistry Book 2",
    publisher: "ACCESSIBLE PUBLISHERS LTD",
    coverImage: "https://via.placeholder.com/200x280/50C878/FFFFFF?text=Chemistry+2",
    isbn: "978-1234567891",
    grade: "SS2",
    subject: "Chemistry",
    syllabus: "Nigerian",
    hasIBookGPT: true,
    isAccessible: true,
    badgeNumber: 2,
  },
  {
    id: "3",
    title: "Progress In Physics - SS1",
    publisher: "ACCESSIBLE PUBLISHERS LTD",
    coverImage: "https://via.placeholder.com/200x280/FF6B6B/FFFFFF?text=Physics+SS1",
    isbn: "978-1234567892",
    grade: "SS1",
    subject: "Physics",
    syllabus: "Nigerian",
    hasIBookGPT: true,
    isAccessible: true,
    badgeNumber: 3,
  },
  {
    id: "4",
    title: "Progress In Biology Book 1",
    publisher: "ACCESSIBLE PUBLISHERS LTD",
    coverImage: "https://via.placeholder.com/200x280/9B59B6/FFFFFF?text=Biology+1",
    isbn: "978-1234567893",
    grade: "SS1",
    subject: "Biology",
    syllabus: "Nigerian",
    hasIBookGPT: true,
    isAccessible: true,
  },
  {
    id: "5",
    title: "Progress In English Language - SS2",
    publisher: "ACCESSIBLE PUBLISHERS LTD",
    coverImage: "https://via.placeholder.com/200x280/3498DB/FFFFFF?text=English+SS2",
    isbn: "978-1234567894",
    grade: "SS2",
    subject: "English",
    syllabus: "Nigerian",
    hasIBookGPT: true,
    isAccessible: true,
  },
  {
    id: "6",
    title: "Progress In Literature - SS1",
    publisher: "ACCESSIBLE PUBLISHERS LTD",
    coverImage: "https://via.placeholder.com/200x280/E74C3C/FFFFFF?text=Literature+SS1",
    isbn: "978-1234567895",
    grade: "SS1",
    subject: "Literature",
    syllabus: "Nigerian",
    hasIBookGPT: true,
    isAccessible: true,
  },
  {
    id: "7",
    title: "Progress In Geography - SS2",
    publisher: "ACCESSIBLE PUBLISHERS LTD",
    coverImage: "https://via.placeholder.com/200x280/16A085/FFFFFF?text=Geography+SS2",
    isbn: "978-1234567896",
    grade: "SS2",
    subject: "Geography",
    syllabus: "Nigerian",
    hasIBookGPT: true,
    isAccessible: true,
  },
  {
    id: "8",
    title: "Progress In Economics - SS1",
    publisher: "ACCESSIBLE PUBLISHERS LTD",
    coverImage: "https://via.placeholder.com/200x280/F39C12/FFFFFF?text=Economics+SS1",
    isbn: "978-1234567897",
    grade: "SS1",
    subject: "Economics",
    syllabus: "Nigerian",
    hasIBookGPT: true,
    isAccessible: true,
  },
];
