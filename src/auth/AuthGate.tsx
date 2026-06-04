import { type FormEvent, type ReactNode, useState } from "react";
import { useNavigate } from "react-router";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useAuth } from "./useAuth";

export const AuthGate = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (auth.loading) {
    return <Loading />;
  }

  if (auth.session) {
    return children;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      if (mode === "signin") {
        await auth.signIn(email, password);
        navigate("/chat", { replace: true });
      } else {
        await auth.signUp(email, password);
        setFeedback(
          "Account created. Check your email if confirmation is enabled.",
        );
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Authentication failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setMode((current) => (current === "signin" ? "signup" : "signin"));
    setError(null);
    setFeedback(null);
  };

  return (
    <div className="grid min-h-svh place-items-center bg-muted px-4 py-10">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {mode === "signin" ? "Sign in" : "Create account"}
          </CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Enter your email and password to continue."
              : "Create an account to start chatting."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={!!error}>
                    <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                    <Input
                      aria-invalid={!!error}
                      autoComplete="email"
                      disabled={submitting}
                      id="auth-email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                      type="email"
                      value={email}
                    />
                  </Field>

                  <Field data-invalid={!!error}>
                    <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                    <Input
                      aria-invalid={!!error}
                      autoComplete={
                        mode === "signin" ? "current-password" : "new-password"
                      }
                      disabled={submitting}
                      id="auth-password"
                      minLength={6}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 6 characters"
                      required
                      type="password"
                      value={password}
                    />
                    <FieldDescription>
                      {mode === "signin"
                        ? "Use the email and password for your account."
                        : "Your password must be at least 6 characters."}
                    </FieldDescription>
                  </Field>

                  {error ? <FieldError>{error}</FieldError> : null}
                  {feedback ? (
                    <FieldDescription className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-700 dark:text-emerald-300">
                      {feedback}
                    </FieldDescription>
                  ) : null}

                  <Field>
                    <Button className="w-full" disabled={submitting} type="submit">
                      {submitting
                        ? "Please wait..."
                        : mode === "signin"
                          ? "Sign in"
                          : "Sign up"}
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>

          <Button
            className="mt-3 w-full"
            onClick={toggleMode}
            type="button"
            variant="ghost"
          >
            {mode === "signin"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
