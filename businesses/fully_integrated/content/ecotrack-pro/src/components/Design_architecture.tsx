import React, { FC, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

interface Props {
  message?: string;
  role?: string;
  ariaLabel?: string;
  ariaDescribedby?: string | string[];
  ariaLabelledby?: string | string[];
  tabIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  dangerouslySetInnerHTML?: (html: string) => string;
  sanitizedHTML?: string;
}

const MyComponent: FC<Props> = ({
  message,
  role,
  ariaLabel,
  ariaDescribedby,
  ariaLabelledby,
  tabIndex,
  className,
  style,
  dangerouslySetInnerHTML,
  sanitizedHTML,
}) => {
  const sanitizedMessage = useMemo(() => {
    if (!sanitizedHTML) {
      if (!dangerouslySetInnerHTML) {
        throw new Error('Either dangerouslySetInnerHTML or sanitizedHTML is required');
      }
      return useSanitizedHTML(dangerouslySetInnerHTML, message);
    }
    return sanitizedHTML;
  }, [dangerouslySetInnerHTML, message, sanitizedHTML]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab' && (event.shiftKey || tabIndex === -1)) {
      event.preventDefault();
    }
  }, [tabIndex]);

  return (
    <div
      role={role}
      aria-label={ariaLabel}
      aria-describedby={Array.isArray(ariaDescribedby) ? ariaDescribedby.join(' ') : ariaDescribedby}
      aria-labelledby={Array.isArray(ariaLabelledby) ? ariaLabelledby.join(' ') : ariaLabelledby}
      tabIndex={tabIndex}
      className={className}
      style={style}
      onKeyDown={handleKeyDown}
    >
      {sanitizedMessage}
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
  role: 'presentation',
  tabIndex: -1,
};

MyComponent.propTypes = {
  message: PropTypes.string,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedby: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  ariaLabelledby: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  tabIndex: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  dangerouslySetInnerHTML: PropTypes.func,
  sanitizedHTML: PropTypes.string,
};

const useSanitizedHTML = (dangerouslySetInnerHTML, html) => {
  // ... (same as before)
};

export default React.memo(MyComponent);

In this updated component, I've added the following improvements:

1. Check if either `dangerouslySetInnerHTML` or `sanitizedHTML` is provided.
2. Added support for multiple `aria-describedby` and `aria-labelledby` values by accepting arrays.
3. Implemented a `handleKeyDown` function to prevent focus from leaving the component when the Tab key is pressed.
4. Added a `sanitizedHTML` prop to allow passing pre-sanitized HTML.
5. Updated the `ariaDescribedby` and `ariaLabelledby` props to accept arrays.
6. Added TypeScript types for the new props and the `handleKeyDown` function.