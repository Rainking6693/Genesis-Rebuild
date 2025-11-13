import React, { useState, useCallback, useEffect } from 'react';

interface ReturnFlowComponentProps {
  title: string;
  description: string;
  onClickHandler?: () => void;
  ariaLiveRegion?: string;
  ariaLiveStatus?: 'polite' | 'assertive' | 'off';
}

const ReturnFlowComponent: React.FC<ReturnFlowComponentProps> = ({
  title,
  description,
  onClickHandler,
  ariaLiveRegion = 'region',
  ariaLiveStatus = 'polite',
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    setIsClicked(true);

    if (onClickHandler) {
      try {
        onClickHandler();
      } catch (error) {
        console.error('Error in onClickHandler:', error);
        setIsClicked(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onClickHandler]);

  useEffect(() => {
    if (isClicked && !isLoading) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isClicked, isLoading]);

  return (
    <div
      role={ariaLiveRegion}
      aria-live={ariaLiveStatus}
      aria-label={`${title} - ${description}`}
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '4px',
      }}
    >
      <h2 id="title">{title}</h2>
      <p id="description">{description}</p>
      <button
        onClick={handleClick}
        disabled={isClicked || isLoading}
        aria-describedby="title description"
      >
        {isClicked ? 'Clicked!' : isLoading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  );
};

export default ReturnFlowComponent;

import React, { useState, useCallback, useEffect } from 'react';

interface ReturnFlowComponentProps {
  title: string;
  description: string;
  onClickHandler?: () => void;
  ariaLiveRegion?: string;
  ariaLiveStatus?: 'polite' | 'assertive' | 'off';
}

const ReturnFlowComponent: React.FC<ReturnFlowComponentProps> = ({
  title,
  description,
  onClickHandler,
  ariaLiveRegion = 'region',
  ariaLiveStatus = 'polite',
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    setIsClicked(true);

    if (onClickHandler) {
      try {
        onClickHandler();
      } catch (error) {
        console.error('Error in onClickHandler:', error);
        setIsClicked(false);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onClickHandler]);

  useEffect(() => {
    if (isClicked && !isLoading) {
      const timer = setTimeout(() => {
        setIsClicked(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isClicked, isLoading]);

  return (
    <div
      role={ariaLiveRegion}
      aria-live={ariaLiveStatus}
      aria-label={`${title} - ${description}`}
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '4px',
      }}
    >
      <h2 id="title">{title}</h2>
      <p id="description">{description}</p>
      <button
        onClick={handleClick}
        disabled={isClicked || isLoading}
        aria-describedby="title description"
      >
        {isClicked ? 'Clicked!' : isLoading ? 'Loading...' : 'Click me'}
      </button>
    </div>
  );
};

export default ReturnFlowComponent;