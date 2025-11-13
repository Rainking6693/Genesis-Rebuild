import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  message: string;
  reviewPlatform?: ReviewPlatform;
}

interface ReviewPlatform {
  onReview?: (message: string) => void;
}

const sanitizeHtml = (unsafeHtml: string) => {
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = unsafeHtml;

  // Handle cases where sanitization fails due to invalid HTML
  if (!tempDiv.textContent) {
    tempDiv = document.createElement('pre');
    tempDiv.textContent = unsafeHtml;
  }

  return tempDiv.textContent || '';
};

const MyComponent: FC<Props> = ({ message, reviewPlatform }) => {
  const [safeMessage, setSafeMessage] = useState(message);

  useEffect(() => {
    setSafeMessage(sanitizeHtml(message));

    if (reviewPlatform && reviewPlatform.onReview) {
      reviewPlatform.onReview(message);
    }
  }, [message, reviewPlatform]);

  // Add accessibility by providing an ARIA-label for screen readers
  const ariaLabel = `Message: ${message}`;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: safeMessage }} aria-label={ariaLabel} />
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error in MyComponent:', error);
};

const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  message: string;
  reviewPlatform?: ReviewPlatform;
}

interface ReviewPlatform {
  onReview?: (message: string) => void;
}

const sanitizeHtml = (unsafeHtml: string) => {
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = unsafeHtml;

  // Handle cases where sanitization fails due to invalid HTML
  if (!tempDiv.textContent) {
    tempDiv = document.createElement('pre');
    tempDiv.textContent = unsafeHtml;
  }

  return tempDiv.textContent || '';
};

const MyComponent: FC<Props> = ({ message, reviewPlatform }) => {
  const [safeMessage, setSafeMessage] = useState(message);

  useEffect(() => {
    setSafeMessage(sanitizeHtml(message));

    if (reviewPlatform && reviewPlatform.onReview) {
      reviewPlatform.onReview(message);
    }
  }, [message, reviewPlatform]);

  // Add accessibility by providing an ARIA-label for screen readers
  const ariaLabel = `Message: ${message}`;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: safeMessage }} aria-label={ariaLabel} />
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error('Error in MyComponent:', error);
};

const MemoizedMyComponent = React.memo(MyComponent);

export default MemoizedMyComponent;