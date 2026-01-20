"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvailablePlan } from "@/hooks/director/use-director-profile";
import { formatCurrency } from "./utils";

interface PlanCardProps {
  plan: AvailablePlan;
}

export const PlanCard = ({ plan }: PlanCardProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{plan.name}</CardTitle>
        <Badge
          variant={plan.status === "ACTIVE" ? "default" : "secondary"}
          className="capitalize"
        >
          {plan.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div>
          <p className="text-2xl font-bold">
            {formatCurrency(plan.cost, plan.currency)}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {plan.billing_cycle.toLowerCase()}
          </p>
        </div>
        {plan.description && (
          <p className="text-sm text-gray-600">{plan.description}</p>
        )}
        <div className="pt-2 border-t space-y-2">
          <p className="text-sm">
            <span className="font-medium">{plan.max_allowed_teachers}</span>{" "}
            Teachers
          </p>
          <p className="text-sm">
            <span className="font-medium">{plan.max_allowed_students}</span>{" "}
            Students
          </p>
          {plan.max_allowed_classes && (
            <p className="text-sm">
              <span className="font-medium">
                {plan.max_allowed_classes}
              </span>{" "}
              Classes
            </p>
          )}
          {plan.max_allowed_subjects && (
            <p className="text-sm">
              <span className="font-medium">
                {plan.max_allowed_subjects}
              </span>{" "}
              Subjects
            </p>
          )}
          <p className="text-sm">
            <span className="font-medium">{plan.max_storage_mb} MB</span>{" "}
            Storage
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

