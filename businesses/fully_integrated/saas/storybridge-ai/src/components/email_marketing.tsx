import React, { FC, useCallback, useState } from 'react';
import DOMPurify from 'dompurify';

type SanitizedMessage = string;
type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface Props {
  message: string;
}

interface MyEmailMarketingComponentProps extends Props {
  maxLength?: number;
}

const MyEmailMarketingComponent: FC<MyEmailMarketingComponentProps> = ({ message, maxLength }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedMessage>(message || '');

  const handleMessageChange = useCallback((event: InputEvent) => {
    const sanitizedInput = DOMPurify.sanitize(event.target.value);
    setSanitizedMessage(sanitizedInput);
  }, []);

  const sanitizedAndValidMessage = sanitizedMessage && sanitizedMessage.trim();

  return (
    <div>
      <input
        type="text"
        value={sanitizedMessage}
        onChange={handleMessageChange}
        maxLength={maxLength}
        aria-label="Email message"
        required
      />
      {sanitizedAndValidMessage && (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizedAndValidMessage,
          }}
          aria-label="Sanitized email message"
        />
      )}
    </div>
  );
};

MyEmailMarketingComponent.defaultProps = {
  message: '',
  maxLength: 200,
};

export default MyEmailMarketingComponent;

import React, { FC, useCallback, useState } from 'react';
import DOMPurify from 'dompurify';

type SanitizedMessage = string;
type InputEvent = React.ChangeEvent<HTMLInputElement>;

interface Props {
  message: string;
}

interface MyEmailMarketingComponentProps extends Props {
  maxLength?: number;
}

const MyEmailMarketingComponent: FC<MyEmailMarketingComponentProps> = ({ message, maxLength }) => {
  const [sanitizedMessage, setSanitizedMessage] = useState<SanitizedMessage>(message || '');

  const handleMessageChange = useCallback((event: InputEvent) => {
    const sanitizedInput = DOMPurify.sanitize(event.target.value);
    setSanitizedMessage(sanitizedInput);
  }, []);

  const sanitizedAndValidMessage = sanitizedMessage && sanitizedMessage.trim();

  return (
    <div>
      <input
        type="text"
        value={sanitizedMessage}
        onChange={handleMessageChange}
        maxLength={maxLength}
        aria-label="Email message"
        required
      />
      {sanitizedAndValidMessage && (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizedAndValidMessage,
          }}
          aria-label="Sanitized email message"
        />
      )}
    </div>
  );
};

MyEmailMarketingComponent.defaultProps = {
  message: '',
  maxLength: 200,
};

export default MyEmailMarketingComponent;