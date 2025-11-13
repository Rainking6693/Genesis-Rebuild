import React, { FC, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message?: string;
}

const MyComponent: FC<Props> = React.forwardRef((props: Props, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const sanitizedMessage = useMemo(() => {
    return DOMPurify.sanitize(props.message || '', {
      ALLOWED_TAGS: ['b', 'i', 'u', 'a'],
      ALLOWED_ATTRS: {
        a: ['href', 'target'],
      },
    });
  }, [props.message]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  React.useEffect(() => {
    if (componentRef.current) {
      componentRef.current.focus();
    }
  }, [props.message, isFocused]);

  return (
    <div
      ref={ref || componentRef}
      data-testid="my-component"
      role="textbox"
      aria-label="My Component"
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={0}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
});

MyComponent.defaultProps = {
  message: '',
};

MyComponent.propTypes = {
  message: PropTypes.string,
};

// Optimize performance by memoizing the component if props don't change
const MemoizedMyComponent: FC<Props> = React.memo(MyComponent);

export default MemoizedMyComponent;

This updated code should provide better resiliency, handle edge cases, improve accessibility, and maintainability for your SaaS business.