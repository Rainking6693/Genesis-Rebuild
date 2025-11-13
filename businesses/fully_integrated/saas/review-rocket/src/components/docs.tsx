export interface Props {
  message?: string;
}

import React, { FC, ReactNode } from 'react';
import { Props as MyComponentProps } from './my-component.interfaces';
import sanitizeAndEscapeHTML from './my-component.sanitize';

const defaultMessage = 'This component is empty';

const allowedHTMLTags = [
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'button',
  'cite',
  'code',
  'data',
  'datagrid',
  'dd',
  'del',
  'dfn',
  'em',
  'i',
  'iframe',
  'img',
  'ins',
  'kbd',
  'label',
  'li',
  'mark',
  'math',
  'meter',
  'nav',
  'nobr',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strike',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'tt',
  'u',
  'ul',
];

const allowedHTMLAttributes = {
  '*': ['class', 'id', 'style'],
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'title'],
};

const MyComponent: FC<MyComponentProps> = ({ message }) => {
  const sanitizedMessage = sanitizeAndEscapeHTML(message || defaultMessage, {
    allowedHTMLTags,
    allowedHTMLAttributes,
  });

  return (
    <div data-testid="my-component" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

export default MyComponent;

import DOMPurify from 'dompurify';

export const sanitizeAndEscapeHTML = (
  message: string,
  options: { allowedHTMLTags?: string[]; allowedHTMLAttributes?: { [key: string]: string[] } } = {}
) => {
  const { allowedHTMLTags = [], allowedHTMLAttributes = {} } = options;

  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: allowedHTMLTags,
    ALLOWED_ATTRS: { ...DOMPurify.defaults.ALLOWED_ATTRS, ...allowedHTMLAttributes },
  });

  return sanitizedMessage.trim();
};

export interface Props {
  message?: string;
}

import React, { FC, ReactNode } from 'react';
import { Props as MyComponentProps } from './my-component.interfaces';
import sanitizeAndEscapeHTML from './my-component.sanitize';

const defaultMessage = 'This component is empty';

const allowedHTMLTags = [
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'button',
  'cite',
  'code',
  'data',
  'datagrid',
  'dd',
  'del',
  'dfn',
  'em',
  'i',
  'iframe',
  'img',
  'ins',
  'kbd',
  'label',
  'li',
  'mark',
  'math',
  'meter',
  'nav',
  'nobr',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strike',
  'strong',
  'sub',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'tr',
  'tt',
  'u',
  'ul',
];

const allowedHTMLAttributes = {
  '*': ['class', 'id', 'style'],
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'title'],
};

const MyComponent: FC<MyComponentProps> = ({ message }) => {
  const sanitizedMessage = sanitizeAndEscapeHTML(message || defaultMessage, {
    allowedHTMLTags,
    allowedHTMLAttributes,
  });

  return (
    <div data-testid="my-component" dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
  );
};

export default MyComponent;

import DOMPurify from 'dompurify';

export const sanitizeAndEscapeHTML = (
  message: string,
  options: { allowedHTMLTags?: string[]; allowedHTMLAttributes?: { [key: string]: string[] } } = {}
) => {
  const { allowedHTMLTags = [], allowedHTMLAttributes = {} } = options;

  const sanitizedMessage = DOMPurify.sanitize(message, {
    ALLOWED_TAGS: allowedHTMLTags,
    ALLOWED_ATTRS: { ...DOMPurify.defaults.ALLOWED_ATTRS, ...allowedHTMLAttributes },
  });

  return sanitizedMessage.trim();
};

**my-component.implementation.ts**

**my-component.sanitize.ts**