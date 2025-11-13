import React, { useMemo, FC } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitizer';

type SanitizeUserInputFunction = (input: string) => string | null;

interface Props {
  message: string;
  ariaLabel?: string;
}

const FunctionalComponent: FC<Props> = ({ message, ariaLabel }) => {
  const sanitizedMessage = useMemo(
    () => (sanitizeUserInput(message) || '<Invalid input>'),
    [message]
  );

  return (
    <div
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

const MemoizedComponent = React.memo(FunctionalComponent);

export default MemoizedComponent;

import React, { useMemo, FC } from 'react';
import { sanitizeUserInput } from '../../security/input_sanitizer';

type SanitizeUserInputFunction = (input: string) => string | null;

interface Props {
  message: string;
  ariaLabel?: string;
}

const FunctionalComponent: FC<Props> = ({ message, ariaLabel }) => {
  const sanitizedMessage = useMemo(
    () => (sanitizeUserInput(message) || '<Invalid input>'),
    [message]
  );

  return (
    <div
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
    />
  );
};

const MemoizedComponent = React.memo(FunctionalComponent);

export default MemoizedComponent;