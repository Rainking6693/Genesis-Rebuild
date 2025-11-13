import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type TFunction = (...arguments: any[]) => string;

interface i18nextTranslationShape {
  t: TFunction;
  i18n: any;
}

interface Props {
  id: string; // Unique identifier for the message
  fallback?: ReactNode; // Optional fallback content for missing translations
}

const MyComponent: React.FC<Props> = ({ id, fallback = 'Missing translation' }) => {
  const { t }: i18nextTranslationShape = useTranslation();

  // Check if the translation exists before rendering the message
  const message = t(id, { returnObjects: true })[0] || fallback;

  // Add a role and aria-label for accessibility
  return <div role="presentation" aria-label={id}>{message}</div>;
};

export default MyComponent;

import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type TFunction = (...arguments: any[]) => string;

interface i18nextTranslationShape {
  t: TFunction;
  i18n: any;
}

interface Props {
  id: string; // Unique identifier for the message
  fallback?: ReactNode; // Optional fallback content for missing translations
}

const MyComponent: React.FC<Props> = ({ id, fallback = 'Missing translation' }) => {
  const { t }: i18nextTranslationShape = useTranslation();

  // Check if the translation exists before rendering the message
  const message = t(id, { returnObjects: true })[0] || fallback;

  // Add a role and aria-label for accessibility
  return <div role="presentation" aria-label={id}>{message}</div>;
};

export default MyComponent;