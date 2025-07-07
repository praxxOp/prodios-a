'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.form}>
        <h2>Register</h2>
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
        <button type="submit" style={styles.button}>Sign Up</button>
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
};
