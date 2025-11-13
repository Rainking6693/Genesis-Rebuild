import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  id: string; // Unique identifier for the document
}

const MyComponent: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation('docs'); // Import translation for the docs section
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setIsLoading(true); // Set loading state to true while fetching the message
        const response = await fetch(`/api/docs/${id}`); // Fetch the message from the server
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.text();
        setMessage(data);
        setIsLoading(false); // Set loading state to false after setting the message
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage(`Error: ${error.message}`);
        setIsLoading(false); // Set loading state to false in case of an error
      }
    };

    fetchMessage();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!message) {
    return <div>An error occurred while fetching the document.</div>;
  }

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: message }} />
      {/* Add ARIA attributes for accessibility */}
      <div aria-label={`Document ${id}`} />
    </div>
  );
};

export default MyComponent;

In this updated version, I've added a loading state to display a loading message while the content is being fetched. I've also added error handling for the API request, checking if the response is ok before setting the message. If the response is not ok, an error message is displayed instead. Additionally, I've added an ARIA label for accessibility purposes.