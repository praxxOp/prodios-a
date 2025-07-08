"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./register.css";
import Entry from "@/components/entry/Entry";
import { Neuo } from "../font";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setError(data.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <Entry />
      <div className={`register-form-container ${Neuo.className}`}>
        <form onSubmit={handleRegister} className="register-form">
          <h2 className="register-title">Sign Up Account</h2>
          <p className="register-subtitle">
            Enter your personal data to create your account.
          </p>
          <h5 className="register-label">Email</h5>
          <input
            type="email"
            placeholder="eg. johnfrans@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <h5 className="register-label">Password</h5>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <p className="register-password-note">
            Must be at least 8 characters.
          </p>
          {error && <p className="register-error">{error}</p>}
          <button type="submit" className="register-button">
            Sign Up
          </button>
          <p className="register-login-link">
            Already have an account?
            <Link href="/" style={{ textDecoration: "none" }}>
              <span>Log in</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
