import React, { useEffect, useState } from 'react';
import { useFeatureFlags, IFeatureFlagsContext } from '@genesis/feature-flags';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage }) => {
  const { isLoading, showFeature } = useFeatureFlags<boolean>('communityPulseContentRecommendations', false);
  const [isFeatureLoaded, setIsFeatureLoaded] = useState(false);

  useEffect(() => {
    if (!showFeature && fallbackMessage) {
      // Log the fallback message for debugging purposes
      console.warn(`Feature 'communityPulseContentRecommendations' is disabled. Using fallback message: ${fallbackMessage}`);
    }
    setIsFeatureLoaded(true);
  }, [showFeature, fallbackMessage]);

  if (isLoading && !isFeatureLoaded) {
    return <div>Loading...</div>;
  }

  if (!showFeature && !fallbackMessage) {
    return <div>This feature is currently disabled. Please check back later.</div>;
  }

  return <div>{showFeature ? message : fallbackMessage}</div>;
};

MyComponent.defaultProps = {
  fallbackMessage: 'This feature is currently disabled. Please check back later.',
};

export default MyComponent;

Changes made:

1. Added a default value for `showFeature` in the `useFeatureFlags` call to handle cases where the feature flag is not found.
2. Added a state variable `isFeatureLoaded` to handle cases where the feature flag is still loading.
3. Updated the fallback message when the feature is disabled to be more accessible and informative.
4. Added a default props for the `fallbackMessage`.
5. Improved maintainability by adding more error handling and providing a more flexible component.