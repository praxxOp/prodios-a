"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Entry from "@/components/entry/Entry";
import { Neuo } from "./font";
import Link from "next/link";
import "./register/register.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="register-container">
      <Entry />
      <div className={`register-form-container ${Neuo.className}`}>
        <form onSubmit={handleLogin} className="register-form">
          <h2 className="register-title">Sign In</h2>
          <p className="register-subtitle">Enter your credentials to access your account.</p>
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
          {error && <p className="register-error">{error}</p>}
          <button type="submit" className="register-button">Sign In</button>
          <p className="register-login-link">
            Don&apos;t have an account?
            <Link href="/register" style={{ textDecoration: "none" }}>
              <span>Sign up</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
