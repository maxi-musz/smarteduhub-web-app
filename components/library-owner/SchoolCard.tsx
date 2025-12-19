import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School } from "@/hooks/use-library-owner-schools";
import { Building2, Mail, Phone, MapPin, Eye } from "lucide-react";
import Image from "next/image";

interface SchoolCardProps {
  school: School;
  onViewDetails: (schoolId: string) => void;
}

export const SchoolCard = ({ school, onViewDetails }: SchoolCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-orange-100 text-orange-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="shadow-sm bg-white hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {school.school_icon?.url ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={school.school_icon.url}
                  alt={school.school_name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-6 w-6 text-brand-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-brand-heading truncate">
                {school.school_name}
              </h3>
              <p className="text-sm text-brand-light-accent-1 truncate">
                {getTypeLabel(school.school_type)} • {school.school_ownership}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(school.status)}>
            {school.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-brand-light-accent-1">
            <Mail className="h-4 w-4" />
            <span className="truncate">{school.school_email}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-light-accent-1">
            <Phone className="h-4 w-4" />
            <span>{school.school_phone}</span>
          </div>
          <div className="flex items-center gap-2 text-brand-light-accent-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{school.school_address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-brand-border">
          <div>
            <p className="text-xs text-brand-light-accent-1">Teachers</p>
            <p className="font-semibold text-brand-heading">
              {school.breakdown.teachers.total}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-light-accent-1">Students</p>
            <p className="font-semibold text-brand-heading">
              {school.breakdown.students.total}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-light-accent-1">Classes</p>
            <p className="font-semibold text-brand-heading">
              {school.breakdown.classes.total}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-light-accent-1">Subjects</p>
            <p className="font-semibold text-brand-heading">
              {school.breakdown.subjects.total}
            </p>
          </div>
        </div>

        <Button
          onClick={() => onViewDetails(school.id)}
          className="w-full mt-3"
          variant="outline"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

