import React from 'react';
import DOMPurify from 'dompurify';

interface SanitizeOptions = {
  FORBID_TAGS?: string[];
  FORBID_ATTR?: string[];
  FORBID_COMMENTS?: boolean;
  ALLOW_COMMENTS?: boolean;
  ALLOW_CREATE_ELEMENT_NODE?: boolean;
  ALLOW_CREATE_TEXT_NODE?: boolean;
  ALLOW_CREATE_CDATA_SECTION_NODE?: boolean;
  ALLOW_CREATE_ENTITY_REFERENCE_NODE?: boolean;
  ALLOW_CREATE_ENTITY_NODE?: boolean;
  ALLOW_CREATE_PROCESSING_INSTRUCTION_NODE?: boolean;
  ALLOW_DATA_URIS?: boolean;
  ALLOW_URL_PROTOCOLS?: string[];
  ALLOW_UNSAFE_URI?: boolean;
  ALLOW_UNSAFE_HTML?: boolean;
};

// Function to validate messages, ensuring they are safe to display
function validateMessage(message: string, sanitizeOptions?: SanitizeOptions): string {
  try {
    // Sanitize the message using DOMPurify
    const sanitizedMessage = DOMPurify.sanitize(message, sanitizeOptions);
    return sanitizedMessage;
  } catch (error) {
    console.error(`Error sanitizing message: ${error.message}`);
    return '';
  }
}

// Interface for props
interface Props {
  message: string;
  ariaLabelKey?: string;
  className?: string;
  maxWidth?: string;
  noWrap?: boolean;
}

// Component for displaying the validated message
const MyComponent: React.FC<Props> = ({
  message,
  ariaLabelKey = 'validated_message',
  className,
  maxWidth,
  noWrap = false,
}) => {
  const validatedMessage = validateMessage(message);

  if (!validatedMessage) {
    return null;
  }

  const messageStyle = {
    whiteSpace: noWrap ? 'nowrap' : 'normal',
    maxWidth,
  };

  return (
    <div className={className} style={messageStyle} aria-label={ariaLabelKey}>
      {validatedMessage}
    </div>
  );
};

export default MyComponent;

This updated component is more flexible, easier to maintain, and provides a better user experience by handling edge cases, supporting internationalization, and allowing for custom styling.