'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      router.push('/dashboard');
    } else {
      const data = await res.json();
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Log In</button>

        <p style={styles.footerText}>
          New here?{' '}
          <span
            onClick={() => router.push('/register')}
            style={styles.link}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f2f5',
  },
  form: {
    background: '#fff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '300px',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#333',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
  },
  footerText: {
    fontSize: '0.9rem',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  link: {
    color: '#0070f3',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
