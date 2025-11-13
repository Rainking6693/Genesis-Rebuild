// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
} from 'react-share';

interface SocialMediaProps {
  url: string;
  title: string;
  description: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ url, title, description }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true); // Simulate loading state
  }, []);

  if (error) {
    return (
      <div className="error">
        Error: {error}
      </div>
    );
  }

  if (!isLoaded) {
    return <div>Loading social media sharing options...</div>;
  }

  return (
    <div className="social-media">
      <h3>Share this content:</h3>
      <div className="social-media-buttons">
        <FacebookShareButton url={url} quote={title} className="social-button">
          <img src="/facebook.svg" alt="Facebook" />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title} className="social-button">
          <img src="/twitter.svg" alt="Twitter" />
        </TwitterShareButton>

        <LinkedinShareButton url={url} title={title} description={description} className="social-button">
          <img src="/linkedin.svg" alt="LinkedIn" />
        </LinkedinShareButton>

        <RedditShareButton url={url} title={title} url={url} className="social-button">
          <img src="/reddit.svg" alt="Reddit" />
        </RedditShareButton>
      </div>
    </div>
  );
};

export default SocialMedia;

// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
} from 'react-share';

interface SocialMediaProps {
  url: string;
  title: string;
  description: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ url, title, description }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true); // Simulate loading state
  }, []);

  if (error) {
    return (
      <div className="error">
        Error: {error}
      </div>
    );
  }

  if (!isLoaded) {
    return <div>Loading social media sharing options...</div>;
  }

  return (
    <div className="social-media">
      <h3>Share this content:</h3>
      <div className="social-media-buttons">
        <FacebookShareButton url={url} quote={title} className="social-button">
          <img src="/facebook.svg" alt="Facebook" />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title} className="social-button">
          <img src="/twitter.svg" alt="Twitter" />
        </TwitterShareButton>

        <LinkedinShareButton url={url} title={title} description={description} className="social-button">
          <img src="/linkedin.svg" alt="LinkedIn" />
        </LinkedinShareButton>

        <RedditShareButton url={url} title={title} url={url} className="social-button">
          <img src="/reddit.svg" alt="Reddit" />
        </RedditShareButton>
      </div>
    </div>
  );
};

export default SocialMedia;

**Final Output:**