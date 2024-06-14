import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '/supabaseClient.js';
import styles from '/styles/AuthForm.module.css';
import Link from 'next/link';

export default function AuthForm({ mode = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // New state for first name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let error;
    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName, // Add first name to user metadata
          }
        }
      });
      error = signUpError;
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    }

    if (error) {
      setError(error.message);
    } else {
      router.push('/hey'); // Redirect to the welcome page after successful login/signup
    }

    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.header}>{mode === 'signup' ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div>
              <label className={styles.label}>First Name</label>
              <input
                className={styles.input}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Loading...' : mode === 'signup' ? 'Sign Up' : 'Login'}
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </form>
        <div className={styles.switchMode}>
          {mode === 'signup' ? (
            <>
              Already a user? <Link href="/sign/in">Login</Link>
            </>
          ) : (
            <>
              New user? <Link href="/sign/up">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}