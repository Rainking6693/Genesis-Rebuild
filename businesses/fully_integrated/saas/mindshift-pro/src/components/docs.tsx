import React, { useEffect, useState } from 'react';
import { useCookies, Cookies } from 'react-cookie';
import { useId } from React;
import { useComponentState } from './ComponentState';
import { useComponentStyles } from './ComponentStyles';

interface Props {
  title: string;
  description: string;
}

const MyComponent: React.FC<Props> = ({ title, description }) => {
  const [cookies] = useCookies<Cookies>(['user']);
  const componentId = useId();
  const { userId, setUserId } = useComponentState();
  const styles = useComponentStyles();

  useEffect(() => {
    if (cookies.user) {
      setUserId(cookies.user);
    }
  }, [cookies.user]);

  const handleUsageDataError = (error: Error) => {
    console.error('Error sending usage data:', error);
  };

  const sendUsageData = async () => {
    try {
      const response = await fetch('/api/usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, title, componentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send usage data');
      }
    } catch (error) {
      handleUsageDataError(error);
    }
  };

  useEffect(() => {
    if (userId) {
      sendUsageData();
    }
  }, [userId]);

  return (
    <div data-testid={componentId} {...styles.root} aria-labelledby={`${componentId}-title`} aria-describedby={`${componentId}-description`}>
      <h2 id={`${componentId}-title`}>{title}</h2>
      <p id={`${componentId}-description`}>{description}</p>
    </div>
  );
};

export default MyComponent;

In this updated code, I've added a `useComponentState` hook to manage the component's state, including the `userId`. I've also added a `useComponentStyles` hook to separate the component's styles. The `sendUsageData` function now checks if the `userId` is set before sending the data, and I've added ARIA attributes for accessibility.