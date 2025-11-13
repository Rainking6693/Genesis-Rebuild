import * as React from 'react';
import PropTypes from 'prop-types';
import is from 'react-is';

// Move common props interface to a separate file for better organization
// (e.g., Props.ts)
import { Props as CommonProps } from './Props';

// Define a new interface for our specific component's props
interface SustainabilityImpactStoryProps extends CommonProps {
  // Add a new property for the story's title
  title: string;
}

// Define the functional component
const SustainabilityImpactStory: React.FC<SustainabilityImpactStoryProps> = ({ title, message }) => {
  // Add a unique id for accessibility purposes
  const id = `sustainability-impact-story-${title.toLowerCase().replace(/\W+/g, '-')}`;

  // Add a heading for the story title with a role attribute for better accessibility
  return (
    <div>
      <h2 id={id} role="heading" aria-level={2}>{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

// Add error handling and validation for props
SustainabilityImpactStory.defaultProps = {
  title: '',
  message: '',
};

SustainabilityImpactStory.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
};

// Add comments for better readability and maintainability
// (e.g., // Component generates personalized sustainability impact stories)

// Use 'react-is' for strict prop type checking
SustainabilityImpactStory.propTypes = {
  ...SustainabilityImpactStory.propTypes,
  title: is.elementType(title) ? PropTypes.elementType : PropTypes.string,
  message: is.elementType(message) ? PropTypes.elementType : PropTypes.string,
};

export default SustainabilityImpactStory;