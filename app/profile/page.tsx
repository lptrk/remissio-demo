"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { RemissioLogo } from "@/components/remissio-logo"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation, type Language } from "@/lib/i18n"
import { ArrowLeft, User, Stethoscope, FileText } from "lucide-react"
import { supabase } from "@/lib/local-storage"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [diagnosisYear, setDiagnosisYear] = useState("")
  const [currentMedication, setCurrentMedication] = useState("")
  const [notes, setNotes] = useState("")
  const [language, setLanguage] = useState<Language>("de")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation(language)

  // Fetch User + Profile from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !currentUser) {
        router.push("/")
        return
      }

      setUser(currentUser)

      const { data: profileData, error: profileError } = await supabase
        .from("Profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single()

      if (profileError) {
        console.error(profileError)
        return
      }

      const dobRaw = profileData.date_of_birth
      const dob = dobRaw ? new Date(dobRaw).toISOString().split("T")[0] : ""

      setProfile(profileData)
      setName(currentUser.user_metadata?.name || "")
      setEmail(currentUser.email || "")
      setGender(profileData.gender || "")
      setBirthDate(dob)
      setAge(profileData.age?.toString() || "")
      setWeight(profileData.weight?.toString() || "")
      setHeight(profileData.height_in_cm?.toString() || "")
      setDiagnosisYear(profileData.year_of_diagnosis?.toString() || "")
      setCurrentMedication(profileData.current_medication || "")
      setNotes(profileData.notes || "")

      // Sprache aus Supabase laden
      const { data: langData } = await supabase.from("Profiles").select("language").eq("id", currentUser.id).single()

      if (langData?.language) setLanguage(langData.language as Language)
    }

    fetchUserProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // User-Metadaten aktualisieren
      await supabase.auth.updateUser({ data: { name } })

      // Profile aktualisieren
      const { error: upsertError } = await supabase.from("Profiles").upsert({
        id: user.id,
        gender,
        email,
        date_of_birth: birthDate || null,
        age: age ? Number.parseInt(age) : null,
        weight: weight ? Number.parseFloat(weight) : null,
        height_in_cm: height ? Number.parseInt(height) : null,
        year_of_diagnosis: diagnosisYear ? Number.parseInt(diagnosisYear) : null,
        current_medication: currentMedication,
        notes,
        language, // Sprache wird jetzt mitgespeichert
        updated_at: new Date().toISOString(),
      })

      if (upsertError) throw upsertError

      toast({
        title: t.changesSaved,
        description: t.profileUpdatedDescription,
        className: "glass-card border-green-200 bg-green-50/80 text-green-800",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: t.errorSaving,
        description: t.profileSaveError,
        variant: "destructive",
        className: "glass-card border-red-200 bg-red-50/80 text-red-800",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAvatarColor = (gender: string) => {
    switch (gender) {
      case "male":
        return "bg-blue-500"
      case "female":
        return "bg-pink-500"
      case "diverse":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user || !profile) return null

  return (
    <div className="min-h-screen">
      <header className="glass-card border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </Button>
              <RemissioLogo />
            </div>
            <LanguageSelector
              language={language}
              onLanguageChange={async (newLang) => {
                setLanguage(newLang)
                await supabase.from("Profiles").update({ language: newLang }).eq("id", user.id)
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">{t.profileSettings}</h2>
          <p className="text-muted-foreground">{t.profileSettingsDescription}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Avatar Card */}
          <Card className="glass-card glass-card-hover lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className={`text-white text-xl font-bold ${getAvatarColor(gender)}`}>
                    {name ? getInitials(name) : <User className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{name || t.noName}</CardTitle>
              <CardDescription>{email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.gender}:</span>
                  <span>{gender ? t[gender as keyof typeof t] || gender : t.notSpecified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.age}:</span>
                  <span>{age || t.notSpecified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.weight}:</span>
                  <span>{weight ? `${weight} kg` : t.notSpecified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.height}:</span>
                  <span>{height ? `${height} cm` : t.notSpecified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.diagnosisYear}:</span>
                  <span>{diagnosisYear || t.notSpecified}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="glass-card glass-card-hover lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t.editProfile}
              </CardTitle>
              <CardDescription>{t.editProfileDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.basicInformation}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.name}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.enterName}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.enterEmail}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">{t.gender}</Label>
                      <Select value={gender} onValueChange={setGender} disabled={isLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectGender} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t.male}</SelectItem>
                          <SelectItem value="female">{t.female}</SelectItem>
                          <SelectItem value="diverse">{t.diverse}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">{t.birthDate}</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">{t.age}</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="z.B. 28"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.physicalInformation}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">{t.weight} (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder={t.weightPlaceholder}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">{t.height} (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder={t.heightPlaceholder}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    {t.medicalInformation}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis-year">{t.diagnosisYear}</Label>
                      <Input
                        id="diagnosis-year"
                        type="number"
                        placeholder="z.B. 2020"
                        value={diagnosisYear}
                        onChange={(e) => setDiagnosisYear(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medication">{t.currentMedication}</Label>
                      <Select value={currentMedication} onValueChange={setCurrentMedication} disabled={isLoading}>
                        <SelectTrigger>
                          <SelectValue placeholder={t.selectMedication} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mesalazin">Mesalazin</SelectItem>
                          <SelectItem value="sulfasalazin">Sulfasalazin</SelectItem>
                          <SelectItem value="prednisolon">Prednisolon</SelectItem>
                          <SelectItem value="azathioprin">Azathioprin</SelectItem>
                          <SelectItem value="biologika">Biologika</SelectItem>
                          <SelectItem value="andere">{t.other}</SelectItem>
                          <SelectItem value="keine">{t.none}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {t.additionalNotes}
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      {t.notes} ({t.optional})
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder={t.notesPlaceholder}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? t.savingChanges : t.saveChanges}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="glass-card-hover bg-transparent"
                    disabled={isLoading}
                  >
                    {t.cancel}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
