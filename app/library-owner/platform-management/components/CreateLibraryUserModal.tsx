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
import type { CreateLibraryUserPayload, LibraryUserRole, LibraryUserType } from "@/hooks/library-owner/use-library-users-types";

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

interface CreateLibraryUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLibraryUserPayload) => void;
  isLoading?: boolean;
}

export function CreateLibraryUserModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateLibraryUserModalProps) {
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

  useEffect(() => {
    if (!isOpen) return;
    setEmail("");
    setPassword("");
    setFirst_name("");
    setLast_name("");
    setPhone_number("");
    setRole("content_creator");
    setUserType("contentcreator");
    setPermissionCodes([]);
    setPermissionLevel("");
  }, [isOpen]);

  const handleTogglePermission = (code: string) => {
    setPermissionCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateLibraryUserPayload = {
      email: email.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      role,
      userType,
      permissions: permissionCodes.length ? permissionCodes : undefined,
      permissionLevel: permissionLevel ? Number(permissionLevel) : undefined,
    };
    if (password.trim()) payload.password = password.trim();
    if (phone_number.trim()) payload.phone_number = phone_number.trim();
    onSubmit(payload);
    onClose();
  };

  const canSubmit = email.trim() && first_name.trim() && last_name.trim();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add library user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-first_name">First name</Label>
              <Input
                id="create-first_name"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
                placeholder="Jane"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-last_name">Last name</Label>
              <Input
                id="create-last_name"
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@library.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-password">Password (optional)</Label>
            <Input
              id="create-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters; leave blank to auto-generate"
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-phone">Phone number (optional)</Label>
            <Input
              id="create-phone"
              value={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
              placeholder="+2348012345678"
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
                      id={`perm-${p.id}`}
                      checked={permissionCodes.includes(p.code)}
                      onCheckedChange={() => handleTogglePermission(p.code)}
                    />
                    <label
                      htmlFor={`perm-${p.id}`}
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
            <Label htmlFor="create-permissionLevel">Permission level (1–10, optional)</Label>
            <Input
              id="create-permissionLevel"
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
                  Adding…
                </>
              ) : (
                "Add user"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
