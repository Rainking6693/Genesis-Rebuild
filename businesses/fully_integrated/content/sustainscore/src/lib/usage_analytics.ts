import React, { FC, useMemo, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  id: string;
}

const MyComponent: FC<Props> = ({ message, id }) => {
  const sanitizedMessage = DOMPurify.sanitize(message);

  // Add a unique key for accessibility and performance
  const uniqueKey = useMemo(() => id + Math.random().toString(36).substring(7), [id]);

  const elementRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    setError(error);
  };

  const createElement = useCallback(() => {
    if (!elementRef.current) {
      elementRef.current = document.createElement('div');
      elementRef.current.setAttribute('role', 'presentation');
    }

    elementRef.current.innerHTML = sanitizedMessage;

    if (!DOMPurify.isTrusted(elementRef.current)) {
      throw new Error('The created element is not safe to render.');
    }

    return elementRef.current;
  }, [sanitizedMessage]);

  useEffect(() => {
    try {
      const createdElement = createElement();
      document.body.appendChild(createdElement);
    } catch (error) {
      handleError(error);
    }
  }, [createElement]);

  return <div key={uniqueKey} ref={elementRef} />;
};

// Memoize the component when props don't change
const MemoizedMyComponent: FC<Props> = React.memo(MyComponent);

export const UsageAnalytics = (props: Props) => {
  const { id } = props;
  const memoizedComponent = useMemo(() => <MemoizedMyComponent id={id} message={props.message} />, [id, props.message]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return memoizedComponent;
};

This version of the UsageAnalytics component should be more resilient, handle edge cases better, be more accessible, and be easier to maintain.