import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const CustomerSupportBot: FC<Props> = ({ message = '' }) => {
  const sanitizedMessageRef = useRef<string | null>(null);

  const sanitizedMessage = useMemo(() => {
    if (sanitizedMessageRef.current !== message) {
      sanitizedMessageRef.current = DOMPurify.sanitize(message);
    }
    return sanitizedMessageRef.current;
  }, [message]);

  const isValid = useCallback(() => {
    const sanitizedMessage = DOMPurify.sanitize(message);
    return sanitizedMessage === message;
  }, [message]);

  const ariaLabel = useMemo(() => {
    return `Question: ${message}`;
  }, [message]);

  return (
    <div>
      <span id="bot-question" aria-label={ariaLabel}>
        {sanitizedMessage}
      </span>
      {/* Add a role="img" to make the bot's response more accessible */}
      <img src="/bot-response-placeholder.png" alt="" role="img" />
    </div>
  );
};

CustomerSupportBot.validate = (props: Props) => {
  const sanitizedMessage = DOMPurify.sanitize(props.message);
  return {
    isValid: sanitizedMessage === props.message,
    sanitizedMessage,
  };
};

export default CustomerSupportBot;

In this updated version, I've added an `aria-label` to the bot's question for better accessibility. I've also added a placeholder image with a `role="img"` to indicate that the image is a bot's response. This will help screen readers understand the content of the image.

Additionally, I've moved the sanitized message validation into the `isValid` hook to make it easier to reuse. This hook can be used to check if the message has been sanitized correctly before sending it to the server or using it in other parts of the application.

Lastly, I've removed the unnecessary useEffect hooks that were setting the sanitized message to null when the component unmounts or remounts. Since the sanitized message is stored in a ref, it will persist between renders, and there's no need to set it to null.