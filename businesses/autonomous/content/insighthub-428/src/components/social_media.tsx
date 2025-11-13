// src/components/SocialMediaShare.tsx
import React, { useState, useCallback } from 'react';

interface SocialMediaShareProps {
  url: string;
  title: string;
  description: string;
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({ url, title, description }) => {
  const [shareError, setShareError] = useState<string | null>(null);

  const handleShare = useCallback(
    (platform: 'twitter' | 'facebook' | 'linkedin') => {
      try {
        let shareUrl = '';
        switch (platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
          default:
            throw new Error(`Unsupported platform: ${platform}`);
        }

        window.open(shareUrl, '_blank');
      } catch (error: any) {
        console.error(`Error sharing on ${platform}:`, error);
        setShareError(`Failed to share on ${platform}. Please try again later.`);
      }
    },
    [url, title]
  );

  return (
    <div>
      {shareError && <div style={{ color: 'red' }}>{shareError}</div>}
      <button onClick={() => handleShare('twitter')}>Share on Twitter</button>
      <button onClick={() => handleShare('facebook')}>Share on Facebook</button>
      <button onClick={() => handleShare('linkedin')}>Share on LinkedIn</button>
    </div>
  );
};

export default SocialMediaShare;

// src/components/SocialMediaShare.tsx
import React, { useState, useCallback } from 'react';

interface SocialMediaShareProps {
  url: string;
  title: string;
  description: string;
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({ url, title, description }) => {
  const [shareError, setShareError] = useState<string | null>(null);

  const handleShare = useCallback(
    (platform: 'twitter' | 'facebook' | 'linkedin') => {
      try {
        let shareUrl = '';
        switch (platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
          default:
            throw new Error(`Unsupported platform: ${platform}`);
        }

        window.open(shareUrl, '_blank');
      } catch (error: any) {
        console.error(`Error sharing on ${platform}:`, error);
        setShareError(`Failed to share on ${platform}. Please try again later.`);
      }
    },
    [url, title]
  );

  return (
    <div>
      {shareError && <div style={{ color: 'red' }}>{shareError}</div>}
      <button onClick={() => handleShare('twitter')}>Share on Twitter</button>
      <button onClick={() => handleShare('facebook')}>Share on Facebook</button>
      <button onClick={() => handleShare('linkedin')}>Share on LinkedIn</button>
    </div>
  );
};

export default SocialMediaShare;