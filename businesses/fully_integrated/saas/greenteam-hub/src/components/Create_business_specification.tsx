import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies, Cookies } from 'react-cookie';

interface Props {
  name: string;
}

interface GreenTeamHubAPIResponse {
  accessToken: string;
}

interface EnvironmentVariables {
  REACT_APP_USERNAME: string;
  REACT_APP_PASSWORD: string;
}

const MyComponent: React.FC<Props> = ({ name }) => {
  const [cookies, setCookies] = useCookies<Cookies>(['greenTeamHubToken']);
  const [accessToken, setAccessToken] = useState<string | null>(cookies.greenTeamHubToken || null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post<GreenTeamHubAPIResponse>(
          'https://greenteamhub.com/api/auth/login',
          {
            username: process.env.REACT_APP_USERNAME,
            password: process.env.REACT_APP_PASSWORD,
          },
          {
            validateStatus: () => true, // Always resolve the promise, even if the status is not 2xx
          }
        );
        setAccessToken(response.data.accessToken);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(error.response.data.error || error.response.statusText);
        } else {
          setError('An unexpected error occurred.');
        }
      }
    };

    if (!accessToken) {
      fetchAccessToken();
    }
  }, [accessToken]);

  const handleLogout = () => {
    setAccessToken(null);
    setCookies('greenTeamHubToken', '', { maxAge: -1 }); // Remove the cookie
  };

  if (!accessToken) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return (
      <div>
        <h1>Error:</h1>
        <p>{error}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {name}!</h1>
      {/* Add your SaaS functionality here */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default MyComponent;

In this version, I've added:

1. A `handleLogout` function to log the user out and remove the access token from the cookies.
2. An error check for Axios errors to ensure that only relevant errors are displayed to the user.
3. A check for the `error` state before rendering the SaaS functionality to ensure that the component doesn't render with an error.
4. A logout button to allow the user to log out.
5. Improved error handling for Axios requests by setting `validateStatus: () => true` to always resolve the promise, even if the status is not 2xx. This can help prevent issues when the server returns an error response with a status code other than 2xx.