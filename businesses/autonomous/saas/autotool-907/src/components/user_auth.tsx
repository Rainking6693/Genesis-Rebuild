// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export default function UserAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({ name: null, email: null, image: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      setUser({
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      });
      setIsLoading(false);
    } else if (status === 'unauthenticated') {
      setUser({ name: null, email: null, image: null });
      setIsLoading(false);
    } else if (status === 'loading') {
      setIsLoading(true);
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
      // Display error message to the user (e.g., using a toast notification)
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("Sign-out error:", error.message);
      // Display error message to the user
      alert(`Sign-out failed: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user.name ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}

// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export default function UserAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({ name: null, email: null, image: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      setUser({
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
      });
      setIsLoading(false);
    } else if (status === 'unauthenticated') {
      setUser({ name: null, email: null, image: null });
      setIsLoading(false);
    } else if (status === 'loading') {
      setIsLoading(true);
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
      // Display error message to the user (e.g., using a toast notification)
      alert(`Sign-in failed: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("Sign-out error:", error.message);
      // Display error message to the user
      alert(`Sign-out failed: ${error.message}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user.name ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}