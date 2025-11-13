// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

interface SocialMediaProps {
  contentUrl: string;
  platform?: 'twitter' | 'facebook' | 'instagram' | 'all';
}

const SocialMedia: React.FC<SocialMediaProps> = ({ contentUrl, platform = 'all' }) => {
  const [shareCounts, setShareCounts] = useState({
    twitter: 0,
    facebook: 0,
    instagram: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShareCounts = async () => {
      try {
        // Placeholder for fetching share counts from a backend service
        // In a real application, this would be an API call
        const mockShareCounts = {
          twitter: Math.floor(Math.random() * 100),
          facebook: Math.floor(Math.random() * 50),
          instagram: Math.floor(Math.random() * 25),
        };
        setShareCounts(mockShareCounts);
      } catch (err: any) {
        setError(`Failed to fetch share counts: ${err.message}`);
      }
    };

    fetchShareCounts();
  }, [contentUrl]);

  const handleShare = (platform: string) => {
    try {
      let shareUrl = '';
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(contentUrl)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(contentUrl)}`;
          break;
        case 'instagram':
          // Instagram doesn't allow direct sharing via URL, so you'd typically
          // guide the user to copy the link or use a custom integration.
          alert("Share on Instagram: Copy the link and share manually.");
          return;
        default:
          console.warn(`Unsupported platform: ${platform}`);
          return;
      }

      window.open(shareUrl, '_blank');
    } catch (err: any) {
      setError(`Failed to share on ${platform}: ${err.message}`);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="social-media">
      {platform === 'all' || platform === 'twitter' ? (
        <button onClick={() => handleShare('twitter')}>
          <FontAwesomeIcon icon={faTwitter} /> Share on Twitter ({shareCounts.twitter})
        </button>
      ) : null}

      {platform === 'all' || platform === 'facebook' ? (
        <button onClick={() => handleShare('facebook')}>
          <FontAwesomeIcon icon={faFacebook} /> Share on Facebook ({shareCounts.facebook})
        </button>
      ) : null}

      {platform === 'all' || platform === 'instagram' ? (
        <button onClick={() => handleShare('instagram')}>
          <FontAwesomeIcon icon={faInstagram} /> Share on Instagram ({shareCounts.instagram})
        </button>
      ) : null}
    </div>
  );
};

export default SocialMedia;

// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

interface SocialMediaProps {
  contentUrl: string;
  platform?: 'twitter' | 'facebook' | 'instagram' | 'all';
}

const SocialMedia: React.FC<SocialMediaProps> = ({ contentUrl, platform = 'all' }) => {
  const [shareCounts, setShareCounts] = useState({
    twitter: 0,
    facebook: 0,
    instagram: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShareCounts = async () => {
      try {
        // Placeholder for fetching share counts from a backend service
        // In a real application, this would be an API call
        const mockShareCounts = {
          twitter: Math.floor(Math.random() * 100),
          facebook: Math.floor(Math.random() * 50),
          instagram: Math.floor(Math.random() * 25),
        };
        setShareCounts(mockShareCounts);
      } catch (err: any) {
        setError(`Failed to fetch share counts: ${err.message}`);
      }
    };

    fetchShareCounts();
  }, [contentUrl]);

  const handleShare = (platform: string) => {
    try {
      let shareUrl = '';
      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(contentUrl)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(contentUrl)}`;
          break;
        case 'instagram':
          // Instagram doesn't allow direct sharing via URL, so you'd typically
          // guide the user to copy the link or use a custom integration.
          alert("Share on Instagram: Copy the link and share manually.");
          return;
        default:
          console.warn(`Unsupported platform: ${platform}`);
          return;
      }

      window.open(shareUrl, '_blank');
    } catch (err: any) {
      setError(`Failed to share on ${platform}: ${err.message}`);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="social-media">
      {platform === 'all' || platform === 'twitter' ? (
        <button onClick={() => handleShare('twitter')}>
          <FontAwesomeIcon icon={faTwitter} /> Share on Twitter ({shareCounts.twitter})
        </button>
      ) : null}

      {platform === 'all' || platform === 'facebook' ? (
        <button onClick={() => handleShare('facebook')}>
          <FontAwesomeIcon icon={faFacebook} /> Share on Facebook ({shareCounts.facebook})
        </button>
      ) : null}

      {platform === 'all' || platform === 'instagram' ? (
        <button onClick={() => handleShare('instagram')}>
          <FontAwesomeIcon icon={faInstagram} /> Share on Instagram ({shareCounts.instagram})
        </button>
      ) : null}
    </div>
  );
};

export default SocialMedia;

Now, I will use the `Write` tool to write the code to a file.