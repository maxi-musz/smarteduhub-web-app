"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Comprehensive language list with ISO 639-1 codes
const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
  { code: "pl", name: "Polish", native: "Polski" },
  { code: "nl", name: "Dutch", native: "Nederlands" },
  { code: "sv", name: "Swedish", native: "Svenska" },
  { code: "da", name: "Danish", native: "Dansk" },
  { code: "no", name: "Norwegian", native: "Norsk" },
  { code: "fi", name: "Finnish", native: "Suomi" },
  { code: "el", name: "Greek", native: "Ελληνικά" },
  { code: "he", name: "Hebrew", native: "עברית" },
  { code: "th", name: "Thai", native: "ไทย" },
  { code: "vi", name: "Vietnamese", native: "Tiếng Việt" },
  { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
  { code: "ms", name: "Malay", native: "Bahasa Melayu" },
  { code: "cs", name: "Czech", native: "Čeština" },
  { code: "hu", name: "Hungarian", native: "Magyar" },
  { code: "ro", name: "Romanian", native: "Română" },
  { code: "bg", name: "Bulgarian", native: "Български" },
  { code: "hr", name: "Croatian", native: "Hrvatski" },
  { code: "sk", name: "Slovak", native: "Slovenčina" },
  { code: "sl", name: "Slovenian", native: "Slovenščina" },
  { code: "uk", name: "Ukrainian", native: "Українська" },
  { code: "ca", name: "Catalan", native: "Català" },
  { code: "eu", name: "Basque", native: "Euskara" },
  { code: "ga", name: "Irish", native: "Gaeilge" },
  { code: "mt", name: "Maltese", native: "Malti" },
  { code: "is", name: "Icelandic", native: "Íslenska" },
  { code: "lv", name: "Latvian", native: "Latviešu" },
  { code: "lt", name: "Lithuanian", native: "Lietuvių" },
  { code: "et", name: "Estonian", native: "Eesti" },
  { code: "sw", name: "Swahili", native: "Kiswahili" },
  { code: "yo", name: "Yoruba", native: "Yorùbá" },
  { code: "ig", name: "Igbo", native: "Igbo" },
  { code: "ha", name: "Hausa", native: "Hausa" },
  { code: "af", name: "Afrikaans", native: "Afrikaans" },
  { code: "zu", name: "Zulu", native: "isiZulu" },
  { code: "xh", name: "Xhosa", native: "isiXhosa" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "si", name: "Sinhala", native: "සිංහල" },
  { code: "my", name: "Myanmar", native: "မြန်မာ" },
  { code: "km", name: "Khmer", native: "ខ្មែរ" },
  { code: "lo", name: "Lao", native: "ລາວ" },
  { code: "ka", name: "Georgian", native: "ქართული" },
  { code: "am", name: "Amharic", native: "አማርኛ" },
  { code: "fa", name: "Persian", native: "فارسی" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "ps", name: "Pashto", native: "پښتو" },
  { code: "ku", name: "Kurdish", native: "Kurdî" },
  { code: "az", name: "Azerbaijani", native: "Azərbaycan" },
  { code: "kk", name: "Kazakh", native: "Қазақ" },
  { code: "ky", name: "Kyrgyz", native: "Кыргызча" },
  { code: "uz", name: "Uzbek", native: "O'zbek" },
  { code: "mn", name: "Mongolian", native: "Монгол" },
  { code: "be", name: "Belarusian", native: "Беларуская" },
  { code: "sr", name: "Serbian", native: "Српски" },
  { code: "mk", name: "Macedonian", native: "Македонски" },
  { code: "sq", name: "Albanian", native: "Shqip" },
  { code: "bs", name: "Bosnian", native: "Bosanski" },
].sort((a, b) => a.name.localeCompare(b.name));

export interface ChatSettingsData {
  language: string;
}

interface ChatSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: ChatSettingsData;
  onSettingsChange: (settings: ChatSettingsData) => void;
}

const SETTINGS_STORAGE_KEY = "explore-chat-settings";

export function getStoredSettings(): ChatSettingsData {
  if (typeof window === "undefined") {
    return { language: "en" };
  }
  
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("[ChatSettings] Failed to load settings:", error);
  }
  
  return { language: "en" };
}

export function saveStoredSettings(settings: ChatSettingsData): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("[ChatSettings] Failed to save settings:", error);
  }
}

export function ChatSettings({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: ChatSettingsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(settings.language);

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) {
      return LANGUAGES;
    }
    
    const query = searchQuery.toLowerCase();
    return LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.native.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleSave = () => {
    const newSettings: ChatSettingsData = {
      language: selectedLanguage,
    };
    onSettingsChange(newSettings);
    saveStoredSettings(newSettings);
    onOpenChange(false);
  };

  const selectedLanguageData = LANGUAGES.find((lang) => lang.code === selectedLanguage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
          <DialogDescription>
            Configure your chat preferences. Settings are saved automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {/* Language Setting */}
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <div className="space-y-2">
              {/* Selected Language Display */}
              {selectedLanguageData && (
                <div className="flex items-center justify-between p-2 bg-brand-bg rounded-md border border-brand-border">
                  <div>
                    <p className="text-sm font-medium text-brand-heading">
                      {selectedLanguageData.name}
                    </p>
                    <p className="text-xs text-brand-light-accent-1">
                      {selectedLanguageData.native} ({selectedLanguageData.code})
                    </p>
                  </div>
                </div>
              )}

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-light-accent-1" />
                <Input
                  id="language"
                  type="text"
                  placeholder="Search for a language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-light-accent-1 hover:text-brand-heading"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Language List */}
              <div className="border border-brand-border rounded-md max-h-[300px] overflow-y-auto">
                {filteredLanguages.length === 0 ? (
                  <div className="p-4 text-center text-sm text-brand-light-accent-1">
                    No languages found
                  </div>
                ) : (
                  <div className="divide-y divide-brand-border">
                    {filteredLanguages.map((lang) => {
                      const isSelected = lang.code === selectedLanguage;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageSelect(lang.code)}
                          className={`w-full text-left p-3 hover:bg-brand-bg transition-colors ${
                            isSelected ? "bg-brand-primary/10 border-l-2 border-brand-primary" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-brand-heading">
                                {lang.name}
                              </p>
                              <p className="text-xs text-brand-light-accent-1">
                                {lang.native}
                              </p>
                            </div>
                            <span className="text-xs text-brand-light-accent-1 font-mono">
                              {lang.code}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-brand-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
