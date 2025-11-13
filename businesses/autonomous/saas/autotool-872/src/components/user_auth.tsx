// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface User {
  email: string | undefined;
  name: string | undefined;
  picture: string | undefined;
}

const UserAuth = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setUserData({
        email: user.email,
        name: user.name,
        picture: user.picture,
      });
    } else {
      setUserData(null);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <img src={userData?.picture || ""} alt={userData?.name || "User"} />
          <p>Welcome, {userData?.name}!</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface User {
  email: string | undefined;
  name: string | undefined;
  picture: string | undefined;
}

const UserAuth = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setUserData({
        email: user.email,
        name: user.name,
        picture: user.picture,
      });
    } else {
      setUserData(null);
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <img src={userData?.picture || ""} alt={userData?.name || "User"} />
          <p>Welcome, {userData?.name}!</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
    </div>
  );
};

export default UserAuth;

Now, I will use the `Write` tool to save the code to `src/components/UserAuth.tsx`.