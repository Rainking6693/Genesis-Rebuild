import React, { FC, useMemo, useId } from 'react';
import DOMPurify from 'dompurify';
import { useOnScreen } from '@react-hook/intersection';

interface Props {
  message: string;
}

type ComponentType = FC<Props>;

const MyComponent: ComponentType = ({ message }) => {
  const id = useId();
  const [isVisible, setVisibility] = useOnScreen({ threshold: 0.5 });
  const sanitizedMessage = useMemo(() => DOMPurify.sanitize(message), [message]);

  const handleVisibilityChange = () => {
    if (isVisible) {
      setVisibility(false); // Reset visibility to false after initial render
    }
  };

  React.useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div id={id} aria-label="MyComponent">
      <div role="alert" className={isVisible ? 'visible' : ''}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

export default MyComponent;

import React, { FC, useMemo, useId } from 'react';
import DOMPurify from 'dompurify';
import { useOnScreen } from '@react-hook/intersection';

interface Props {
  message: string;
}

type ComponentType = FC<Props>;

const MyComponent: ComponentType = ({ message }) => {
  const id = useId();
  const [isVisible, setVisibility] = useOnScreen({ threshold: 0.5 });
  const sanitizedMessage = useMemo(() => DOMPurify.sanitize(message), [message]);

  const handleVisibilityChange = () => {
    if (isVisible) {
      setVisibility(false); // Reset visibility to false after initial render
    }
  };

  React.useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div id={id} aria-label="MyComponent">
      <div role="alert" className={isVisible ? 'visible' : ''}>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

export default MyComponent;