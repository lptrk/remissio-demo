"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { type Language, getAvailableLanguages, useTranslation } from "@/lib/i18n"

interface LanguageSelectorProps {
  language?: string
  onLanguageChange?: (language: Language) => void
  className?: string
}

export function LanguageSelector({ onLanguageChange, className }: LanguageSelectorProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("de")
  const { t } = useTranslation(currentLanguage)
  const languages = getAvailableLanguages()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("remissio_language") as Language
    if (savedLanguage && languages.find((l) => l.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem("remissio_language", language)
    onLanguageChange?.(language)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-auto min-w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
