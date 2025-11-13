// IMessage.ts
export interface IMessage {
  message: string;
  isTrusted?: boolean;
}

// MyComponent.tsx
import React, { FC, ReactNode, SyntheticEvent } from 'react';
import { IMessage } from './IMessage';

interface Props extends IMessage {
  isTrusted?: boolean;
}

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  const [sanitizedMessage, setSanitizedMessage] = React.useState('');

  React.useEffect(() => {
    if (isTrusted) {
      setSanitizedMessage(message);
    } else {
      const sanitize = async () => {
        try {
          const parser = new DOMParser();
          const sanitized = parser.parseFromString(message, 'text/html').body.textContent;
          setSanitizedMessage(sanitized);
        } catch (error) {
          console.error('Error sanitizing HTML:', error);
          setSanitizedMessage('');
        }
      };
      sanitize();
    }
  }, [message, isTrusted]);

  const handleClick = (event: SyntheticEvent) => {
    event.currentTarget.blur();
  };

  // Use a div with a data-testid attribute for easier testing
  return (
    <div data-testid="my-component">
      <div
        contentEditable={!isTrusted}
        onBlur={handleClick}
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      />
    </div>
  );
};

export default MyComponent;

// IMessage.ts
export interface IMessage {
  message: string;
  isTrusted?: boolean;
}

// MyComponent.tsx
import React, { FC, ReactNode, SyntheticEvent } from 'react';
import { IMessage } from './IMessage';

interface Props extends IMessage {
  isTrusted?: boolean;
}

const MyComponent: FC<Props> = ({ message, isTrusted = false }) => {
  const [sanitizedMessage, setSanitizedMessage] = React.useState('');

  React.useEffect(() => {
    if (isTrusted) {
      setSanitizedMessage(message);
    } else {
      const sanitize = async () => {
        try {
          const parser = new DOMParser();
          const sanitized = parser.parseFromString(message, 'text/html').body.textContent;
          setSanitizedMessage(sanitized);
        } catch (error) {
          console.error('Error sanitizing HTML:', error);
          setSanitizedMessage('');
        }
      };
      sanitize();
    }
  }, [message, isTrusted]);

  const handleClick = (event: SyntheticEvent) => {
    event.currentTarget.blur();
  };

  // Use a div with a data-testid attribute for easier testing
  return (
    <div data-testid="my-component">
      <div
        contentEditable={!isTrusted}
        onBlur={handleClick}
        dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
      />
    </div>
  );
};

export default MyComponent;