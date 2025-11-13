// src/components/SocialMediaShare.tsx
import React, { useState } from 'react';

interface SocialMediaShareProps {
  url: string;
  title: string;
  description: string;
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({ url, title, description }) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Handle the error gracefully, perhaps by displaying an error message to the user.
      alert('Failed to copy link. Please try again.');
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="social-share">
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on Twitter</button>
      </a>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on Facebook</button>
      </a>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on LinkedIn</button>
      </a>
      <button onClick={handleCopyToClipboard}>Copy Link</button>
      {copySuccess && <p>Copied!</p>}
    </div>
  );
};

export default SocialMediaShare;

// src/components/SocialMediaShare.tsx
import React, { useState } from 'react';

interface SocialMediaShareProps {
  url: string;
  title: string;
  description: string;
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({ url, title, description }) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Handle the error gracefully, perhaps by displaying an error message to the user.
      alert('Failed to copy link. Please try again.');
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="social-share">
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on Twitter</button>
      </a>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on Facebook</button>
      </a>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
        <button>Share on LinkedIn</button>
      </a>
      <button onClick={handleCopyToClipboard}>Copy Link</button>
      {copySuccess && <p>Copied!</p>}
    </div>
  );
};

export default SocialMediaShare;