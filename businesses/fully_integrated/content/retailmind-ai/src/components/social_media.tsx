import React, { FC, PropsWithChildren, useContext } from 'react';
import { DOMPurify } from 'dompurify';
import { ThemeContext } from './ThemeContext';

interface Props extends PropsWithChildren<{ message?: string }> {
  errorMessage?: string;
}

const SocialMediaContent: FC<Props> = ({ children, errorMessage }) => {
  const { theme } = useContext(ThemeContext);

  const sanitizedMessage = DOMPurify.sanitize(children as string);

  if (!sanitizedMessage) {
    return <div className={`error-message ${theme}`}>
      {errorMessage || SocialMediaContent.errorMessage}
    </div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

SocialMediaContent.defaultProps = {
  children: '',
};

SocialMediaContent.errorMessage = 'Invalid or malicious content detected. Please contact support.';

export default SocialMediaContent;

import React, { FC, PropsWithChildren, useContext } from 'react';
import { DOMPurify } from 'dompurify';
import { ThemeContext } from './ThemeContext';

interface Props extends PropsWithChildren<{ message?: string }> {
  errorMessage?: string;
}

const SocialMediaContent: FC<Props> = ({ children, errorMessage }) => {
  const { theme } = useContext(ThemeContext);

  const sanitizedMessage = DOMPurify.sanitize(children as string);

  if (!sanitizedMessage) {
    return <div className={`error-message ${theme}`}>
      {errorMessage || SocialMediaContent.errorMessage}
    </div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />;
};

SocialMediaContent.defaultProps = {
  children: '',
};

SocialMediaContent.errorMessage = 'Invalid or malicious content detected. Please contact support.';

export default SocialMediaContent;