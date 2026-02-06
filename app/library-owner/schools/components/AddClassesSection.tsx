"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Loader2 } from "lucide-react";
import { useOnboardLibraryClasses } from "@/hooks/library-owner/use-onboard-library-classes";
import { useToast } from "@/hooks/use-toast";

const CLASS_LEVELS = [
  "JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
];

const BULK_OPTIONS = [
  { label: "Primary 1 - Primary 6", classes: ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6"] },
  { label: "JSS1 - JSS3", classes: ["JSS1", "JSS2", "JSS3"] },
  { label: "SS1 - SS2", classes: ["SS1", "SS2"] },
];

interface AddClassesSectionProps {
  schoolId: string;
}

export function AddClassesSection({ schoolId }: AddClassesSectionProps) {
  const { toast } = useToast();
  const onboardClasses = useOnboardLibraryClasses();
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedBulk, setSelectedBulk] = useState("");

  const handleAddClass = () => {
    if (selectedLevel && !classes.includes(selectedLevel)) {
      setClasses((prev) => [...prev, selectedLevel]);
      setSelectedLevel("");
    }
  };

  const handleAddBulk = () => {
    const option = BULK_OPTIONS.find((o) => o.label === selectedBulk);
    if (option) {
      const newOnes = option.classes.filter((c) => !classes.includes(c));
      if (newOnes.length > 0) setClasses((prev) => [...prev, ...newOnes]);
      setSelectedBulk("");
    }
  };

  const handleSubmit = async () => {
    if (classes.length === 0) return;
    try {
      await onboardClasses.mutateAsync({ schoolId, class_names: classes });
      setClasses([]);
      toast({ title: "Classes added", description: `${classes.length} class(es) added successfully.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to add classes", description: err instanceof Error ? err.message : "Please try again." });
    }
  };

  const availableLevels = CLASS_LEVELS.filter((c) => !classes.includes(c));
  const availableBulk = BULK_OPTIONS.filter((opt) => opt.classes.some((c) => !classes.includes(c)));

  return (
    <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4 space-y-3">
      <p className="text-sm font-medium text-brand-heading">Add classes</p>
      <div className="flex flex-wrap gap-2">
        <Select value={selectedBulk} onValueChange={setSelectedBulk}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Bulk add" />
          </SelectTrigger>
          <SelectContent>
            {availableBulk.map((o) => (
              <SelectItem key={o.label} value={o.label}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" variant="outline" onClick={handleAddBulk} disabled={!selectedBulk}>Add bulk</Button>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="Single" />
          </SelectTrigger>
          <SelectContent>
            {availableLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" variant="outline" onClick={handleAddClass} disabled={!selectedLevel}>Add</Button>
      </div>
      {classes.length > 0 && (
        <>
          <div className="flex flex-wrap gap-1.5">
            {classes.map((name, i) => (
              <span key={`${name}-${i}`} className="inline-flex items-center gap-1 bg-white border border-brand-border rounded px-2 py-0.5 text-sm">
                {name}
                <button type="button" onClick={() => setClasses((prev) => prev.filter((_, idx) => idx !== i))} className="text-gray-500 hover:text-gray-700"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
          <Button size="sm" onClick={handleSubmit} disabled={onboardClasses.isPending} className="bg-brand-primary text-white hover:bg-brand-primary/90">
            {onboardClasses.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save classes"}
          </Button>
        </>
      )}
    </div>
  );
}
