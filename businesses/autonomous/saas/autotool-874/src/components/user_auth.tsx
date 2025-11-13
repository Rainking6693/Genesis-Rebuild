// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
      // Handle sign-in error appropriately (e.g., display error message to user)
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("Sign-out error:", error.message);
      // Handle sign-out error appropriately (e.g., display error message to user)
    }
  };

  return {
    user: session?.user || null,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
};

export default function UserAuth() {
  const { user, isLoading, signIn, signOut } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={signOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={signIn}>Sign in</button>
    </div>
  );
}

// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error.message);
      // Handle sign-in error appropriately (e.g., display error message to user)
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("Sign-out error:", error.message);
      // Handle sign-out error appropriately (e.g., display error message to user)
    }
  };

  return {
    user: session?.user || null,
    isLoading,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
};

export default function UserAuth() {
  const { user, isLoading, signIn, signOut } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={signOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={signIn}>Sign in</button>
    </div>
  );
}

Now, I will use the `Write` tool to save the code to `src/components/UserAuth.tsx` and the build report to `build_report.json`.

**Final Answer:**