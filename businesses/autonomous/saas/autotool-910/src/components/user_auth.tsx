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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    } else {
      setUser(null);
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (e: any) {
      console.error("Sign-in error:", e);
      setError(e.message || "Failed to sign in.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e: any) {
      console.error("Sign-out error:", e);
      setError(e.message || "Failed to sign out.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <img src={user.image || ""} alt="User Avatar" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
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
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export default function UserAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    } else {
      setUser(null);
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (e: any) {
      console.error("Sign-in error:", e);
      setError(e.message || "Failed to sign in.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e: any) {
      console.error("Sign-out error:", e);
      setError(e.message || "Failed to sign out.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <img src={user.image || ""} alt="User Avatar" style={{ borderRadius: '50%', width: '50px', height: '50px' }} />
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}