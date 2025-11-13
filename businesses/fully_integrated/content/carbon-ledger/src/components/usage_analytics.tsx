import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [viewCount, setViewCount] = useState(0);

  const trackViewCount = useCallback(() => {
    try {
      setViewCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error tracking view count:', error);
    }
  }, []);

  useEffect(() => {
    // Track component view count
    const handleFocus = () => {
      trackViewCount();
    };

    try {
      window.addEventListener('focus', handleFocus);
    } catch (error) {
      console.error('Error adding event listener:', error);
    }

    // Clean up event listener on component unmount
    return () => {
      try {
        window.removeEventListener('focus', handleFocus);
      } catch (error) {
        console.error('Error removing event listener:', error);
      }
    };
  }, [trackViewCount]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <p aria-live="polite" aria-atomic="true">
        View count: {viewCount}
      </p>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [viewCount, setViewCount] = useState(0);

  const trackViewCount = useCallback(() => {
    try {
      setViewCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error tracking view count:', error);
    }
  }, []);

  useEffect(() => {
    // Track component view count
    const handleFocus = () => {
      trackViewCount();
    };

    try {
      window.addEventListener('focus', handleFocus);
    } catch (error) {
      console.error('Error adding event listener:', error);
    }

    // Clean up event listener on component unmount
    return () => {
      try {
        window.removeEventListener('focus', handleFocus);
      } catch (error) {
        console.error('Error removing event listener:', error);
      }
    };
  }, [trackViewCount]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <p aria-live="polite" aria-atomic="true">
        View count: {viewCount}
      </p>
    </div>
  );
};

export default MyComponent;