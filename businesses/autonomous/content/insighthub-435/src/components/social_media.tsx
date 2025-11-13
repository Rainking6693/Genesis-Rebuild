// src/components/SocialShare.tsx
import React, { useState } from 'react';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, PinterestShareButton } from 'react-share';

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  image?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ url, title, description, image }) => {
  const [error, setError] = useState<string | null>(null);

  const handleShareError = (platform: string, err: any) => {
    console.error(`Error sharing to ${platform}:`, err);
    setError(`Failed to share to ${platform}. Please try again later.`);
  };

  return (
    <div className="social-share">
      {error && <div className="error-message">{error}</div>}

      <FacebookShareButton
        url={url}
        quote={description}
        onError={(err) => handleShareError("Facebook", err)}
      >
        <img src="/facebook-icon.png" alt="Share on Facebook" />
      </FacebookShareButton>

      <TwitterShareButton
        url={url}
        title={title}
        onError={(err) => handleShareError("Twitter", err)}
      >
        <img src="/twitter-icon.png" alt="Share on Twitter" />
      </TwitterShareButton>

      <LinkedinShareButton
        url={url}
        title={title}
        summary={description}
        source={url}
        onError={(err) => handleShareError("LinkedIn", err)}
      >
        <img src="/linkedin-icon.png" alt="Share on LinkedIn" />
      </LinkedinShareButton>

      {image && (
        <PinterestShareButton
          url={url}
          media={image}
          description={description}
          onError={(err) => handleShareError("Pinterest", err)}
        >
          <img src="/pinterest-icon.png" alt="Share on Pinterest" />
        </PinterestShareButton>
      )}
    </div>
  );
};

export default SocialShare;