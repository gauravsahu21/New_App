"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSupabaseConfig } from "@/lib/supabase/config";

export default function Home() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");

    if (!getSupabaseConfig()) {
      setNotice("Add your Supabase project URL and publishable key to .env.local first.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setNotice("We couldn't sign you in with those details. Check them and try again.");
        return;
      }

      router.replace("/account");
    } catch {
      setNotice("We couldn't reach Supabase. Check your project settings and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="welcome-panel" aria-label="Welcome">
        <div className="wordmark" aria-label="A1Thikedar">
          <span className="wordmark-symbol" aria-hidden="true">
            <span />
          </span>
          <span>A1Thikedar</span>
        </div>

        <div className="welcome-copy">
          <p className="eyebrow">A PLACE TO PICK UP</p>
          <h1>Good to have you back.</h1>
        </div>

        <div className="orbit-art" aria-hidden="true">
          <div className="orbit orbit-outer" />
          <div className="orbit orbit-middle" />
          <div className="orbit orbit-inner" />
          <span className="orbit-sun" />
          <span className="orbit-caption">A LITTLE SPACE, JUST FOR YOU</span>
        </div>

        <p className="panel-index">ACCOUNT ACCESS <span>01 / 01</span></p>
      </section>

      <section className="form-panel" aria-labelledby="login-title">
        <div className="login-form-wrap">
          <p className="eyebrow form-eyebrow">WELCOME BACK</p>
          <h2 id="login-title">Sign in</h2>
          <p className="form-intro">Enter the email address and password for your account.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <input
                autoComplete="email"
                id="email"
                inputMode="email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrap">
                <input
                  autoComplete="current-password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="submit-button" disabled={isSubmitting} type="submit">
              <span>{isSubmitting ? "Signing in..." : "Continue"}</span>
              <span aria-hidden="true" className="submit-arrow">→</span>
            </button>
            <p aria-live="polite" className="form-notice" role="status">{notice}</p>
          </form>
        </div>
        <p className="form-footer">YOUR ACCOUNT, ON YOUR TERMS</p>
      </section>
    </main>
  );
}
//gaurav us