import { AuthForm } from "@/components/auth-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RemissioLogo } from "@/components/remissio-logo"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex pl-10 justify-center">
          <RemissioLogo className="w-48 sm:w-56 md:w-64" />
        </div>

        <Card className="glass-card glass-card-hover shadow-lg">
          <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 sm:pt-8">
            <CardTitle className="text-2xl sm:text-3xl text-center">Willkommen</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base">
              Melden Sie sich an oder erstellen Sie ein Konto
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
