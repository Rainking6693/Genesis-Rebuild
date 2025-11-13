import React, { FC, ReactNode, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { useMemo } from 'react';

interface Props {
  message: string;
}

const sanitizeAndEscapeHTML = (message: string): string => {
  const sanitizedMessage = sanitizeUserInput(message);
  return sanitizedMessage.replace(/<(?![img|br])[\w\W]+>/gi, ''); // Remove all tags except img and br
};

const FunctionalComponent: FC<Props> = ({ message }) => {
  const [safeHTML, setSafeHTML] = useState<string>('');

  useEffect(() => {
    const newSafeHTML = sanitizeAndEscapeHTML(message);
    setSafeHTML(newSafeHTML);
  }, [message]);

  const safeHTMLAsJSX = useMemo(() => <div dangerouslySetInnerHTML={{ __html: safeHTML }} />, [safeHTML]);

  return (
    <>
      {safeHTMLAsJSX}
      <style jsx global>{`
        div[data-testid='email-component'] {
          font-size: 16px;
          line-height: 1.5;
          color: #333;
          margin: 0 0 24px;
        }
        div[data-testid='email-component'] img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </>
  );
};

FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.displayName = 'EmailComponent';

export default FunctionalComponent;

import React, { FC, ReactNode, useEffect, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { useMemo } from 'react';

interface Props {
  message: string;
}

const sanitizeAndEscapeHTML = (message: string): string => {
  const sanitizedMessage = sanitizeUserInput(message);
  return sanitizedMessage.replace(/<(?![img|br])[\w\W]+>/gi, ''); // Remove all tags except img and br
};

const FunctionalComponent: FC<Props> = ({ message }) => {
  const [safeHTML, setSafeHTML] = useState<string>('');

  useEffect(() => {
    const newSafeHTML = sanitizeAndEscapeHTML(message);
    setSafeHTML(newSafeHTML);
  }, [message]);

  const safeHTMLAsJSX = useMemo(() => <div dangerouslySetInnerHTML={{ __html: safeHTML }} />, [safeHTML]);

  return (
    <>
      {safeHTMLAsJSX}
      <style jsx global>{`
        div[data-testid='email-component'] {
          font-size: 16px;
          line-height: 1.5;
          color: #333;
          margin: 0 0 24px;
        }
        div[data-testid='email-component'] img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </>
  );
};

FunctionalComponent.defaultProps = {
  message: '',
};

FunctionalComponent.displayName = 'EmailComponent';

export default FunctionalComponent;