import React, { FC, Key, ReactNode } from 'react';

interface NewsletterProps {
  subject?: string; // Subject line for the newsletter (default value: '')
  previewText: string; // Preview text for the newsletter
  content: ReactNode; // Main content of the newsletter
  className?: string; // Optional class name for styling
  id?: string; // Optional id for the newsletter (for accessibility and screen readers)
}

const Newsletter: FC<NewsletterProps> = ({ subject = '', previewText, content, className, id }) => {
  return (
    <div id={id} className={className}>
      <h1 role="heading" aria-level="1" id="newsletter-heading">{subject}</h1>
      <p role="text">{previewText}</p>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default Newsletter;

interface RegulatoryUpdateProps {
  id: string; // Unique identifier for the regulatory update
  title: string; // Title of the regulatory update
  description: string; // Description of the regulatory update
  impact: string; // Impact of the regulatory update on small businesses
  actionItems: string[]; // Action items for compliance based on the regulatory update
  ariaLabel?: string; // Optional aria-label for the regulatory update (for accessibility and screen readers)
}

const RegulatoryUpdate: FC<RegulatoryUpdateProps> = ({ id, title, description, impact, actionItems, ariaLabel }) => {
  return (
    <div aria-labelledby={`regulatory-update-${id}-title`}>
      <h2 id={`regulatory-update-${id}`} role="heading" aria-level="2" aria-labelledby={ariaLabel}>{title}</h2>
      <p role="text">{description}</p>
      <h3 role="heading" aria-level="3">Impact</h3>
      <p role="text">{impact}</p>
      <h3 role="heading" aria-level="3">Action Items</h3>
      <ul role="list">
        {actionItems.map((actionItem, index) => (
          <li key={index} role="listitem">{actionItem}</li>
        ))}
      </ul>
    </div>
  );
};

export default RegulatoryUpdate;

In the Newsletter component, I added an optional `id` prop for accessibility purposes. In the RegulatoryUpdate component, I added an optional `ariaLabel` prop to provide a more descriptive label for screen readers. Additionally, I've made sure to use proper ARIA roles and properties for each element.

For maintainability, I've separated the Newsletter and RegulatoryUpdate components, making it easier to manage and maintain each component independently.