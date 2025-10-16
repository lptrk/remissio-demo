"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { localAuth } from "@/lib/local-storage"

export function AuthForm() {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const { toast } = useToast()

	// Sign In State
	const [signInEmail, setSignInEmail] = useState("")
	const [signInPassword, setSignInPassword] = useState("")

	// Sign Up State
	const [signUpName, setSignUpName] = useState("")
	const [signUpEmail, setSignUpEmail] = useState("")
	const [signUpPassword, setSignUpPassword] = useState("")

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const { data, error } = await localAuth.signIn(signInEmail, signInPassword)

			if (error || !data.user) {
				toast({
					title: "Anmeldefehler",
					description: error?.message || "Ungültige Anmeldedaten",
					variant: "destructive",
				})
				setIsLoading(false)
				return
			}

			toast({
				title: "Erfolgreich angemeldet",
				description: "Willkommen zurück!",
			})

			router.push("/dashboard")
		} catch (error) {
			console.error(error)
			toast({
				title: "Fehler",
				description: "Ein unerwarteter Fehler ist aufgetreten",
				variant: "destructive",
			})
			setIsLoading(false)
		}
	}

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			const { data, error } = await localAuth.signUp(signUpEmail, signUpPassword, signUpName)

			if (error || !data.user) {
				toast({
					title: "Registrierungsfehler",
					description: error?.message || "Registrierung fehlgeschlagen",
					variant: "destructive",
				})
				setIsLoading(false)
				return
			}

			toast({
				title: "Konto erstellt",
				description: "Ihr Konto wurde erfolgreich erstellt!",
			})

			router.push("/onboarding")
		} catch (error) {
			console.error(error)
			toast({
				title: "Fehler",
				description: "Ein unerwarteter Fehler ist aufgetreten",
				variant: "destructive",
			})
			setIsLoading(false)
		}
	}

	return (
		<Tabs defaultValue="signin" className="w-full">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="signin">Anmelden</TabsTrigger>
				<TabsTrigger value="signup">Registrieren</TabsTrigger>
			</TabsList>

			<TabsContent value="signin">
				<form onSubmit={handleSignIn} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="signin-email">E-Mail</Label>
						<Input
							id="signin-email"
							type="email"
							placeholder="ihre@email.de"
							value={signInEmail}
							onChange={(e) => setSignInEmail(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="signin-password">Passwort</Label>
						<Input
							id="signin-password"
							type="password"
							placeholder="••••••••"
							value={signInPassword}
							onChange={(e) => setSignInPassword(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Wird angemeldet..." : "Anmelden"}
					</Button>
					<p className={'text-sm text-gray-600'}>
						Hinweis: Dies ist eine Demo-Version. Alle eingegebenen Daten werden nicht auf unseren Servern gespeichert und verbleiben nur lokal in deinem Browser.
					</p>
				</form>
			</TabsContent>

			<TabsContent value="signup">
				<form onSubmit={handleSignUp} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="signup-name">Name</Label>
						<Input
							id="signup-name"
							type="text"
							placeholder="Max Mustermann"
							value={signUpName}
							onChange={(e) => setSignUpName(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="signup-email">E-Mail</Label>
						<Input
							id="signup-email"
							type="email"
							placeholder="ihre@email.de"
							value={signUpEmail}
							onChange={(e) => setSignUpEmail(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="signup-password">Passwort</Label>
						<Input
							id="signup-password"
							type="password"
							placeholder="••••••••"
							value={signUpPassword}
							onChange={(e) => setSignUpPassword(e.target.value)}
							required
							disabled={isLoading}
							minLength={6}
						/>
					</div>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Wird erstellt..." : "Konto erstellen"}
					</Button>
					<p className={'text-sm text-gray-600'}>
						Hinweis: Dies ist eine Demo-Version. Alle eingegebenen Daten werden nicht auf unseren Servern gespeichert und verbleiben nur lokal in deinem Browser.
					</p>
				</form>
			</TabsContent>
		</Tabs>
	)
}
