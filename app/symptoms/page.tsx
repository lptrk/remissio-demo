"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/local-storage"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RemissioLogo } from "@/components/remissio-logo"

const pucaiQuestions = [
  {
    id: "stomachache",
    question: "Bauchschmerzen",
    description: "Wie stark waren Ihre Bauchschmerzen in den letzten 3 Tagen?",
    options: [
      { value: 0, label: "Keine Schmerzen", points: 0 },
      { value: 1, label: "Leichte Schmerzen", points: 5 },
      { value: 2, label: "Mäßige Schmerzen", points: 10 },
      { value: 3, label: "Starke Schmerzen", points: 15 },
    ],
  },
  {
    id: "rectal_bleeding",
    question: "Rektale Blutungen",
    description: "Wie viel Blut war in den letzten 3 Tagen in Ihrem Stuhl?",
    options: [
      { value: 0, label: "Kein Blut", points: 0 },
      { value: 1, label: "Kleine Mengen <50%", points: 10 },
      { value: 2, label: "Kleine Mengen >50%", points: 20 },
      { value: 3, label: "Große Mengen Blut", points: 30 },
    ],
  },
  {
    id: "texture",
    question: "Stuhlkonsistenz",
    description: "Wie war die Konsistenz Ihres Stuhls in den letzten 3 Tagen?",
    options: [
      { value: 0, label: "Geformt", points: 0 },
      { value: 1, label: "Teilweise geformt", points: 5 },
      { value: 2, label: "Vollständig ungeformt", points: 10 },
    ],
  },
  {
    id: "frequency",
    question: "Stuhlfrequenz",
    description: "Wie viele Stuhlgänge hatten Sie pro Tag in den letzten 3 Tagen?",
    options: [
      { value: 0, label: "0–2 pro Tag", points: 0 },
      { value: 1, label: "3–5 pro Tag", points: 5 },
      { value: 2, label: "6–8 pro Tag", points: 10 },
      { value: 3, label: ">8 pro Tag", points: 15 },
    ],
  },
  {
    id: "nightly_bowel_movements",
    question: "Nächtliche Stuhlgänge",
    description: "Hatten Sie in den letzten 3 Tagen nächtliche Stuhlgänge?",
    options: [
      { value: 0, label: "Nein", points: 0 },
      { value: 1, label: "Ja", points: 10 },
    ],
  },
  {
    id: "level_of_activity",
    question: "Aktivitätsniveau",
    description: "Wie war Ihr Aktivitätsniveau in den letzten 3 Tagen?",
    options: [
      { value: 0, label: "Keine Einschränkung", points: 0 },
      { value: 1, label: "Gelegentliche Einschränkung", points: 5 },
      { value: 2, label: "Häufige Einschränkung", points: 10 },
    ],
  },
]

export default function SymptomsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        if (error || !user) {
          router.push("/")
          return
        }
        setUser(user)
      } catch (error) {
        console.error("[v0] Error fetching user:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const calculatePUCAIScore = () =>
    pucaiQuestions.reduce((sum, q) => {
      const ans = answers[q.id]
      const opt = q.options.find((o) => o.value === ans)
      return sum + (opt?.points || 0)
    }, 0)

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== pucaiQuestions.length) {
      toast({
        title: "Unvollständig",
        description: "Bitte beantworten Sie alle Fragen.",
        variant: "destructive",
      })
      return
    }

    if (!user) return

    setIsSubmitting(true)

    try {
      const sum = calculatePUCAIScore()

      const payload = {
        user_id: user.id,
        stomachache: answers.stomachache || 0,
        rectal_bleeding: answers.rectal_bleeding || 0,
        texture: answers.texture || 0,
        frequency: answers.frequency || 0,
        nightly_bowel_movements: answers.nightly_bowel_movements || 0,
        level_of_activity: answers.level_of_activity || 0,
        sum,
        created_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("pucais").insert([payload])

      if (error) {
        console.error("[v0] Error saving PUCAI score:", error)
        toast({
          title: "Fehler",
          description: "Score konnte nicht gespeichert werden.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      toast({
        title: "PUCAI Score gespeichert",
        description: `Ihr Score: ${sum}`,
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Unexpected error in handleSubmit:", error)
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Lädt...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const currentQ = pucaiQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / pucaiQuestions.length) * 100
  const isLast = currentQuestion === pucaiQuestions.length - 1
  const canProceed = answers[currentQ.id] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center py-4 gap-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Button>
            <div className="flex items-center gap-2 sm:gap-4">
              <RemissioLogo />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">PUCAI Assessment</h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Frage {currentQuestion + 1} von {pucaiQuestions.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Progress value={progress} className="h-2 mb-8" />

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">{currentQ.question}</CardTitle>
            <CardDescription className="text-base sm:text-lg">{currentQ.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ""}
              onValueChange={(v) => handleAnswer(currentQ.id, Number.parseInt(v))}
            >
              {currentQ.options.map((opt) => (
                <div
                  key={opt.value}
                  className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <RadioGroupItem value={opt.value.toString()} id={`${currentQ.id}-${opt.value}`} className="mt-1" />
                  <Label htmlFor={`${currentQ.id}-${opt.value}`} className="flex-1 cursor-pointer">
                    <div className="font-medium text-sm sm:text-base">{opt.label}</div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{opt.points} Punkte</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex flex-col sm:flex-row justify-between pt-6 gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((c) => c - 1)}
                disabled={currentQuestion === 0}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4" /> <span className="ml-2">Zurück</span>
              </Button>

              {isLast ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? "Wird gespeichert..." : "Score speichern"}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentQuestion((c) => c + 1)}
                  disabled={!canProceed}
                  className="gap-2 w-full sm:w-auto"
                >
                  Weiter <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
