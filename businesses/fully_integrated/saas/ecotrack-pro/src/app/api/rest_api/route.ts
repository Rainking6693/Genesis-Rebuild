import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  message: string;
}

const FunctionalComponent: FC<Props> = ({ message, ...textareaProps }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = React.Children.toTree(
    <span dangerouslySetInnerHTML={{ __html: message.replace(/[&<>"']/g, replaceSpecialChars) }} />
  );

  const replaceSpecialChars = (match: string) => {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
      default:
        return match;
    }
  };

  return <textarea {...textareaProps} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

// Add input validation for message prop
FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: React.PropTypes.string.isRequired,
};

// Use named export for better readability and maintainability
export const EcoTrackProRestApiComponent = FunctionalComponent;

import React, { FC, ReactNode, DetailedHTMLProps, TextareaHTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  message: string;
}

const FunctionalComponent: FC<Props> = ({ message, ...textareaProps }) => {
  // Sanitize the input to prevent XSS attacks
  const sanitizedMessage = React.Children.toTree(
    <span dangerouslySetInnerHTML={{ __html: message.replace(/[&<>"']/g, replaceSpecialChars) }} />
  );

  const replaceSpecialChars = (match: string) => {
    switch (match) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
      default:
        return match;
    }
  };

  return <textarea {...textareaProps} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

// Add input validation for message prop
FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.propTypes = {
  message: React.PropTypes.string.isRequired,
};

// Use named export for better readability and maintainability
export const EcoTrackProRestApiComponent = FunctionalComponent;