"use client";

interface SubjectHeaderProps {
  subtitle?: string;
}

export const SubjectHeader = ({ subtitle }: SubjectHeaderProps) => {
  const defaultSubtitle = subtitle || "Manage your subjects";
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-heading">Subjects</h1>
        <p className="text-brand-light-accent-1 text-sm">
          {defaultSubtitle}
        </p>
      </div>
    </div>
  );
};

