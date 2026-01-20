"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Check, X } from "lucide-react";
import { DirectorProfile } from "@/hooks/use-director-profile";
import { useDirectorProfileUpdate } from "@/hooks/use-director-profile-update";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DirectorProfile;
}

interface EditableTextFieldProps {
  label: string;
  value: string;
  originalValue: string;
  onSave: (value: string) => Promise<void>;
  inputType?: string;
  required?: boolean;
  isLoading?: boolean;
  renderInput?: (value: string, onChange: (value: string) => void) => React.ReactNode;
}

function EditableTextField({
  label,
  value,
  originalValue,
  onSave,
  inputType = "text",
  required = false,
  isLoading = false,
  renderInput,
}: EditableTextFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const hasChanged = currentValue !== originalValue;

  useEffect(() => {
    setCurrentValue(value);
    setIsEditing(false);
  }, [value]);

  const handleSave = async () => {
    if (!hasChanged) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
    } catch (error) {
      logger.error("Error saving field", { error });
      // Error is handled by the parent
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(originalValue);
    setIsEditing(false);
  };

  const handleChange = (newValue: string) => {
    setCurrentValue(newValue);
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          {renderInput ? (
            renderInput(currentValue, handleChange)
          ) : (
            <Input
              type={inputType}
              value={currentValue}
              onChange={(e) => handleChange(e.target.value)}
              required={required}
              disabled={saving || isLoading}
            />
          )}
        </div>
        {isEditing && hasChanged && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={saving || isLoading}
              className="text-green-600 hover:text-green-700"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={saving || isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

interface EditableSwitchProps {
  label: string;
  description: string;
  value: boolean;
  originalValue: boolean;
  onSave: (value: boolean) => Promise<void>;
  isLoading?: boolean;
}

function EditableSwitch({
  label,
  description,
  value,
  originalValue,
  onSave,
  isLoading = false,
}: EditableSwitchProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const hasChanged = currentValue !== originalValue;

  useEffect(() => {
    setCurrentValue(value);
    setShowActions(false);
  }, [value]);

  const handleChange = (newValue: boolean) => {
    setCurrentValue(newValue);
    setShowActions(true);
  };

  const handleSave = async () => {
    if (!hasChanged) {
      setShowActions(false);
      return;
    }

    setSaving(true);
    try {
      await onSave(currentValue);
      setShowActions(false);
    } catch (error) {
      logger.error("Error saving switch", { error });
      // Error is handled by the parent
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCurrentValue(originalValue);
    setShowActions(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={currentValue}
          onCheckedChange={handleChange}
          disabled={saving || isLoading}
        />
        {showActions && hasChanged && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSave}
              disabled={saving || isLoading}
              className="text-green-600 hover:text-green-700"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={saving || isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  profile,
}: EditProfileModalProps) => {
  const { toast } = useToast();
  const updateProfile = useDirectorProfileUpdate();

  const handleFieldUpdate = async <T,>(
    field: string,
    value: T
  ): Promise<void> => {
    try {
      const updateData: Record<string, unknown> = { [field]: value };
      await updateProfile.mutateAsync(updateData as Parameters<typeof updateProfile.mutateAsync>[0]);

      toast({
        title: "Success",
        description: "Field updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update field. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EditableTextField
                label="First Name"
                value={profile.user.first_name}
                originalValue={profile.user.first_name}
                onSave={(value) => handleFieldUpdate("first_name", value)}
                required
                isLoading={updateProfile.isPending}
              />

              <EditableTextField
                label="Last Name"
                value={profile.user.last_name}
                originalValue={profile.user.last_name}
                onSave={(value) => handleFieldUpdate("last_name", value)}
                required
                isLoading={updateProfile.isPending}
              />

              <EditableTextField
                label="Phone Number"
                value={profile.user.phone_number || ""}
                originalValue={profile.user.phone_number || ""}
                onSave={(value) =>
                  handleFieldUpdate("phone_number", value || undefined)
                }
                inputType="tel"
                isLoading={updateProfile.isPending}
              />

              <EditableTextField
                label="Gender"
                value={profile.user.gender}
                originalValue={profile.user.gender}
                onSave={(value) =>
                  handleFieldUpdate("gender", value as "male" | "female" | "other")
                }
                isLoading={updateProfile.isPending}
                renderInput={(value, onChange) => (
                  <Select
                    value={value}
                    onValueChange={onChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayPicture">Display Picture</Label>
              <Input
                id="displayPicture"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleFieldUpdate("display_picture", file);
                    e.target.value = "";
                  }
                }}
                disabled={updateProfile.isPending}
              />
            </div>
          </div>

          {/* School Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">School Information</h3>

            <div className="space-y-2">
              <Label htmlFor="schoolLogo">School Logo</Label>
              <Input
                id="schoolLogo"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleFieldUpdate("school_logo", file);
                    e.target.value = "";
                  }
                }}
                disabled={updateProfile.isPending}
              />
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Push Notifications",
                  description: "Receive push notifications",
                  field: "push_notifications" as const,
                  value: profile.settings.push_notifications,
                },
                {
                  label: "Email Notifications",
                  description: "Receive email notifications",
                  field: "email_notifications" as const,
                  value: profile.settings.email_notifications,
                },
                {
                  label: "Assessment Reminders",
                  description: "Get reminders for assessments",
                  field: "assessment_reminders" as const,
                  value: profile.settings.assessment_reminders,
                },
                {
                  label: "Grade Notifications",
                  description: "Get notified about grades",
                  field: "grade_notifications" as const,
                  value: profile.settings.grade_notifications,
                },
                {
                  label: "Announcement Notifications",
                  description: "Get notified about announcements",
                  field: "announcement_notifications" as const,
                  value: profile.settings.announcement_notifications,
                },
                {
                  label: "Dark Mode",
                  description: "Enable dark mode",
                  field: "dark_mode" as const,
                  value: profile.settings.dark_mode,
                },
                {
                  label: "Sound Effects",
                  description: "Enable sound effects",
                  field: "sound_effects" as const,
                  value: profile.settings.sound_effects,
                },
                {
                  label: "Haptic Feedback",
                  description: "Enable haptic feedback",
                  field: "haptic_feedback" as const,
                  value: profile.settings.haptic_feedback,
                },
                {
                  label: "Auto Save",
                  description: "Automatically save changes",
                  field: "auto_save" as const,
                  value: profile.settings.auto_save,
                },
                {
                  label: "Offline Mode",
                  description: "Enable offline functionality",
                  field: "offline_mode" as const,
                  value: profile.settings.offline_mode,
                },
                {
                  label: "Show Contact Info",
                  description: "Display contact information",
                  field: "show_contact_info" as const,
                  value: profile.settings.show_contact_info,
                },
                {
                  label: "Show Academic Progress",
                  description: "Display academic progress",
                  field: "show_academic_progress" as const,
                  value: profile.settings.show_academic_progress,
                },
                {
                  label: "Data Sharing",
                  description: "Allow data sharing",
                  field: "data_sharing" as const,
                  value: profile.settings.data_sharing,
                },
              ].map((setting) => (
                <EditableSwitch
                  key={setting.field}
                  label={setting.label}
                  description={setting.description}
                  value={setting.value}
                  originalValue={setting.value}
                  onSave={(value) => handleFieldUpdate(setting.field, value)}
                  isLoading={updateProfile.isPending}
                />
              ))}

              <EditableTextField
                label="Profile Visibility"
                value={profile.settings.profile_visibility}
                originalValue={profile.settings.profile_visibility}
                onSave={(value) => handleFieldUpdate("profile_visibility", value)}
                isLoading={updateProfile.isPending}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
