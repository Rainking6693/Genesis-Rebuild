import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

type SocialMediaPlatform = 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'pinterest';

interface SocialMediaProps {
  platform: SocialMediaPlatform;
  url: string;
  iconSize?: number; // Optional: Size of the icon, defaults to 24
  ariaLabel?: string; // Optional: Accessibility label, defaults to "Share on [platform]"
  iconColor?: string; // Optional: Color of the icon, defaults to '#007bff'
  className?: string; // Optional: Additional CSS classes for the link
}

const platformIcons: { [key in SocialMediaPlatform]: string } = {
  facebook: 'fab fa-facebook', // Assuming Font Awesome or similar is used
  twitter: 'fab fa-twitter',
  linkedin: 'fab fa-linkedin',
  instagram: 'fab fa-instagram',
  youtube: 'fab fa-youtube',
  pinterest: 'fab fa-pinterest',
};

const SocialMediaLink: React.FC<SocialMediaProps> = ({
  platform,
  url,
  iconSize = 24,
  ariaLabel,
  iconColor = '#007bff',
  className,
}) => {
  const iconClass = platformIcons[platform];

  if (!iconClass) {
    console.error(`SocialMediaLink: Invalid platform "${platform}".  Consider adding it to the platformIcons object.`);
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel || `Share on ${platform} (Unsupported Icon)`}
        className={className}
      >
        {/* Fallback Icon or Message */}
        <span>{platform} (Icon Missing)</span>
      </a>
    );
  }

  const accessibleLabel = ariaLabel || `Share on ${platform}`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      // Add any custom analytics or event tracking here
      // Example: trackSocialShare(platform);
    } catch (error) {
      console.error("Error during click tracking:", error);
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer" // Security best practice for target="_blank"
      aria-label={accessibleLabel}
      className={className}
      onClick={handleClick}
    >
      <i className={`${iconClass} fa-lg`} style={{ fontSize: iconSize + 'px', color: iconColor }} aria-hidden="true"></i>
    </a>
  );
};

export default SocialMediaLink;

import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

type SocialMediaPlatform = 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'pinterest';

interface SocialMediaProps {
  platform: SocialMediaPlatform;
  url: string;
  iconSize?: number; // Optional: Size of the icon, defaults to 24
  ariaLabel?: string; // Optional: Accessibility label, defaults to "Share on [platform]"
  iconColor?: string; // Optional: Color of the icon, defaults to '#007bff'
  className?: string; // Optional: Additional CSS classes for the link
}

const platformIcons: { [key in SocialMediaPlatform]: string } = {
  facebook: 'fab fa-facebook', // Assuming Font Awesome or similar is used
  twitter: 'fab fa-twitter',
  linkedin: 'fab fa-linkedin',
  instagram: 'fab fa-instagram',
  youtube: 'fab fa-youtube',
  pinterest: 'fab fa-pinterest',
};

const SocialMediaLink: React.FC<SocialMediaProps> = ({
  platform,
  url,
  iconSize = 24,
  ariaLabel,
  iconColor = '#007bff',
  className,
}) => {
  const iconClass = platformIcons[platform];

  if (!iconClass) {
    console.error(`SocialMediaLink: Invalid platform "${platform}".  Consider adding it to the platformIcons object.`);
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel || `Share on ${platform} (Unsupported Icon)`}
        className={className}
      >
        {/* Fallback Icon or Message */}
        <span>{platform} (Icon Missing)</span>
      </a>
    );
  }

  const accessibleLabel = ariaLabel || `Share on ${platform}`;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      // Add any custom analytics or event tracking here
      // Example: trackSocialShare(platform);
    } catch (error) {
      console.error("Error during click tracking:", error);
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer" // Security best practice for target="_blank"
      aria-label={accessibleLabel}
      className={className}
      onClick={handleClick}
    >
      <i className={`${iconClass} fa-lg`} style={{ fontSize: iconSize + 'px', color: iconColor }} aria-hidden="true"></i>
    </a>
  );
};

export default SocialMediaLink;