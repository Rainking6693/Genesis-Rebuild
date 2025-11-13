import React, { useState, useRef } from 'react';
import { ComponentPropsWithRef, DetailedHTMLProps } from 'react';

type LogProps = Omit<DetailedHTMLProps<HTMLDivElement, HTMLDivElement>, keyof LogProps> & {
  message: string;
  testId?: string;
  className?: string;
  variant?: string;
  maxLength?: number;
  maxLines?: number;
  readMoreText?: string;
  onReadMoreClick?: () => void;
  collapsible?: boolean;
  collapsedByDefault?: boolean;
};

const LogComponent: React.FC<LogProps> = ({
  message,
  testId = 'audit-log',
  className,
  variant,
  maxLength = 200,
  maxLines = 4,
  readMoreText = 'Read more',
  onReadMoreClick,
  collapsible = true,
  collapsedByDefault = false,
  ...rest
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const [collapsed, setCollapsed] = useState(collapsedByDefault);
  const logRef = useRef<HTMLDivElement>(null);

  const handleReadMoreClick = () => {
    if (onReadMoreClick) {
      onReadMoreClick();
    }
    setCollapsed(!collapsed);
  };

  const truncateMessage = () => {
    if (message.length > maxLength) {
      setIsTruncated(true);
      if (collapsible) {
        return message.slice(0, maxLength) + '...';
      }
      return message.slice(0, maxLength) + ' ' + readMoreText;
    }
    return message;
  };

  const logStyles = {
    maxHeight: collapsed ? '0px' : 'auto',
    transition: 'max-height 0.3s ease-out',
    overflow: 'hidden',
  };

  return (
    <div
      data-testid={testId}
      className={`log-component ${className} ${variant}`}
      role="log"
      aria-label="Audit log message"
      aria-labelledby={`log-title-${testId}`}
      {...rest}
    >
      <div id={`log-title-${testId}`} className="log-title">
        {variant && `[${variant}]`}
      </div>
      <div
        ref={logRef}
        className="log-message"
        style={logStyles}
        data-variant={variant}
        data-collapsed={collapsed.toString()}
      >
        {truncateMessage()}
      </div>
      {isTruncated && (
        <div className="log-read-more" onClick={handleReadMoreClick}>
          {readMoreText}
        </div>
      )}
    </div>
  );
};

const MyComponent: React.FC<LogProps> = ({ message, testId = 'audit-log', className, ...rest }) => {
  return <LogComponent variant="my-component" message={message} testId={testId} className={className} {...rest} />;
};

const RetentionLabChurnMessageComponent: React.FC<LogProps> = ({ message, testId = 'retention-lab-churn-message', className, ...rest }) => {
  return <LogComponent variant="retention-lab-churn-message" message={message} testId={testId} className={className} {...rest} />;
};

export { MyComponent, RetentionLabChurnMessageComponent };

This updated code addresses the requirements for resiliency, edge cases, accessibility, and maintainability. The LogComponent now handles long messages, provides a collapsible interface, and is more accessible with the addition of a title and variant attributes. The custom props allow for better customization of the logs, and the use of a ref and state ensures a smooth user experience when expanding/collapsing the log.