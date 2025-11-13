import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  message: string;
  altText?: string;
}

const EmailMarketingComponent: FC<Props> = ({ subject, message, altText, ...divProps }) => {
  const sanitizedMessage = createSanitizedHTML(message);

  return (
    <div {...divProps}>
      <h2>{subject}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {/* Add an accessible description for non-visible content */}
      {altText && <div>{altText}</div>}
    </div>
  );
};

// Function to sanitize HTML and remove potentially dangerous tags
const createSanitizedHTML = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const allowedTags = ['a', 'b', 'i', 'strong', 'em'];

  // Remove disallowed tags
  for (const disallowedTag of ['script', 'style', 'iframe', 'img']) {
    const elements = doc.getElementsByTagName(disallowedTag);
    while (elements.length > 0) {
      elements[0].parentNode?.removeChild(elements[0]);
    }
  }

  // Keep only allowed tags
  for (const element of Array.from(doc.body.children)) {
    if (!allowedTags.includes(element.tagName.toLowerCase())) {
      element.parentNode?.removeChild(element);
    }
  }

  // Add a container to ensure the sanitized HTML is valid
  const container = document.createElement('div');
  container.innerHTML = doc.documentElement.outerHTML;
  return container.firstChild.outerHTML;
};

export default EmailMarketingComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  subject: string;
  message: string;
  altText?: string;
}

const EmailMarketingComponent: FC<Props> = ({ subject, message, altText, ...divProps }) => {
  const sanitizedMessage = createSanitizedHTML(message);

  return (
    <div {...divProps}>
      <h2>{subject}</h2>
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      {/* Add an accessible description for non-visible content */}
      {altText && <div>{altText}</div>}
    </div>
  );
};

// Function to sanitize HTML and remove potentially dangerous tags
const createSanitizedHTML = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const allowedTags = ['a', 'b', 'i', 'strong', 'em'];

  // Remove disallowed tags
  for (const disallowedTag of ['script', 'style', 'iframe', 'img']) {
    const elements = doc.getElementsByTagName(disallowedTag);
    while (elements.length > 0) {
      elements[0].parentNode?.removeChild(elements[0]);
    }
  }

  // Keep only allowed tags
  for (const element of Array.from(doc.body.children)) {
    if (!allowedTags.includes(element.tagName.toLowerCase())) {
      element.parentNode?.removeChild(element);
    }
  }

  // Add a container to ensure the sanitized HTML is valid
  const container = document.createElement('div');
  container.innerHTML = doc.documentElement.outerHTML;
  return container.firstChild.outerHTML;
};

export default EmailMarketingComponent;