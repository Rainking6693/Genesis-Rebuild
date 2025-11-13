import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  errorId?: string;
  isErrorVisibleByDefault?: boolean;
}

const MyComponent: FC<Props> = ({ message, errorId, isErrorVisibleByDefault = true }) => {
  const [isErrorVisible, setIsErrorVisible] = useState(isErrorVisibleByDefault);
  const [errorMessage, setErrorMessage] = useState(message);

  useEffect(() => {
    if (!errorId) return;

    const errorElement = document.getElementById(errorId);
    if (!errorElement) return;

    let observer: IntersectionObserver | null = null;

    const handleScroll = () => {
      const isScrolledIntoView = errorElement.isIntersectingViewport();
      setIsErrorVisible(isScrolledIntoView);
    };

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    if (!observer) {
      observer = new IntersectionObserver(handleScroll, options);
    }

    observer.observe(errorElement);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [errorId, isErrorVisibleByDefault]);

  return (
    <div id={errorId} className="moodboost-message" role="alert" aria-hidden={!isErrorVisible}>
      {isErrorVisible && <>{errorMessage}</>}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  errorId?: string;
  isErrorVisibleByDefault?: boolean;
}

const MyComponent: FC<Props> = ({ message, errorId, isErrorVisibleByDefault = true }) => {
  const [isErrorVisible, setIsErrorVisible] = useState(isErrorVisibleByDefault);
  const [errorMessage, setErrorMessage] = useState(message);

  useEffect(() => {
    if (!errorId) return;

    const errorElement = document.getElementById(errorId);
    if (!errorElement) return;

    let observer: IntersectionObserver | null = null;

    const handleScroll = () => {
      const isScrolledIntoView = errorElement.isIntersectingViewport();
      setIsErrorVisible(isScrolledIntoView);
    };

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    if (!observer) {
      observer = new IntersectionObserver(handleScroll, options);
    }

    observer.observe(errorElement);

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [errorId, isErrorVisibleByDefault]);

  return (
    <div id={errorId} className="moodboost-message" role="alert" aria-hidden={!isErrorVisible}>
      {isErrorVisible && <>{errorMessage}</>}
    </div>
  );
};

export default MyComponent;