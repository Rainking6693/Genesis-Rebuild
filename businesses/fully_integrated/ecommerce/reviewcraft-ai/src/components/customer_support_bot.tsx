import React, { FC, ReactElement, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { SanitizeHtmlFunc } from './types';

type Props = {
  name: string;
  avatar: ReactElement | null;
  message: string;
  responseDelay?: number;
  maxLines?: number;
  errorComponent?: ReactElement;
  id?: string;
};

const CustomerSupportBot: FC<Props> = ({
  name,
  avatar,
  message,
  responseDelay = 1000,
  maxLines = 4,
  errorComponent = <span>An error occurred while sanitizing the message.</span>,
  id,
}) => {
  const sanitizeHtml: SanitizeHtmlFunc = (input) => {
    if (!input) {
      return null;
    }
    try {
      return DOMPurify.sanitize(input);
    } catch (error) {
      console.error('Error sanitizing HTML:', error);
      return null;
    }
  };

  const sanitizedMessage = sanitizeHtml(message) || errorComponent;
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      setTimeout(() => messageRef.current.focus(), responseDelay);
    }
  }, [message, responseDelay]);

  const sanitizedChildren = React.Children.map(sanitizedMessage.props.children, (child) =>
    React.cloneElement(child as ReactElement, {
      // Pass through any additional props from the child element
      ...child.props,
      // Sanitize any text content within the child element
      dangerouslySetInnerHTML: {
        __html: DOMPurify.sanitize(child.props.dangerouslySetInnerHTML?.__html || ''),
      },
    })
  );

  return (
    <div id={id}>
      <div className="avatar">{avatar}</div>
      <div className="name">{name}</div>
      <div className="message" ref={messageRef}>
        {sanitizedChildren.slice(0, maxLines).map((child, index) => (
          <React.Fragment key={index}>{child}</React.Fragment>
        ))}
        {sanitizedChildren.length > maxLines && (
          <div>... and {sanitizedChildren.length - maxLines} more lines</div>
        )}
      </div>
    </div>
  );
};

export default CustomerSupportBot;

import React, { FC, ReactElement, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { SanitizeHtmlFunc } from './types';

type Props = {
  name: string;
  avatar: ReactElement | null;
  message: string;
  responseDelay?: number;
  maxLines?: number;
  errorComponent?: ReactElement;
  id?: string;
};

const CustomerSupportBot: FC<Props> = ({
  name,
  avatar,
  message,
  responseDelay = 1000,
  maxLines = 4,
  errorComponent = <span>An error occurred while sanitizing the message.</span>,
  id,
}) => {
  const sanitizeHtml: SanitizeHtmlFunc = (input) => {
    if (!input) {
      return null;
    }
    try {
      return DOMPurify.sanitize(input);
    } catch (error) {
      console.error('Error sanitizing HTML:', error);
      return null;
    }
  };

  const sanitizedMessage = sanitizeHtml(message) || errorComponent;
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      setTimeout(() => messageRef.current.focus(), responseDelay);
    }
  }, [message, responseDelay]);

  const sanitizedChildren = React.Children.map(sanitizedMessage.props.children, (child) =>
    React.cloneElement(child as ReactElement, {
      // Pass through any additional props from the child element
      ...child.props,
      // Sanitize any text content within the child element
      dangerouslySetInnerHTML: {
        __html: DOMPurify.sanitize(child.props.dangerouslySetInnerHTML?.__html || ''),
      },
    })
  );

  return (
    <div id={id}>
      <div className="avatar">{avatar}</div>
      <div className="name">{name}</div>
      <div className="message" ref={messageRef}>
        {sanitizedChildren.slice(0, maxLines).map((child, index) => (
          <React.Fragment key={index}>{child}</React.Fragment>
        ))}
        {sanitizedChildren.length > maxLines && (
          <div>... and {sanitizedChildren.length - maxLines} more lines</div>
        )}
      </div>
    </div>
  );
};

export default CustomerSupportBot;