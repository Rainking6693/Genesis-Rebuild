import React, { FC, ReactNode, useRef, useState } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    if (componentRef.current) {
      componentRef.current.focus();
      setIsLoaded(true);
    }
  }, [message]);

  const sanitizedMessage = {
    __html: message,
  };

  const handleError = (e: React.SyntheticEvent) => {
    e.currentTarget.innerHTML = 'Error: Unsafe content detected.';
  };

  return (
    <div data-testid="my-component" aria-label="My Component" ref={componentRef}>
      {isLoaded ? (
        <div
          dangerouslySetInnerHTML={sanitizedMessage}
          key="my-component"
          onError={handleError}
        />
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, useRef, useState } from 'react';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    if (componentRef.current) {
      componentRef.current.focus();
      setIsLoaded(true);
    }
  }, [message]);

  const sanitizedMessage = {
    __html: message,
  };

  const handleError = (e: React.SyntheticEvent) => {
    e.currentTarget.innerHTML = 'Error: Unsafe content detected.';
  };

  return (
    <div data-testid="my-component" aria-label="My Component" ref={componentRef}>
      {isLoaded ? (
        <div
          dangerouslySetInnerHTML={sanitizedMessage}
          key="my-component"
          onError={handleError}
        />
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default MyComponent;