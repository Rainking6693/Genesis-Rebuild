import { ReactElement, ReactNode } from 'react';
import { sanitize } from 'dompurify';
import { validateMessage } from './validationUtils';

interface Props {
  message?: string;
}

const sanitizeMessage = (message: string): string => {
  // Sanitize the message to prevent XSS attacks
  return sanitize(message);
};

const validateAndSanitizeMessage = (message: string): string | null => {
  const sanitizedMessage = sanitizeMessage(message);
  const validatedMessage = validateMessage(sanitizedMessage);

  if (validatedMessage) {
    return validatedMessage;
  }

  return null;
};

const MyComponent: React.FC<Props> = ({ message }: Props): ReactElement => {
  const sanitizedAndValidatedMessage = useMemo(
    () => validateAndSanitizeMessage(message || ''),
    [message]
  );

  if (!sanitizedAndValidatedMessage) {
    return <div>Invalid message</div>;
  }

  return (
    <div data-testid="my-component" aria-label={sanitizedAndValidatedMessage}>
      <div dangerouslySetInnerHTML={{ __html: sanitizedAndValidatedMessage }} />
    </div>
  );
};

MyComponent.defaultProps = {
  message: '',
};

// Add type for export default
export default MyComponent;

In this updated code, I've added a default value for the `message` prop to prevent any potential issues when the prop is not provided. I've also added a data-testid attribute for easier testing and an aria-label attribute to provide a more meaningful description for screen readers. Lastly, I've used a more descriptive variable name for the sanitized and validated message.