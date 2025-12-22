export interface MockBookChapter {
  id: string;
  materialId: string;
  title: string;
  description: string | null;
  pageStart: number | null;
  pageEnd: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockBookDetail {
  id: string;
  platformId: string;
  uploadedById: string;
  title: string;
  description: string | null;
  author: string | null;
  isbn: string | null;
  publisher: string | null;
  materialType: string;
  url: string;
  s3Key: string;
  pageCount: number | null;
  thumbnailUrl: string | null;
  thumbnailS3Key: string | null;
  isAvailable: boolean;
  classId: string | null;
  subjectId: string | null;
  isAiEnabled: boolean;
  status: string;
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  chapters: MockBookChapter[];
}

// Mock data for general books with chapters
export const mockGeneralBooks: Record<string, MockBookDetail> = {
  "material_123": {
    id: "material_123",
    platformId: "platform_123",
    uploadedById: "user_123",
    title: "Advanced Algebra for Senior Secondary Schools",
    description: "A comprehensive guide to advanced algebra concepts covering quadratic equations, polynomials, and complex numbers.",
    author: "John Doe",
    isbn: "978-3-16-148410-0",
    publisher: "Smart Edu Publishing",
    materialType: "PDF",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    s3Key: "library/general-materials/platforms/platform_123/material_123.pdf",
    pageCount: 450,
    thumbnailUrl: null,
    thumbnailS3Key: null,
    isAvailable: true,
    classId: "class_123",
    subjectId: "subject_123",
    isAiEnabled: true,
    status: "published",
    views: 1500,
    downloads: 800,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z",
    chapters: [
      {
        id: "chapter_1",
        materialId: "material_123",
        title: "Chapter 1: Introduction to Algebra",
        description: "This chapter introduces basic algebraic concepts and fundamental operations.",
        pageStart: 1,
        pageEnd: 45,
        order: 1,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: "chapter_2",
        materialId: "material_123",
        title: "Chapter 2: Linear Equations",
        description: "Understanding linear equations, their solutions, and applications.",
        pageStart: 46,
        pageEnd: 90,
        order: 2,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: "chapter_3",
        materialId: "material_123",
        title: "Chapter 3: Quadratic Equations",
        description: "Solving quadratic equations using various methods including factoring, completing the square, and the quadratic formula.",
        pageStart: 91,
        pageEnd: 150,
        order: 3,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: "chapter_4",
        materialId: "material_123",
        title: "Chapter 4: Polynomials",
        description: "Working with polynomials, their operations, and factorization techniques.",
        pageStart: 151,
        pageEnd: 220,
        order: 4,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: "chapter_5",
        materialId: "material_123",
        title: "Chapter 5: Complex Numbers",
        description: "Introduction to complex numbers, their arithmetic, and geometric representation.",
        pageStart: 221,
        pageEnd: 280,
        order: 5,
        createdAt: "2025-01-01T00:00:00.000Z",
        updatedAt: "2025-01-01T00:00:00.000Z",
      },
    ],
  },
  "material_456": {
    id: "material_456",
    platformId: "platform_123",
    uploadedById: "user_456",
    title: "Introduction to Physics",
    description: "Basic physics concepts for beginners covering mechanics, thermodynamics, and waves.",
    author: "Jane Smith",
    isbn: "978-3-16-148411-1",
    publisher: "Science Publishers",
    materialType: "PDF",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    s3Key: "library/general-materials/platforms/platform_123/material_456.pdf",
    pageCount: 320,
    thumbnailUrl: null,
    thumbnailS3Key: null,
    isAvailable: true,
    classId: null,
    subjectId: null,
    isAiEnabled: true,
    status: "published",
    views: 3000,
    downloads: 2500,
    createdAt: "2025-01-02T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z",
    chapters: [
      {
        id: "chapter_6",
        materialId: "material_456",
        title: "Chapter 1: Motion and Forces",
        description: "Understanding motion, velocity, acceleration, and Newton's laws of motion.",
        pageStart: 1,
        pageEnd: 60,
        order: 1,
        createdAt: "2025-01-02T00:00:00.000Z",
        updatedAt: "2025-01-02T00:00:00.000Z",
      },
      {
        id: "chapter_7",
        materialId: "material_456",
        title: "Chapter 2: Energy and Work",
        description: "Concepts of energy, work, power, and conservation of energy.",
        pageStart: 61,
        pageEnd: 120,
        order: 2,
        createdAt: "2025-01-02T00:00:00.000Z",
        updatedAt: "2025-01-02T00:00:00.000Z",
      },
      {
        id: "chapter_8",
        materialId: "material_456",
        title: "Chapter 3: Thermodynamics",
        description: "Heat, temperature, and the laws of thermodynamics.",
        pageStart: 121,
        pageEnd: 200,
        order: 3,
        createdAt: "2025-01-02T00:00:00.000Z",
        updatedAt: "2025-01-02T00:00:00.000Z",
      },
      {
        id: "chapter_9",
        materialId: "material_456",
        title: "Chapter 4: Waves and Oscillations",
        description: "Understanding wave motion, sound waves, and electromagnetic waves.",
        pageStart: 201,
        pageEnd: 280,
        order: 4,
        createdAt: "2025-01-02T00:00:00.000Z",
        updatedAt: "2025-01-02T00:00:00.000Z",
      },
    ],
  },
};

// Helper function to get mock book by ID
export function getMockBookById(bookId: string): MockBookDetail | null {
  return mockGeneralBooks[bookId] || null;
}

