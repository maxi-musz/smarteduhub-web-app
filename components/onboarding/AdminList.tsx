"use client";

import React from "react";
import { User, Mail, Phone, Trash2 } from "lucide-react";

type AdminFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type AdminListProps = {
  admins: AdminFormData[];
  onRemoveAdmin: (id: string) => void;
};

const AdminList: React.FC<AdminListProps> = ({ admins, onRemoveAdmin }) => {
  if (admins.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
          <User className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-brand-light-accent-2 text-sm">
          No admins added yet. Add your first admin to get started
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-brand-heading">Admins Added</h3>
        <span className="text-sm text-brand-light-accent-2">
          {admins.length} admin{admins.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-3">
        {admins.map((admin, index) => (
          <div
            key={`admin-${admin.email}-${index}`}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-brand-border"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-brand-primary" />
              </div>
              <div>
                <p className="font-medium text-brand-heading">
                  {admin.firstName} {admin.lastName}
                </p>
                <div className="flex items-center gap-4 text-sm text-brand-light-accent-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {admin.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {admin.phoneNumber}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onRemoveAdmin(`admin-${admin.email}-${index}`)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminList;
