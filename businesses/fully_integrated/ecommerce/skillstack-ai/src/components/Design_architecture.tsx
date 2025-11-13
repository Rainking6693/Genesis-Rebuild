import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useLocale } from './useLocale';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const { locale } = useLocale();

  useEffect(() => {
    setSanitizedMessage(DOMPurify.sanitize(message, {
      ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'strong', 'em', 'span', 'br', 'p', 'ol', 'ul', 'li'],
      ALLOWED_ATTRS: {
        a: ['href', 'target', 'rel'],
        '*': ['style', 'class'],
      },
      FILTER_CSS_CLASS_ATTRS: true,
      FILTER_PROTOCOLS: {
        protocols: ['http:', 'https:'],
        relative: false,
      },
      FILTER_REMOVE_TAGS: ['script', 'style', 'iframe', 'embed', 'object', 'applet'],
      FILTER_PROTOCOL_WHITELIST: {
        protocol: ['data:', 'mailto:'],
        url: [],
      },
      FILTER_PROTOCOL_BLACKLIST: [],
      FILTER_PROTOCOL_SCHEMES: ['http', 'https'],
      ALLOWED_PROTOCOLS: [],
      ALLOWED_URI_REGEX: /^(\w+:\/\/\S*)/,
      ALLOWED_QUERY_REGEX: /^([a-zA-Z0-9\-\.\?\=\&\/\_]*)/,
      ALLOWED_FRAGMENT_REGEX: /^([a-zA-Z0-9\-\_]*)/,
      FILTER_REMOVE_EMPTY: true,
      FILTER_FORBID_TAG_ENDING_SLASH: true,
      FILTER_FORBID_UNCLOSED_TAGS: true,
      FILTER_FORBID_COMMENTS: true,
      FILTER_FORBID_WHITESPACE: true,
      FILTER_FORBID_UNSAFE_ATTR: true,
      FILTER_FORBID_UNSAFE_CONTENT: true,
      FILTER_FORBID_UNSAFE_URI: true,
      ALLOWED_CREATE_ELEMENT_NODE_MAP: {
        '*': {
          b: 'strong',
          i: 'em',
          u: 'span',
          a: 'a',
          strong: 'strong',
          em: 'em',
          span: 'span',
          br: 'br',
          p: 'p',
          ol: 'ol',
          ul: 'ul',
          li: 'li',
        },
      },
      ALLOWED_CREATE_TEXT_NODE_MAP: {
        '*': {
          b: (node) => node.textContent.bold(),
          i: (node) => node.textContent.italic(),
          u: (node) => node.textContent.underline(),
          a: (node) => `<a href="${node.textContent}" target="_blank" rel="noopener noreferrer">${node.textContent}</a>`,
          strong: (node) => node.textContent.bold(),
          em: (node) => node.textContent.italic(),
          span: (node) => node.textContent,
          br: () => '<br />',
          p: (node) => `<p>${node.textContent}</p>`,
          ol: (node) => `<ol>${node.textContent.split('\n').map((listItem) => `<li>${listItem}</li>`).join('')}</ol>`,
          ul: (node) => `<ul>${node.textContent.split('\n').map((listItem) => `<li>${listItem}</li>`).join('')}</ul>`,
          li: (node) => `<li>${node.textContent}</li>`,
        },
      },
    }));
  }, [message, locale]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useLocale } from './useLocale';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState(message);
  const { locale } = useLocale();

  useEffect(() => {
    setSanitizedMessage(DOMPurify.sanitize(message, {
      ALLOWED_TAGS: ['b', 'i', 'u', 'a', 'strong', 'em', 'span', 'br', 'p', 'ol', 'ul', 'li'],
      ALLOWED_ATTRS: {
        a: ['href', 'target', 'rel'],
        '*': ['style', 'class'],
      },
      FILTER_CSS_CLASS_ATTRS: true,
      FILTER_PROTOCOLS: {
        protocols: ['http:', 'https:'],
        relative: false,
      },
      FILTER_REMOVE_TAGS: ['script', 'style', 'iframe', 'embed', 'object', 'applet'],
      FILTER_PROTOCOL_WHITELIST: {
        protocol: ['data:', 'mailto:'],
        url: [],
      },
      FILTER_PROTOCOL_BLACKLIST: [],
      FILTER_PROTOCOL_SCHEMES: ['http', 'https'],
      ALLOWED_PROTOCOLS: [],
      ALLOWED_URI_REGEX: /^(\w+:\/\/\S*)/,
      ALLOWED_QUERY_REGEX: /^([a-zA-Z0-9\-\.\?\=\&\/\_]*)/,
      ALLOWED_FRAGMENT_REGEX: /^([a-zA-Z0-9\-\_]*)/,
      FILTER_REMOVE_EMPTY: true,
      FILTER_FORBID_TAG_ENDING_SLASH: true,
      FILTER_FORBID_UNCLOSED_TAGS: true,
      FILTER_FORBID_COMMENTS: true,
      FILTER_FORBID_WHITESPACE: true,
      FILTER_FORBID_UNSAFE_ATTR: true,
      FILTER_FORBID_UNSAFE_CONTENT: true,
      FILTER_FORBID_UNSAFE_URI: true,
      ALLOWED_CREATE_ELEMENT_NODE_MAP: {
        '*': {
          b: 'strong',
          i: 'em',
          u: 'span',
          a: 'a',
          strong: 'strong',
          em: 'em',
          span: 'span',
          br: 'br',
          p: 'p',
          ol: 'ol',
          ul: 'ul',
          li: 'li',
        },
      },
      ALLOWED_CREATE_TEXT_NODE_MAP: {
        '*': {
          b: (node) => node.textContent.bold(),
          i: (node) => node.textContent.italic(),
          u: (node) => node.textContent.underline(),
          a: (node) => `<a href="${node.textContent}" target="_blank" rel="noopener noreferrer">${node.textContent}</a>`,
          strong: (node) => node.textContent.bold(),
          em: (node) => node.textContent.italic(),
          span: (node) => node.textContent,
          br: () => '<br />',
          p: (node) => `<p>${node.textContent}</p>`,
          ol: (node) => `<ol>${node.textContent.split('\n').map((listItem) => `<li>${listItem}</li>`).join('')}</ol>`,
          ul: (node) => `<ul>${node.textContent.split('\n').map((listItem) => `<li>${listItem}</li>`).join('')}</ul>`,
          li: (node) => `<li>${node.textContent}</li>`,
        },
      },
    }));
  }, [message, locale]);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

export default MyComponent;