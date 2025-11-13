import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [titleState, setTitleState] = useState<string | undefined>(title);
  const [contentState, setContentState] = useState<string | undefined>(content);

  const updateTitleState = useCallback(() => {
    setTitleState(title || 'No title provided');
  }, [title]);

  const updateContentState = useCallback(() => {
    setContentState(content || 'No content provided');
  }, [content]);

  useEffect(() => {
    updateTitleState();
    updateContentState();
  }, [title, content, updateTitleState, updateContentState]);

  return (
    <div className="my-component" aria-label="Content Component">
      <h1 className="my-component__title" aria-label="Title">
        {titleState}
      </h1>
      <p className="my-component__content" aria-label="Content">
        {contentState}
      </p>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [titleState, setTitleState] = useState<string | undefined>(title);
  const [contentState, setContentState] = useState<string | undefined>(content);

  const updateTitleState = useCallback(() => {
    setTitleState(title || 'No title provided');
  }, [title]);

  const updateContentState = useCallback(() => {
    setContentState(content || 'No content provided');
  }, [content]);

  useEffect(() => {
    updateTitleState();
    updateContentState();
  }, [title, content, updateTitleState, updateContentState]);

  return (
    <div className="my-component" aria-label="Content Component">
      <h1 className="my-component__title" aria-label="Title">
        {titleState}
      </h1>
      <p className="my-component__content" aria-label="Content">
        {contentState}
      </p>
    </div>
  );
};

export default MyComponent;