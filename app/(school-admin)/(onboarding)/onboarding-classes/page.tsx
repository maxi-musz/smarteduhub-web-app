"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, X } from "lucide-react";
import { useOnboarding } from "@/contexts/OnboardingContext";

const classLevels = [
  "JSS1",
  "JSS2",
  "JSS3",
  "SS1",
  "SS2",
  "SS3",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
];

const OnboardClasses = () => {
  const router = useRouter();
  const { data, updateClasses } = useOnboarding();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [classes, setClasses] = useState<string[]>(data.classes);

  const handleAddClass = () => {
    if (selectedLevel && !classes.includes(selectedLevel)) {
      setClasses((prev) => [...prev, selectedLevel]);
      setSelectedLevel("");
    }
  };

  const handleRemoveClass = (index: number) => {
    setClasses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    updateClasses(classes);
    router.push("/onboarding-teachers");
  };

  const availableLevels = classLevels.filter(
    (level) => !classes.includes(level)
  );

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-primary my-8">
            SmartEdu-Hub
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-brand-light-accent-2 font-medium">
              Step 1 of 5
            </span>
            <span className="text-sm text-brand-primary font-medium">
              20% Complete
            </span>
          </div>
          <Progress value={20} className="h-2" />
        </div>

        {/* Main Form Card */}
        <div className="bg-brand-bg rounded-md border-2 border-brand-border p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-brand-heading mb-2">
              Step 1 of 5: Add Your Classes
            </h2>
            <p className="text-brand-light-accent-2 text-sm">
              Define your school&apos;s class structure so it can be used when
              assigning
              <br />
              (Typically from Primary 1 to SS3, but you can add any level
              needed)
            </p>
          </div>

          {/* Select & Add Class */}
          <div className="mb-8">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-brand-heading mb-2">
                  Select Class Level
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a class level" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAddClass}
                disabled={!selectedLevel}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 px-6"
              >
                Add class
              </Button>
            </div>
          </div>

          {/* Class Tags */}
          {classes.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-brand-light-accent-2 text-sm">
                No classes added yet. Add your first class to get started
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Added Classes
              </h3>
              <div className="flex flex-wrap gap-2">
                {classes.map((className, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-white px-3 py-1 border-brand-border rounded-full border shadow-xs"
                  >
                    <span className="text-sm text-brand-light-accent-2">
                      {className}
                    </span>
                    <button
                      onClick={() => handleRemoveClass(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end border-t border-gray-200 pt-4 mt-8">
            <Button
              onClick={handleNext}
              disabled={classes.length === 0}
              className={`px-8 ${
                classes.length > 0
                  ? "bg-brand-primary hover:bg-brand-primary/90 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardClasses;
