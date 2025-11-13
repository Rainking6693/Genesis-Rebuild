// src/components/UserAuth.tsx
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { useState } from 'react';

export default function UserAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await NextAuth.signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials.');
      } else {
        // Redirect to dashboard or desired page
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSignIn}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export const authOptions = {
  providers: [
    Providers.Credentials({
      async authorize(credentials) {
        // Replace with your actual authentication logic (e.g., database lookup)
        if (credentials?.email === 'test@example.com' && credentials?.password === 'password') {
          return { id: '1', name: 'Test User', email: credentials.email };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      session: await NextAuth.getSession(context)
    },
  }
}