"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useAvailablePermissions } from "@/hooks/library-owner/use-library-users";
import type { LibraryUserListItem, UpdateLibraryUserPayload, LibraryUserRole, LibraryUserType } from "@/hooks/library-owner/use-library-users-types";

const ROLES: { value: LibraryUserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "content_creator", label: "Content creator" },
  { value: "reviewer", label: "Reviewer" },
  { value: "viewer", label: "Viewer" },
];

const USER_TYPES: { value: LibraryUserType; label: string }[] = [
  { value: "libraryresourceowner", label: "Library resource owner" },
  { value: "librarymanager", label: "Library manager" },
  { value: "contentcreator", label: "Content creator" },
  { value: "reviewer", label: "Reviewer" },
  { value: "viewer", label: "Viewer" },
];

interface EditLibraryUserModalProps {
  user: LibraryUserListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, payload: UpdateLibraryUserPayload) => void;
  isLoading?: boolean;
}

export function EditLibraryUserModal({
  user,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditLibraryUserModalProps) {
  const { data: availablePermissions = [] } = useAvailablePermissions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [role, setRole] = useState<LibraryUserRole>("content_creator");
  const [userType, setUserType] = useState<LibraryUserType>("contentcreator");
  const [permissionCodes, setPermissionCodes] = useState<string[]>([]);
  const [permissionLevel, setPermissionLevel] = useState<string>("");

  const initialSnapshot = React.useRef<string>("");

  useEffect(() => {
    if (!isOpen || !user) return;
    setEmail(user.email);
    setPassword("");
    setFirst_name(user.first_name);
    setLast_name(user.last_name);
    setPhone_number(user.phone_number ?? "");
    setRole((user.role as LibraryUserRole) || "content_creator");
    setUserType((user.userType as LibraryUserType) || "contentcreator");
    setPermissionCodes(Array.isArray(user.permissions) ? user.permissions : []);
    setPermissionLevel(user.permissionLevel != null ? String(user.permissionLevel) : "");
    initialSnapshot.current = JSON.stringify({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number ?? "",
      role: (user.role as LibraryUserRole) || "content_creator",
      userType: (user.userType as LibraryUserType) || "contentcreator",
      permissionCodes: [...(Array.isArray(user.permissions) ? user.permissions : [])].sort(),
      permissionLevel: user.permissionLevel != null ? String(user.permissionLevel) : "",
      passwordLength: 0,
    });
  }, [isOpen, user]);

  const handleTogglePermission = (code: string) => {
    setPermissionCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload: UpdateLibraryUserPayload = {
      email: email.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      role,
      userType,
      permissions: permissionCodes,
      permissionLevel: permissionLevel ? Number(permissionLevel) : undefined,
    };
    if (password.trim()) payload.password = password.trim();
    if (phone_number.trim()) payload.phone_number = phone_number.trim();
    onSubmit(user.id, payload);
    onClose();
  };

  const currentSnapshot = JSON.stringify({
    email: email.trim(),
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    phone_number: phone_number.trim(),
    role,
    userType,
    permissionCodes: [...permissionCodes].sort(),
    permissionLevel: permissionLevel.trim(),
    passwordLength: password.length,
  });
  const hasChanged = initialSnapshot.current !== currentSnapshot;
  const canSubmit =
    user &&
    email.trim() &&
    first_name.trim() &&
    last_name.trim() &&
    hasChanged;

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit library user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-first_name">First name</Label>
              <Input
                id="edit-first_name"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-last_name">Last name</Label>
              <Input
                id="edit-last_name"
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-password">New password (optional)</Label>
            <Input
              id="edit-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone number</Label>
            <Input
              id="edit-phone"
              value={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as LibraryUserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>User type</Label>
              <Select value={userType} onValueChange={(v) => setUserType(v as LibraryUserType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {availablePermissions.length > 0 && (
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="rounded-md border border-brand-border p-3 space-y-2 max-h-32 overflow-y-auto">
                {availablePermissions.map((p) => (
                  <div key={p.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-perm-${p.id}`}
                      checked={permissionCodes.includes(p.code)}
                      onCheckedChange={() => handleTogglePermission(p.code)}
                    />
                    <label
                      htmlFor={`edit-perm-${p.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {p.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-permissionLevel">Permission level (1–10)</Label>
            <Input
              id="edit-permissionLevel"
              type="number"
              min={1}
              max={10}
              value={permissionLevel}
              onChange={(e) => setPermissionLevel(e.target.value)}
              placeholder="1–10"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
