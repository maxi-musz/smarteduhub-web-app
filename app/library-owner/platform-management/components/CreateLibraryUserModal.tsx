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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useAvailablePermissions } from "@/hooks/library-owner/use-library-users";
import type { CreateLibraryUserPayload, LibraryUserRole, LibraryUserType } from "@/hooks/library-owner/use-library-users-types";

// Fixed role and user type for new library users
const DEFAULT_ROLE: LibraryUserRole = "admin";
const DEFAULT_USER_TYPE: LibraryUserType = "libraryresourceowner";

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
  const [permissionCodes, setPermissionCodes] = useState<string[]>([]);
  const [permissionLevel, setPermissionLevel] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;
    setEmail("");
    setPassword("");
    setFirst_name("");
    setLast_name("");
    setPhone_number("");
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
    if (isLoading) return; // Prevent double submission
    
    const payload: CreateLibraryUserPayload = {
      email: email.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      role: DEFAULT_ROLE,
      userType: DEFAULT_USER_TYPE,
      permissions: permissionCodes.length ? permissionCodes : undefined,
      permissionLevel: permissionLevel ? Number(permissionLevel) : undefined,
    };
    if (password.trim()) payload.password = password.trim();
    if (phone_number.trim()) payload.phone_number = phone_number.trim();
    onSubmit(payload);
    // Don't close here - let parent close after async operation completes
  };

  const canSubmit = email.trim() && first_name.trim() && last_name.trim();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
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
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="create-phone">Phone number (optional)</Label>
            <Input
              id="create-phone"
              value={phone_number}
              onChange={(e) => setPhone_number(e.target.value)}
              placeholder="+2348012345678"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="h-10 px-3 py-2 rounded-md border border-brand-border bg-gray-50 text-sm text-brand-heading">
                Admin
              </div>
            </div>
            <div className="space-y-2">
              <Label>User type</Label>
              <div className="h-10 px-3 py-2 rounded-md border border-brand-border bg-gray-50 text-sm text-brand-heading">
                Library resource owner
              </div>
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
                      disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
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
