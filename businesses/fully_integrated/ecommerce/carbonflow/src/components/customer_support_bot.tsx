import React, { useState, useEffect, useCallback } from 'react';

interface CustomerSupportBotProps {
  title: string;
  content: string;
  maxCharacters?: number;
  onContentChange?: (content: string) => void;
  onError?: (error: Error) => void;
}

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  title,
  content,
  maxCharacters = 500,
  onContentChange,
  onError,
}) => {
  const [displayedContent, setDisplayedContent] = useState<string>(content);

  useEffect(() => {
    setDisplayedContent(content);
  }, [content]);

  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      try {
        const newContent = event.target.value;
        if (newContent.length <= maxCharacters) {
          setDisplayedContent(newContent);
          onContentChange?.(newContent);
        }
      } catch (error) {
        onError?.(error as Error);
      }
    },
    [maxCharacters, onContentChange, onError]
  );

  return (
    <div className="customer-support-bot" aria-live="polite">
      <h1 className="customer-support-bot__title" id="customer-support-bot-title">
        {title}
      </h1>
      <textarea
        className="customer-support-bot__content"
        value={displayedContent}
        onChange={handleContentChange}
        maxLength={maxCharacters}
        aria-describedby="customer-support-bot-title"
        aria-label={`Customer support bot content, maximum ${maxCharacters} characters`}
      />
      <p className="customer-support-bot__character-count">
        {displayedContent.length}/{maxCharacters} characters
      </p>
    </div>
  );
};

export default CustomerSupportBot;

import React, { useState, useEffect, useCallback } from 'react';

interface CustomerSupportBotProps {
  title: string;
  content: string;
  maxCharacters?: number;
  onContentChange?: (content: string) => void;
  onError?: (error: Error) => void;
}

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  title,
  content,
  maxCharacters = 500,
  onContentChange,
  onError,
}) => {
  const [displayedContent, setDisplayedContent] = useState<string>(content);

  useEffect(() => {
    setDisplayedContent(content);
  }, [content]);

  const handleContentChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      try {
        const newContent = event.target.value;
        if (newContent.length <= maxCharacters) {
          setDisplayedContent(newContent);
          onContentChange?.(newContent);
        }
      } catch (error) {
        onError?.(error as Error);
      }
    },
    [maxCharacters, onContentChange, onError]
  );

  return (
    <div className="customer-support-bot" aria-live="polite">
      <h1 className="customer-support-bot__title" id="customer-support-bot-title">
        {title}
      </h1>
      <textarea
        className="customer-support-bot__content"
        value={displayedContent}
        onChange={handleContentChange}
        maxLength={maxCharacters}
        aria-describedby="customer-support-bot-title"
        aria-label={`Customer support bot content, maximum ${maxCharacters} characters`}
      />
      <p className="customer-support-bot__character-count">
        {displayedContent.length}/{maxCharacters} characters
      </p>
    </div>
  );
};

export default CustomerSupportBot;