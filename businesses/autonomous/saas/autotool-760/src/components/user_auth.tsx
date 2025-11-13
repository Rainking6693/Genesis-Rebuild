// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react'; // Assuming NextAuth.js

interface AuthContextType {
  user: any | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const useAuth = (): AuthContextType => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(status === 'loading');
  }, [status]);

  const user = session?.user;

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error);
      // Handle sign-in error (e.g., display an error message to the user)
      alert(`Sign-in failed: ${error.message}`); // Basic error display
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("Sign-out error:", error);
      // Handle sign-out error (e.g., display an error message to the user)
      alert(`Sign-out failed: ${error.message}`); // Basic error display
    }
  };

  return {
    user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isLoading,
  };
};

export default useAuth;

// Example Usage (in another component):
// import useAuth from './UserAuth';
// const MyComponent = () => {
//   const { user, signIn, signOut, isLoading } = useAuth();
//
//   if (isLoading) {
//     return <p>Loading...</p>;
//   }
//
//   if (user) {
//     return (
//       <div>
//         <p>Welcome, {user.name}!</p>
//         <button onClick={signOut}>Sign Out</button>
//       </div>
//     );
//   }
//
//   return (
//     <div>
//       <button onClick={signIn}>Sign In</button>
//     </div>
//   );
// };

// Error Boundary Example (Wrap components using useAuth)
// import { ErrorBoundary } from 'react-error-boundary';
//
// <ErrorBoundary fallback={<div>Something went wrong!</div>}>
//   <MyComponent />
// </ErrorBoundary>

// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react'; // Assuming NextAuth.js

interface AuthContextType {
  user: any | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const useAuth = (): AuthContextType => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(status === 'loading');
  }, [status]);

  const user = session?.user;

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error);
      // Handle sign-in error (e.g., display an error message to the user)
      alert(`Sign-in failed: ${error.message}`); // Basic error display
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("Sign-out error:", error);
      // Handle sign-out error (e.g., display an error message to the user)
      alert(`Sign-out failed: ${error.message}`); // Basic error display
    }
  };

  return {
    user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isLoading,
  };
};

export default useAuth;

// Example Usage (in another component):
// import useAuth from './UserAuth';
// const MyComponent = () => {
//   const { user, signIn, signOut, isLoading } = useAuth();
//
//   if (isLoading) {
//     return <p>Loading...</p>;
//   }
//
//   if (user) {
//     return (
//       <div>
//         <p>Welcome, {user.name}!</p>
//         <button onClick={signOut}>Sign Out</button>
//       </div>
//     );
//   }
//
//   return (
//     <div>
//       <button onClick={signIn}>Sign In</button>
//     </div>
//   );
// };

// Error Boundary Example (Wrap components using useAuth)
// import { ErrorBoundary } from 'react-error-boundary';
//
// <ErrorBoundary fallback={<div>Something went wrong!</div>}>
//   <MyComponent />
// </ErrorBoundary>

Now, I'll write the code to a file and generate the build report.