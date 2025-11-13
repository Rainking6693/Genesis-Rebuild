import React, { useContext, useState } from 'react';
import { FeatureFlagsContext } from '../../contexts/FeatureFlagsContext';

interface Props {
  name?: string;
  fallbackContent?: string;
}

const defaultFallbackContent = 'Anonymous';

const FunctionalComponent: React.FC<Props> = ({ name = defaultFallbackContent, fallbackContent = defaultFallbackContent }) => {
  const { isFeatureEnabled } = useContext(FeatureFlagsContext);
  const [userName, setUserName] = useState(fallbackContent);

  React.useEffect(() => {
    if (isFeatureEnabled('wellness_content_personalization')) {
      setUserName(name);
    }
  }, [isFeatureEnabled, name]);

  const fallbackMessage = !isFeatureEnabled('wellness_content_personalization') ? 'Feature not available for you at the moment.' : undefined;

  return (
    <>
      {fallbackMessage && <h1>{fallbackMessage}</h1>}
      {isFeatureEnabled('wellness_content_personalization') && <h1>Hello, {userName}!</h1>}
    </>
  );
};

export default FunctionalComponent;

1. Added a default value for the `name` and `fallbackContent` props.
2. Moved the fallback message check outside the return statement for better readability.
3. Wrapped the return statement in a fragment (`<>...</>`) to avoid unnecessary wrapping of the JSX elements.
4. Made the component more accessible by providing a fallback message when the feature is not available.
5. Made the component more maintainable by adding default values for the props and using the `useEffect` hook to update the user name when the feature is enabled.