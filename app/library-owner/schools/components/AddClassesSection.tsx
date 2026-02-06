"use client";

import { useState, useEffect } from "react";
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

/** Nigerian system order: add classes in this sequence. */
const CLASS_LEVELS_ORDERED = [
  "KG1", "KG2", "Nursery 1", "Nursery 2",
  "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
  "JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3",
];

interface AddClassesSectionProps {
  schoolId: string;
}

export function AddClassesSection({ schoolId }: AddClassesSectionProps) {
  const { toast } = useToast();
  const onboardClasses = useOnboardLibraryClasses();
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("");

  const handleAddClass = () => {
    if (selectedLevel && !classes.includes(selectedLevel)) {
      setClasses((prev) => [...prev, selectedLevel]);
      setSelectedLevel("");
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

  /** Only the next class in Nigerian order can be added (enforces sequence). */
  const nextClassIndex = classes.length;
  const nextClass = nextClassIndex < CLASS_LEVELS_ORDERED.length ? CLASS_LEVELS_ORDERED[nextClassIndex] : null;
  const availableLevels = nextClass ? [nextClass] : [];

  useEffect(() => {
    if (nextClass && selectedLevel !== nextClass) setSelectedLevel(nextClass);
    if (!nextClass) setSelectedLevel("");
  }, [nextClass, selectedLevel]);

  return (
    <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-brand-heading">Add classes</p>
        <p className="text-xs text-brand-light-accent-1 mt-1">
          Add classes in order: KG1 → KG2 → Nursery 1 → Nursery 2 → Primary 1–6 → JSS1–3 → SS1–3. Select the next class in sequence.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder={nextClass ? `Next: ${nextClass}` : "All added"} />
          </SelectTrigger>
          <SelectContent>
            {availableLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" variant="outline" onClick={handleAddClass} disabled={!selectedLevel}>
          Add
        </Button>
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
