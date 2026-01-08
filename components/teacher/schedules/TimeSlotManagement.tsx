"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Clock, Loader2 } from "lucide-react";
import {
  useTimeSlots,
  useCreateTimeSlot,
  useUpdateTimeSlot,
  useDeleteTimeSlot,
  type CreateTimeSlotRequest,
  type UpdateTimeSlotRequest,
} from "@/hooks/schedules/use-schedules";
import { useToast } from "@/hooks/use-toast";

const TimeSlotFormDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTimeSlotRequest | UpdateTimeSlotRequest) => void;
  editingSlot?: { id: string; startTime: string; endTime: string; label: string };
  isSubmitting: boolean;
}> = ({ isOpen, onClose, onSubmit, editingSlot, isSubmitting }) => {
  const [formData, setFormData] = useState({
    startTime: editingSlot?.startTime || "",
    endTime: editingSlot?.endTime || "",
    label: editingSlot?.label || "",
  });

  React.useEffect(() => {
    if (editingSlot) {
      setFormData({
        startTime: editingSlot.startTime,
        endTime: editingSlot.endTime,
        label: editingSlot.label,
      });
    } else {
      setFormData({ startTime: "", endTime: "", label: "" });
    }
  }, [editingSlot, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingSlot ? "Edit Time Slot" : "Create New Time Slot"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, label: e.target.value }))
              }
              placeholder="e.g., First Period"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, startTime: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endTime: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingSlot ? "Updating..." : "Creating..."}
                </>
              ) : editingSlot ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TimeSlotManagement: React.FC = () => {
  const { toast } = useToast();
  const { data: timeSlots, isLoading, error } = useTimeSlots();
  const createMutation = useCreateTimeSlot();
  const updateMutation = useUpdateTimeSlot();
  const deleteMutation = useDeleteTimeSlot();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<{
    id: string;
    startTime: string;
    endTime: string;
    label: string;
  } | null>(null);

  const handleCreate = (data: CreateTimeSlotRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Time slot created successfully",
        });
        setIsFormOpen(false);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to create time slot",
          variant: "destructive",
        });
      },
    });
  };

  const handleUpdate = (data: UpdateTimeSlotRequest) => {
    if (!editingSlot) return;
    updateMutation.mutate(
      { id: editingSlot.id, data },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Time slot updated successfully",
          });
          setIsFormOpen(false);
          setEditingSlot(null);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to update time slot",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Time slot deleted successfully",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to delete time slot",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleEdit = (slot: {
    id: string;
    startTime: string;
    endTime: string;
    label: string;
  }) => {
    setEditingSlot(slot);
    setIsFormOpen(true);
  };

  const formatTime = (time: string) => {
    // Convert HH:mm to HH:mm format (already in correct format)
    return time;
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-primary" />
            <CardTitle>Time Slots Management</CardTitle>
          </div>
          <Button onClick={() => setIsFormOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Time Slot
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            {error.message || "Failed to load time slots"}
          </div>
        ) : timeSlots && timeSlots.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Time Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots
                  .sort((a, b) => a.order - b.order)
                  .map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{slot.order}</TableCell>
                      <TableCell className="font-medium">{slot.label}</TableCell>
                      <TableCell>
                        {formatTimeRange(slot.startTime, slot.endTime)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            slot.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {slot.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(slot)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(slot.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-brand-light-accent-1">
            No time slots found. Create your first time slot to get started.
          </div>
        )}
      </CardContent>

      <TimeSlotFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSlot(null);
        }}
        onSubmit={editingSlot ? handleUpdate : handleCreate}
        editingSlot={editingSlot || undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </Card>
  );
};

export default TimeSlotManagement;


