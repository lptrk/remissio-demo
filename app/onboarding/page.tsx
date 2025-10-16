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
import { useToast } from "@/hooks/use-toast"
import { RemissioLogo } from "@/components/remissio-logo"
import { supabase } from "@/lib/local-storage"

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null)
  const [age, setAge] = useState("")
  const [diagnosisYear, setDiagnosisYear] = useState("")
  const [currentMedication, setCurrentMedication] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser()
        if (error || !userData?.user) {
          router.push("/")
          return
        }

        const user = userData.user

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.error(profileError)
          return
        }

        if (profile?.onboarding_completed) {
          router.push("/dashboard")
          return
        }

        setUser({ ...user, profile })
      } catch (error) {
        console.error("[v0] Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Fehler",
        description: "Kein User gefunden, bitte anmelden.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      age: Number.parseInt(age),
      year_of_diagnosis: Number.parseInt(diagnosisYear),
      current_medication: currentMedication,
      notes,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Profil erstellt",
      description: "Ihr Profil wurde erfolgreich eingerichtet!",
    })

    router.push("/dashboard")
  }

  if (loading || !user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <RemissioLogo className="justify-center" />
          <CardTitle className="text-2xl">Willkommen bei Remissio, {user.name}!</CardTitle>
          <CardDescription>
            Lassen Sie uns Ihr Profil einrichten, um Ihre Gesundheit optimal zu verfolgen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Alter</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="z.B. 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis-year">Jahr der Diagnose</Label>
                <Input
                  id="diagnosis-year"
                  type="number"
                  placeholder="z.B. 2020"
                  value={diagnosisYear}
                  onChange={(e) => setDiagnosisYear(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medication">Aktuelle Medikation</Label>
              <Select value={currentMedication} onValueChange={setCurrentMedication}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie Ihre Medikation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mesalazin">Mesalazin</SelectItem>
                  <SelectItem value="sulfasalazin">Sulfasalazin</SelectItem>
                  <SelectItem value="prednisolon">Prednisolon</SelectItem>
                  <SelectItem value="azathioprin">Azathioprin</SelectItem>
                  <SelectItem value="biologika">Biologika</SelectItem>
                  <SelectItem value="andere">Andere</SelectItem>
                  <SelectItem value="keine">Keine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Zusätzliche Notizen (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Besondere Umstände, Allergien, oder andere wichtige Informationen..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full">
              Profil erstellen und fortfahren
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
