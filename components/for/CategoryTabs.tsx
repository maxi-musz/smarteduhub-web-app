import React from "react";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: { category: string; slug: string }[];
  activeSlug: string;
  onSelectCategory: (slug: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeSlug,
  onSelectCategory,
}) => (
  <nav className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 mb-8">
    {categories.map((cat) => (
      <button
        key={cat.slug}
        className={cn(
          "px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 cursor-pointer",
          cat.slug === activeSlug
            ? "text-brand-primary border-brand-primary"
            : "text-gray-600 border-transparent hover:text-brand-primary hover:border-gray-300"
        )}
        onClick={() => onSelectCategory(cat.slug)}
      >
        {cat.category}
      </button>
    ))}
  </nav>
);

export default CategoryTabs;
