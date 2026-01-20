"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlan } from "@/hooks/use-director-profile";
import { DetailField } from "./DetailField";
import { formatDate, formatCurrency } from "./utils";

interface CurrentPlanProps {
  plan: SubscriptionPlan;
}

export const CurrentPlan = ({ plan }: CurrentPlanProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{plan.name}</CardTitle>
        <Badge
          variant={plan.status === "ACTIVE" ? "default" : "secondary"}
          className="capitalize"
        >
          {plan.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailField label="Plan Type" value={plan.plan_type} />
        <DetailField
          label="Cost"
          value={formatCurrency(plan.cost, plan.currency)}
        />
        <DetailField
          label="Billing Cycle"
          value={<span className="capitalize">{plan.billing_cycle.toLowerCase()}</span>}
        />
        <DetailField
          label="Auto Renew"
          value={
            plan.auto_renew ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )
          }
        />
        {plan.description && (
          <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="font-medium">{plan.description}</p>
          </div>
        )}
        <DetailField
          label="Max Teachers"
          value={plan.max_allowed_teachers.toString()}
        />
        <DetailField
          label="Max Students"
          value={plan.max_allowed_students.toString()}
        />
        {plan.max_allowed_classes && (
          <DetailField
            label="Max Classes"
            value={plan.max_allowed_classes.toString()}
          />
        )}
        {plan.max_allowed_subjects && (
          <DetailField
            label="Max Subjects"
            value={plan.max_allowed_subjects.toString()}
          />
        )}
        <DetailField
          label="Max Storage"
          value={`${plan.max_storage_mb} MB`}
        />
        <DetailField
          label="Max File Size"
          value={`${plan.max_file_size_mb} MB`}
        />
        {plan.start_date && (
          <DetailField
            label="Start Date"
            value={formatDate(plan.start_date)}
          />
        )}
        {plan.end_date && (
          <DetailField label="End Date" value={formatDate(plan.end_date)} />
        )}
      </div>
    </CardContent>
  </Card>
);

