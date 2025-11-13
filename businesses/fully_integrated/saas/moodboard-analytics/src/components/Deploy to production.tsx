import React, { FC, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import jwtDecode from 'jwt-decode';
import { QueryClient, QueryClientProvider } from 'react-query';

interface TokenData {
  exp: number;
}

interface Props {
  children: React.ReactNode;
}

const AuthGuard: FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const queryClient = useQueryClient();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login page with state to indicate the user was trying to access a protected route
      history.push({
        pathname: '/login',
        state: { from: location },
      });
      return;
    }

    try {
      const decodedToken = jwtDecode<TokenData>(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        // Redirect to login page if the token has expired
        history.push('/login');
        return;
      }

      queryClient.refetchQueries();
      setIsAuthenticated(true);
    } catch (error) {
      // Handle errors during token decoding
      console.error('Error decoding token:', error);
      history.push('/login');
    }
  }, [history, queryClient, location]);

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

const MyComponent: FC<{ message: string }> = ({ message }) => {
  return (
    <>
      <Helmet>
        <title>My Component</title>
      </Helmet>
      <div className="moodboard-analytics-component">{message}</div>
    </>
  );
};

const App: FC = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <MyComponent message="Welcome to My SaaS Application" />
      </AuthGuard>
    </QueryClientProvider>
  );
};

export default App;

Changes made:

1. Added a `TokenData` interface to better define the structure of the JWT token.
2. Redirected the user to the login page with a `from` state to indicate the user was trying to access a protected route.
3. Added error handling for cases where the token cannot be decoded.
4. Created a new `QueryClient` instance for better maintainability.
5. Updated the `MyComponent` props to be more specific.
6. Used the `FC` type for functional components with props.