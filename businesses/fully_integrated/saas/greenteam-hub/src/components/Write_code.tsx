import React, { FC, useRef, useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [sanitizedMessage, setSanitizedMessage] = useState(message);

  React.useEffect(() => {
    if (divRef.current) {
      setSanitizedMessage(DOMPurify.sanitize(message));
    }
  }, [message]);

  if (!divRef.current) {
    return <div>Loading...</div>;
  }

  return (
    <div ref={divRef}>
      <div key={sanitizedMessage} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

export default MyComponent;

This version of the code will display a loading message if the `divRef` is not yet available, and it adds a `key` prop to the inner `div` for better React performance. The `key` prop helps React identify which items have changed, are added, or are removed, and it can improve the performance of your component by reducing the number of unnecessary re-renders.