import React, { useCallback, useState } from 'react';

interface SocialMediaShareProps {
  url: string;
  title: string;
  description: string;
  hashtags?: string[];
  /**
   *  Optional prop to specify the target for the share links. Defaults to '_blank'.
   *  Use '_self' to open in the same tab.
   */
  shareTarget?: '_blank' | '_self';
  /**
   * Optional prop to customize the button styles.
   */
  buttonClassName?: string;
  /**
   * Optional prop to customize the container styles.
   */
  containerClassName?: string;
  /**
   * Optional prop to provide custom labels for each social media platform.
   */
  labels?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  /**
   * Callback function to execute after a share attempt.  Receives the social media platform as an argument.
   */
  onShare?: (platform: 'facebook' | 'twitter' | 'linkedin' | 'email') => void;
  /**
   * Optional prop to display error messages. Defaults to false.
   */
  showErrorMessages?: boolean;
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({
  url,
  title,
  description,
  hashtags = [],
  shareTarget = '_blank',
  buttonClassName = '',
  containerClassName = '',
  labels,
  onShare,
  showErrorMessages = false,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.map(encodeURIComponent).join(',');

  const openShareWindow = useCallback(
    (shareUrl: string, platform: 'facebook' | 'twitter' | 'linkedin' | 'email') => {
      try {
        if (!window) {
          throw new Error('Window object is not available.'); // Handle server-side rendering or similar cases
        }
        window.open(shareUrl, shareTarget);
        onShare?.(platform); // Optional callback after share attempt
        setErrorMessage(null); // Clear any previous error message
      } catch (error: any) {
        console.error(`Failed to share to ${platform}:`, error);
        const message = `Failed to share to ${platform}: ${error.message || 'An error occurred.'}`;
        setErrorMessage(message);
      }
    },
    [shareTarget, onShare]
  );

  const shareToFacebook = useCallback(() => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    openShareWindow(facebookUrl, 'facebook');
  }, [encodedUrl, openShareWindow]);

  const shareToTwitter = useCallback(() => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`;
    openShareWindow(twitterUrl, 'twitter');
  }, [encodedUrl, encodedTitle, encodedHashtags, openShareWindow]);

  const shareToLinkedIn = useCallback(() => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    openShareWindow(linkedinUrl, 'linkedin');
  }, [encodedUrl, openShareWindow]);

  const shareToEmail = useCallback(() => {
    try {
      if (!window) {
        throw new Error('Window object is not available.'); // Handle server-side rendering or similar cases
      }
      const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0D%0A%0D%0ACheck out this link: ${encodedUrl}`;
      window.location.href = emailUrl;
      onShare?.('email');
      setErrorMessage(null); // Clear any previous error message
    } catch (error: any) {
      console.error('Failed to share via email:', error);
      const message = `Failed to share via email: ${error.message || 'An error occurred.'}`;
      setErrorMessage(message);
    }
  }, [encodedTitle, encodedDescription, encodedUrl, onShare]);

  const facebookLabel = labels?.facebook || 'Share on Facebook';
  const twitterLabel = labels?.twitter || 'Share on Twitter';
  const linkedinLabel = labels?.linkedin || 'Share on LinkedIn';
  const emailLabel = labels?.email || 'Share via Email';

  // Accessibility improvements:  Use semantic HTML and ARIA attributes.
  return (
    <div className={containerClassName}>
      {showErrorMessages && errorMessage && (
        <div role="alert" style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}
      <button
        className={buttonClassName}
        onClick={shareToFacebook}
        aria-label={facebookLabel}
        title={facebookLabel} // Add title for better accessibility
      >
        {facebookLabel}
      </button>
      <button
        className={buttonClassName}
        onClick={shareToTwitter}
        aria-label={twitterLabel}
        title={twitterLabel}
      >
        {twitterLabel}
      </button>
      <button
        className={buttonClassName}
        onClick={shareToLinkedIn}
        aria-label={linkedinLabel}
        title={linkedinLabel}
      >
        {linkedinLabel}
      </button>
      <button
        className={buttonClassName}
        onClick={shareToEmail}
        aria-label={emailLabel}
        title={emailLabel}
      >
        {emailLabel}
      </button>
    </div>
  );
};

export default SocialMediaShare;

import React, { useCallback, useState } from 'react';

interface SocialMediaShareProps {
  url: string;
  title: string;
  description: string;
  hashtags?: string[];
  /**
   *  Optional prop to specify the target for the share links. Defaults to '_blank'.
   *  Use '_self' to open in the same tab.
   */
  shareTarget?: '_blank' | '_self';
  /**
   * Optional prop to customize the button styles.
   */
  buttonClassName?: string;
  /**
   * Optional prop to customize the container styles.
   */
  containerClassName?: string;
  /**
   * Optional prop to provide custom labels for each social media platform.
   */
  labels?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
  /**
   * Callback function to execute after a share attempt.  Receives the social media platform as an argument.
   */
  onShare?: (platform: 'facebook' | 'twitter' | 'linkedin' | 'email') => void;
  /**
   * Optional prop to display error messages. Defaults to false.
   */
  showErrorMessages?: boolean;
}

const SocialMediaShare: React.FC<SocialMediaShareProps> = ({
  url,
  title,
  description,
  hashtags = [],
  shareTarget = '_blank',
  buttonClassName = '',
  containerClassName = '',
  labels,
  onShare,
  showErrorMessages = false,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.map(encodeURIComponent).join(',');

  const openShareWindow = useCallback(
    (shareUrl: string, platform: 'facebook' | 'twitter' | 'linkedin' | 'email') => {
      try {
        if (!window) {
          throw new Error('Window object is not available.'); // Handle server-side rendering or similar cases
        }
        window.open(shareUrl, shareTarget);
        onShare?.(platform); // Optional callback after share attempt
        setErrorMessage(null); // Clear any previous error message
      } catch (error: any) {
        console.error(`Failed to share to ${platform}:`, error);
        const message = `Failed to share to ${platform}: ${error.message || 'An error occurred.'}`;
        setErrorMessage(message);
      }
    },
    [shareTarget, onShare]
  );

  const shareToFacebook = useCallback(() => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    openShareWindow(facebookUrl, 'facebook');
  }, [encodedUrl, openShareWindow]);

  const shareToTwitter = useCallback(() => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`;
    openShareWindow(twitterUrl, 'twitter');
  }, [encodedUrl, encodedTitle, encodedHashtags, openShareWindow]);

  const shareToLinkedIn = useCallback(() => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    openShareWindow(linkedinUrl, 'linkedin');
  }, [encodedUrl, openShareWindow]);

  const shareToEmail = useCallback(() => {
    try {
      if (!window) {
        throw new Error('Window object is not available.'); // Handle server-side rendering or similar cases
      }
      const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0D%0A%0D%0ACheck out this link: ${encodedUrl}`;
      window.location.href = emailUrl;
      onShare?.('email');
      setErrorMessage(null); // Clear any previous error message
    } catch (error: any) {
      console.error('Failed to share via email:', error);
      const message = `Failed to share via email: ${error.message || 'An error occurred.'}`;
      setErrorMessage(message);
    }
  }, [encodedTitle, encodedDescription, encodedUrl, onShare]);

  const facebookLabel = labels?.facebook || 'Share on Facebook';
  const twitterLabel = labels?.twitter || 'Share on Twitter';
  const linkedinLabel = labels?.linkedin || 'Share on LinkedIn';
  const emailLabel = labels?.email || 'Share via Email';

  // Accessibility improvements:  Use semantic HTML and ARIA attributes.
  return (
    <div className={containerClassName}>
      {showErrorMessages && errorMessage && (
        <div role="alert" style={{ color: 'red' }}>
          {errorMessage}
        </div>
      )}
      <button
        className={buttonClassName}
        onClick={shareToFacebook}
        aria-label={facebookLabel}
        title={facebookLabel} // Add title for better accessibility
      >
        {facebookLabel}
      </button>
      <button
        className={buttonClassName}
        onClick={shareToTwitter}
        aria-label={twitterLabel}
        title={twitterLabel}
      >
        {twitterLabel}
      </button>
      <button
        className={buttonClassName}
        onClick={shareToLinkedIn}
        aria-label={linkedinLabel}
        title={linkedinLabel}
      >
        {linkedinLabel}
      </button>
      <button
        className={buttonClassName}
        onClick={shareToEmail}
        aria-label={emailLabel}
        title={emailLabel}
      >
        {emailLabel}
      </button>
    </div>
  );
};

export default SocialMediaShare;