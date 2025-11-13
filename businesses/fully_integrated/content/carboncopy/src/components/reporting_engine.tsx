import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  onSubmit?: (title: string, content: string) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content, onSubmit }) => {
  const [titleState, setTitleState] = useState<string | undefined>(title);
  const [contentState, setContentState] = useState<string | undefined>(content);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setTitleState(title);
    setContentState(content);
  }, [title, content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleState(event.target.value);
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentState(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (titleState && contentState) {
        onSubmit?.(titleState, contentState);
      }
    },
    [titleState, contentState, onSubmit]
  );

  const handleReset = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();
      setTitleState(title);
      setContentState(content);
    }
  }, [title, content]);

  return (
    <form className="my-component" onSubmit={handleSubmit} onReset={handleReset} ref={formRef}>
      <label htmlFor="title" className="my-component__title-label">
        Title:
      </label>
      <input
        id="title"
        type="text"
        className="my-component__title-input"
        value={titleState || ''}
        onChange={handleTitleChange}
        required
        aria-label="Title"
      />

      <label htmlFor="content" className="my-component__content-label">
        Content:
      </label>
      <textarea
        id="content"
        className="my-component__content-textarea"
        value={contentState || ''}
        onChange={handleContentChange}
        required
        aria-label="Content"
      ></textarea>

      <div className="my-component__actions">
        <button type="submit" className="my-component__submit-button">
          Submit
        </button>
        <button type="reset" className="my-component__reset-button">
          Reset
        </button>
      </div>
    </form>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface MyComponentProps {
  title?: string;
  content?: string;
  onSubmit?: (title: string, content: string) => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content, onSubmit }) => {
  const [titleState, setTitleState] = useState<string | undefined>(title);
  const [contentState, setContentState] = useState<string | undefined>(content);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setTitleState(title);
    setContentState(content);
  }, [title, content]);

  const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleState(event.target.value);
  }, []);

  const handleContentChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentState(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (titleState && contentState) {
        onSubmit?.(titleState, contentState);
      }
    },
    [titleState, contentState, onSubmit]
  );

  const handleReset = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();
      setTitleState(title);
      setContentState(content);
    }
  }, [title, content]);

  return (
    <form className="my-component" onSubmit={handleSubmit} onReset={handleReset} ref={formRef}>
      <label htmlFor="title" className="my-component__title-label">
        Title:
      </label>
      <input
        id="title"
        type="text"
        className="my-component__title-input"
        value={titleState || ''}
        onChange={handleTitleChange}
        required
        aria-label="Title"
      />

      <label htmlFor="content" className="my-component__content-label">
        Content:
      </label>
      <textarea
        id="content"
        className="my-component__content-textarea"
        value={contentState || ''}
        onChange={handleContentChange}
        required
        aria-label="Content"
      ></textarea>

      <div className="my-component__actions">
        <button type="submit" className="my-component__submit-button">
          Submit
        </button>
        <button type="reset" className="my-component__reset-button">
          Reset
        </button>
      </div>
    </form>
  );
};

export default MyComponent;