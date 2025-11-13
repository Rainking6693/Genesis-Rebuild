import React, { FC, useId, useMemo } from 'react';
import { sanitizeHTML } from 'react-html-sanitizer';

interface Props {
  message: string;
}

const sanitizeMessage = (message: string, allowedAttributes: any) => sanitizeHTML(message, { allowedAttributes });

const MyComponent: FC<Props> = ({ message }) => {
  const id = useId();
  const sanitizedMessage = useMemo(() => sanitizeMessage(message, {}), [message, id]); // Use the generated ID as the key for the memoized value

  return (
    <div id={id} className="moodboard-ai-message" aria-labelledby={id}>
      {sanitizedMessage}
    </div>
  );
};

MyComponent.displayName = 'MoodBoardAIMessage';

MyComponent.defaultProps = {
  message: '',
};

export default MyComponent;

In this updated code:

1. The `sanitizeMessage` function is defined to make the sanitization process more reusable and maintainable.
2. The `sanitizedMessage` memoized value now uses the generated ID as the key, ensuring that the sanitized message is only computed when the input message changes or the component is mounted for the first time.
3. The `sanitizeMessage` function accepts an `allowedAttributes` parameter, allowing for more flexibility in edge cases where specific attributes may be required.
4. The `useMemo` hook is used instead of `useMemoize` to ensure compatibility with the latest versions of React.