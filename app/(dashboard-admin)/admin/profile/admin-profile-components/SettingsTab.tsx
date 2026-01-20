"use client";

import { DirectorSettings } from "@/hooks/use-director-profile";
import { SettingItem } from "./SettingItem";

interface SettingsTabProps {
  settings: DirectorSettings;
}

export const SettingsTab = ({ settings }: SettingsTabProps) => (
  <div className="mt-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SettingItem
        title="Push Notifications"
        description="Receive push notifications"
        enabled={settings.push_notifications}
      />
      <SettingItem
        title="Email Notifications"
        description="Receive email notifications"
        enabled={settings.email_notifications}
      />
      <SettingItem
        title="Assessment Reminders"
        description="Get reminders for assessments"
        enabled={settings.assessment_reminders}
      />
      <SettingItem
        title="Grade Notifications"
        description="Get notified about grades"
        enabled={settings.grade_notifications}
      />
      <SettingItem
        title="Announcement Notifications"
        description="Get notified about announcements"
        enabled={settings.announcement_notifications}
      />
      <SettingItem
        title="Dark Mode"
        description="Enable dark mode"
        enabled={settings.dark_mode}
      />
      <SettingItem
        title="Sound Effects"
        description="Enable sound effects"
        enabled={settings.sound_effects}
      />
      <SettingItem
        title="Haptic Feedback"
        description="Enable haptic feedback"
        enabled={settings.haptic_feedback}
      />
      <SettingItem
        title="Auto Save"
        description="Automatically save changes"
        enabled={settings.auto_save}
      />
      <SettingItem
        title="Offline Mode"
        description="Enable offline functionality"
        enabled={settings.offline_mode}
      />
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="font-medium mb-1">Profile Visibility</p>
        <p className="text-sm text-gray-500">{settings.profile_visibility}</p>
      </div>
      <SettingItem
        title="Show Contact Info"
        description="Display contact information"
        enabled={settings.show_contact_info}
      />
      <SettingItem
        title="Show Academic Progress"
        description="Display academic progress"
        enabled={settings.show_academic_progress}
      />
      <SettingItem
        title="Data Sharing"
        description="Allow data sharing"
        enabled={settings.data_sharing}
      />
    </div>
  </div>
);

