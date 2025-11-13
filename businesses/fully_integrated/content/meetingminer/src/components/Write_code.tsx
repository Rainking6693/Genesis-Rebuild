import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'a'];

const createSanitizedHTML = (html: string): string => {
  const DOMParser = new DOMParser();
  const sanitizedDocument = DOMParser.parseFromString(html, 'text/html');

  // Remove any potentially dangerous tags or attributes
  sanitizedDocument.body.innerHTML = sanitizedDocument.body.innerHTML
    .replace(/<script[^>]*>(.*?)<\/script>/gs, '')
    .replace(/<style[^>]*>(.*?)<\/style>/gs, '')
    .replace(/<[^>]+?(\s+?|\/)?>/g, (tag) => {
      if (!allowedTags.includes(tag.toLowerCase())) {
        return '';
      }
      return tag;
    });

  return sanitizedDocument.body.innerHTML;
};

const MyComponent: FC<Props> = ({ message, children, className, ariaLabel, ...rest }) => {
  const sanitizedMessage = message ? createSanitizedHTML(message) : '';

  return (
    <div className={className} aria-label={ariaLabel} {...rest}>
      {children}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message?: string;
  children?: ReactNode;
  ariaLabel?: string;
};

const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'a'];

const createSanitizedHTML = (html: string): string => {
  const DOMParser = new DOMParser();
  const sanitizedDocument = DOMParser.parseFromString(html, 'text/html');

  // Remove any potentially dangerous tags or attributes
  sanitizedDocument.body.innerHTML = sanitizedDocument.body.innerHTML
    .replace(/<script[^>]*>(.*?)<\/script>/gs, '')
    .replace(/<style[^>]*>(.*?)<\/style>/gs, '')
    .replace(/<[^>]+?(\s+?|\/)?>/g, (tag) => {
      if (!allowedTags.includes(tag.toLowerCase())) {
        return '';
      }
      return tag;
    });

  return sanitizedDocument.body.innerHTML;
};

const MyComponent: FC<Props> = ({ message, children, className, ariaLabel, ...rest }) => {
  const sanitizedMessage = message ? createSanitizedHTML(message) : '';

  return (
    <div className={className} aria-label={ariaLabel} {...rest}>
      {children}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default MyComponent;