import React, { FC, memo } from 'react';
import PropTypes from 'prop-types';

// Move validation function to a separate utility function
const validateMessage = (message: string) => {
  // Implement a simple validation function to ensure the message is safe to render
  // This is a basic example, you should use a more robust solution in a production environment
  const sanitizedMessage = message
    .replace(/<[^>]*>?/gm, '') // Remove all HTML tags
    .replace(/&([a-zA-Z]{2,8})(?:#([0-9]{2,8})|;)/g, (match, p1, p2) => {
      // Remove named and numeric character references
      return p1;
    })
    .trim(); // Remove leading and trailing whitespace

  if (!sanitizedMessage) {
    throw new Error('Message cannot be empty');
  }

  return sanitizedMessage;
};

// Define API response and error interfaces
interface ApiResponse {
  content: string;
}

interface ApiError {
  message: string;
}

interface Props {
  apiUrl: string;
  ariaLabel?: string;
}

const MyComponent: FC<Props> = ({ apiUrl, ariaLabel }) => {
  const [content, setContent] = React.useState<string>('');
  const [error, setError] = React.useState<ApiError | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = (await response.json()) as ApiResponse;
        setContent(validateMessage(data.content));
      } catch (error) {
        setError({ message: error.message });
      }
    };

    fetchData();
  }, [apiUrl]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Add aria-label for accessibility
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      aria-label={ariaLabel || 'Custom content'} // Add aria-label for accessibility
    />
  );
};

MyComponent.defaultProps = {
  apiUrl: '',
  ariaLabel: 'Custom content',
};

MyComponent.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
};

export default memo(MyComponent);

This version of the component fetches content from an API, validates it, and handles errors. It also adds an aria-label for accessibility. You can customize the API URL and the default aria-label in the props.