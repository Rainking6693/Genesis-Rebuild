import React, { FC, useEffect, useId, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

interface PropsWithId extends Props {
  id?: string;
}

const MyComponent: FC<PropsWithId> = ({ message, id }) => {
  const componentId = id || useId();

  // Use React.memo for performance optimization
  const memoizedComponent = React.useMemo(() => {
    const sanitizedMessage = DOMPurify.sanitize(message);
    return <div id={componentId} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
  }, [message, componentId]);

  // Add error handling and logging for potential issues with the message content
  useEffect(() => {
    try {
      const sanitizedMessage = DOMPurify.sanitize(message);
      // Set the sanitized message to the component's innerHTML
      memoizedComponent.setProps({ message: sanitizedMessage });
    } catch (error) {
      console.error(`Error in MyComponent (id: ${componentId}):`, error);
    }
  }, [message]);

  return memoizedComponent;
};

MyComponent.error = (error: Error, componentId: string) => {
  console.error(`Error in MyComponent (id: ${componentId}):`, error);
};

export default MyComponent;

import React, { FC, useEffect, useId, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

interface PropsWithId extends Props {
  id?: string;
}

const MyComponent: FC<PropsWithId> = ({ message, id }) => {
  const componentId = id || useId();

  // Use React.memo for performance optimization
  const memoizedComponent = React.useMemo(() => {
    const sanitizedMessage = DOMPurify.sanitize(message);
    return <div id={componentId} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
  }, [message, componentId]);

  // Add error handling and logging for potential issues with the message content
  useEffect(() => {
    try {
      const sanitizedMessage = DOMPurify.sanitize(message);
      // Set the sanitized message to the component's innerHTML
      memoizedComponent.setProps({ message: sanitizedMessage });
    } catch (error) {
      console.error(`Error in MyComponent (id: ${componentId}):`, error);
    }
  }, [message]);

  return memoizedComponent;
};

MyComponent.error = (error: Error, componentId: string) => {
  console.error(`Error in MyComponent (id: ${componentId}):`, error);
};

export default MyComponent;