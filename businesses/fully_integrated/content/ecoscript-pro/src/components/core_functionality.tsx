import React, { FC, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: FC<Props> = ({ message, fallbackMessage = 'Loading...' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      const sanitizedMessage = DOMPurify.sanitize(message);
      divRef.current.innerHTML = sanitizedMessage;
      setIsLoaded(true);
    }
  }, [message]);

  return (
    <div>
      {!isLoaded && <div id="my-component-fallback">{fallbackMessage}</div>}
      <div ref={divRef} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  fallbackMessage: 'Loading...',
};

MyComponent.propTypes = {
  message: PropTypes.string,
  fallbackMessage: PropTypes.string,
};

export default MyComponent;

import React, { FC, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: FC<Props> = ({ message, fallbackMessage = 'Loading...' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      const sanitizedMessage = DOMPurify.sanitize(message);
      divRef.current.innerHTML = sanitizedMessage;
      setIsLoaded(true);
    }
  }, [message]);

  return (
    <div>
      {!isLoaded && <div id="my-component-fallback">{fallbackMessage}</div>}
      <div ref={divRef} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  fallbackMessage: 'Loading...',
};

MyComponent.propTypes = {
  message: PropTypes.string,
  fallbackMessage: PropTypes.string,
};

export default MyComponent;