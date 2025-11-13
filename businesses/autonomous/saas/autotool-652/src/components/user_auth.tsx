// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react'; // Using NextAuth.js for authentication

interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export default function UserAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (session) {
      setUser({
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn(); // Use NextAuth.js signIn function
    } catch (error: any) {
      console.error("Sign-in error:", error);
      // Display error message to the user (e.g., using a notification library)
      alert(`Sign-in failed: ${error.message}`); // Basic error display
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Use NextAuth.js signOut function
    } catch (error: any) {
      console.error("Sign-out error:", error);
      // Display error message to the user
      alert(`Sign-out failed: ${error.message}`); // Basic error display
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}

// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react'; // Using NextAuth.js for authentication

interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export default function UserAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (session) {
      setUser({
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn(); // Use NextAuth.js signIn function
    } catch (error: any) {
      console.error("Sign-in error:", error);
      // Display error message to the user (e.g., using a notification library)
      alert(`Sign-in failed: ${error.message}`); // Basic error display
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Use NextAuth.js signOut function
    } catch (error: any) {
      console.error("Sign-out error:", error);
      // Display error message to the user
      alert(`Sign-out failed: ${error.message}`); // Basic error display
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}