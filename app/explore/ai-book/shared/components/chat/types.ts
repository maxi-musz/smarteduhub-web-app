/**
 * Types and interfaces for Chat Interface components
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean; // Whether this message is currently being typed
}

export interface StudyTool {
  id: string;
  label: string;
  iconColor: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface ChatInterfaceProps {
  bookTitle?: string;
  chapterTitle?: string;
  initialMessage?: string;
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  studyTools?: StudyTool[];
  showStudyTools?: boolean;
  onStudyToolClick?: (toolId: string) => void;
  disclaimer?: string;
  materialId?: string; // Chapter ID for socket messaging
  useSocket?: boolean; // Whether to use socket for messaging (default: true)
}
