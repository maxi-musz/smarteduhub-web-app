"use client";

import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SubscriptionPlan, AvailablePlan } from "@/hooks/use-director-profile";
import { CurrentPlan } from "./CurrentPlan";
import { PlanCard } from "./PlanCard";

interface SubscriptionTabProps {
  subscriptionPlan: SubscriptionPlan | null;
  availablePlans: AvailablePlan[];
}

export const SubscriptionTab = ({
  subscriptionPlan,
  availablePlans,
}: SubscriptionTabProps) => (
  <div className="mt-6 space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
      {subscriptionPlan ? (
        <CurrentPlan plan={subscriptionPlan} />
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No active subscription</p>
          </CardContent>
        </Card>
      )}
    </div>

    {availablePlans && availablePlans.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availablePlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    )}
  </div>
);

