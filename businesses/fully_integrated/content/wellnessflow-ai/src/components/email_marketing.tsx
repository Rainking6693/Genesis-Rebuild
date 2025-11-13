import React, { useMemo, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { useLocalStorage } from 'usehooks-ts';

type Props = {
  message: string;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const [storedMessage, setStoredMessage] = useLocalStorage<string>('lastMessage', '');
  const [sanitizedMessage, setSanitizedMessage] = useState<string>(storedMessage);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    const sanitizedInput = sanitizeUserInput(input);
    setSanitizedMessage(sanitizedInput);
    setStoredMessage(sanitizedInput);
  };

  const sanitizedAndStoredMessage = useMemo(() => sanitizedMessage, [sanitizedMessage]);

  return (
    <div>
      <textarea value={sanitizedMessage} onChange={handleMessageChange} />
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedAndStoredMessage,
        }}
      />
      <p>
      </p>
      <p>
        To improve accessibility, consider adding a label to the textarea and using ARIA attributes.
      </p>
    </div>
  );
};

export default MyComponent;

import React, { useMemo, useState } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitization';
import { useLocalStorage } from 'usehooks-ts';

type Props = {
  message: string;
};

const MyComponent: React.FC<Props> = ({ message }) => {
  const [storedMessage, setStoredMessage] = useLocalStorage<string>('lastMessage', '');
  const [sanitizedMessage, setSanitizedMessage] = useState<string>(storedMessage);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.target.value;
    const sanitizedInput = sanitizeUserInput(input);
    setSanitizedMessage(sanitizedInput);
    setStoredMessage(sanitizedInput);
  };

  const sanitizedAndStoredMessage = useMemo(() => sanitizedMessage, [sanitizedMessage]);

  return (
    <div>
      <textarea value={sanitizedMessage} onChange={handleMessageChange} />
      <div
        dangerouslySetInnerHTML={{
          __html: sanitizedAndStoredMessage,
        }}
      />
      <p>
      </p>
      <p>
        To improve accessibility, consider adding a label to the textarea and using ARIA attributes.
      </p>
    </div>
  );
};

export default MyComponent;