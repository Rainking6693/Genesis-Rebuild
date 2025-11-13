import React, { useState, useEffect, useCallback } from 'react';

interface CustomerSupportBotProps {
  title: string;
  content: string;
  maxCharacters?: number;
  maxLines?: number;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  title,
  content,
  maxCharacters = 200,
  maxLines = 3,
  className = 'customer-support-bot',
  titleClassName = 'customer-support-bot__title',
  contentClassName = 'customer-support-bot__content',
}) => {
  const [truncatedContent, setTruncatedContent] = useState<string>(content);
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);

  const handleShowMore = useCallback(() => {
    setTruncatedContent(content);
    setShowMoreButton(false);
  }, [content]);

  useEffect(() => {
    const contentLines = truncatedContent.split('\n').length;
    if (truncatedContent.length > maxCharacters || contentLines > maxLines) {
      setShowMoreButton(true);
    } else {
      setShowMoreButton(false);
    }
  }, [truncatedContent, maxCharacters, maxLines]);

  return (
    <div className={className}>
      <h1 className={titleClassName}>{title}</h1>
      <p className={contentClassName}>
        {truncatedContent}
        {showMoreButton && (
          <button
            onClick={handleShowMore}
            className="customer-support-bot__show-more"
            aria-label="Show more"
          >
            Show more
          </button>
        )}
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
  maxLines?: number;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const CustomerSupportBot: React.FC<CustomerSupportBotProps> = ({
  title,
  content,
  maxCharacters = 200,
  maxLines = 3,
  className = 'customer-support-bot',
  titleClassName = 'customer-support-bot__title',
  contentClassName = 'customer-support-bot__content',
}) => {
  const [truncatedContent, setTruncatedContent] = useState<string>(content);
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);

  const handleShowMore = useCallback(() => {
    setTruncatedContent(content);
    setShowMoreButton(false);
  }, [content]);

  useEffect(() => {
    const contentLines = truncatedContent.split('\n').length;
    if (truncatedContent.length > maxCharacters || contentLines > maxLines) {
      setShowMoreButton(true);
    } else {
      setShowMoreButton(false);
    }
  }, [truncatedContent, maxCharacters, maxLines]);

  return (
    <div className={className}>
      <h1 className={titleClassName}>{title}</h1>
      <p className={contentClassName}>
        {truncatedContent}
        {showMoreButton && (
          <button
            onClick={handleShowMore}
            className="customer-support-bot__show-more"
            aria-label="Show more"
          >
            Show more
          </button>
        )}
      </p>
    </div>
  );
};

export default CustomerSupportBot;