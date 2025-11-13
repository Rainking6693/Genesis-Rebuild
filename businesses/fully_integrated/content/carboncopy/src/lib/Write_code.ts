import React, { FC, useRef } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  message: string;
  ariaLabel?: string;
}

const createComponent = (componentName: string): FC<Props> => {
  const Component: FC<Props> = (props) => {
    const divRef = useRef<HTMLDivElement>(null);
    const sanitizedMessage = DOMPurify.sanitize(props.message);

    React.useEffect(() => {
      if (divRef.current) {
        divRef.current.innerHTML = sanitizedMessage;
      }
    }, [sanitizedMessage]);

    return (
      <div ref={divRef} aria-label={props.ariaLabel}>
        {/* Include a fallback for screen readers */}
        <span dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    );
  };

  return Component;
};

const MyComponent: FC<Props> = createComponent('MyComponent');
const CarbonCopyComponent: FC<Props> = createComponent('CarbonCopy');

export { MyComponent, CarbonCopyComponent };

In this version, I've used the `DOMPurify` library to sanitize the HTML to prevent any potential XSS attacks. I've also added an `aria-label` prop to improve accessibility, and a fallback for screen readers. The component now uses a `useRef` to store the DOM element and updates its content when the `message` prop changes. This approach ensures that the component behaves correctly even when the message contains dynamic content.