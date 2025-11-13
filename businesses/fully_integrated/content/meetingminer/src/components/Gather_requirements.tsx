import React, { FC, SyntheticEvent, useState, useEffect } from 'react';

interface Props {
  message: string;
  onError?: (error: Error) => void;
  onMount?: () => void;
  onUpdate?: () => void;
  onUnmount?: () => void;
}

const MyComponent: FC<Props> = ({ message, onError, onMount, onUpdate, onUnmount }) => {
  const [content, setContent] = useState(message);

  const handleError = (e: SyntheticEvent) => {
    const target = e.target as HTMLDivElement;
    const newContent = target.innerText;
    setContent(newContent);

    if (onError) {
      onError(new Error(`Error sanitizing user-generated content: ${newContent}`));
    }
  };

  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, []);

  useEffect(() => {
    if (onUpdate) {
      onUpdate();
    }
  }, [content]);

  useEffect(() => {
    return () => {
      if (onUnmount) {
        onUnmount();
      }
    };
  }, []);

  return (
    <div
      onError={handleError}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

export default MyComponent;

import React, { FC, SyntheticEvent, useState, useEffect } from 'react';

interface Props {
  message: string;
  onError?: (error: Error) => void;
  onMount?: () => void;
  onUpdate?: () => void;
  onUnmount?: () => void;
}

const MyComponent: FC<Props> = ({ message, onError, onMount, onUpdate, onUnmount }) => {
  const [content, setContent] = useState(message);

  const handleError = (e: SyntheticEvent) => {
    const target = e.target as HTMLDivElement;
    const newContent = target.innerText;
    setContent(newContent);

    if (onError) {
      onError(new Error(`Error sanitizing user-generated content: ${newContent}`));
    }
  };

  useEffect(() => {
    if (onMount) {
      onMount();
    }
  }, []);

  useEffect(() => {
    if (onUpdate) {
      onUpdate();
    }
  }, [content]);

  useEffect(() => {
    return () => {
      if (onUnmount) {
        onUnmount();
      }
    };
  }, []);

  return (
    <div
      onError={handleError}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

MyComponent.defaultProps = {
  message: '',
};

export default MyComponent;