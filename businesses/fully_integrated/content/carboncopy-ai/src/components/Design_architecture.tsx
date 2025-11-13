import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useClimateInsights } from './climate-insights-hook';

interface Props {
  message?: string;
}

const validateMessage = (message: string) => {
  // Add your validation logic here
  // For example, check if message is not empty and does not contain any dangerous HTML tags
  // Use DOMPurify for sanitizing HTML
  const sanitizedMessage = DOMPurify.sanitize(message);
  if (!sanitizedMessage || sanitizedMessage.trim() === '') {
    throw new Error('Invalid or empty message');
  }
  return sanitizedMessage;
};

const MyComponent: FC<Props> = ({ message }) => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(message);

  const { climateInsights } = useClimateInsights();

  useEffect(() => {
    const fetchGeneratedContent = async () => {
      try {
        const generatedContent = await climateInsights.generateContent();
        setGeneratedContent(generatedContent);
      } catch (error) {
        console.error(error);
      }
    };

    if (!generatedContent) {
      fetchGeneratedContent();
    }
  }, [climateInsights, generatedContent]);

  const validatedMessage = validateMessage(generatedContent || '');

  // Add accessibility by providing an alternative text for the content
  const altText = generatedContent || 'No generated content';

  return (
    <>
      {/* Use div for accessibility and Fragment for performance */}
      <div>
        {generatedContent && (
          <div
            dangerouslySetInnerHTML={{ __html: validatedMessage }}
            aria-label={altText}
          />
        )}
      </div>
    </>
  );
};

MyComponent.defaultProps = {
  message: '',
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useClimateInsights } from './climate-insights-hook';

interface Props {
  message?: string;
}

const validateMessage = (message: string) => {
  // Add your validation logic here
  // For example, check if message is not empty and does not contain any dangerous HTML tags
  // Use DOMPurify for sanitizing HTML
  const sanitizedMessage = DOMPurify.sanitize(message);
  if (!sanitizedMessage || sanitizedMessage.trim() === '') {
    throw new Error('Invalid or empty message');
  }
  return sanitizedMessage;
};

const MyComponent: FC<Props> = ({ message }) => {
  const [generatedContent, setGeneratedContent] = useState<string | null>(message);

  const { climateInsights } = useClimateInsights();

  useEffect(() => {
    const fetchGeneratedContent = async () => {
      try {
        const generatedContent = await climateInsights.generateContent();
        setGeneratedContent(generatedContent);
      } catch (error) {
        console.error(error);
      }
    };

    if (!generatedContent) {
      fetchGeneratedContent();
    }
  }, [climateInsights, generatedContent]);

  const validatedMessage = validateMessage(generatedContent || '');

  // Add accessibility by providing an alternative text for the content
  const altText = generatedContent || 'No generated content';

  return (
    <>
      {/* Use div for accessibility and Fragment for performance */}
      <div>
        {generatedContent && (
          <div
            dangerouslySetInnerHTML={{ __html: validatedMessage }}
            aria-label={altText}
          />
        )}
      </div>
    </>
  );
};

MyComponent.defaultProps = {
  message: '',
};

export default MyComponent;