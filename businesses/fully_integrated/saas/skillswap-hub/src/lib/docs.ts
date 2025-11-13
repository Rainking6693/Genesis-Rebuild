import React, { PropsWithChildren, ReactNode } from 'react';
import { Props as ComponentProps } from './SkillSwapHubDocs.types';

type SanitizedHTMLMessage = ReactNode;

const sanitizeHTML = (html: string): SanitizedHTMLMessage => {
  let tempDiv: HTMLDivElement | null = null;

  try {
    tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return <div>Error sanitizing HTML: {error.message}</div>;
  }

  return tempDiv.childNodes[0];
};

const SkillSwapHubDocs: React.FC<ComponentProps> = ({ message }) => {
  const sanitizedMessage = sanitizeHTML(message);
  return (
    <>
      {sanitizedMessage ? (
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      ) : (
        <div>No sanitized message provided.</div>
      )}
    </>
  );
};

export type Props = {
  message: SanitizedHTMLMessage;
};

export const SkillSwapHubDocsTypes = () => {
  return <Props.Type />;
};

// Add a new type for the sanitized message
export type SanitizedHTMLMessageType = ReactNode;

// Update the SkillSwapHubDocsTypes component to use the new sanitized message type
export const SkillSwapHubDocsTypes = () => {
  return <Props.SanitizedHTMLMessageType />;
};