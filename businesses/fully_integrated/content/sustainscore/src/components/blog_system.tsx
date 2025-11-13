import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types'; // Optional, but good for runtime type checking in development

interface ContentBlockProps {
  title?: string;
  content?: string | ReactNode; // Allow ReactNode for richer content
  className?: string; // Allow external styling
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6; // Allow control over title level
  fallbackContent?: ReactNode; // Customizable fallback content
  ariaLabelTitle?: string; // More control over aria-label for title
  ariaLabelContent?: string; // More control over aria-label for content
  ariaLabelFallback?: string; // More control over aria-label for fallback
  dataTestId?: string; // For testing purposes
}

const ContentBlock: FC<ContentBlockProps> = ({
  title,
  content,
  className = '',
  titleLevel = 1,
  fallbackContent = 'No content available',
  ariaLabelTitle,
  ariaLabelContent,
  ariaLabelFallback = 'No content available',
  dataTestId,
}) => {
  const HeadingTag = `h${titleLevel}` as keyof React.ReactHTML;

  const hasContent = !!title || !!content;

  return (
    <div className={`content-block ${className}`} data-testid={dataTestId}>
      {title && (
        <HeadingTag
          className="content-block__title"
          aria-label={ariaLabelTitle || title}
          data-testid={`${dataTestId}-title`}
        >
          {title}
        </HeadingTag>
      )}

      {content && (
        <div
          className="content-block__content"
          aria-label={ariaLabelContent || (typeof content === 'string' ? content : undefined)} // Only apply aria-label if content is a string
          data-testid={`${dataTestId}-content`}
        >
          {content}
        </div>
      )}

      {!hasContent && (
        <div
          className="content-block__empty"
          aria-label={ariaLabelFallback}
          data-testid={`${dataTestId}-empty`}
        >
          {fallbackContent}
        </div>
      )}
    </div>
  );
};

ContentBlock.propTypes = { // Optional: PropTypes for runtime type checking in development
  title: PropTypes.string,
  content: PropTypes.node,
  className: PropTypes.string,
  titleLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  fallbackContent: PropTypes.node,
  ariaLabelTitle: PropTypes.string,
  ariaLabelContent: PropTypes.string,
  ariaLabelFallback: PropTypes.string,
  dataTestId: PropTypes.string,
};

ContentBlock.defaultProps = {
  className: '',
  titleLevel: 1,
  fallbackContent: 'No content available',
  ariaLabelFallback: 'No content available',
};

export default ContentBlock;

import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types'; // Optional, but good for runtime type checking in development

interface ContentBlockProps {
  title?: string;
  content?: string | ReactNode; // Allow ReactNode for richer content
  className?: string; // Allow external styling
  titleLevel?: 1 | 2 | 3 | 4 | 5 | 6; // Allow control over title level
  fallbackContent?: ReactNode; // Customizable fallback content
  ariaLabelTitle?: string; // More control over aria-label for title
  ariaLabelContent?: string; // More control over aria-label for content
  ariaLabelFallback?: string; // More control over aria-label for fallback
  dataTestId?: string; // For testing purposes
}

const ContentBlock: FC<ContentBlockProps> = ({
  title,
  content,
  className = '',
  titleLevel = 1,
  fallbackContent = 'No content available',
  ariaLabelTitle,
  ariaLabelContent,
  ariaLabelFallback = 'No content available',
  dataTestId,
}) => {
  const HeadingTag = `h${titleLevel}` as keyof React.ReactHTML;

  const hasContent = !!title || !!content;

  return (
    <div className={`content-block ${className}`} data-testid={dataTestId}>
      {title && (
        <HeadingTag
          className="content-block__title"
          aria-label={ariaLabelTitle || title}
          data-testid={`${dataTestId}-title`}
        >
          {title}
        </HeadingTag>
      )}

      {content && (
        <div
          className="content-block__content"
          aria-label={ariaLabelContent || (typeof content === 'string' ? content : undefined)} // Only apply aria-label if content is a string
          data-testid={`${dataTestId}-content`}
        >
          {content}
        </div>
      )}

      {!hasContent && (
        <div
          className="content-block__empty"
          aria-label={ariaLabelFallback}
          data-testid={`${dataTestId}-empty`}
        >
          {fallbackContent}
        </div>
      )}
    </div>
  );
};

ContentBlock.propTypes = { // Optional: PropTypes for runtime type checking in development
  title: PropTypes.string,
  content: PropTypes.node,
  className: PropTypes.string,
  titleLevel: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
  fallbackContent: PropTypes.node,
  ariaLabelTitle: PropTypes.string,
  ariaLabelContent: PropTypes.string,
  ariaLabelFallback: PropTypes.string,
  dataTestId: PropTypes.string,
};

ContentBlock.defaultProps = {
  className: '',
  titleLevel: 1,
  fallbackContent: 'No content available',
  ariaLabelFallback: 'No content available',
};

export default ContentBlock;