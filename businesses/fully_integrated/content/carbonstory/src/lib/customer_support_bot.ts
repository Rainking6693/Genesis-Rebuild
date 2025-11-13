import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  language?: string;
}

const MyComponent: FC<Props> = ({ message, language }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message, { ALLOWED_TAGS: allowedTags(language) }) }}
      aria-label="CarbonStory message"
    />
  );
};

const allowedTags = (language: string) => {
  // Define allowed HTML tags based on the language
  // For example, for English, allow more tags than for other languages
  if (language === 'en') {
    return {
      SET_ALL: [],
      STYLE: {
        properties: ['color', 'background-color', 'font-size', 'font-weight'],
      },
      SCRIPT: {
        attributes: { src: true },
      },
      A: {
        attributes: { href: true, target: '_blank' },
      },
      IMG: {
        attributes: { src: true, alt: true },
      },
    };
  }

  // For other languages, allow fewer tags
  return {
    SET_ALL: [],
    STYLE: {},
    SCRIPT: {},
    A: {},
    IMG: {},
  };
};

const defaultMessage = {
  en: 'Welcome to CarbonStory! Track your carbon footprint and support eco-friendly brands.',
  de: 'Willkommen bei CarbonStory! Verfolge Ihren Kohlenstofffußabdruck und unterstütze grüne Marken.',
};

const sanitizeMessage = (message: string, language: string) => {
  try {
    const sanitizedMessage = DOMPurify.sanitize(message, { ALLOWED_TAGS: allowedTags(language) });
    return sanitizedMessage || defaultMessage[language] || 'An error occurred while sanitizing the message.';
  } catch (error) {
    console.error('Error sanitizing message:', error);
    return 'An error occurred while sanitizing the message.';
  }
};

export const CarbonStoryMessage = () => {
  const [message, setMessage] = useState(defaultMessage.en);

  useEffect(() => {
    const sanitizedMessage = sanitizeMessage(message, 'en');
    setMessage(sanitizedMessage);
  }, [message]);

  return <MyComponent message={message} language="en" />;
};

In this updated code, I've added a `language` prop to the `MyComponent` component to allow for internationalization. I've also defined a `allowedTags` function to allow different sets of HTML tags based on the language. The `sanitizeMessage` function now takes a `language` parameter and uses the appropriate allowed tags based on the language. If sanitization fails, it falls back to a default message in the specified language. Additionally, I've added ARIA attributes for accessibility.