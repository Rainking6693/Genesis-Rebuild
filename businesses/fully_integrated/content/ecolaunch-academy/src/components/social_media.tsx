import React, { ReactNode, FC, useMemo, useState, useEffect } from 'react';

// Define a type for the social media platforms
type SocialMediaPlatform = 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram' | 'YouTube' | 'TikTok';

interface SocialMediaProps {
  platform: SocialMediaPlatform;
  url: string;
  icon?: ReactNode; // Allows for custom icons
  ariaLabel?: string; // Accessibility label
  className?: string; // Allows for custom styling
  onError?: (error: Error) => void; // Callback for error handling
  fallbackIcon?: ReactNode; // Icon to display if platform icon is missing
}

const SocialMediaLink: FC<SocialMediaProps> = ({
  platform,
  url,
  icon,
  ariaLabel,
  className,
  onError,
  fallbackIcon,
}) => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [urlError, setUrlError] = useState<Error | null>(null);

  // Default aria label based on the platform
  const defaultAriaLabel = `Visit EcoLaunch Academy on ${platform}`;

  // Use ariaLabel if provided, otherwise use the default
  const ariaLabelText = ariaLabel || defaultAriaLabel;

  // Define platform icons using a more robust approach
  const platformIcons: Record<SocialMediaPlatform, ReactNode> = useMemo(
    () => ({
      LinkedIn: <i className="fab fa-linkedin" aria-hidden="true"></i>, // Example using Font Awesome
      Twitter: <i className="fab fa-twitter" aria-hidden="true"></i>,
      Facebook: <i className="fab fa-facebook" aria-hidden="true"></i>,
      Instagram: <i className="fab fa-instagram" aria-hidden="true"></i>,
      YouTube: <i className="fab fa-youtube" aria-hidden="true"></i>,
      TikTok: <i className="fab fa-tiktok" aria-hidden="true"></i>,
    }),
    []
  );

  // Select the icon to use, prioritizing the provided icon
  const selectedIcon = useMemo(() => {
    if (icon) {
      return icon;
    }

    const platformIcon = platformIcons[platform];
    if (platformIcon) {
      return platformIcon;
    }

    return fallbackIcon || platform; // Fallback to platform name if no icon is available
  }, [icon, platform, platformIcons, fallbackIcon]);

  useEffect(() => {
    try {
      new URL(url);
      setIsValidUrl(true);
      setUrlError(null);
    } catch (error: any) {
      setIsValidUrl(false);
      setUrlError(error);
      onError?.(error); // Report the error to the parent component
      console.error(`Invalid URL for ${platform}: ${url}`, error); // Log the error for debugging
    }
  }, [url, platform, onError]);

  // Render null if the URL is invalid to prevent broken links
  if (!isValidUrl) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isValidUrl && urlError) {
      event.preventDefault(); // Prevent navigation
      onError?.(urlError); // Re-trigger the error callback
      console.error(`Attempted navigation to invalid URL for ${platform}: ${url}`, urlError);
      return;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer" // Security best practice
      aria-label={ariaLabelText}
      title={ariaLabelText} // Added title for better UX
      className={className}
      onClick={handleClick}
    >
      {selectedIcon}
    </a>
  );
};

SocialMediaLink.defaultProps = {
  className: '',
  fallbackIcon: null,
};

export default SocialMediaLink;

import React, { ReactNode, FC, useMemo, useState, useEffect } from 'react';

// Define a type for the social media platforms
type SocialMediaPlatform = 'LinkedIn' | 'Twitter' | 'Facebook' | 'Instagram' | 'YouTube' | 'TikTok';

interface SocialMediaProps {
  platform: SocialMediaPlatform;
  url: string;
  icon?: ReactNode; // Allows for custom icons
  ariaLabel?: string; // Accessibility label
  className?: string; // Allows for custom styling
  onError?: (error: Error) => void; // Callback for error handling
  fallbackIcon?: ReactNode; // Icon to display if platform icon is missing
}

const SocialMediaLink: FC<SocialMediaProps> = ({
  platform,
  url,
  icon,
  ariaLabel,
  className,
  onError,
  fallbackIcon,
}) => {
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [urlError, setUrlError] = useState<Error | null>(null);

  // Default aria label based on the platform
  const defaultAriaLabel = `Visit EcoLaunch Academy on ${platform}`;

  // Use ariaLabel if provided, otherwise use the default
  const ariaLabelText = ariaLabel || defaultAriaLabel;

  // Define platform icons using a more robust approach
  const platformIcons: Record<SocialMediaPlatform, ReactNode> = useMemo(
    () => ({
      LinkedIn: <i className="fab fa-linkedin" aria-hidden="true"></i>, // Example using Font Awesome
      Twitter: <i className="fab fa-twitter" aria-hidden="true"></i>,
      Facebook: <i className="fab fa-facebook" aria-hidden="true"></i>,
      Instagram: <i className="fab fa-instagram" aria-hidden="true"></i>,
      YouTube: <i className="fab fa-youtube" aria-hidden="true"></i>,
      TikTok: <i className="fab fa-tiktok" aria-hidden="true"></i>,
    }),
    []
  );

  // Select the icon to use, prioritizing the provided icon
  const selectedIcon = useMemo(() => {
    if (icon) {
      return icon;
    }

    const platformIcon = platformIcons[platform];
    if (platformIcon) {
      return platformIcon;
    }

    return fallbackIcon || platform; // Fallback to platform name if no icon is available
  }, [icon, platform, platformIcons, fallbackIcon]);

  useEffect(() => {
    try {
      new URL(url);
      setIsValidUrl(true);
      setUrlError(null);
    } catch (error: any) {
      setIsValidUrl(false);
      setUrlError(error);
      onError?.(error); // Report the error to the parent component
      console.error(`Invalid URL for ${platform}: ${url}`, error); // Log the error for debugging
    }
  }, [url, platform, onError]);

  // Render null if the URL is invalid to prevent broken links
  if (!isValidUrl) {
    return null;
  }

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isValidUrl && urlError) {
      event.preventDefault(); // Prevent navigation
      onError?.(urlError); // Re-trigger the error callback
      console.error(`Attempted navigation to invalid URL for ${platform}: ${url}`, urlError);
      return;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer" // Security best practice
      aria-label={ariaLabelText}
      title={ariaLabelText} // Added title for better UX
      className={className}
      onClick={handleClick}
    >
      {selectedIcon}
    </a>
  );
};

SocialMediaLink.defaultProps = {
  className: '',
  fallbackIcon: null,
};

export default SocialMediaLink;