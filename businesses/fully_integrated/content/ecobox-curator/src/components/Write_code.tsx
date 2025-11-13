import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLDivAttributes, HTMLDivElement> {
  message: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ className, style, message, children, ...rest }) => {
  const sanitizedMessage = createSanitizedHTML(message);

  return (
    <div className={className} style={style} {...rest}>
      {sanitizedMessage}
      {children}
    </div>
  );
};

const createSanitizedHTML = (html: string) => {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const frag = document.createDocumentFragment();

    for (let node of doc.body.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const isAllowedElement = isAllowedElementType(node.tagName);

        if (!isAllowedElement) {
          continue;
        }
      }

      frag.appendChild(node);
    }

    return frag.innerHTML;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
};

const isAllowedElementType = (tagName: string) => {
  // List of allowed HTML elements
  const allowedElements = ['a', 'b', 'br', 'em', 'i', 'strong', 'sub', 'sup'];

  return allowedElements.includes(tagName.toLowerCase());
};

export default MyComponent;

import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLDivAttributes, HTMLDivElement> {
  message: string;
  children?: ReactNode;
}

const MyComponent: FC<Props> = ({ className, style, message, children, ...rest }) => {
  const sanitizedMessage = createSanitizedHTML(message);

  return (
    <div className={className} style={style} {...rest}>
      {sanitizedMessage}
      {children}
    </div>
  );
};

const createSanitizedHTML = (html: string) => {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const frag = document.createDocumentFragment();

    for (let node of doc.body.childNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const isAllowedElement = isAllowedElementType(node.tagName);

        if (!isAllowedElement) {
          continue;
        }
      }

      frag.appendChild(node);
    }

    return frag.innerHTML;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return '';
  }
};

const isAllowedElementType = (tagName: string) => {
  // List of allowed HTML elements
  const allowedElements = ['a', 'b', 'br', 'em', 'i', 'strong', 'sub', 'sup'];

  return allowedElements.includes(tagName.toLowerCase());
};

export default MyComponent;