import React, { FC, ReactNode, useCallback, useEffect, useRef } from 'react';

interface Props {
  message: string;
}

const allowedTags = ['div', 'span', 'a', 'strong', 'em'];
const allowedAttributes = {
  // Add any attributes you want to allow here
  a: {
    href: true,
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

const sanitizeMessage = (message: string): ReactNode => {
  const parser = new DOMParser();
  const sanitizedMessage = parser.parseFromString(message, 'text/html').documentElement;

  // Remove any disallowed tags
  Array.from(sanitizedMessage.getElementsByTagName('*')).forEach((node) => {
    if (!allowedTags.includes(node.tagName)) {
      node.parentNode.removeChild(node);
    }
  });

  // Remove any disallowed attributes
  Array.from(sanitizedMessage.getElementsByTagName('*')).forEach((node) => {
    if (node.tagName === 'A') {
      Object.keys(allowedAttributes.a).forEach((attr) => {
        if (!node.hasAttribute(attr)) return;
        if (!allowedAttributes.a[attr]) {
          node.removeAttribute(attr);
        }
      });
    } else {
      Array.from(node.attributes).forEach((attr) => {
        if (!allowedAttributes[node.tagName] || !allowedAttributes[node.tagName][attr.name]) {
          node.removeAttribute(attr.name);
        }
      });
    }
  });

  // Add a role attribute for accessibility
  const root = sanitizedMessage.getElementsByTagName('body')[0];
  root.setAttribute('role', 'article');

  return sanitizedMessage.outerHTML;
};

const MyComponent: FC<Props> = ({ message }) => {
  const safeMessageRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (!safeMessageRef.current) return;
    safeMessageRef.current.style.width = `${safeMessageRef.current.scrollWidth}px`;
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const safeMessage = useMemo(() => sanitizeMessage(message), [message]);

  return (
    <div ref={safeMessageRef}>
      <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode, useCallback, useEffect, useRef } from 'react';

interface Props {
  message: string;
}

const allowedTags = ['div', 'span', 'a', 'strong', 'em'];
const allowedAttributes = {
  // Add any attributes you want to allow here
  a: {
    href: true,
    target: '_blank',
    rel: 'noopener noreferrer',
  },
};

const sanitizeMessage = (message: string): ReactNode => {
  const parser = new DOMParser();
  const sanitizedMessage = parser.parseFromString(message, 'text/html').documentElement;

  // Remove any disallowed tags
  Array.from(sanitizedMessage.getElementsByTagName('*')).forEach((node) => {
    if (!allowedTags.includes(node.tagName)) {
      node.parentNode.removeChild(node);
    }
  });

  // Remove any disallowed attributes
  Array.from(sanitizedMessage.getElementsByTagName('*')).forEach((node) => {
    if (node.tagName === 'A') {
      Object.keys(allowedAttributes.a).forEach((attr) => {
        if (!node.hasAttribute(attr)) return;
        if (!allowedAttributes.a[attr]) {
          node.removeAttribute(attr);
        }
      });
    } else {
      Array.from(node.attributes).forEach((attr) => {
        if (!allowedAttributes[node.tagName] || !allowedAttributes[node.tagName][attr.name]) {
          node.removeAttribute(attr.name);
        }
      });
    }
  });

  // Add a role attribute for accessibility
  const root = sanitizedMessage.getElementsByTagName('body')[0];
  root.setAttribute('role', 'article');

  return sanitizedMessage.outerHTML;
};

const MyComponent: FC<Props> = ({ message }) => {
  const safeMessageRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (!safeMessageRef.current) return;
    safeMessageRef.current.style.width = `${safeMessageRef.current.scrollWidth}px`;
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const safeMessage = useMemo(() => sanitizeMessage(message), [message]);

  return (
    <div ref={safeMessageRef}>
      <div dangerouslySetInnerHTML={{ __html: safeMessage }} />
    </div>
  );
};

export default MyComponent;