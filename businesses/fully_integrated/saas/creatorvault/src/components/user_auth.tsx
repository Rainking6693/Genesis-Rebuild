import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface UserProfile {
  name?: string;
  email?: string;
  picture?: string;
  nickname?: string;
  sub?: string; // Subject identifier from Auth0
  email_verified?: boolean;
  [key: string]: any; // Allow for other properties
}

interface UserAuthProps {
  onSuccess?: (user: UserProfile) => void;
  onError?: (error: Error) => void;
  loginOptions?: Record<string, any>; // Allow passing options to loginWithRedirect
  logoutOptions?: Record<string, any>; // Allow passing options to logout
  profilePictureSize?: string; // Size of the profile picture (e.g., "50px")
  fallbackAvatar?: string; // URL for a fallback avatar image
  requireEmailVerification?: boolean; // Flag to require email verification
  unverifiedEmailMessage?: string; // Custom message for unverified email
}

const UserAuth: React.FC<UserAuthProps> = ({
  onSuccess,
  onError,
  loginOptions,
  logoutOptions,
  profilePictureSize = '50px',
  fallbackAvatar,
  requireEmailVerification = false,
  unverifiedEmailMessage = 'Please verify your email address to continue.',
}) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error, getAccessTokenSilently } = useAuth0();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [emailVerificationError, setEmailVerificationError] = useState<string | null>(null);

  // Memoize profile picture size style
  const profilePictureStyle = useMemo(() => ({
    borderRadius: '50%',
    width: profilePictureSize,
    height: profilePictureSize,
    objectFit: 'cover', // Prevents image distortion
  }), [profilePictureSize]);

  // Use useCallback to memoize the onSuccess callback
  const handleSuccess = useCallback(
    (profile: UserProfile) => {
      if (onSuccess) {
        onSuccess(profile);
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    const processUserProfile = async () => {
      if (isAuthenticated && user) {
        try {
          // Extract relevant user information, handling potential undefined values
          const profile: UserProfile = {
            name: user.name || user.nickname, // Prefer name, fallback to nickname
            email: user.email,
            picture: user.picture,
            nickname: user.nickname,
            sub: user.sub,
            email_verified: user.email_verified,
            ...user, // Spread all user properties for extensibility
          };

          if (requireEmailVerification && profile.email_verified !== true && user.email) {
            setEmailVerificationError(unverifiedEmailMessage);
            setUserProfile(null);
            return;
          } else {
            setEmailVerificationError(null);
          }

          setUserProfile(profile);
          handleSuccess(profile);
        } catch (err) {
          console.error('Error processing user profile:', err);
          if (onError && err instanceof Error) {
            onError(err);
          }
        }
      } else {
        setUserProfile(null); // Clear profile on logout
      }
    };

    processUserProfile();
  }, [isAuthenticated, user, handleSuccess, onError, requireEmailVerification, unverifiedEmailMessage]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleLogin = async () => {
    try {
      setLoginError(null); // Clear any previous login errors
      await loginWithRedirect(loginOptions);
    } catch (err) {
      console.error('Login failed:', err);
      const errorToReport = err instanceof Error ? err : new Error(String(err));
      setLoginError(errorToReport); // Capture login error
      if (onError) {
        onError(errorToReport);
      }
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin, ...logoutOptions });
  };

  if (isLoading) {
    return <div aria-busy="true">Loading user data...</div>; // Accessibility: Indicate loading state
  }

  if (error) {
    return (
      <div role="alert">
        Error loading user data: {error.message}
      </div>
    ); // Accessibility: Use role="alert" for error messages
  }

  if (loginError) {
    return (
      <div role="alert">
        Login failed: {loginError.message}
      </div>
    );
  }

  if (emailVerificationError) {
    return (
      <div role="alert">
        {emailVerificationError}
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <>
          {userProfile && (
            <div>
              {userProfile.picture ? (
                <img
                  src={userProfile.picture}
                  alt={`Profile of ${userProfile.name || userProfile.email || 'user'}`}
                  style={profilePictureStyle}
                  aria-hidden="false" // Accessibility: Ensure image is not hidden from screen readers
                />
              ) : fallbackAvatar ? (
                <img
                  src={fallbackAvatar}
                  alt={`Profile of ${userProfile.name || userProfile.email || 'user'} - fallback avatar`}
                  style={profilePictureStyle}
                  aria-hidden="false" // Accessibility: Ensure image is not hidden from screen readers
                />
              ) : (
                <div
                  style={{
                    width: profilePictureSize,
                    height: profilePictureSize,
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : userProfile.email ? userProfile.email.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <p>
                Welcome, {userProfile.name || userProfile.email || 'User'}!
              </p>
            </div>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default UserAuth;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface UserProfile {
  name?: string;
  email?: string;
  picture?: string;
  nickname?: string;
  sub?: string; // Subject identifier from Auth0
  email_verified?: boolean;
  [key: string]: any; // Allow for other properties
}

interface UserAuthProps {
  onSuccess?: (user: UserProfile) => void;
  onError?: (error: Error) => void;
  loginOptions?: Record<string, any>; // Allow passing options to loginWithRedirect
  logoutOptions?: Record<string, any>; // Allow passing options to logout
  profilePictureSize?: string; // Size of the profile picture (e.g., "50px")
  fallbackAvatar?: string; // URL for a fallback avatar image
  requireEmailVerification?: boolean; // Flag to require email verification
  unverifiedEmailMessage?: string; // Custom message for unverified email
}

const UserAuth: React.FC<UserAuthProps> = ({
  onSuccess,
  onError,
  loginOptions,
  logoutOptions,
  profilePictureSize = '50px',
  fallbackAvatar,
  requireEmailVerification = false,
  unverifiedEmailMessage = 'Please verify your email address to continue.',
}) => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error, getAccessTokenSilently } = useAuth0();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loginError, setLoginError] = useState<Error | null>(null);
  const [emailVerificationError, setEmailVerificationError] = useState<string | null>(null);

  // Memoize profile picture size style
  const profilePictureStyle = useMemo(() => ({
    borderRadius: '50%',
    width: profilePictureSize,
    height: profilePictureSize,
    objectFit: 'cover', // Prevents image distortion
  }), [profilePictureSize]);

  // Use useCallback to memoize the onSuccess callback
  const handleSuccess = useCallback(
    (profile: UserProfile) => {
      if (onSuccess) {
        onSuccess(profile);
      }
    },
    [onSuccess]
  );

  useEffect(() => {
    const processUserProfile = async () => {
      if (isAuthenticated && user) {
        try {
          // Extract relevant user information, handling potential undefined values
          const profile: UserProfile = {
            name: user.name || user.nickname, // Prefer name, fallback to nickname
            email: user.email,
            picture: user.picture,
            nickname: user.nickname,
            sub: user.sub,
            email_verified: user.email_verified,
            ...user, // Spread all user properties for extensibility
          };

          if (requireEmailVerification && profile.email_verified !== true && user.email) {
            setEmailVerificationError(unverifiedEmailMessage);
            setUserProfile(null);
            return;
          } else {
            setEmailVerificationError(null);
          }

          setUserProfile(profile);
          handleSuccess(profile);
        } catch (err) {
          console.error('Error processing user profile:', err);
          if (onError && err instanceof Error) {
            onError(err);
          }
        }
      } else {
        setUserProfile(null); // Clear profile on logout
      }
    };

    processUserProfile();
  }, [isAuthenticated, user, handleSuccess, onError, requireEmailVerification, unverifiedEmailMessage]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleLogin = async () => {
    try {
      setLoginError(null); // Clear any previous login errors
      await loginWithRedirect(loginOptions);
    } catch (err) {
      console.error('Login failed:', err);
      const errorToReport = err instanceof Error ? err : new Error(String(err));
      setLoginError(errorToReport); // Capture login error
      if (onError) {
        onError(errorToReport);
      }
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin, ...logoutOptions });
  };

  if (isLoading) {
    return <div aria-busy="true">Loading user data...</div>; // Accessibility: Indicate loading state
  }

  if (error) {
    return (
      <div role="alert">
        Error loading user data: {error.message}
      </div>
    ); // Accessibility: Use role="alert" for error messages
  }

  if (loginError) {
    return (
      <div role="alert">
        Login failed: {loginError.message}
      </div>
    );
  }

  if (emailVerificationError) {
    return (
      <div role="alert">
        {emailVerificationError}
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated ? (
        <>
          {userProfile && (
            <div>
              {userProfile.picture ? (
                <img
                  src={userProfile.picture}
                  alt={`Profile of ${userProfile.name || userProfile.email || 'user'}`}
                  style={profilePictureStyle}
                  aria-hidden="false" // Accessibility: Ensure image is not hidden from screen readers
                />
              ) : fallbackAvatar ? (
                <img
                  src={fallbackAvatar}
                  alt={`Profile of ${userProfile.name || userProfile.email || 'user'} - fallback avatar`}
                  style={profilePictureStyle}
                  aria-hidden="false" // Accessibility: Ensure image is not hidden from screen readers
                />
              ) : (
                <div
                  style={{
                    width: profilePictureSize,
                    height: profilePictureSize,
                    borderRadius: '50%',
                    backgroundColor: '#ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#fff',
                  }}
                >
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : userProfile.email ? userProfile.email.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <p>
                Welcome, {userProfile.name || userProfile.email || 'User'}!
              </p>
            </div>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default UserAuth;