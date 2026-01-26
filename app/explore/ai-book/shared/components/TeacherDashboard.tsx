"use client";

import React, { useState } from "react";
import {
  FileText,
  GraduationCap,
  ClipboardList,
  BarChart3,
  FileEdit,
  Lightbulb,
  Monitor,
  Puzzle,
  Home,
  Video,
  Globe,
  Rocket,
  Wrench,
  Sparkles,
  BookOpen,
  ClipboardCheck,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { TeacherToolDialog } from "./TeacherToolDialog";
import {
  getTeacherToolDisplayMessage,
  getTeacherToolBackendMessage,
  teacherToolRequiresDialog,
  type TeacherToolDialogData,
} from "./teacherToolMessages";

interface TeacherDashboardProps {
  onToolClick?: (message: string, displayMessage: string) => void;
  selectedChapterId?: string | null;
  onChapterChange?: (chapterId: string) => void;
  chapters?: Array<{ id: string; title: string; order: number }>;
  bookTitle?: string;
  chapterTitle?: string;
}

interface Tool {
  id: string;
  label: string;
  icon: React.ReactNode;
  accentColor?: string;
  gradient?: string;
  description?: string;
}

const startHereTools: Tool[] = [
  {
    id: "lesson-plan",
    label: "Lesson Plan",
    icon: <FileText className="h-4 w-4" />,
    gradient: "from-blue-500 to-blue-600",
    description: "Create structured lesson plans",
  },
  {
    id: "teaching-coach",
    label: "Teaching Coach",
    icon: <GraduationCap className="h-4 w-4" />,
    gradient: "from-purple-500 to-purple-600",
    description: "Get personalized teaching guidance",
  },
  {
    id: "question-bank",
    label: "Question Bank",
    icon: <ClipboardList className="h-4 w-4" />,
    accentColor: "text-red-500",
    gradient: "from-red-500 to-red-600",
    description: "Access curated questions",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    accentColor: "text-green-500",
    gradient: "from-green-500 to-green-600",
    description: "Track student progress",
  },
  {
    id: "create-question-paper",
    label: "Create Question Paper",
    icon: <FileEdit className="h-4 w-4" />,
    accentColor: "text-orange-500",
    gradient: "from-orange-500 to-orange-600",
    description: "Generate exam papers",
  },
];

const planTools: Tool[] = [
  {
    id: "lesson-plan-advanced",
    label: "Lesson Plan",
    icon: <FileText className="h-4 w-4" />,
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    id: "teaching-coach-advanced",
    label: "Teaching Coach",
    icon: <GraduationCap className="h-4 w-4" />,
    gradient: "from-violet-500 to-violet-600",
  },
  {
    id: "definitions-concepts",
    label: "Definitions/Concepts",
    icon: <FileText className="h-4 w-4" />,
    accentColor: "text-purple-500",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: "chapter-summary",
    label: "Chapter Summary",
    icon: <FileText className="h-4 w-4" />,
    accentColor: "text-green-500",
    gradient: "from-emerald-500 to-emerald-600",
  },
];

const teachTools: Tool[] = [
  {
    id: "interactive-activities",
    label: "Interactive Activities",
    icon: <Puzzle className="h-4 w-4" />,
    accentColor: "text-gray-500",
    gradient: "from-slate-500 to-slate-600",
  },
  {
    id: "homework-assignment",
    label: "Homework & Assignment",
    icon: <Home className="h-4 w-4" />,
    accentColor: "text-amber-600",
    gradient: "from-amber-500 to-amber-600",
  },
  {
    id: "suggested-videos",
    label: "Suggested Videos",
    icon: <Video className="h-4 w-4" />,
    accentColor: "text-blue-500",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "real-world-examples",
    label: "Real-World Examples",
    icon: <Globe className="h-4 w-4" />,
    accentColor: "text-orange-500",
    gradient: "from-orange-500 to-orange-600",
  },
];

const assessTools: Tool[] = [
  {
    id: "create-mcqs-teacher",
    label: "Create MCQs",
    icon: <ClipboardCheck className="h-4 w-4" />,
    accentColor: "text-gray-600",
    gradient: "from-gray-500 to-gray-600",
  },
  {
    id: "create-questions-answers-teacher",
    label: "Create Question and Answers",
    icon: <ClipboardCheck className="h-4 w-4" />,
    accentColor: "text-red-500",
    gradient: "from-red-500 to-red-600",
  },
  {
    id: "question-bank",
    label: "Question Bank",
    icon: <HelpCircle className="h-4 w-4" />,
    accentColor: "text-red-500",
    gradient: "from-red-500 to-red-600",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    accentColor: "text-purple-500",
    gradient: "from-purple-500 to-purple-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function TeacherDashboard({
  onToolClick,
  selectedChapterId,
  onChapterChange,
  chapters = [],
  bookTitle,
  chapterTitle,
}: TeacherDashboardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingToolId, setPendingToolId] = useState<string | null>(null);

  const handleToolClick = (toolId: string) => {
    // Require chapter selection first
    if (!selectedChapterId) {
      return; // Don't allow tool clicks without chapter selection
    }

    // Check if this tool requires a dialog
    if (teacherToolRequiresDialog(toolId)) {
      setPendingToolId(toolId);
      setDialogOpen(true);
    } else {
      // Send message directly
      const displayMessage = getTeacherToolDisplayMessage(toolId);
      const backendMessage = getTeacherToolBackendMessage(toolId, bookTitle, chapterTitle);
      onToolClick?.(backendMessage, displayMessage);
    }
  };

  const handleDialogSubmit = (dialogData: TeacherToolDialogData) => {
    if (!pendingToolId) return;

    const displayMessage = getTeacherToolDisplayMessage(pendingToolId, dialogData);
    const backendMessage = getTeacherToolBackendMessage(
      pendingToolId,
      bookTitle,
      chapterTitle,
      dialogData
    );
    
    onToolClick?.(backendMessage, displayMessage);
    setPendingToolId(null);
  };

  const getToolLabel = (toolId: string): string => {
    return getTeacherToolDisplayMessage(toolId);
  };

  const isChapterSelected = !!selectedChapterId;

  const ToolCard = ({ tool, index }: { tool: Tool; index?: number }) => {
    const isDisabled = !isChapterSelected;
    
    return (
    <motion.button
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      custom={index}
      onClick={() => !isDisabled && handleToolClick(tool.id)}
      disabled={isDisabled}
      className={`group relative flex flex-col items-center justify-center gap-1.5 p-2 bg-white rounded-lg border border-brand-border shadow-sm transition-all duration-300 min-h-[70px] w-full overflow-hidden ${
        isDisabled 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:shadow-md cursor-pointer"
      }`}
    >
      {/* Gradient background on hover - only when enabled */}
      {!isDisabled && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${tool.gradient || "from-brand-primary to-brand-primary"} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />
      )}
      
      {/* Icon container with solid background for better visibility */}
      <div
        className={`relative z-10 p-1.5 rounded-lg ${
          isDisabled 
            ? "bg-gray-100" 
            : "bg-brand-primary/10 group-hover:bg-brand-primary/15"
        } transition-all duration-300`}
      >
        <motion.div
          className={`${tool.accentColor || "text-brand-primary"}`}
          whileHover={!isDisabled ? { scale: 1.1, rotate: 5 } : {}}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {tool.icon}
        </motion.div>
      </div>
      
      {/* Label */}
      <span className={`relative z-10 text-[11px] font-semibold text-center leading-tight ${
        isDisabled ? "text-gray-400" : "text-brand-heading"
      }`}>
        {tool.label}
      </span>
      
      {/* Description for start here tools */}
      {tool.description && (
        <span className={`relative z-10 text-[9px] text-center mt-0.5 transition-opacity duration-300 line-clamp-2 ${
          isDisabled 
            ? "text-gray-400 opacity-60" 
            : "text-gray-500 opacity-0 group-hover:opacity-100"
        }`}>
          {tool.description}
        </span>
      )}
      
      {/* Hover border effect - only when enabled */}
      {!isDisabled && (
        <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-brand-primary/30 transition-all duration-300" />
      )}
    </motion.button>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto h-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Hero Header Section - Centered */}
        <div className="max-w-7xl mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex flex-col items-center justify-center gap-2 mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="relative"
              >
                <div className="h-12 w-12 rounded-xl bg-brand-primary flex items-center justify-center shadow-md shadow-brand-primary/20">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  className="absolute -top-0.5 -right-0.5"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.div>
              </motion.div>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-brand-heading mb-1 bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">
                  Teacher AI Assistant
                </h1>
                <p className="text-gray-600 text-sm">
                  Empower your teaching with AI-powered tools
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* All content below header is left-aligned - starts from left edge */}
        <div className="w-full">
        {/* Chapter Selection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 w-full"
        >
          <Card className="p-3 bg-white/80 backdrop-blur-sm border-brand-border shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-primary/10">
                  <BookOpen className="h-4 w-4 text-brand-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-heading block">
                    Select Chapter <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {isChapterSelected 
                      ? "Chapter selected - tools are now available"
                      : "Choose a chapter to enable all tools"}
                  </p>
                </div>
              </div>
              <select
                value={selectedChapterId || ""}
                onChange={(e) => onChapterChange?.(e.target.value)}
                className="px-3 py-1.5 text-sm border-2 border-brand-border rounded-lg bg-white text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary min-w-[200px] font-medium shadow-sm hover:border-brand-primary/50 transition-colors"
              >
                <option value="">-- Select a chapter --</option>
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>
          </Card>
          
          {/* Warning message when no chapter selected */}
          {!isChapterSelected && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg w-full"
            >
              <p className="text-xs text-amber-800 font-medium text-left">
                ⚠️ Please select a chapter first to access all teaching tools
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Start Here Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-6 w-full"
        >
          <Card className="p-4 bg-gradient-to-br from-orange-50 via-orange-50/50 to-white border-2 border-orange-200/50 shadow-md">
            <div className="flex items-center gap-2 mb-4 w-full">
              <div className="p-1.5 rounded-lg bg-orange-500 shadow-sm">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-brand-heading flex items-center gap-2">
                  Start Here
                  <ChevronRight className="h-4 w-4 text-orange-500" />
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Essential tools to begin your teaching journey
                </p>
              </div>
            </div>
            
            {/* Visual connector line */}
            <div className="relative mb-3">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 to-transparent"></div>
              <div className="pl-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-2 lg:gap-2">
                  {startHereTools.map((tool, index) => (
                    <ToolCard key={tool.id} tool={tool} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Advanced Tools Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Accordion
            type="single"
            collapsible
            defaultValue="advanced"
            className="w-full"
          >
            <AccordionItem value="advanced" className="border-none">
              <AccordionTrigger className="hover:no-underline py-3 px-3 rounded-lg bg-white/80 backdrop-blur-sm border border-brand-border shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-brand-primary">
                    <Wrench className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-brand-heading">
                      Advanced Tools
                    </h2>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Explore additional features and capabilities
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                {/* Plan Sub-section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <Card className="p-4 bg-gradient-to-br from-amber-50 via-amber-50/30 to-white border-2 border-amber-200/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-amber-500 shadow-sm">
                        <Lightbulb className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-brand-heading flex items-center gap-2">
                          Plan
                          <ChevronRight className="h-3.5 w-3.5 text-amber-500" />
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Tools for lesson planning and preparation
                        </p>
                      </div>
                    </div>
                    {/* Visual connector line */}
                    <div className="relative mb-3">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-transparent"></div>
                      <div className="pl-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-2">
                          {planTools.map((tool, index) => (
                            <ToolCard key={tool.id} tool={tool} index={index} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Teach Sub-section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative"
                >
                  <Card className="p-4 bg-gradient-to-br from-blue-50 via-blue-50/30 to-white border-2 border-blue-200/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-blue-500 shadow-sm">
                        <Monitor className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-brand-heading flex items-center gap-2">
                          Teach
                          <ChevronRight className="h-3.5 w-3.5 text-blue-500" />
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Resources for engaging classroom instruction
                        </p>
                      </div>
                    </div>
                    {/* Visual connector line */}
                    <div className="relative mb-3">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-transparent"></div>
                      <div className="pl-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-2">
                          {teachTools.map((tool, index) => (
                            <ToolCard key={tool.id} tool={tool} index={index} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Assess Sub-section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <Card className="p-4 bg-gradient-to-br from-purple-50 via-purple-50/30 to-white border-2 border-purple-200/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-1.5 rounded-lg bg-purple-500 shadow-sm">
                        <ClipboardCheck className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-brand-heading flex items-center gap-2">
                          Assess
                          <ChevronRight className="h-3.5 w-3.5 text-purple-500" />
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Tools for assessment and evaluation
                        </p>
                      </div>
                    </div>
                    {/* Visual connector line */}
                    <div className="relative mb-3">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-transparent"></div>
                      <div className="pl-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 lg:gap-2">
                          {assessTools.map((tool, index) => (
                            <ToolCard key={tool.id} tool={tool} index={index} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
        </div>
      </div>

      {/* Teacher Tool Dialog */}
      {pendingToolId && (
        <TeacherToolDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          toolId={pendingToolId}
          toolLabel={getToolLabel(pendingToolId)}
          onSubmit={handleDialogSubmit}
        />
      )}
    </div>
  );
}
