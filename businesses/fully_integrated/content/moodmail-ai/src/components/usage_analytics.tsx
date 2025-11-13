import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [viewCount, setViewCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const trackViewCount = useCallback(() => {
    if (isMounted) {
      setViewCount((prevCount) => prevCount + 1);
    }
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);

    // Track component view count
    const handleFocus = () => {
      trackViewCount();
    };

    window.addEventListener('focus', handleFocus);

    // Clean up event listener on component unmount
    return () => {
      setIsMounted(false);
      window.removeEventListener('focus', handleFocus);
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
  const [isMounted, setIsMounted] = useState(false);

  const trackViewCount = useCallback(() => {
    if (isMounted) {
      setViewCount((prevCount) => prevCount + 1);
    }
  }, [isMounted]);

  useEffect(() => {
    setIsMounted(true);

    // Track component view count
    const handleFocus = () => {
      trackViewCount();
    };

    window.addEventListener('focus', handleFocus);

    // Clean up event listener on component unmount
    return () => {
      setIsMounted(false);
      window.removeEventListener('focus', handleFocus);
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