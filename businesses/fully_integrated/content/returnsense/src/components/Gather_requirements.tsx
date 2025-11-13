import React, { FC, useCallback, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

type MessageSource = 'userInput' | 'APIResponse' | 'DefaultMessage';
type Message = string;
type MessageProps = {
  source: MessageSource;
  message: Message;
  messageId?: string;
  isEditable?: boolean; // Added for edge cases where the message might be editable
};

const Message: FC<MessageProps> = ({ source, message, messageId, isEditable }) => {
  const messageClass = isEditable ? 'editable-message' : 'non-editable-message'; // Added class for editable messages

  return (
    <div data-testid={messageId} aria-label={`Message from ${source}`} className={messageClass}>
      {message}
    </div>
  );
};

const useMessage = (source: MessageSource, message: Message, isEditable?: boolean) => {
  const sanitizedMessage = useSanitizeForXSS(message);

  if (!['userInput', 'APIResponse', 'DefaultMessage'].includes(source)) {
    throw new Error(`Invalid message source: ${source}`);
  }

  return sanitizedMessage;
};

const useSanitizeForXSS = useCallback((html: string) => {
  return DOMPurify.sanitize(html);
}, []);

const MyComponent: FC<MessageProps> = ({ source, message, messageId, isEditable }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  const sanitizedMessage = useMessage(source, message, isEditable);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  return <Message ref={messageRef} isEditable={isEditable} {...{ source, message, messageId }} />;
};

export default MyComponent;

import React, { FC, useCallback, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

type MessageSource = 'userInput' | 'APIResponse' | 'DefaultMessage';
type Message = string;
type MessageProps = {
  source: MessageSource;
  message: Message;
  messageId?: string;
  isEditable?: boolean; // Added for edge cases where the message might be editable
};

const Message: FC<MessageProps> = ({ source, message, messageId, isEditable }) => {
  const messageClass = isEditable ? 'editable-message' : 'non-editable-message'; // Added class for editable messages

  return (
    <div data-testid={messageId} aria-label={`Message from ${source}`} className={messageClass}>
      {message}
    </div>
  );
};

const useMessage = (source: MessageSource, message: Message, isEditable?: boolean) => {
  const sanitizedMessage = useSanitizeForXSS(message);

  if (!['userInput', 'APIResponse', 'DefaultMessage'].includes(source)) {
    throw new Error(`Invalid message source: ${source}`);
  }

  return sanitizedMessage;
};

const useSanitizeForXSS = useCallback((html: string) => {
  return DOMPurify.sanitize(html);
}, []);

const MyComponent: FC<MessageProps> = ({ source, message, messageId, isEditable }) => {
  const messageRef = useRef<HTMLDivElement>(null);

  const sanitizedMessage = useMessage(source, message, isEditable);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.innerHTML = sanitizedMessage;
    }
  }, [sanitizedMessage]);

  return <Message ref={messageRef} isEditable={isEditable} {...{ source, message, messageId }} />;
};

export default MyComponent;