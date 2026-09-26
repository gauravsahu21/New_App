"use client";

import { useState, type FormEvent } from "react";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Sign-in is not connected yet. Your details were not sent.");
  }

  return (
    <main className="login-page">
      <section className="welcome-panel" aria-label="Welcome">
        <div className="wordmark" aria-label="Your space">
          <span className="wordmark-symbol" aria-hidden="true">
            <span />
          </span>
          <span>Your space</span>
        </div>

        <div className="welcome-copy">
          <p className="eyebrow">A PLACE TO PICK UP</p>
          <h1>Good to have you back.</h1>
          <p>Everything starts with a familiar number.</p>
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
          <p className="form-intro">Enter the mobile number and password for your account.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="phone">Mobile number</label>
              <input
                autoComplete="tel"
                id="phone"
                inputMode="tel"
                name="phone"
                placeholder="e.g. +1 555 123 4567"
                required
                type="tel"
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

            <button className="submit-button" type="submit">
              <span>Continue</span>
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
