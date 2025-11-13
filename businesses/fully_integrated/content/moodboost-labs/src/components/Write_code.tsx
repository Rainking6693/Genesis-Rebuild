import React, { FC, PropsWithChildren, useId } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message = '' }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);
  const componentId = useId();

  return (
    <div id={componentId} data-testid={componentId}>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        key={message}
        aria-labelledby={componentId}
      />
    </div>
  );
};

export default MyComponent;

import React, { FC, PropsWithChildren, useId } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = ({ message = '' }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);
  const componentId = useId();

  return (
    <div id={componentId} data-testid={componentId}>
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        key={message}
        aria-labelledby={componentId}
      />
    </div>
  );
};

export default MyComponent;