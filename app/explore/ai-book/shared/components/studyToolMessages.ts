/**
 * Study Tool Messages Configuration
 * 
 * This file contains the user-friendly display messages and backend messages
 * for each study tool. When a user selects a study tool:
 * - The display message is shown in the UI (what the user sees they sent)
 * - The backend message is sent to the server (more detailed and contextual)
 */

export interface StudyToolDialogData {
  numberOfQuestions: number;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  questionType?: "short-answer" | "long-answer" | "mixed";
  additionalNotes?: string;
  includeAnswers?: boolean; // Default: true
  includeExplanations?: boolean; // Default: true
}

export interface StudyToolMessageConfig {
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
  getDisplayMessage?: (dialogData?: StudyToolDialogData) => string;
  /** 
   * Function that generates the backend message with context
   * @param bookTitle - The title of the book (optional)
   * @param chapterTitle - The title of the chapter (optional)
   * @param dialogData - User input data from dialog (optional)
   * @returns The message to send to the backend
   */
  getBackendMessage: (bookTitle?: string, chapterTitle?: string, dialogData?: StudyToolDialogData) => string;
}

export const studyToolMessages: Record<string, StudyToolMessageConfig> = {
  "chapter-summary": {
    displayMessage: "Chapter Summary",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide a complete, accurate, and comprehensive chapter summary of this chapter. Ensure all information is correct and well-structured.`;
      } else if (chapterTitle) {
        return `The user is currently working on the chapter "${chapterTitle}". Please provide a complete, accurate, and comprehensive chapter summary of this chapter. Ensure all information is correct and well-structured.`;
      } else {
        return `Please provide a complete, accurate, and comprehensive chapter summary of the current chapter. Ensure all information is correct and well-structured.`;
      }
    },
  },
  "important-notes": {
    displayMessage: "Important Notes for Exams",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide important notes and key points that are essential for exams related to this chapter. Focus on critical concepts, formulas, definitions, and exam-relevant information. Ensure all information is accurate and correct.`;
      } else if (chapterTitle) {
        return `The user is currently working on the chapter "${chapterTitle}". Please provide important notes and key points that are essential for exams related to this chapter. Focus on critical concepts, formulas, definitions, and exam-relevant information. Ensure all information is accurate and correct.`;
      } else {
        return `Please provide important notes and key points that are essential for exams related to the current chapter. Focus on critical concepts, formulas, definitions, and exam-relevant information. Ensure all information is accurate and correct.`;
      }
    },
  },
  "revision-notes": {
    displayMessage: "Revision Notes",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please create comprehensive revision notes for this chapter. Include key concepts, summaries, important points, and a structured format that facilitates effective revision. Ensure all information is accurate and correct.`;
      } else if (chapterTitle) {
        return `The user is currently working on the chapter "${chapterTitle}". Please create comprehensive revision notes for this chapter. Include key concepts, summaries, important points, and a structured format that facilitates effective revision. Ensure all information is accurate and correct.`;
      } else {
        return `Please create comprehensive revision notes for the current chapter. Include key concepts, summaries, important points, and a structured format that facilitates effective revision. Ensure all information is accurate and correct.`;
      }
    },
  },
  "common-mistakes": {
    displayMessage: "Common Mistakes",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please identify and explain common mistakes that students typically make when studying or answering questions related to this chapter. Provide clear explanations of why these mistakes occur and how to avoid them. Ensure all information is accurate and correct.`;
      } else if (chapterTitle) {
        return `The user is currently working on the chapter "${chapterTitle}". Please identify and explain common mistakes that students typically make when studying or answering questions related to this chapter. Provide clear explanations of why these mistakes occur and how to avoid them. Ensure all information is accurate and correct.`;
      } else {
        return `Please identify and explain common mistakes that students typically make when studying or answering questions related to the current chapter. Provide clear explanations of why these mistakes occur and how to avoid them. Ensure all information is accurate and correct.`;
      }
    },
  },
  "study-tricks": {
    displayMessage: "Study Tricks",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please provide effective study tricks, tips, and strategies specifically tailored for mastering this chapter. Include memory techniques, learning strategies, and practical approaches that will help the user understand and retain the material better. Ensure all information is accurate and correct.`;
      } else if (chapterTitle) {
        return `The user is currently working on the chapter "${chapterTitle}". Please provide effective study tricks, tips, and strategies specifically tailored for mastering this chapter. Include memory techniques, learning strategies, and practical approaches that will help the user understand and retain the material better. Ensure all information is accurate and correct.`;
      } else {
        return `Please provide effective study tricks, tips, and strategies specifically tailored for mastering the current chapter. Include memory techniques, learning strategies, and practical approaches that will help the user understand and retain the material better. Ensure all information is accurate and correct.`;
      }
    },
  },
  "create-definitions": {
    displayMessage: "Create Definitions / Concepts",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please create comprehensive definitions and explanations of all key concepts, terms, and important definitions found in this chapter. Organize them clearly and ensure each definition is accurate, complete, and easy to understand. Ensure all information is correct.`;
      } else if (chapterTitle) {
        return `The user is currently working on the chapter "${chapterTitle}". Please create comprehensive definitions and explanations of all key concepts, terms, and important definitions found in this chapter. Organize them clearly and ensure each definition is accurate, complete, and easy to understand. Ensure all information is correct.`;
      } else {
        return `Please create comprehensive definitions and explanations of all key concepts, terms, and important definitions found in the current chapter. Organize them clearly and ensure each definition is accurate, complete, and easy to understand. Ensure all information is correct.`;
      }
    },
  },
  "create-question-paper": {
    displayMessage: "Create Question Paper",
    getBackendMessage: (bookTitle, chapterTitle) => {
      if (bookTitle && chapterTitle) {
        return `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". Please create a comprehensive question paper based on this chapter. Include a variety of question types (multiple choice, short answer, long answer, etc.) that cover all important topics in the chapter. Ensure all questions are relevant, accurate, and appropriate for the chapter content.`;
      } else if (chapterTitle) {
        return `The user is currently working on the chapter "${chapterTitle}". Please create a comprehensive question paper based on this chapter. Include a variety of question types (multiple choice, short answer, long answer, etc.) that cover all important topics in the chapter. Ensure all questions are relevant, accurate, and appropriate for the chapter content.`;
      } else {
        return `Please create a comprehensive question paper based on the current chapter. Include a variety of question types (multiple choice, short answer, long answer, etc.) that cover all important topics in the chapter. Ensure all questions are relevant, accurate, and appropriate for the chapter content.`;
      }
    },
  },
  "create-questions-answers": {
    displayMessage: "Create Questions and Answers",
    requiresDialog: true,
    getDisplayMessage: (dialogData) => {
      if (!dialogData) return "Create Questions and Answers";
      
      const numQuestions = dialogData.numberOfQuestions;
      const difficulty = dialogData.difficulty || "mixed";
      const questionType = dialogData.questionType || "mixed";
      const includeAnswers = dialogData.includeAnswers !== false; // Default true
      const includeExplanations = dialogData.includeExplanations !== false; // Default true
      
      let message = `Create Questions and Answers with ${numQuestions} question${numQuestions !== 1 ? "s" : ""}`;
      
      if (difficulty !== "mixed") {
        message += `, difficulty: ${difficulty}`;
      } else {
        message += `, difficulty: mixed`;
      }
      
      if (questionType !== "mixed") {
        const typeLabel = questionType === "short-answer" ? "short answer" : "long answer";
        message += `, type: ${typeLabel}`;
      } else {
        message += `, type: mixed`;
      }
      
      if (!includeAnswers) {
        message += `, without answers`;
      }
      
      if (!includeExplanations) {
        message += `, without explanations`;
      }
      
      return message;
    },
    getBackendMessage: (bookTitle, chapterTitle, dialogData) => {
      const numQuestions = dialogData?.numberOfQuestions || 10;
      const difficulty = dialogData?.difficulty || "mixed";
      const questionType = dialogData?.questionType || "mixed";
      const additionalNotes = dialogData?.additionalNotes;
      const includeAnswers = dialogData?.includeAnswers !== false; // Default true
      const includeExplanations = dialogData?.includeExplanations !== false; // Default true
      
      let message = "";
      if (bookTitle && chapterTitle) {
        message = `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". `;
      } else if (chapterTitle) {
        message = `The user is currently working on the chapter "${chapterTitle}". `;
      }
      
      message += `Please create ${numQuestions} question(s) based on this chapter. `;
      
      if (includeAnswers) {
        message += `Include detailed answers for each question. `;
      } else {
        message += `Do NOT include answers - provide only the questions. `;
      }
      
      if (includeExplanations && includeAnswers) {
        message += `Include explanations for the answers. `;
      } else if (includeExplanations && !includeAnswers) {
        message += `Include explanations for the questions. `;
      }
      
      if (difficulty !== "mixed") {
        message += `The questions should be of ${difficulty} difficulty level. `;
      } else {
        message += `Include a mix of easy, medium, and hard difficulty questions. `;
      }
      
      if (questionType === "short-answer") {
        message += `All questions should be short answer questions. `;
      } else if (questionType === "long-answer") {
        message += `All questions should be long answer/essay questions. `;
      } else {
        message += `Include a mix of short answer and long answer questions. `;
      }
      
      if (additionalNotes) {
        message += `Additional requirements: ${additionalNotes}. `;
      }
      
      message += `Ensure all questions are relevant, accurate, and appropriate for the chapter content.`;
      
      return message;
    },
  },
  "create-mcqs": {
    displayMessage: "Create MCQs",
    requiresDialog: true,
    getDisplayMessage: (dialogData) => {
      if (!dialogData) return "Create MCQs";
      
      const numQuestions = dialogData.numberOfQuestions;
      const difficulty = dialogData.difficulty || "mixed";
      const includeAnswers = dialogData.includeAnswers !== false; // Default true
      const includeExplanations = dialogData.includeExplanations !== false; // Default true
      
      let message = `Create MCQs with ${numQuestions} question${numQuestions !== 1 ? "s" : ""}`;
      
      if (difficulty !== "mixed") {
        message += `, difficulty: ${difficulty}`;
      } else {
        message += `, difficulty: mixed`;
      }
      
      if (!includeAnswers) {
        message += `, without answers`;
      }
      
      if (!includeExplanations) {
        message += `, without explanations`;
      }
      
      return message;
    },
    getBackendMessage: (bookTitle, chapterTitle, dialogData) => {
      const numQuestions = dialogData?.numberOfQuestions || 10;
      const difficulty = dialogData?.difficulty || "mixed";
      const additionalNotes = dialogData?.additionalNotes;
      const includeAnswers = dialogData?.includeAnswers !== false; // Default true
      const includeExplanations = dialogData?.includeExplanations !== false; // Default true
      
      let message = "";
      if (bookTitle && chapterTitle) {
        message = `The user is currently working on the book "${bookTitle}" in the chapter "${chapterTitle}". `;
      } else if (chapterTitle) {
        message = `The user is currently working on the chapter "${chapterTitle}". `;
      }
      
      message += `Please create ${numQuestions} multiple choice question(s) (MCQs) based on this chapter. `;
      
      message += `Each question should have 4 options (A, B, C, D) with only one correct answer. `;
      
      if (includeAnswers) {
        message += `Include the correct answer for each question. `;
      } else {
        message += `Do NOT include the correct answers - provide only the questions with options. `;
      }
      
      if (includeExplanations && includeAnswers) {
        message += `Provide clear explanations for why the correct answer is right and why the incorrect options are wrong. `;
      } else if (includeExplanations && !includeAnswers) {
        message += `Include explanations for each question. `;
      }
      
      if (difficulty !== "mixed") {
        message += `The questions should be of ${difficulty} difficulty level. `;
      } else {
        message += `Include a mix of easy, medium, and hard difficulty questions. `;
      }
      
      if (additionalNotes) {
        message += `Additional requirements: ${additionalNotes}. `;
      }
      
      message += `Ensure all questions are relevant, accurate, and appropriate for the chapter content.`;
      
      return message;
    },
  },
};

/**
 * Get the display message for a study tool
 * @param toolId - The ID of the study tool
 * @param dialogData - Optional dialog data to include in the display message
 */
export function getStudyToolDisplayMessage(toolId: string, dialogData?: StudyToolDialogData): string {
  const config = studyToolMessages[toolId];
  if (!config) return toolId;
  
  // If there's a custom display message generator and dialog data, use it
  if (config.getDisplayMessage && dialogData) {
    return config.getDisplayMessage(dialogData);
  }
  
  // Otherwise, use the base display message
  return config.displayMessage;
}

/**
 * Get the backend message for a study tool with context
 */
export function getStudyToolBackendMessage(
  toolId: string,
  bookTitle?: string,
  chapterTitle?: string,
  dialogData?: StudyToolDialogData
): string {
  const config = studyToolMessages[toolId];
  if (!config) {
    return `Help me with ${toolId}`;
  }
  return config.getBackendMessage(bookTitle, chapterTitle, dialogData);
}

/**
 * Check if a study tool requires a dialog for user input
 */
export function studyToolRequiresDialog(toolId: string): boolean {
  return studyToolMessages[toolId]?.requiresDialog === true;
}
