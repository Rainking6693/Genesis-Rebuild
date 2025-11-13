import React, { FC, useMemo, useCallback } from 'react';
import Dompurify from 'dompurify';

interface Props {
  messageId: string;
  message?: string;
  language?: string;
}

interface Translations {
  [messageId: string]: string;
}

const MyComponent: FC<Props> = ({ messageId, message, language }) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message || getMessage(messageId, language)), [messageId, language]);

  return (
    <div>
      {language && <span data-testid="language">{language}</span>}
      <div>
        <span aria-label={getMessage(messageId, language)} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        <div dangerouslySetInnerHTML={{ __html: message || '' }} hidden /> {/* Fallback for screen readers */}
      </div>
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error(`Error in MyComponent: ${error.message}`);
};

const sanitizeMessage = useCallback((message: string): string => {
  // Add your sanitization logic here, such as removing script tags, HTML encoding, etc.
  return message;
}, []);

const getMessage = (messageId: string, language: string): string => {
  // Add your i18n logic here, such as fetching messages from a server or a local file.
  return messageId;
};

export type PolicyBotProComponent = typeof MyComponent;

const MemoizedMyComponent: PolicyBotProComponent = (props) => {
  const { messageId, ...rest } = props;
  const sanitizedMessage = sanitizeMessage(props.message || getMessage(messageId, props.language));

  return useMemo(() => <MyComponent {...rest} message={sanitizedMessage} messageId={messageId} />, [messageId, sanitizedMessage, ...Object.values(rest)]);
};

export default MemoizedMyComponent;

import React, { FC, useMemo, useCallback } from 'react';
import Dompurify from 'dompurify';

interface Props {
  messageId: string;
  message?: string;
  language?: string;
}

interface Translations {
  [messageId: string]: string;
}

const MyComponent: FC<Props> = ({ messageId, message, language }) => {
  const sanitizedMessage = useMemo(() => sanitizeMessage(message || getMessage(messageId, language)), [messageId, language]);

  return (
    <div>
      {language && <span data-testid="language">{language}</span>}
      <div>
        <span aria-label={getMessage(messageId, language)} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
        <div dangerouslySetInnerHTML={{ __html: message || '' }} hidden /> {/* Fallback for screen readers */}
      </div>
    </div>
  );
};

MyComponent.error = (error: Error) => {
  console.error(`Error in MyComponent: ${error.message}`);
};

const sanitizeMessage = useCallback((message: string): string => {
  // Add your sanitization logic here, such as removing script tags, HTML encoding, etc.
  return message;
}, []);

const getMessage = (messageId: string, language: string): string => {
  // Add your i18n logic here, such as fetching messages from a server or a local file.
  return messageId;
};

export type PolicyBotProComponent = typeof MyComponent;

const MemoizedMyComponent: PolicyBotProComponent = (props) => {
  const { messageId, ...rest } = props;
  const sanitizedMessage = sanitizeMessage(props.message || getMessage(messageId, props.language));

  return useMemo(() => <MyComponent {...rest} message={sanitizedMessage} messageId={messageId} />, [messageId, sanitizedMessage, ...Object.values(rest)]);
};

export default MemoizedMyComponent;