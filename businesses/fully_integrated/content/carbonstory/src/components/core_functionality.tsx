import React, { useEffect } from 'react';

interface Props {
  user: {
    name: string;
    carbonFootprint: number;
    brandLoyaltyScore: number;
  };
}

const MyComponent: React.FC<Props> = ({ user }) => {
  useEffect(() => {
    // Fetch user's carbon footprint and brand loyalty score from API
    // Update state with the fetched data
  }, []);

  return (
    <div>
      <h1>Hello, {user.name}!</h1>
      <p>Your carbon footprint: {user.carbonFootprint} kg CO2e</p>
      <p>Your brand loyalty score: {user.brandLoyaltyScore}</p>
      <button>View your personalized sustainability impact report</button>
    </div>
  );
};

export default MyComponent;

import React, { useEffect } from 'react';

interface Props {
  user: {
    name: string;
    carbonFootprint: number;
    brandLoyaltyScore: number;
  };
}

const MyComponent: React.FC<Props> = ({ user }) => {
  useEffect(() => {
    // Fetch user's carbon footprint and brand loyalty score from API
    // Update state with the fetched data
  }, []);

  return (
    <div>
      <h1>Hello, {user.name}!</h1>
      <p>Your carbon footprint: {user.carbonFootprint} kg CO2e</p>
      <p>Your brand loyalty score: {user.brandLoyaltyScore}</p>
      <button>View your personalized sustainability impact report</button>
    </div>
  );
};

export default MyComponent;