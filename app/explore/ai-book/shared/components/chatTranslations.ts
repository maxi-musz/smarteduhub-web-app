/**
 * Chat Interface Translations
 * Provides localized strings for the chat interface based on selected language
 */

export interface ChatTranslations {
  // Initial messages
  initialMessageWithChapter: string;
  initialMessageNoChapter: string;
  
  // Connection status
  connected: string;
  connecting: string;
  disconnected: string;
  
  // UI Labels
  selectStudyTool: string;
  connectingToServer: string;
  askQuestionPlaceholder: string;
  selectChapterFirst: string;
  aiTyping: string;
  thinking: string;
  
  // Disclaimer
  disclaimer: string;
  
  // Study Tools
  studyTools: {
    chapterSummary: string;
    importantNotes: string;
    revisionNotes: string;
    commonMistakes: string;
    studyTricks: string;
    createDefinitions: string;
    createQuestionPaper: string;
    createQuestionsAnswers: string;
    createMcqs: string;
  };
}

const translations: Record<string, ChatTranslations> = {
  en: {
    initialMessageWithChapter: "Hello! How can I assist you with the chapter today? Feel free to ask any questions you have.",
    initialMessageNoChapter: "Hello! Please select a chapter to start chatting about the book content.",
    connected: "Connected",
    connecting: "Connecting...",
    disconnected: "Disconnected",
    selectStudyTool: "Select a study tool...",
    connectingToServer: "Connecting to chat server...",
    askQuestionPlaceholder: "Ask any question about the chapter...",
    selectChapterFirst: "Please select a chapter first to start chatting...",
    aiTyping: "AI is typing...",
    thinking: "Thinking...",
    disclaimer: "iBookGPT's answers are based on the provided book and might have errors.",
    studyTools: {
      chapterSummary: "Chapter Summary",
      importantNotes: "Important Notes for Exams",
      revisionNotes: "Revision Notes",
      commonMistakes: "Common Mistakes",
      studyTricks: "Study Tricks",
      createDefinitions: "Create Definitions / Concepts",
      createQuestionPaper: "Create Question Paper",
      createQuestionsAnswers: "Create Questions and Answers",
      createMcqs: "Create MCQs",
    },
  },
  yo: {
    initialMessageWithChapter: "Bawo! Bawo ni mo le ran ọ lọwọ nipa isalẹ yii loni? Jọwọ bi ibeere eyikeyi ti o ba ni.",
    initialMessageNoChapter: "Bawo! Jọwọ yan isalẹ kan lati bẹrẹ sọrọ nipa akoonu iwe naa.",
    connected: "Ti sopọ",
    connecting: "N sopọ...",
    disconnected: "Ti yọ kuro",
    selectStudyTool: "Yan ohun elo iwadi...",
    connectingToServer: "N sopọ si olupin sọrọ...",
    askQuestionPlaceholder: "Bi ibeere eyikeyi nipa isalẹ...",
    selectChapterFirst: "Jọwọ yan isalẹ kan ni akọkọ lati bẹrẹ sọrọ...",
    aiTyping: "AI n kọ...",
    thinking: "N ronú...",
    disclaimer: "Idahun iBookGPT da lori iwe ti a fun ati pe o le ni aṣiṣe.",
    studyTools: {
      chapterSummary: "Akojọ Isalẹ",
      importantNotes: "Awọn Akọsilẹ Pataki fun Awọn Idanwo",
      revisionNotes: "Awọn Akọsilẹ Atunṣe",
      commonMistakes: "Awọn Aṣiṣe Wọpọ",
      studyTricks: "Awọn Eto Ikawe",
      createDefinitions: "Ṣẹda Awọn Itumọ / Awọn Erongba",
      createQuestionPaper: "Ṣẹda Iwe Ibeere",
      createQuestionsAnswers: "Ṣẹda Awọn Ibeere ati Awọn Idahun",
      createMcqs: "Ṣẹda Awọn Ibeere Yiyan Pupọ",
    },
  },
  ig: {
    initialMessageWithChapter: "Ndewo! Kedu ka m nwere ike inyere gị aka na isi nke taa? Biko jụọ ajụjụ ọ bụla ị nwere.",
    initialMessageNoChapter: "Ndewo! Biko họrọ isi ka ịmalite ịgba ajụjụ banyere ọdịnaya akwụkwọ ahụ.",
    connected: "Ejikọrọ",
    connecting: "Na-ejikọ...",
    disconnected: "Akwụsịla",
    selectStudyTool: "Họrọ ngwa ọmụmụ...",
    connectingToServer: "Na-ejikọ na sava mkparịta ụka...",
    askQuestionPlaceholder: "Jụọ ajụjụ ọ bụla banyere isi...",
    selectChapterFirst: "Biko họrọ isi mbụ ka ịmalite ịgba ajụjụ...",
    aiTyping: "AI na-ede...",
    thinking: "Na-eche...",
    disclaimer: "Azịza iBookGPT dabere na akwụkwọ enyere ma nwee ike inwe njehie.",
    studyTools: {
      chapterSummary: "Nchịkọta Isi",
      importantNotes: "Ihe Ndị Dị Mkpa Maka Ule",
      revisionNotes: "Ihe Ndị Ntugharị",
      commonMistakes: "Njehie Ndị A Na-ahụkarị",
      studyTricks: "Atụmatụ Ọmụmụ",
      createDefinitions: "Mepụta Nkọwa / Echiche",
      createQuestionPaper: "Mepụta Akwụkwọ Ajụjụ",
      createQuestionsAnswers: "Mepụta Ajụjụ na Azịza",
      createMcqs: "Mepụta Ajụjụ Nhọrọ Ọtụtụ",
    },
  },
  ha: {
    initialMessageWithChapter: "Sannu! Yaya zan iya taimaka muku game da babi na yau? Don Allah yi tambaya duk wanda kuke da shi.",
    initialMessageNoChapter: "Sannu! Don Allah zaɓi babi don fara tattaunawa game da abubuwan littafin.",
    connected: "An haɗa",
    connecting: "Ana haɗawa...",
    disconnected: "An cire haɗin",
    selectStudyTool: "Zaɓi kayan aikin karatu...",
    connectingToServer: "Ana haɗawa zuwa uwar garken tattaunawa...",
    askQuestionPlaceholder: "Yi tambaya duk game da babi...",
    selectChapterFirst: "Don Allah zaɓi babi da farko don fara tattaunawa...",
    aiTyping: "AI yana rubutu...",
    thinking: "Tunani...",
    disclaimer: "Amsoshin iBookGPT ya dogara ne akan littafin da aka bayar kuma yana iya samun kurakurai.",
    studyTools: {
      chapterSummary: "Taƙaitaccen Babi",
      importantNotes: "Bayanan Muhimmanci don Jarrabawa",
      revisionNotes: "Bayanan Bita",
      commonMistakes: "Kurakuran Gama Gari",
      studyTricks: "Dabarun Karatu",
      createDefinitions: "Ƙirƙiri Ma'anoni / Ra'ayoyi",
      createQuestionPaper: "Ƙirƙiri Takardar Tambaya",
      createQuestionsAnswers: "Ƙirƙiri Tambayoyi da Amsoshi",
      createMcqs: "Ƙirƙiri Tambayoyin Zaɓi da Yawa",
    },
  },
  fr: {
    initialMessageWithChapter: "Bonjour ! Comment puis-je vous aider avec le chapitre aujourd'hui ? N'hésitez pas à poser toutes vos questions.",
    initialMessageNoChapter: "Bonjour ! Veuillez sélectionner un chapitre pour commencer à discuter du contenu du livre.",
    connected: "Connecté",
    connecting: "Connexion...",
    disconnected: "Déconnecté",
    selectStudyTool: "Sélectionner un outil d'étude...",
    connectingToServer: "Connexion au serveur de chat...",
    askQuestionPlaceholder: "Posez une question sur le chapitre...",
    selectChapterFirst: "Veuillez d'abord sélectionner un chapitre pour commencer à discuter...",
    aiTyping: "L'IA tape...",
    thinking: "Réflexion...",
    disclaimer: "Les réponses d'iBookGPT sont basées sur le livre fourni et peuvent contenir des erreurs.",
    studyTools: {
      chapterSummary: "Résumé du Chapitre",
      importantNotes: "Notes Importantes pour les Examens",
      revisionNotes: "Notes de Révision",
      commonMistakes: "Erreurs Courantes",
      studyTricks: "Astuces d'Étude",
      createDefinitions: "Créer des Définitions / Concepts",
      createQuestionPaper: "Créer un Questionnaire",
      createQuestionsAnswers: "Créer des Questions et Réponses",
      createMcqs: "Créer des QCM",
    },
  },
  es: {
    initialMessageWithChapter: "¡Hola! ¿Cómo puedo ayudarte con el capítulo hoy? Siéntete libre de hacer cualquier pregunta que tengas.",
    initialMessageNoChapter: "¡Hola! Por favor selecciona un capítulo para comenzar a chatear sobre el contenido del libro.",
    connected: "Conectado",
    connecting: "Conectando...",
    disconnected: "Desconectado",
    selectStudyTool: "Seleccionar una herramienta de estudio...",
    connectingToServer: "Conectando al servidor de chat...",
    askQuestionPlaceholder: "Haz cualquier pregunta sobre el capítulo...",
    selectChapterFirst: "Por favor selecciona un capítulo primero para comenzar a chatear...",
    aiTyping: "La IA está escribiendo...",
    thinking: "Pensando...",
    disclaimer: "Las respuestas de iBookGPT se basan en el libro proporcionado y pueden tener errores.",
    studyTools: {
      chapterSummary: "Resumen del Capítulo",
      importantNotes: "Notas Importantes para Exámenes",
      revisionNotes: "Notas de Revisión",
      commonMistakes: "Errores Comunes",
      studyTricks: "Trucos de Estudio",
      createDefinitions: "Crear Definiciones / Conceptos",
      createQuestionPaper: "Crear Examen",
      createQuestionsAnswers: "Crear Preguntas y Respuestas",
      createMcqs: "Crear Preguntas de Opción Múltiple",
    },
  },
  sw: {
    initialMessageWithChapter: "Hujambo! Ninawezaje kukusaidia na sura hii leo? Jisikie huru kuuliza maswali yoyote unayo.",
    initialMessageNoChapter: "Hujambo! Tafadhali chagua sura ili kuanza mazungumzo kuhusu maudhui ya kitabu.",
    connected: "Imeunganishwa",
    connecting: "Inaunganisha...",
    disconnected: "Imeondolewa",
    selectStudyTool: "Chagua zana ya kusoma...",
    connectingToServer: "Inaunganisha kwa seva ya mazungumzo...",
    askQuestionPlaceholder: "Uliza swali lolote kuhusu sura...",
    selectChapterFirst: "Tafadhali chagua sura kwanza ili kuanza mazungumzo...",
    aiTyping: "AI inaandika...",
    thinking: "Inafikiri...",
    disclaimer: "Majibu ya iBookGPT yanategemea kitabu kilichotolewa na yanaweza kuwa na makosa.",
    studyTools: {
      chapterSummary: "Muhtasari wa Sura",
      importantNotes: "Maelezo Muhimu kwa Mitihani",
      revisionNotes: "Maelezo ya Uhakiki",
      commonMistakes: "Makosa ya Kawaida",
      studyTricks: "Hila za Kusoma",
      createDefinitions: "Unda Ufafanuzi / Dhana",
      createQuestionPaper: "Unda Karatasi ya Maswali",
      createQuestionsAnswers: "Unda Maswali na Majibu",
      createMcqs: "Unda Maswali ya Chaguo Nyingi",
    },
  },
  ar: {
    initialMessageWithChapter: "مرحباً! كيف يمكنني مساعدتك في الفصل اليوم؟ لا تتردد في طرح أي أسئلة لديك.",
    initialMessageNoChapter: "مرحباً! يرجى اختيار فصل للبدء في الدردشة حول محتوى الكتاب.",
    connected: "متصل",
    connecting: "جاري الاتصال...",
    disconnected: "غير متصل",
    selectStudyTool: "اختر أداة دراسة...",
    connectingToServer: "جاري الاتصال بخادم الدردشة...",
    askQuestionPlaceholder: "اطرح أي سؤال حول الفصل...",
    selectChapterFirst: "يرجى اختيار فصل أولاً لبدء الدردشة...",
    aiTyping: "الذكاء الاصطناعي يكتب...",
    thinking: "جاري التفكير...",
    disclaimer: "إجابات iBookGPT مبنية على الكتاب المقدم وقد تحتوي على أخطاء.",
    studyTools: {
      chapterSummary: "ملخص الفصل",
      importantNotes: "ملاحظات مهمة للامتحانات",
      revisionNotes: "ملاحظات المراجعة",
      commonMistakes: "الأخطاء الشائعة",
      studyTricks: "حيل الدراسة",
      createDefinitions: "إنشاء التعريفات / المفاهيم",
      createQuestionPaper: "إنشاء ورقة أسئلة",
      createQuestionsAnswers: "إنشاء أسئلة وأجوبة",
      createMcqs: "إنشاء أسئلة الاختيار من متعدد",
    },
  },
  hi: {
    initialMessageWithChapter: "नमस्ते! मैं आज अध्याय के साथ आपकी कैसे मदद कर सकता हूं? कृपया कोई भी प्रश्न पूछने में संकोच न करें।",
    initialMessageNoChapter: "नमस्ते! कृपया पुस्तक की सामग्री के बारे में चैट शुरू करने के लिए एक अध्याय चुनें।",
    connected: "जुड़ा हुआ",
    connecting: "जोड़ रहा है...",
    disconnected: "डिस्कनेक्ट",
    selectStudyTool: "एक अध्ययन उपकरण चुनें...",
    connectingToServer: "चैट सर्वर से जोड़ रहा है...",
    askQuestionPlaceholder: "अध्याय के बारे में कोई प्रश्न पूछें...",
    selectChapterFirst: "कृपया पहले एक अध्याय चुनें चैट शुरू करने के लिए...",
    aiTyping: "AI टाइप कर रहा है...",
    thinking: "सोच रहा है...",
    disclaimer: "iBookGPT के उत्तर प्रदान की गई पुस्तक पर आधारित हैं और इसमें त्रुटियां हो सकती हैं।",
    studyTools: {
      chapterSummary: "अध्याय सारांश",
      importantNotes: "परीक्षा के लिए महत्वपूर्ण नोट्स",
      revisionNotes: "संशोधन नोट्स",
      commonMistakes: "सामान्य गलतियां",
      studyTricks: "अध्ययन ट्रिक्स",
      createDefinitions: "परिभाषाएं / अवधारणाएं बनाएं",
      createQuestionPaper: "प्रश्न पत्र बनाएं",
      createQuestionsAnswers: "प्रश्न और उत्तर बनाएं",
      createMcqs: "बहुविकल्पीय प्रश्न बनाएं",
    },
  },
};

/**
 * Get translations for a specific language code
 * Falls back to English if translation is not available
 */
export function getChatTranslations(languageCode: string): ChatTranslations {
  return translations[languageCode] || translations.en;
}

/**
 * Get a specific translation key
 */
export function t(languageCode: string, key: keyof ChatTranslations): string {
  const trans = getChatTranslations(languageCode);
  return trans[key] as string;
}
