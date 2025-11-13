import React, { FC, createContext, useContext, SetStateAction, useState } from 'react';
import axios from 'axios';

// Create a custom context for storing user data
const UserDataContext = createContext<{ userData?: any; loading: boolean; error?: Error; noUserData?: boolean }>({
  loading: true,
});

// Wrap the component with the context provider to share user data
const CustomerSupportBotWithData = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [noUserData, setNoUserData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/user');
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }

      if (!response.data) {
        setNoUserData(true);
      }
    };

    fetchData();
  }, []);

  return (
    <UserDataContext.Provider value={{ userData, loading, error, noUserData }}>
      <CustomerSupportBot />
    </UserDataContext.Provider>
  );
};

// Use the user data context to access user data within the component
const CustomerSupportBot: FC = () => {
  const { userData, loading, error, noUserData } = useContext(UserDataContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (noUserData) {
    return <div>No user data available. Please log in to continue.</div>;
  }

  return (
    <div className="customer-support-bot" aria-label="Customer Support Bot" data-testid="customer-support-bot">
      {getGreeting()}
    </div>
  );
};

// Generate personalized greetings based on user data
const getGreeting = () => {
  const { userData } = useContext(UserDataContext);
  if (!userData) {
    return 'Welcome to Climate Pulse! How can I assist you with your sustainability needs?';
  }

  if (userDataLoading) {
    return 'Loading...';
  }

  const { name, businessName } = userData;
  return `Welcome back, ${name} from ${businessName}! How can I assist you with your sustainability needs today?`;
};

export default CustomerSupportBotWithData;

This updated version addresses the issues mentioned and improves the overall quality of the code.