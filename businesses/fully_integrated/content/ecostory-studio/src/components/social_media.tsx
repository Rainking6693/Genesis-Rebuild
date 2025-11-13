import React, { FC, useEffect, useState } from 'react';

interface Props {
  message?: string;
}

const SocialMediaPost: FC<Props> = ({ message }) => {
  const [loadedMessage, setLoadedMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.ecostorystudio.com/messages');
        if (!response.ok) {
          throw new Error('Error fetching message');
        }
        const data = await response.json();
        setLoadedMessage(data.message);
      } catch (error) {
        console.error(error);
        setLoadedMessage('Unable to load message at this time. Please try again later.');
      }
    };

    fetchData();
  }, []);

  if (!loadedMessage) {
    return null;
  }

  return (
    <a href="https://api.ecostorystudio.com/messages" aria-label="View message source">
      <div className="social-media-post">{loadedMessage || message}</div>
    </a>
  );
};

SocialMediaPost.defaultProps = {
  message: 'Join us in our sustainability journey!',
};

export default SocialMediaPost;

This version of the component will now handle cases where the API call fails, providing a fallback message. It also ensures that the component only renders when the message has been loaded successfully, and it wraps the post with a link to the source for improved accessibility.