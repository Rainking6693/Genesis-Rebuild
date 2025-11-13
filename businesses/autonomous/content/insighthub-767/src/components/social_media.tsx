// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';

interface SocialMediaProps {
  contentUrl: string;
  title: string;
  description: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ contentUrl, title, description }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareToTwitter = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(contentUrl)}&text=${encodeURIComponent(title + " - " + description)}`;
      window.open(twitterUrl, '_blank'); // Open in new tab
    } catch (err: any) {
      setError(`Failed to share to Twitter: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const shareToFacebook = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(contentUrl)}`;
      window.open(facebookUrl, '_blank');
    } catch (err: any) {
      setError(`Failed to share to Facebook: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for displaying social media feed (requires API integration)
  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Placeholder: Replace with actual API call to fetch social media feed
        // Example: const response = await fetch('/api/social-media-feed');
        // const data = await response.json();
        // setFeedItems(data);

        // Simulate fetching feed data
        setTimeout(() => {
          setFeedItems([
            { id: 1, text: "Example Tweet 1" },
            { id: 2, text: "Example Tweet 2" },
          ]);
        }, 500);

      } catch (err: any) {
        setError(`Failed to fetch social media feed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div>
      <h2>Share this content:</h2>
      <button onClick={shareToTwitter} disabled={isLoading}>
        {isLoading ? 'Sharing to Twitter...' : 'Share to Twitter'}
      </button>
      <button onClick={shareToFacebook} disabled={isLoading}>
        {isLoading ? 'Sharing to Facebook...' : 'Share to Facebook'}
      </button>

      <h2>Social Media Feed:</h2>
      {isLoading && <p>Loading feed...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {feedItems.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMedia;

// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';

interface SocialMediaProps {
  contentUrl: string;
  title: string;
  description: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ contentUrl, title, description }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareToTwitter = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(contentUrl)}&text=${encodeURIComponent(title + " - " + description)}`;
      window.open(twitterUrl, '_blank'); // Open in new tab
    } catch (err: any) {
      setError(`Failed to share to Twitter: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const shareToFacebook = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(contentUrl)}`;
      window.open(facebookUrl, '_blank');
    } catch (err: any) {
      setError(`Failed to share to Facebook: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for displaying social media feed (requires API integration)
  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Placeholder: Replace with actual API call to fetch social media feed
        // Example: const response = await fetch('/api/social-media-feed');
        // const data = await response.json();
        // setFeedItems(data);

        // Simulate fetching feed data
        setTimeout(() => {
          setFeedItems([
            { id: 1, text: "Example Tweet 1" },
            { id: 2, text: "Example Tweet 2" },
          ]);
        }, 500);

      } catch (err: any) {
        setError(`Failed to fetch social media feed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div>
      <h2>Share this content:</h2>
      <button onClick={shareToTwitter} disabled={isLoading}>
        {isLoading ? 'Sharing to Twitter...' : 'Share to Twitter'}
      </button>
      <button onClick={shareToFacebook} disabled={isLoading}>
        {isLoading ? 'Sharing to Facebook...' : 'Share to Facebook'}
      </button>

      <h2>Social Media Feed:</h2>
      {isLoading && <p>Loading feed...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {feedItems.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMedia;