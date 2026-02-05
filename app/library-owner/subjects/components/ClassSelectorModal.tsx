"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LibraryClass } from "@/hooks/library-owner/use-library-owner-resources";
import { Search, BookOpen, Layers, Video, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClass: (classItem: LibraryClass) => void;
  classes: LibraryClass[];
}

export const ClassSelectorModal = ({
  isOpen,
  onClose,
  onSelectClass,
  classes,
}: ClassSelectorModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = classes.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClass = (classItem: LibraryClass) => {
    onSelectClass(classItem);
    setSearchQuery("");
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Select a Class</DialogTitle>
          <p className="text-xs text-brand-light-accent-1 mt-0.5">
            Choose which class to add the new subject to
          </p>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-light-accent-1" />
          <Input
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Classes List */}
        <div className="h-[300px] overflow-y-auto pr-2">
          {filteredClasses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm text-brand-light-accent-1">
                {searchQuery ? "No classes match your search" : "No classes available"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClasses.map((classItem) => (
                <button
                  key={classItem.id}
                  onClick={() => handleSelectClass(classItem)}
                  className={cn(
                    "w-full p-3 rounded-lg border border-brand-border",
                    "hover:bg-gray-50 hover:border-brand-primary/50",
                    "transition-colors text-left group"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-brand-heading text-sm group-hover:text-brand-primary transition-colors">
                        {classItem.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-brand-light-accent-1">
                        <div className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          <span>{classItem.subjectsCount} subjects</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          <span>{classItem.videosCount} videos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span>{classItem.materialsCount} materials</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-brand-light-accent-1 group-hover:text-brand-primary transition-colors flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-brand-border">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
