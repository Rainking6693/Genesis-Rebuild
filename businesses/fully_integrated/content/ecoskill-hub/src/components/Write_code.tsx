import React, { FC, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message = '', className, ariaLabel }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    if (divRef.current && message) {
      divRef.current.innerHTML = DOMPurify.sanitize(message);
      setHasContent(true);
    }
  }, [message]);

  return (
    <div ref={divRef} className={className} aria-label={ariaLabel}>
      {hasContent && (
        <>
          {/* Add any additional content or components here */}
        </>
      )}
    </div>
  );
};

export default MyComponent;

import React, { FC, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
  className?: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ message = '', className, ariaLabel }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    if (divRef.current && message) {
      divRef.current.innerHTML = DOMPurify.sanitize(message);
      setHasContent(true);
    }
  }, [message]);

  return (
    <div ref={divRef} className={className} aria-label={ariaLabel}>
      {hasContent && (
        <>
          {/* Add any additional content or components here */}
        </>
      )}
    </div>
  );
};

export default MyComponent;