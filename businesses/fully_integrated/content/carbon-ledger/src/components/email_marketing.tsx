import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title = 'Default Title',
  description = 'Default Description',
  onClick = () => {},
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    setIsClicked(true);
    onClick();
  }, [onClick]);

  useEffect(() => {
    if (isClicked) {
      console.log('Button was clicked!');
    }
  }, [isClicked]);

  useEffect(() => {
    if (isClicked && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isClicked]);

  return (
    <div className="my-component" aria-live="polite">
      <h2 className="my-component__title" id="my-component-title">
        {title}
      </h2>
      <p className="my-component__description" aria-describedby="my-component-title">
        {description}
      </p>
      <button
        className="my-component__button"
        onClick={handleClick}
        aria-label="Click me"
        disabled={isClicked}
        ref={buttonRef}
      >
        {isClicked ? 'Clicked!' : 'Click me'}
      </button>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title?: string;
  description?: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title = 'Default Title',
  description = 'Default Description',
  onClick = () => {},
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = useCallback(() => {
    setIsClicked(true);
    onClick();
  }, [onClick]);

  useEffect(() => {
    if (isClicked) {
      console.log('Button was clicked!');
    }
  }, [isClicked]);

  useEffect(() => {
    if (isClicked && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isClicked]);

  return (
    <div className="my-component" aria-live="polite">
      <h2 className="my-component__title" id="my-component-title">
        {title}
      </h2>
      <p className="my-component__description" aria-describedby="my-component-title">
        {description}
      </p>
      <button
        className="my-component__button"
        onClick={handleClick}
        aria-label="Click me"
        disabled={isClicked}
        ref={buttonRef}
      >
        {isClicked ? 'Clicked!' : 'Click me'}
      </button>
    </div>
  );
};

export default MyComponent;