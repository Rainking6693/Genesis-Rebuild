import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  message: string;
  isEditable?: boolean;
  onContentChange?: (content: string) => void;
}

const MyComponent: FC<Props> = ({ message, isEditable = false, onContentChange }) => {
  const [content, setContent] = useState(message);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(message);
    if (isEditable) {
      divRef.current?.focus();
    }
  }, [message, isEditable]);

  const handleContentChange = (event: React.SyntheticEvent) => {
    setContent(event.currentTarget.innerHTML);
    if (onContentChange) {
      onContentChange(event.currentTarget.innerHTML);
    }
  };

  return (
    <div
      ref={divRef}
      className="p-4 border border-gray-300 rounded-md"
      contentEditable={isEditable}
      onInput={handleContentChange}
    >
      {content}
    </div>
  );
};

export { MyComponent as default, MyComponent };

import React, { FC, useEffect, useRef, useState } from 'react';

interface Props {
  message: string;
  isEditable?: boolean;
  onContentChange?: (content: string) => void;
}

const MyComponent: FC<Props> = ({ message, isEditable = false, onContentChange }) => {
  const [content, setContent] = useState(message);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(message);
    if (isEditable) {
      divRef.current?.focus();
    }
  }, [message, isEditable]);

  const handleContentChange = (event: React.SyntheticEvent) => {
    setContent(event.currentTarget.innerHTML);
    if (onContentChange) {
      onContentChange(event.currentTarget.innerHTML);
    }
  };

  return (
    <div
      ref={divRef}
      className="p-4 border border-gray-300 rounded-md"
      contentEditable={isEditable}
      onInput={handleContentChange}
    >
      {content}
    </div>
  );
};

export { MyComponent as default, MyComponent };