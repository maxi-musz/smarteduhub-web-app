"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Palette, Sun } from "lucide-react";

interface Settings {
  theme: "light" | "dark" | "system";
  notifications: {
    email: boolean;
    push: boolean;
    updates: boolean;
    reminders: boolean;
  };
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
    sessionTimeout: number;
  };
  appearance: {
    colorScheme: string;
    fontSize: string;
    compactMode: boolean;
  };
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    theme: "system",
    notifications: {
      email: true,
      push: true,
      updates: false,
      reminders: true,
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30,
    },
    appearance: {
      colorScheme: "blue",
      fontSize: "medium",
      compactMode: false,
    },
  });

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    setSettings({ ...settings, theme });
  };

  const handleNotificationChange = (
    key: keyof typeof settings.notifications
  ) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const handleSecurityChange = (
    key: keyof typeof settings.security,
    value: boolean | number
  ) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [key]: value,
      },
    });
  };

  const handleAppearanceChange = (
    key: keyof typeof settings.appearance,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value,
      },
    });
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <h2 className="text-2xl font-bold">Settings</h2>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Theme Mode</Label>
                  <div className="text-sm text-gray-500">
                    Choose your preferred theme mode
                  </div>
                </div>
                <Select
                  value={settings.theme}
                  onValueChange={(value: "light" | "dark" | "system") =>
                    handleThemeChange(value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Palette className="w-4 h-4 mr-2" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <div className="text-sm text-gray-500">
                    Receive notifications via email
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={() => handleNotificationChange("email")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Push Notifications</Label>
                  <div className="text-sm text-gray-500">
                    Receive push notifications
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={() => handleNotificationChange("push")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>System Updates</Label>
                  <div className="text-sm text-gray-500">
                    Get notified about system updates
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.updates}
                  onCheckedChange={() => handleNotificationChange("updates")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Reminders</Label>
                  <div className="text-sm text-gray-500">
                    Receive reminder notifications
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.reminders}
                  onCheckedChange={() => handleNotificationChange("reminders")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <div className="text-sm text-gray-500">
                    Enable two-factor authentication for added security
                  </div>
                </div>
                <Switch
                  checked={settings.security.twoFactor}
                  onCheckedChange={(checked) =>
                    handleSecurityChange("twoFactor", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Login Alerts</Label>
                  <div className="text-sm text-gray-500">
                    Receive alerts for new login attempts
                  </div>
                </div>
                <Switch
                  checked={settings.security.loginAlerts}
                  onCheckedChange={(checked) =>
                    handleSecurityChange("loginAlerts", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Session Timeout (minutes)</Label>
                  <div className="text-sm text-gray-500">
                    Automatically log out after inactivity
                  </div>
                </div>
                <Input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleSecurityChange(
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-[100px]"
                  min={1}
                  max={120}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Color Scheme</Label>
                  <div className="text-sm text-gray-500">
                    Choose your preferred color scheme
                  </div>
                </div>
                <Select
                  value={settings.appearance.colorScheme}
                  onValueChange={(value) =>
                    handleAppearanceChange("colorScheme", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select color scheme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Font Size</Label>
                  <div className="text-sm text-gray-500">
                    Adjust the font size
                  </div>
                </div>
                <Select
                  value={settings.appearance.fontSize}
                  onValueChange={(value) =>
                    handleAppearanceChange("fontSize", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Compact Mode</Label>
                  <div className="text-sm text-gray-500">
                    Enable compact mode for denser layout
                  </div>
                </div>
                <Switch
                  checked={settings.appearance.compactMode}
                  onCheckedChange={(checked) =>
                    handleAppearanceChange("compactMode", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
