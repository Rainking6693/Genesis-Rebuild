import React, { PropsWithChildren, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle: string;
  content: string;
  className?: string; // Added a prop for custom classes
}

// Adding a utility function for generating SEO-friendly slugs
function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

// Adding a utility function for escaping HTML special characters
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.toString().replace(/[&<>"']/g, (match) => map[match]);
}

// Using the utility functions to generate a slug and escape HTML for the blog post content
const defaultProps: Props = {
  title: 'GreenShift Analytics: Transforming Environmental Compliance into a Profit Driver',
  subtitle: 'Learn how our AI-powered sustainability tracking platform helps small e-commerce businesses reduce their carbon footprint and turn green initiatives into competitive advantages.',
  content: `
    <p>
      At GreenShift Analytics, we understand that environmental compliance can often be seen as a cost center for small e-commerce businesses. That's why we've developed an AI-powered sustainability tracking platform that helps automate the calculation, reduction, and marketing of your carbon footprint.
    </p>

    <p>
      Our platform turns green initiatives into competitive advantages by providing automated sustainability reporting and customer-facing green badges. By doing so, you can transform environmental compliance from a cost center into a profit driver.
    </p>

    <p>
      Join us in our mission to make sustainability accessible and profitable for small e-commerce businesses everywhere.
    </p>
  `,
  className: 'blog-post', // Added a default class name for styling
};

// Adding a propTypes validation for the component
import propTypes from 'prop-types';

MyComponent.propTypes = {
  title: propTypes.string.isRequired,
  subtitle: propTypes.string.isRequired,
  content: propTypes.string.isRequired,
  className: propTypes.string,
};

// Adding a defaultProps for the component
MyComponent.defaultProps = defaultProps;

// Adding a wrapper for the content to handle edge cases and improve accessibility
const ContentWrapper = ({ children }: PropsWithChildren<{}>) => {
  // Check if children is a string or ReactNode
  if (typeof children !== 'string' && !React.isValidElement(children)) {
    throw new Error('ContentWrapper: Children must be a string or a valid ReactNode.');
  }

  // Escape HTML special characters
  const escapedContent = escapeHtml(children as ReactNode);

  return (
    <div
      // Add aria-label for screen readers
      aria-label="Blog post content"
    >
      <div dangerouslySetInnerHTML={{ __html: escapedContent }} />
    </div>
  );
};

// Using the ContentWrapper to wrap the content in the MyComponent
const MyComponent: React.FC<Props> = ({ title, subtitle, content, className }) => {
  return (
    <div className={className}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <ContentWrapper>{content}</ContentWrapper>
    </div>
  );
};

export default MyComponent;
export { generateSlug };

This version of the component includes type safety, improved ContentWrapper to handle potential risks, and added accessibility features like an aria-label for screen readers.