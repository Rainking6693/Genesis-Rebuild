import React, { useState, useEffect, useCallback } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  const [titleState, setTitleState] = useState<string | undefined>(title);
  const [contentState, setContentState] = useState<string | undefined>(content);

  const updateTitleState = useCallback(() => {
    setTitleState(title || 'No Title Provided');
  }, [title]);

  const updateContentState = useCallback(() => {
    setContentState(content || 'No Content Provided');
  }, [content]);

  useEffect(() => {
    updateTitleState();
    updateContentState();
  }, [title, content, updateTitleState, updateContentState]);

  return (
    <div className="my-component" aria-label="Reporting Component">
      <h2 className="my-component__title" aria-label="Component Title">
        {titleState}
      </h2>
      <p className="my-component__content" aria-label="Component Content">
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
    setTitleState(title || 'No Title Provided');
  }, [title]);

  const updateContentState = useCallback(() => {
    setContentState(content || 'No Content Provided');
  }, [content]);

  useEffect(() => {
    updateTitleState();
    updateContentState();
  }, [title, content, updateTitleState, updateContentState]);

  return (
    <div className="my-component" aria-label="Reporting Component">
      <h2 className="my-component__title" aria-label="Component Title">
        {titleState}
      </h2>
      <p className="my-component__content" aria-label="Component Content">
        {contentState}
      </p>
    </div>
  );
};

export default MyComponent;