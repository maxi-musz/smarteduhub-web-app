import { useQuery } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on the backend API response
export interface StudentDashboardResponse {
  success: boolean;
  message: string;
  data: StudentDashboardData;
}

export interface StudentDashboardData {
  general_info: {
    current_session: {
      academic_year: string;
      term: string;
      start_date: string;
      end_date: string;
    };
    student_class: {
      id: string;
      name: string;
    };
    class_teacher: {
      id: string;
      name: string;
      display_picture: string | null;
    };
    student: {
      id: string;
      name: string;
      email: string;
      display_picture: string | null;
    };
    current_date: string;
    current_time: string;
  };
  stats: {
    total_subjects: number;
    pending_assessments: number;
  };
  subjects_enrolled: SubjectEnrolled[];
  class_schedule: {
    today: DaySchedule;
    tomorrow: DaySchedule;
    day_after_tomorrow: DaySchedule;
  };
  notifications: Notification[];
}

export interface SubjectEnrolled {
  id: string;
  name: string;
  code: string;
  color: string;
  teacher: {
    id: string;
    name: string;
    display_picture: string | null;
  };
}

export interface DaySchedule {
  day: string;
  schedule: ScheduleEntry[];
}

export interface ScheduleEntry {
  subject: {
    id: string;
    name: string;
    code: string;
    color: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  time: {
    from: string;
    to: string;
    label: string;
  };
  room: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  comingUpOn: string;
  createdAt: string;
}

/**
 * Fetch student dashboard data
 */
const fetchStudentDashboard = async (): Promise<StudentDashboardData> => {
  logger.info("[use-student-dashboard] Fetching student dashboard");
  
  try {
    const response = await authenticatedApi.get<StudentDashboardData>(
      "/students/dashboard"
    );

    logger.info("[use-student-dashboard] Dashboard fetched successfully", response);
    
    // authenticatedApi already returns the parsed JSON response
    // Check if response has the expected structure
    if (response && typeof response === 'object' && 'data' in response && response.success && response.data) {
      return response.data;
    }
    
    // If response is already the data object (in case backend returns it directly)
    if (response && typeof response === 'object' && 'general_info' in response) {
      return response as unknown as StudentDashboardData;
    }
    
    logger.error("[use-student-dashboard] Unexpected response structure:", { response });
    throw new Error("Unexpected response structure from dashboard API");
  } catch (error) {
    logger.error("[use-student-dashboard] Error fetching dashboard:", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }
};

/**
 * Hook to fetch student dashboard data
 */
export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ["student", "dashboard"],
    queryFn: fetchStudentDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 1, // Only retry once
  });
};

