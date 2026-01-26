/**
 * Teacher Tool Messages Configuration
 * 
 * This file contains the professional display messages and backend messages
 * for each teacher tool. When a teacher selects a tool:
 * - The display message is shown in the UI (what the teacher sees they sent)
 * - The backend message is sent to the server (more detailed and contextual)
 */

export interface TeacherToolDialogData {
  numberOfQuestions?: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  questionType?: "short-answer" | "long-answer" | "mixed";
  additionalNotes?: string;
  includeAnswers?: boolean;
  includeExplanations?: boolean;
  gradeLevel?: string;
  learningObjectives?: string;
  timeAllocation?: string;
  assessmentType?: string;
}

export interface TeacherToolMessageConfig {
  /** User-friendly message displayed in the chat UI */
  displayMessage: string;
  /** Whether this tool requires user input via dialog */
  requiresDialog?: boolean;
  /** 
   * Function that generates the display message with dialog data (optional)
   * If not provided, uses the base displayMessage
   * @param dialogData - User input data from dialog (optional)
   * @returns The message to display in the UI
   */
  getDisplayMessage?: (dialogData?: TeacherToolDialogData) => string;
  /** 
   * Function that generates the backend message with context
   * @param bookTitle - The title of the book (optional)
   * @param chapterTitle - The title of the chapter (optional)
   * @param dialogData - User input data from dialog (optional)
   * @returns The message to send to the backend
   */
  getBackendMessage: (bookTitle?: string, chapterTitle?: string, dialogData?: TeacherToolDialogData) => string;
}

export const teacherToolMessages: Record<string, TeacherToolMessageConfig> = {
  "lesson-plan": {
    displayMessage: "Generate Lesson Plan",
    requiresDialog: true,
    getDisplayMessage: (dialogData) => {
      if (!dialogData) return "Generate Lesson Plan";
      let message = "Generate Lesson Plan";
      if (dialogData.gradeLevel) message += ` for ${dialogData.gradeLevel}`;
      if (dialogData.timeAllocation) message += ` (${dialogData.timeAllocation})`;
      if (dialogData.learningObjectives) message += ` with specified objectives`;
      return message;
    },
    getBackendMessage: (bookTitle, chapterTitle, dialogData) => {
      let message = "";
      if (bookTitle && chapterTitle) {
        message = `I am a teacher preparing a lesson plan for the book "${bookTitle}" in the chapter "${chapterTitle}". `;
      } else if (chapterTitle) {
        message = `I am a teacher preparing a lesson plan for the chapter "${chapterTitle}". `;
      } else {
        message = `I am a teacher preparing a lesson plan for the current chapter. `;
      }
      
      message += `Please create a comprehensive, professional lesson plan that includes: `;
      message += `1) Clear learning objectives, 2) Detailed lesson structure and timeline, 3) Teaching methodologies and activities, 4) Assessment strategies, 5) Required materials and resources. `;
      
      if (dialogData?.gradeLevel) {
        message += `The lesson is designed for ${dialogData.gradeLevel} level students. `;
      }
      
      if (dialogData?.timeAllocation) {
        message += `The allocated time for this lesson is ${dialogData.timeAllocation}. `;
      }
      
      if (dialogData?.learningObjectives) {
        message += `Specific learning objectives: ${dialogData.learningObjectives}. `;
      }
      
      if (dialogData?.additionalNotes) {
        message += `Additional requirements: ${dialogData.additionalNotes}. `;
      }
      
      message += `Ensure the lesson plan is pedagogically sound, engaging, and aligned with educational best practices.`;
      
      return message;
    },
  },
  "teaching-coach": {
    displayMessage: "Teaching Coach Consultation",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". I need professional teaching guidance and coaching. Please provide expert advice on: effective teaching strategies for this content, student engagement techniques, common challenges and solutions, differentiation strategies, and assessment approaches. Provide practical, actionable recommendations based on educational best practices.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". I need professional teaching guidance and coaching. Please provide expert advice on: effective teaching strategies for this content, student engagement techniques, common challenges and solutions, differentiation strategies, and assessment approaches. Provide practical, actionable recommendations based on educational best practices.`;
      } else {
        return `I am a teacher and need professional teaching guidance and coaching. Please provide expert advice on: effective teaching strategies, student engagement techniques, common challenges and solutions, differentiation strategies, and assessment approaches. Provide practical, actionable recommendations based on educational best practices.`;
      }
    },
  },
  "question-bank": {
    displayMessage: "Access Question Bank",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide me with a comprehensive question bank for this chapter. Include a variety of question types (multiple choice, short answer, long answer, essay) covering all key concepts and learning objectives. Ensure questions are well-structured, educationally appropriate, and aligned with the chapter content.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". Please provide me with a comprehensive question bank for this chapter. Include a variety of question types (multiple choice, short answer, long answer, essay) covering all key concepts and learning objectives. Ensure questions are well-structured, educationally appropriate, and aligned with the chapter content.`;
      } else {
        return `I am a teacher and need access to a comprehensive question bank for the current chapter. Please provide a variety of question types (multiple choice, short answer, long answer, essay) covering all key concepts and learning objectives. Ensure questions are well-structured, educationally appropriate, and aligned with the chapter content.`;
      }
    },
  },
  "analytics": {
    displayMessage: "Chapter Analytics & Insights",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide comprehensive analytics and insights for this chapter including: key learning outcomes, difficulty analysis, topic coverage breakdown, suggested teaching focus areas, common student misconceptions, and recommended assessment strategies. Provide data-driven insights to help me optimize my teaching approach.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". Please provide comprehensive analytics and insights for this chapter including: key learning outcomes, difficulty analysis, topic coverage breakdown, suggested teaching focus areas, common student misconceptions, and recommended assessment strategies. Provide data-driven insights to help me optimize my teaching approach.`;
      } else {
        return `I am a teacher and need comprehensive analytics and insights for the current chapter including: key learning outcomes, difficulty analysis, topic coverage breakdown, suggested teaching focus areas, common student misconceptions, and recommended assessment strategies. Provide data-driven insights to help me optimize my teaching approach.`;
      }
    },
  },
  "create-question-paper": {
    displayMessage: "Create Question Paper",
    requiresDialog: true,
    getDisplayMessage: (dialogData) => {
      if (!dialogData) return "Create Question Paper";
      let message = "Create Question Paper";
      if (dialogData.numberOfQuestions) message += ` with ${dialogData.numberOfQuestions} questions`;
      if (dialogData.assessmentType) message += ` (${dialogData.assessmentType})`;
      if (dialogData.timeAllocation) message += ` - ${dialogData.timeAllocation}`;
      return message;
    },
    getBackendMessage: (bookTitle, chapterTitle, dialogData) => {
      let message = "";
      if (bookTitle && chapterTitle) {
        message = `I am a teacher creating a question paper for the book "${bookTitle}" in the chapter "${chapterTitle}". `;
      } else if (chapterTitle) {
        message = `I am a teacher creating a question paper for the chapter "${chapterTitle}". `;
      } else {
        message = `I am a teacher creating a question paper for the current chapter. `;
      }
      
      const numQuestions = dialogData?.numberOfQuestions || 20;
      message += `Please create a professional, comprehensive question paper with ${numQuestions} questions. `;
      
      if (dialogData?.assessmentType) {
        message += `The assessment type is: ${dialogData.assessmentType}. `;
      }
      
      if (dialogData?.timeAllocation) {
        message += `The allocated time for this assessment is ${dialogData.timeAllocation}. `;
      }
      
      message += `Include a balanced mix of question types (multiple choice, short answer, long answer, essay) that comprehensively cover all important topics in the chapter. `;
      message += `Each question should be clear, well-structured, and educationally appropriate. `;
      message += `Include marking schemes and suggested answers where applicable. `;
      
      if (dialogData?.difficulty && dialogData.difficulty !== "mixed") {
        message += `The questions should be of ${dialogData.difficulty} difficulty level. `;
      } else {
        message += `Include a mix of easy, medium, and hard difficulty questions. `;
      }
      
      if (dialogData?.additionalNotes) {
        message += `Additional requirements: ${dialogData.additionalNotes}. `;
      }
      
      message += `Ensure all questions are relevant, accurate, and appropriate for the chapter content.`;
      
      return message;
    },
  },
  "lesson-plan-advanced": {
    displayMessage: "Advanced Lesson Plan",
    requiresDialog: true,
    getDisplayMessage: (dialogData) => {
      if (!dialogData) return "Advanced Lesson Plan";
      let message = "Advanced Lesson Plan";
      if (dialogData.gradeLevel) message += ` for ${dialogData.gradeLevel}`;
      return message;
    },
    getBackendMessage: (bookTitle, chapterTitle, dialogData) => {
      let message = "";
      if (bookTitle && chapterTitle) {
        message = `I am a teacher creating an advanced lesson plan for the book "${bookTitle}" in the chapter "${chapterTitle}". `;
      } else if (chapterTitle) {
        message = `I am a teacher creating an advanced lesson plan for the chapter "${chapterTitle}". `;
      } else {
        message = `I am a teacher creating an advanced lesson plan for the current chapter. `;
      }
      
      message += `Please create a comprehensive, advanced lesson plan that includes: `;
      message += `1) Detailed learning objectives aligned with curriculum standards, 2) Multi-stage lesson structure with precise timing, 3) Advanced teaching methodologies (inquiry-based, project-based, collaborative learning), 4) Differentiation strategies for diverse learners, 5) Formative and summative assessment strategies, 6) Integration of technology and multimedia resources, 7) Extension activities for advanced students, 8) Remediation strategies for struggling students. `;
      
      if (dialogData?.gradeLevel) {
        message += `The lesson is designed for ${dialogData.gradeLevel} level students. `;
      }
      
      if (dialogData?.timeAllocation) {
        message += `The allocated time for this lesson is ${dialogData.timeAllocation}. `;
      }
      
      if (dialogData?.learningObjectives) {
        message += `Specific learning objectives: ${dialogData.learningObjectives}. `;
      }
      
      if (dialogData?.additionalNotes) {
        message += `Additional requirements: ${dialogData.additionalNotes}. `;
      }
      
      message += `Ensure the lesson plan is pedagogically advanced, research-based, and incorporates modern educational best practices.`;
      
      return message;
    },
  },
  "teaching-coach-advanced": {
    displayMessage: "Advanced Teaching Coach",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am an experienced teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". I need advanced teaching coaching and mentorship. Please provide expert-level guidance on: advanced pedagogical strategies, innovative teaching methodologies, student-centered learning approaches, technology integration, assessment for learning techniques, classroom management strategies, and professional development recommendations. Provide research-based, evidence-informed recommendations tailored to experienced educators.`;
      } else if (chapterTitle) {
        return `I am an experienced teacher working on the chapter "${chapterTitle}". I need advanced teaching coaching and mentorship. Please provide expert-level guidance on: advanced pedagogical strategies, innovative teaching methodologies, student-centered learning approaches, technology integration, assessment for learning techniques, classroom management strategies, and professional development recommendations. Provide research-based, evidence-informed recommendations tailored to experienced educators.`;
      } else {
        return `I am an experienced teacher and need advanced teaching coaching and mentorship. Please provide expert-level guidance on: advanced pedagogical strategies, innovative teaching methodologies, student-centered learning approaches, technology integration, assessment for learning techniques, classroom management strategies, and professional development recommendations. Provide research-based, evidence-informed recommendations tailored to experienced educators.`;
      }
    },
  },
  "definitions-concepts": {
    displayMessage: "Key Definitions & Concepts",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide a comprehensive list of all key definitions, concepts, and important terms found in this chapter. For each definition, include: the precise definition, context and usage, related concepts, examples, and teaching notes. Organize them clearly and ensure each definition is accurate, complete, and suitable for teaching purposes.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". Please provide a comprehensive list of all key definitions, concepts, and important terms found in this chapter. For each definition, include: the precise definition, context and usage, related concepts, examples, and teaching notes. Organize them clearly and ensure each definition is accurate, complete, and suitable for teaching purposes.`;
      } else {
        return `I am a teacher and need a comprehensive list of all key definitions, concepts, and important terms for the current chapter. For each definition, include: the precise definition, context and usage, related concepts, examples, and teaching notes. Organize them clearly and ensure each definition is accurate, complete, and suitable for teaching purposes.`;
      }
    },
  },
  "chapter-summary": {
    displayMessage: "Chapter Summary for Teaching",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide a comprehensive, professional chapter summary designed for teaching purposes. Include: main topics and themes, key learning points, important concepts, teaching highlights, potential discussion points, and connections to broader curriculum. Ensure the summary is well-structured, accurate, and useful for lesson preparation.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". Please provide a comprehensive, professional chapter summary designed for teaching purposes. Include: main topics and themes, key learning points, important concepts, teaching highlights, potential discussion points, and connections to broader curriculum. Ensure the summary is well-structured, accurate, and useful for lesson preparation.`;
      } else {
        return `I am a teacher and need a comprehensive, professional chapter summary designed for teaching purposes. Include: main topics and themes, key learning points, important concepts, teaching highlights, potential discussion points, and connections to broader curriculum. Ensure the summary is well-structured, accurate, and useful for lesson preparation.`;
      }
    },
  },
  "interactive-activities": {
    displayMessage: "Interactive Activities & Exercises",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide a comprehensive collection of interactive activities, exercises, and hands-on learning experiences for this chapter. Include: group activities, individual exercises, discussion prompts, practical applications, games or simulations, and assessment activities. Ensure all activities are engaging, educationally valuable, and aligned with the chapter's learning objectives.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". Please provide a comprehensive collection of interactive activities, exercises, and hands-on learning experiences for this chapter. Include: group activities, individual exercises, discussion prompts, practical applications, games or simulations, and assessment activities. Ensure all activities are engaging, educationally valuable, and aligned with the chapter's learning objectives.`;
      } else {
        return `I am a teacher and need a comprehensive collection of interactive activities, exercises, and hands-on learning experiences for the current chapter. Include: group activities, individual exercises, discussion prompts, practical applications, games or simulations, and assessment activities. Ensure all activities are engaging, educationally valuable, and aligned with the chapter's learning objectives.`;
      }
    },
  },
  "homework-assignment": {
    displayMessage: "Homework & Assignment Ideas",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide comprehensive homework and assignment ideas for this chapter. Include: various assignment types (written, research, projects, presentations), clear instructions and rubrics, differentiation options for different ability levels, assessment criteria, and suggested time allocations. Ensure assignments are meaningful, reinforce learning, and provide opportunities for student growth.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". Please provide comprehensive homework and assignment ideas for this chapter. Include: various assignment types (written, research, projects, presentations), clear instructions and rubrics, differentiation options for different ability levels, assessment criteria, and suggested time allocations. Ensure assignments are meaningful, reinforce learning, and provide opportunities for student growth.`;
      } else {
        return `I am a teacher and need comprehensive homework and assignment ideas for the current chapter. Include: various assignment types (written, research, projects, presentations), clear instructions and rubrics, differentiation options for different ability levels, assessment criteria, and suggested time allocations. Ensure assignments are meaningful, reinforce learning, and provide opportunities for student growth.`;
      }
    },
  },
  "suggested-videos": {
    displayMessage: "Suggested Educational Videos",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide a curated list of suggested educational videos, multimedia resources, and online content that would enhance teaching and learning for this chapter. Include: video recommendations with descriptions, appropriate grade levels, key learning points covered, discussion questions to accompany videos, and integration suggestions for classroom use. Ensure all recommendations are educationally appropriate and aligned with the chapter content.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". Please provide a curated list of suggested educational videos, multimedia resources, and online content that would enhance teaching and learning for this chapter. Include: video recommendations with descriptions, appropriate grade levels, key learning points covered, discussion questions to accompany videos, and integration suggestions for classroom use. Ensure all recommendations are educationally appropriate and aligned with the chapter content.`;
      } else {
        return `I am a teacher and need a curated list of suggested educational videos, multimedia resources, and online content for the current chapter. Include: video recommendations with descriptions, appropriate grade levels, key learning points covered, discussion questions to accompany videos, and integration suggestions for classroom use. Ensure all recommendations are educationally appropriate and aligned with the chapter content.`;
      }
    },
  },
  "real-world-examples": {
    displayMessage: "Real-World Examples & Applications",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `I am a teacher working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide comprehensive real-world examples, applications, and case studies related to this chapter's content. Include: practical examples from various fields, current events and news connections, career applications, everyday life connections, and case studies that illustrate key concepts. Ensure examples are relevant, engaging, and help students understand the practical significance of the material.`;
      } else if (chapterTitle) {
        return `I am a teacher working on the chapter "${chapterTitle}". Please provide comprehensive real-world examples, applications, and case studies related to this chapter's content. Include: practical examples from various fields, current events and news connections, career applications, everyday life connections, and case studies that illustrate key concepts. Ensure examples are relevant, engaging, and help students understand the practical significance of the material.`;
      } else {
        return `I am a teacher and need comprehensive real-world examples, applications, and case studies for the current chapter. Include: practical examples from various fields, current events and news connections, career applications, everyday life connections, and case studies that illustrate key concepts. Ensure examples are relevant, engaging, and help students understand the practical significance of the material.`;
      }
    },
  },
};

/**
 * Get the display message for a teacher tool
 * @param toolId - The ID of the teacher tool
 * @param dialogData - Optional dialog data to include in the display message
 */
export function getTeacherToolDisplayMessage(toolId: string, dialogData?: TeacherToolDialogData): string {
  const config = teacherToolMessages[toolId];
  if (!config) return toolId;
  
  // If there's a custom display message generator and dialog data, use it
  if (config.getDisplayMessage && dialogData) {
    return config.getDisplayMessage(dialogData);
  }
  
  // Otherwise, use the base display message
  return config.displayMessage;
}

/**
 * Get the backend message for a teacher tool with context
 */
export function getTeacherToolBackendMessage(
  toolId: string,
  bookTitle?: string,
  chapterTitle?: string,
  dialogData?: TeacherToolDialogData
): string {
  const config = teacherToolMessages[toolId];
  if (!config) {
    return `Help me with ${toolId}`;
  }
  return config.getBackendMessage(bookTitle, chapterTitle, dialogData);
}

/**
 * Check if a teacher tool requires a dialog for user input
 */
export function teacherToolRequiresDialog(toolId: string): boolean {
  return teacherToolMessages[toolId]?.requiresDialog === true;
}
