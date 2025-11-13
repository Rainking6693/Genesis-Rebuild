// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

interface SocialMediaProps {
  url: string;
  title: string;
  description: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ url, title, description }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shareToFacebook = () => {
    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error sharing to Facebook:", error);
      // Implement error handling, e.g., display an error message to the user
      alert("Failed to share to Facebook. Please try again later.");
    }
  };

  const shareToTwitter = () => {
    try {
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + " - " + description)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error sharing to Twitter:", error);
      // Implement error handling, e.g., display an error message to the user
      alert("Failed to share to Twitter. Please try again later.");
    }
  };

  const shareToInstagram = () => {
    // Instagram doesn't allow direct sharing with URL parameters.
    // Instead, guide the user to copy the link.
    alert("To share on Instagram, please copy the link and paste it into your post.");
  };

  const shareToLinkedIn = () => {
    try {
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error sharing to LinkedIn:", error);
      // Implement error handling, e.g., display an error message to the user
      alert("Failed to share to LinkedIn. Please try again later.");
    }
  };

  if (!isMounted) {
    return null; // Or a loading indicator
  }

  return (
    <div className="social-media-share">
      <button onClick={shareToFacebook} aria-label="Share on Facebook">
        <FaFacebook />
      </button>
      <button onClick={shareToTwitter} aria-label="Share on Twitter">
        <FaTwitter />
      </button>
      <button onClick={shareToInstagram} aria-label="Share on Instagram">
        <FaInstagram />
      </button>
      <button onClick={shareToLinkedIn} aria-label="Share on LinkedIn">
        <FaLinkedin />
      </button>
    </div>
  );
};

export default SocialMedia;

// src/components/SocialMedia.tsx
import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

interface SocialMediaProps {
  url: string;
  title: string;
  description: string;
}

const SocialMedia: React.FC<SocialMediaProps> = ({ url, title, description }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shareToFacebook = () => {
    try {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(facebookUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error sharing to Facebook:", error);
      // Implement error handling, e.g., display an error message to the user
      alert("Failed to share to Facebook. Please try again later.");
    }
  };

  const shareToTwitter = () => {
    try {
      const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + " - " + description)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error sharing to Twitter:", error);
      // Implement error handling, e.g., display an error message to the user
      alert("Failed to share to Twitter. Please try again later.");
    }
  };

  const shareToInstagram = () => {
    // Instagram doesn't allow direct sharing with URL parameters.
    // Instead, guide the user to copy the link.
    alert("To share on Instagram, please copy the link and paste it into your post.");
  };

  const shareToLinkedIn = () => {
    try {
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error("Error sharing to LinkedIn:", error);
      // Implement error handling, e.g., display an error message to the user
      alert("Failed to share to LinkedIn. Please try again later.");
    }
  };

  if (!isMounted) {
    return null; // Or a loading indicator
  }

  return (
    <div className="social-media-share">
      <button onClick={shareToFacebook} aria-label="Share on Facebook">
        <FaFacebook />
      </button>
      <button onClick={shareToTwitter} aria-label="Share on Twitter">
        <FaTwitter />
      </button>
      <button onClick={shareToInstagram} aria-label="Share on Instagram">
        <FaInstagram />
      </button>
      <button onClick={shareToLinkedIn} aria-label="Share on LinkedIn">
        <FaLinkedin />
      </button>
    </div>
  );
};

export default SocialMedia;