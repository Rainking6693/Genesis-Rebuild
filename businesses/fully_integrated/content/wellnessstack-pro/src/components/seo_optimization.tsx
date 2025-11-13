import React, { FC, useEffect, useMemo } from 'react';

interface Props {
  title: string; // Add a title for SEO purposes
  description: string; // Add a description for SEO purposes
  keywords: string[]; // Add relevant keywords for SEO
  message: string;
}

const safeHTMLRegExp = /<(?!script|style|iframe|img)[^>]*>/gi;

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  const safeMessage = useMemo(() => {
    return message.replace(safeHTMLRegExp, '');
  }, [message]);

  useEffect(() => {
    // Add meta tags only if they have content
    const addMetaTag = (name: string, content: string) => {
      if (content) {
        const metaTag = document.createElement('meta');
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };

    addMetaTag('title', title);
    addMetaTag('description', description);
    if (keywords && keywords.length > 0) {
      addMetaTag('keywords', keywords.join(', '));
    }
  }, [title, description, keywords]);

  return (
    <div>
      {/* Use a safe HTML string for potential HTML content */}
      <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useMemo } from 'react';

interface Props {
  title: string; // Add a title for SEO purposes
  description: string; // Add a description for SEO purposes
  keywords: string[]; // Add relevant keywords for SEO
  message: string;
}

const safeHTMLRegExp = /<(?!script|style|iframe|img)[^>]*>/gi;

const MyComponent: FC<Props> = ({ title, description, keywords, message }) => {
  const safeMessage = useMemo(() => {
    return message.replace(safeHTMLRegExp, '');
  }, [message]);

  useEffect(() => {
    // Add meta tags only if they have content
    const addMetaTag = (name: string, content: string) => {
      if (content) {
        const metaTag = document.createElement('meta');
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };

    addMetaTag('title', title);
    addMetaTag('description', description);
    if (keywords && keywords.length > 0) {
      addMetaTag('keywords', keywords.join(', '));
    }
  }, [title, description, keywords]);

  return (
    <div>
      {/* Use a safe HTML string for potential HTML content */}
      <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
    </div>
  );
};

export default MyComponent;