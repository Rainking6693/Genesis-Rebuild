// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';

interface SocialMediaProps {
  contentUrl: string;
  title: string;
  description: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ contentUrl, title, description }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const encodedUrl = encodeURIComponent(contentUrl);
      const encodedTitle = encodeURIComponent(title);
      const encodedDescription = encodeURIComponent(description);

      // Example share URL for Twitter
      const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}%20-%20${encodedDescription}`;
      setShareUrl(twitterShareUrl);
    } catch (err: any) {
      console.error("Error generating share URL:", err);
      setError("Failed to generate share URL. Please try again later.");
    }
  }, [contentUrl, title, description]);

  const handleShare = () => {
    try {
      window.open(shareUrl, '_blank');
    } catch (err: any) {
      console.error("Error opening share window:", err);
      setError("Failed to open share window. Please check your browser settings.");
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleShare}>Share on Twitter</button>
      {/* Add more social media sharing options here */}
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
  const [shareUrl, setShareUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const encodedUrl = encodeURIComponent(contentUrl);
      const encodedTitle = encodeURIComponent(title);
      const encodedDescription = encodeURIComponent(description);

      // Example share URL for Twitter
      const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}%20-%20${encodedDescription}`;
      setShareUrl(twitterShareUrl);
    } catch (err: any) {
      console.error("Error generating share URL:", err);
      setError("Failed to generate share URL. Please try again later.");
    }
  }, [contentUrl, title, description]);

  const handleShare = () => {
    try {
      window.open(shareUrl, '_blank');
    } catch (err: any) {
      console.error("Error opening share window:", err);
      setError("Failed to open share window. Please check your browser settings.");
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleShare}>Share on Twitter</button>
      {/* Add more social media sharing options here */}
    </div>
  );
};

export default SocialMedia;

Now, I will use the `Write` tool to write the code to a file and then output the build report.

**Final Output:**