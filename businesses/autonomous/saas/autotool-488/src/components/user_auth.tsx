// src/components/UserAuth.tsx
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from 'react';

export default function UserAuth() {
  const { data: session } = useSession()
  const [error, setError] = useState<string | null>(null);

  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={async () => {
        try {
          await signIn();
          setError(null);
        } catch (e: any) {
          setError(e.message || "An error occurred during sign-in.");
        }
      }}>Sign in</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </>
  );
}

// Example of a more complex component with error handling:
export function PasswordResetForm() {
  const [email, setEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('loading');
    setErrorMessage('');

    try {
      // Simulate an API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

      if (email === 'test@example.com') { // Simulate success condition
        setResetStatus('success');
      } else {
        throw new Error('User not found.');
      }

    } catch (error: any) {
      setResetStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred.');
    } finally {
      // Optional: Reset the form after a delay
      // setTimeout(() => {
      //   setEmail('');
      //   setResetStatus('idle');
      // }, 5000);
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={resetStatus === 'loading'}>
        {resetStatus === 'loading' ? 'Sending...' : 'Reset Password'}
      </button>

      {resetStatus === 'success' && (
        <p style={{ color: 'green' }}>Password reset link sent to your email.</p>
      )}

      {resetStatus === 'error' && (
        <p style={{ color: 'red' }}>Error: {errorMessage}</p>
      )}
    </form>
  );
}