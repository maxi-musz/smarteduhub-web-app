/**
 * Types and interfaces for Chat Interface components
 */

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean; // Whether this message is currently being typed
  imageUrl?: string; // Base64 image data URL for user messages
  imageCaption?: string; // Caption for the image
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
  programmaticMessage?: { 
    message: string; 
    displayContent?: string; 
    imageUrl?: string; 
    imageCaption?: string;
    metadata?: { page: number; coordinates?: { x: number; y: number; width: number; height: number } };
  } | null; // Message to send programmatically
  onProgrammaticMessageSent?: () => void; // Callback when programmatic message is sent
}
