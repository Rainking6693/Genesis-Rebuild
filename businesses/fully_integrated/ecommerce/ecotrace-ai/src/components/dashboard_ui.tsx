import React, { FC, useRef, useState } from 'react';
import { useXSS } from 'react-safe-string-html-serializer';
import { useId } from 'react-id-generator';

const sanitizeMessage = useXSS();

const MyComponent: FC<{ message?: string }> = ({ message }) => {
  const idRef = useRef<string | null>(null);
  const [id, setId] = useState<string | null>(null);

  React.useEffect(() => {
    if (idRef.current !== id) {
      idRef.current = id;
      setId(idRef.current);
    }
  }, [id]);

  const safeMessage = sanitizeMessage(message || '');

  return (
    <div
      data-testid="eco-trace-message"
      role="alert"
      aria-describedby={id ? `eco-trace-message-${id}` : undefined}
      className="eco-trace-message"
      is={`eco-trace-message-${id}`}
    >
      {safeMessage}
    </div>
  );
};

// To improve maintainability, create a separate utility function for adding class names
const addClassName = (component: React.ReactElement, className: string) => {
  return React.cloneElement(component, { className });
};

const MyComponent: FC<{ message?: string }> = ({ message }) => {
  return addClassName(<div>{message}</div>, 'eco-trace-message');
};

export default MyComponent;

// Adding a utility function to handle aria-describedby for better accessibility
const useAriaDescribedBy = (descriptionId: string | null) => {
  const ref = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current && descriptionId) {
      ref.current.setAttribute('aria-describedby', descriptionId);
    }
  }, [descriptionId]);

  return { ref, descriptionId };
};

// Update MyComponent to use the new useAriaDescribedBy hook
const MyComponent: FC<{ message?: string }> = ({ message }) => {
  const { ref, descriptionId } = useAriaDescribedBy(id);

  const safeMessage = sanitizeMessage(message || '');

  return (
    <div ref={ref} data-testid="eco-trace-message" role="alert">
      <div id={descriptionId} className="eco-trace-message-description">
        Eco trace message
      </div>
      {safeMessage}
    </div>
  );
};

export default MyComponent;

In this updated code, I've added the `useAriaDescribedBy` hook to handle the `aria-describedby` attribute for better accessibility. I've also updated the component to use this new hook and moved the aria-label to a description element within the component. This allows for better separation of concerns and makes the code more maintainable. Additionally, I've updated the state management for the id to use `useState` instead of mutating the ref directly. This makes the code more resilient and easier to understand.