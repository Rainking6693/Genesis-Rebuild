import React, { FC, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { isEmpty } from 'lodash';

interface Props {
  businessName: string; // Use a more descriptive variable name to align with the business context
  defaultTitle: string;
  defaultDescription: string;
}

const DEFAULT_TITLE = 'Welcome to EcoScript Pro';
const DEFAULT_DESCRIPTION = 'EcoScript Pro helps businesses create climate-conscious marketing copy and build customer trust through verified sustainability claims.';

const EcoScriptProDashboard: FC<Props> = ({ businessName, defaultTitle, defaultDescription }) => {
  // Check if businessName is empty and return a fallback message
  const fallbackMessage = isEmpty(businessName) ? 'Anonymous User' : businessName;

  return (
    <>
      {/* Wrap JSX with a <> tag to improve accessibility */}
      <Helmet>
        {/* Set default SEO values */}
        <title>{defaultTitle}</title>
        <meta name="description" content={defaultDescription} />
      </Helmet>
      <h1>Welcome to EcoScript Pro, {fallbackMessage}!</h1>
    </>
  );
};

// Use Helmet to set title and meta tags for better SEO and user experience
// Default values are provided for better maintainability
EcoScriptProDashboard.defaultProps = {
  defaultTitle: DEFAULT_TITLE,
  defaultDescription: DEFAULT_DESCRIPTION,
};

export default EcoScriptProDashboard;

In this updated code, I've added default props for the title and description to make the component more maintainable. I've also separated the default SEO values from the dynamic ones, making it easier to update the default values without affecting the dynamic ones. Additionally, I've added a `defaultProps` object to set default values for the `defaultTitle` and `defaultDescription` props. Lastly, I've added a `defaultTitle` and `defaultDescription` to the Helmet component, so it doesn't break if the `businessName` prop is not provided.