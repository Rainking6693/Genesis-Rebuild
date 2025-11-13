import React, { FC, ReactNode, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Optional, but good for runtime type checking in development

interface EmailMarketingProps {
  /**
   * The main title of the email section.  Should be short and descriptive.
   */
  title: string;
  /**
   * The main content of the email section.  Supports basic HTML.
   */
  content: string;
  /**
   * Optional CTA button. If provided, a button will be rendered below the content.
   */
  callToAction?: {
    label: string;
    url: string;
    accessibilityLabel?: string; // For screen readers
  };
  /**
   * Optional image to display.  Should be optimized for email clients.
   */
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /**
   * Optional children to render within the component.  Allows for more complex layouts.
   */
  children?: ReactNode;
  /**
   * Optional CSS class name to apply to the root element.
   */
  className?: string;
  /**
   *  Optional style overrides for the root element.
   */
  style?: React.CSSProperties;
  /**
   *  Flag to disable rendering if needed.  Useful for A/B testing or conditional content.
   */
  isEnabled?: boolean;
}

const EmailMarketing: FC<EmailMarketingProps> = ({
  title,
  content,
  callToAction,
  image,
  children,
  className,
  style,
  isEnabled = true,
}) => {
  const [isCtaClicked, setIsCtaClicked] = useState(false);

  useEffect(() => {
    // Clean up any analytics tracking or other side effects when the component is unmounted
    return () => {
      // Example: window.dataLayer.push({'event': 'cta_click_cleanup', 'cta_label': callToAction?.label, 'cta_url': callToAction?.url});
    };
  }, [callToAction?.label, callToAction?.url]);

  const handleCtaClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent default link behavior

    if (callToAction?.url) {
      // Basic analytics tracking (optional)
      try {
        // eslint-disable-next-line no-console
        console.log(`CTA Clicked: ${callToAction.label} - ${callToAction.url}`);
        // Example:  window.dataLayer.push({'event': 'cta_click', 'cta_label': callToAction.label, 'cta_url': callToAction.url});
        setIsCtaClicked(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error tracking CTA click:', error);
      }

      // Navigate to the CTA URL
      window.location.href = callToAction.url;
    }
  };

  if (!isEnabled) {
    return null; // Or a placeholder component if desired
  }

  return (
    <div className={`email-marketing ${className || ''}`} style={style}>
      {image && (
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }} // Responsive image
        />
      )}

      <h1 className="email-marketing__title" style={{ wordBreak: 'break-word' }}>{title}</h1>

      <div
        className="email-marketing__content"
        dangerouslySetInnerHTML={{ __html: content }} // Sanitize content if needed!
        style={{ wordBreak: 'break-word' }}
      />

      {callToAction && (
        <a
          href={callToAction.url}
          className={`email-marketing__cta ${isCtaClicked ? 'email-marketing__cta--clicked' : ''}`}
          onClick={handleCtaClick}
          aria-label={callToAction.accessibilityLabel || callToAction.label}
        >
          {callToAction.label}
        </a>
      )}

      {children}
    </div>
  );
};

EmailMarketing.propTypes = { // Optional:  Runtime type checking (development only)
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  callToAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    accessibilityLabel: PropTypes.string,
  }),
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  isEnabled: PropTypes.bool,
};

export default EmailMarketing;

import React, { FC, ReactNode, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Optional, but good for runtime type checking in development

interface EmailMarketingProps {
  /**
   * The main title of the email section.  Should be short and descriptive.
   */
  title: string;
  /**
   * The main content of the email section.  Supports basic HTML.
   */
  content: string;
  /**
   * Optional CTA button. If provided, a button will be rendered below the content.
   */
  callToAction?: {
    label: string;
    url: string;
    accessibilityLabel?: string; // For screen readers
  };
  /**
   * Optional image to display.  Should be optimized for email clients.
   */
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  /**
   * Optional children to render within the component.  Allows for more complex layouts.
   */
  children?: ReactNode;
  /**
   * Optional CSS class name to apply to the root element.
   */
  className?: string;
  /**
   *  Optional style overrides for the root element.
   */
  style?: React.CSSProperties;
  /**
   *  Flag to disable rendering if needed.  Useful for A/B testing or conditional content.
   */
  isEnabled?: boolean;
}

const EmailMarketing: FC<EmailMarketingProps> = ({
  title,
  content,
  callToAction,
  image,
  children,
  className,
  style,
  isEnabled = true,
}) => {
  const [isCtaClicked, setIsCtaClicked] = useState(false);

  useEffect(() => {
    // Clean up any analytics tracking or other side effects when the component is unmounted
    return () => {
      // Example: window.dataLayer.push({'event': 'cta_click_cleanup', 'cta_label': callToAction?.label, 'cta_url': callToAction?.url});
    };
  }, [callToAction?.label, callToAction?.url]);

  const handleCtaClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent default link behavior

    if (callToAction?.url) {
      // Basic analytics tracking (optional)
      try {
        // eslint-disable-next-line no-console
        console.log(`CTA Clicked: ${callToAction.label} - ${callToAction.url}`);
        // Example:  window.dataLayer.push({'event': 'cta_click', 'cta_label': callToAction.label, 'cta_url': callToAction.url});
        setIsCtaClicked(true);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error tracking CTA click:', error);
      }

      // Navigate to the CTA URL
      window.location.href = callToAction.url;
    }
  };

  if (!isEnabled) {
    return null; // Or a placeholder component if desired
  }

  return (
    <div className={`email-marketing ${className || ''}`} style={style}>
      {image && (
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }} // Responsive image
        />
      )}

      <h1 className="email-marketing__title" style={{ wordBreak: 'break-word' }}>{title}</h1>

      <div
        className="email-marketing__content"
        dangerouslySetInnerHTML={{ __html: content }} // Sanitize content if needed!
        style={{ wordBreak: 'break-word' }}
      />

      {callToAction && (
        <a
          href={callToAction.url}
          className={`email-marketing__cta ${isCtaClicked ? 'email-marketing__cta--clicked' : ''}`}
          onClick={handleCtaClick}
          aria-label={callToAction.accessibilityLabel || callToAction.label}
        >
          {callToAction.label}
        </a>
      )}

      {children}
    </div>
  );
};

EmailMarketing.propTypes = { // Optional:  Runtime type checking (development only)
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  callToAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    accessibilityLabel: PropTypes.string,
  }),
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  isEnabled: PropTypes.bool,
};

export default EmailMarketing;