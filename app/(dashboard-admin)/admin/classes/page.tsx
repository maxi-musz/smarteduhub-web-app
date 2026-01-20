"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Plus, Pencil, Loader2 } from "lucide-react";
import {
  useDirectorClasses,
  useCreateDirectorClass,
  useEditDirectorClass,
  type DirectorClass,
} from "@/hooks/use-director-classes";

const AdminClassesPage = () => {
  const { data, isLoading, error } = useDirectorClasses();
  const createClassMutation = useCreateDirectorClass();
  const editClassMutation = useEditDirectorClass();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<DirectorClass | null>(null);
  const [name, setName] = useState("");
  const [classTeacherId, setClassTeacherId] = useState<string | undefined>();

  const classes = data?.classes ?? [];
  const teachers = data?.teachers ?? [];

  const handleOpenCreate = () => {
    setEditingClass(null);
    setName("");
    setClassTeacherId(undefined);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (cls: DirectorClass) => {
    setEditingClass(cls);
    setName(cls.name);
    setClassTeacherId(cls.classTeacher?.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }

    if (editingClass) {
      editClassMutation.mutate(
        {
          classId: editingClass.id,
          name: name.trim(),
          classTeacherId,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
          },
        }
      );
      return;
    }

    createClassMutation.mutate(
      {
        name: name.trim(),
        classTeacherId,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      }
    );
  };

  const isSubmitting =
    createClassMutation.isPending || editClassMutation.isPending;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Classes
        </h2>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {error && (
        <Card>
          <CardContent className="p-4">
            <p className="text-red-600">
              Failed to load classes. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Users className="h-5 w-5 text-brand-primary" />
            Class List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-brand-light-accent-1">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Loading classes...
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-12 text-brand-light-accent-1">
              No classes have been created yet.
            </div>
          ) : (
            <div className="space-y-2">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-3 rounded-md border border-brand-border bg-white"
                >
                  <div>
                    <p className="font-medium capitalize">{cls.name}</p>
                    <p className="text-xs text-brand-light-accent-1">
                      {cls.classTeacher
                        ? `Class teacher: ${cls.classTeacher.first_name} ${cls.classTeacher.last_name}`
                        : "No class teacher assigned"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(cls)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClass ? "Edit Class" : "Add Class"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="class-name"
                className="text-sm font-medium text-gray-700"
              >
                Class Name
              </label>
              <Input
                id="class-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. JSS 1A"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Class Teacher (optional)
              </label>
              <Select
                value={classTeacherId ?? "none"}
                onValueChange={(value) => {
                  if (value === "none") {
                    setClassTeacherId(undefined);
                  } else {
                    setClassTeacherId(value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No class teacher</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || !name}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingClass ? "Save Changes" : "Create Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClassesPage;


