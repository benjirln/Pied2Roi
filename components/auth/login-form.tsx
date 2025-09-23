"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { loginAction, type AuthState } from "@/app/auth/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground"
      disabled={pending}
    >
      {pending ? "Connexion..." : "Se connecter"}
    </Button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState<AuthState, FormData>(loginAction, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 my-[25px] py-5">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold">Bon retour</CardTitle>
        <CardDescription className="text-muted-foreground">
          Connectez-vous à votre compte Pied2Roi
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {state.error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Entrez votre email"
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Entrez votre mot de passe"
                className="pl-10 pr-10 h-12"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <SubmitButton />
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link
              href="/auth/register"
              className="text-accent hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
