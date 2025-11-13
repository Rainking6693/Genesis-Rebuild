// src/components/user_auth/UserAuth.tsx
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

const UserAuth = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('github'); // Or any other provider configured in NextAuth.js
    } catch (e: any) {
      console.error("Sign-in error:", e);
      setError(e.message || "An error occurred during sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut();
    } catch (e: any) {
      console.error("Sign-out error:", e);
      setError(e.message || "An error occurred during sign-out.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      {session ? (
        <>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={handleSignOut}>Sign out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign in</button>
      )}
    </div>
  );
};

export default UserAuth;

// src/components/user_auth/UserAuth.tsx
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

const UserAuth = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('github'); // Or any other provider configured in NextAuth.js
    } catch (e: any) {
      console.error("Sign-in error:", e);
      setError(e.message || "An error occurred during sign-in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut();
    } catch (e: any) {
      console.error("Sign-out error:", e);
      setError(e.message || "An error occurred during sign-out.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      {session ? (
        <>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={handleSignOut}>Sign out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign in</button>
      )}
    </div>
  );
};

export default UserAuth;

Now, I will use the `Write` tool to save the code to a file.