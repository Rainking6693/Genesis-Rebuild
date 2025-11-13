import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string, trustedTypes = DOMPurify.defaultTrustedTypes) => {
  if (!trustedTypes) {
    throw new Error('DOMPurify: No trustedTypes provided');
  }

  return trustedTypes.createPolicy('MyPolicy', {}).sanitize(html, ['innerHTML']);
};

export interface EcoConvertAIComponentProps {
  message: string;
  className?: string;
}

import React, { ReactNode, useState } from 'react';
import { EcoConvertAIComponentProps } from './EcoConvertAIComponentProps';
import { sanitizeHtml } from './sanitizeHtml';

const MyComponent: React.FC<EcoConvertAIComponentProps> = ({ message, className }) => {
  const [safeHtml, setSafeHtml] = useState<ReactNode | null>(null);

  React.useEffect(() => {
    const sanitizedHtml = sanitizeHtml(message);
    setSafeHtml(sanitizedHtml);
  }, [message]);

  if (!safeHtml) {
    return <div>Loading...</div>;
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
};

export default MyComponent;

import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string, trustedTypes = DOMPurify.defaultTrustedTypes) => {
  if (!trustedTypes) {
    throw new Error('DOMPurify: No trustedTypes provided');
  }

  return trustedTypes.createPolicy('MyPolicy', {}).sanitize(html, ['innerHTML']);
};

export interface EcoConvertAIComponentProps {
  message: string;
  className?: string;
}

import React, { ReactNode, useState } from 'react';
import { EcoConvertAIComponentProps } from './EcoConvertAIComponentProps';
import { sanitizeHtml } from './sanitizeHtml';

const MyComponent: React.FC<EcoConvertAIComponentProps> = ({ message, className }) => {
  const [safeHtml, setSafeHtml] = useState<ReactNode | null>(null);

  React.useEffect(() => {
    const sanitizedHtml = sanitizeHtml(message);
    setSafeHtml(sanitizedHtml);
  }, [message]);

  if (!safeHtml) {
    return <div>Loading...</div>;
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
};

export default MyComponent;

In this version, I've added a `trustedTypes` parameter to the function, which allows for customizing the trusted types policy. If no trusted types are provided, an error is thrown.

2. EcoConvertAIComponentProps.ts

I've added an optional `className` property to the props interface for better customization of the component's styling.

3. MyComponent.tsx