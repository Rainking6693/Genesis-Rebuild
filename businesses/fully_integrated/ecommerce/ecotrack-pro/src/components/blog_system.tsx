import React, { PropsWithChildren } from 'react';
import { EcoTrackProBrand } from '../../branding'; // Import EcoTrackPro branding for consistent messaging

type BlogPostProps = PropsWithChildren<{
  title: string; // Use descriptive variable names for clarity
  subtitle?: string; // Add optional subtitle for flexibility
}> & Partial<Pick<BlogPostProps, 'title'>>; // Add type check for title prop

const defaultProps: BlogPostProps = {
  title: '', // Provide a default value for title
  subtitle: '',
};

const BlogPost: React.FC<BlogPostProps> = ({ title, subtitle, children }) => {
  // Use React.useMemo to memoize the subtitle element to prevent unnecessary re-renders
  const memoizedSubtitle = React.useMemo(() => (subtitle ? <p>{subtitle}</p> : null), [subtitle]);

  // Check if title is provided to prevent potential errors
  if (!title) {
    return <div>Title is required</div>;
  }

  return (
    <div>
      <h1>{title}</h1>
      {memoizedSubtitle}
      <EcoTrackProBrand /> {/* Include EcoTrackPro branding in each blog post for brand consistency */}
      {children} // Add support for additional children elements
    </div>
  );
};

// Spread defaultProps into the component to provide default values for optional props
BlogPost.defaultProps = defaultProps;

// Add aria-label to EcoTrackProBrand for accessibility
BlogPost.EcoTrackProBrand = React.forwardRef((_, ref) => (
  <EcoTrackProBrand ref={ref} aria-label="EcoTrackPro Brand" />
));

export default BlogPost;

This version of the BlogPost component includes checks for the presence of the title prop, a default value for the title prop, and an aria-label for the EcoTrackProBrand for better accessibility. It also ensures that the subtitle element is only rendered when it is provided, improving performance.