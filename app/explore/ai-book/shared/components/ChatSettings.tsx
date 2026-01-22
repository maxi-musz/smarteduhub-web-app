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
import { Search, X, Gauge, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  typewriterSpeed: number; // Typing speed in milliseconds per character (lower = faster)
  ttsVoice: string; // TTS voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
  ttsSpeed: number; // TTS playback speed: 0.25 to 4.0 (default: 1.0)
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
    return { language: "en", typewriterSpeed: 20, ttsVoice: "alloy", ttsSpeed: 1.0 };
  }
  
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure all settings exist (for backward compatibility)
      if (parsed.typewriterSpeed === undefined) {
        parsed.typewriterSpeed = 20;
      }
      if (parsed.ttsVoice === undefined) {
        parsed.ttsVoice = "alloy";
      }
      if (parsed.ttsSpeed === undefined) {
        parsed.ttsSpeed = 1.0;
      }
      return parsed;
    }
  } catch (error) {
    console.error("[ChatSettings] Failed to load settings:", error);
  }
  
  return { language: "en", typewriterSpeed: 20, ttsVoice: "alloy", ttsSpeed: 1.0 };
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
  const [typewriterSpeed, setTypewriterSpeed] = useState(settings.typewriterSpeed || 20);
  const [ttsVoice, setTtsVoice] = useState(settings.ttsVoice || "alloy");
  const [ttsSpeed, setTtsSpeed] = useState(settings.ttsSpeed || 1.0);

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
      typewriterSpeed: typewriterSpeed,
      ttsVoice: ttsVoice,
      ttsSpeed: ttsSpeed,
    };
    onSettingsChange(newSettings);
    saveStoredSettings(newSettings);
    onOpenChange(false);
  };

  // Get speed label
  const getSpeedLabel = (speed: number) => {
    if (speed <= 5) return "Very Fast";
    if (speed <= 15) return "Fast";
    if (speed <= 30) return "Normal";
    if (speed <= 50) return "Slow";
    return "Very Slow";
  };

  // Get characters per second
  const getCharsPerSecond = (speed: number) => {
    return Math.round(1000 / speed);
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
          {/* Language Setting - Collapsible */}
          <Accordion type="single" collapsible defaultValue="" className="w-full">
            <AccordionItem value="language" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <Label htmlFor="language" className="text-base font-medium cursor-pointer">
                  Language
                </Label>
              </AccordionTrigger>
              <AccordionContent className="pt-2">
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Typewriter Speed Setting */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brand-light-accent-1" />
              <Label htmlFor="typewriter-speed">Typewriter Speed</Label>
            </div>
            <div className="space-y-3">
              <div className="px-2">
                <Slider
                  id="typewriter-speed"
                  min={5}
                  max={100}
                  step={5}
                  value={[typewriterSpeed]}
                  onValueChange={(value) => setTypewriterSpeed(value[0])}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between px-2">
                <div>
                  <p className="text-sm font-medium text-brand-heading">
                    {getSpeedLabel(typewriterSpeed)}
                  </p>
                  <p className="text-xs text-brand-light-accent-1">
                    {getCharsPerSecond(typewriterSpeed)} characters/second
                  </p>
                </div>
                <div className="text-sm font-mono text-brand-light-accent-1">
                  {typewriterSpeed}ms
                </div>
              </div>
              <p className="text-xs text-brand-light-accent-1 px-2">
                Adjust how fast the AI responses appear. Lower values = faster typing.
              </p>
            </div>
          </div>

          {/* TTS Settings */}
          <Accordion type="single" collapsible defaultValue="" className="w-full">
            <AccordionItem value="tts" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-brand-light-accent-1" />
                  <Label className="text-base font-medium cursor-pointer">
                    Text-to-Speech
                  </Label>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 space-y-4">
                {/* TTS Voice Selection */}
                <div className="space-y-2">
                  <Label htmlFor="tts-voice">Voice</Label>
                  <Select value={ttsVoice} onValueChange={setTtsVoice}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy - Neutral, balanced voice</SelectItem>
                      <SelectItem value="echo">Echo - Clear, confident voice</SelectItem>
                      <SelectItem value="fable">Fable - Warm, expressive voice</SelectItem>
                      <SelectItem value="onyx">Onyx - Deep, authoritative voice</SelectItem>
                      <SelectItem value="nova">Nova - Bright, energetic voice</SelectItem>
                      <SelectItem value="shimmer">Shimmer - Soft, gentle voice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* TTS Speed */}
                <div className="space-y-2">
                  <Label htmlFor="tts-speed">Speech Speed</Label>
                  <div className="space-y-3">
                    <div className="px-2">
                      <Slider
                        id="tts-speed"
                        min={0.25}
                        max={4.0}
                        step={0.25}
                        value={[ttsSpeed]}
                        onValueChange={(value) => setTtsSpeed(value[0])}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center justify-between px-2">
                      <div>
                        <p className="text-sm font-medium text-brand-heading">
                          {ttsSpeed === 1.0 ? "Normal" : ttsSpeed < 1.0 ? "Slow" : "Fast"}
                        </p>
                        <p className="text-xs text-brand-light-accent-1">
                          {ttsSpeed}x speed
                        </p>
                      </div>
                      <div className="text-sm font-mono text-brand-light-accent-1">
                        {ttsSpeed.toFixed(2)}x
                      </div>
                    </div>
                    <p className="text-xs text-brand-light-accent-1 px-2">
                      Adjust the speech playback speed. Range: 0.25x (slow) to 4.0x (fast).
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
