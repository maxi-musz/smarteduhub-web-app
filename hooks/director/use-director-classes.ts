import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { useToast } from "@/hooks/use-toast";

// Types based on classes.md
export interface DirectorClassTeacher {
  id: string;
  first_name: string;
  last_name: string;
  display_picture: unknown | null;
}

export interface DirectorClass {
  id: string;
  name: string;
  classTeacher: DirectorClassTeacher | null;
}

export interface DirectorTeacher {
  id: string;
  first_name: string;
  last_name: string;
  display_picture: unknown | null;
  email: string;
  phone_number: string;
}

export interface DirectorClassesData {
  classes: DirectorClass[];
  teachers: DirectorTeacher[];
}

interface CreateClassRequest {
  name: string;
  classTeacherId?: string;
}

const QUERY_KEY = ["director", "classes"] as const;

const fetchDirectorClasses = async (): Promise<DirectorClassesData> => {
  const response = await authenticatedApi.get<DirectorClassesData>(
    "/director/classes/fetch-all-classes"
  );

  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    "success" in response &&
    response.success &&
    response.data
  ) {
    return response.data;
  }

  if (response && typeof response === "object" && "classes" in response) {
    return response as unknown as DirectorClassesData;
  }

  throw new Error("Unexpected response structure when fetching classes");
};

export const useDirectorClasses = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchDirectorClasses,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDirectorClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: CreateClassRequest) => {
      const response = await authenticatedApi.post<DirectorClass>(
        "/director/classes/create-class",
        payload
      );

      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        "success" in response &&
        response.success &&
        response.data
      ) {
        return response.data;
      }

      throw new Error("Failed to create class");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Class created",
        description: "The class has been created successfully.",
      });
    },
  });
};

export const useEditDirectorClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (params: { classId: string } & CreateClassRequest) => {
      const { classId, ...body } = params;
      const response = await authenticatedApi.patch<DirectorClass>(
        `/director/classes/edit-class/${classId}`,
        body
      );

      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        "success" in response &&
        response.success &&
        response.data
      ) {
        return response.data;
      }

      throw new Error("Failed to update class");
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast({
        title: "Class updated",
        description: "The class has been updated successfully.",
      });
    },
  });
};


