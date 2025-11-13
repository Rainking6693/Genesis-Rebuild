import React, { FC, createContext, useContext } from 'react';

/**
 * FeatureFlagProps: The props for the FeatureFlagComponent.
 *
 * @typedef {Object} FeatureFlagProps
 * @property {string} id - The unique identifier for the feature flag.
 */

/**
 * FeatureFlagContext: The context for managing feature flags.
 *
 * @typedef {Object} FeatureFlagContext
 * @property {boolean} isEnabled - Whether the feature flag is enabled or not.
 * @property {(id: string) => void} toggleFeatureFlag - A function to toggle the feature flag.
 */

/**
 * FeatureFlagComponent: A React functional component that displays a message based on the provided feature flag id.
 *
 * @param {FeatureFlagProps} props - The props for the FeatureFlagComponent.
 * @returns {JSX.Element} A JSX element containing the message or null if the feature flag is not enabled.
 */
const FeatureFlagComponent: FC<FeatureFlagProps> = ({ id }) => {
  const { isEnabled, toggleFeatureFlag } = useContext(FeatureFlagContext);

  const handleToggle = () => {
    toggleFeatureFlag(id);
  };

  if (!isEnabled) {
    return (
      <div>
        <button onClick={handleToggle}>Toggle Feature Flag {id}</button>
        {/* Add aria-hidden="true" to the div if the message is not intended for screen readers */}
        <div aria-hidden="true">Message (Disabled)</div>
      </div>
    );
  }

  return (
    <div>
      {/* Add aria-hidden="false" to the div if the message is intended for screen readers */}
      <div aria-hidden="false">Message</div>
    </div>
  );
};

/**
 * FeatureFlagProvider: A higher-order component that provides the FeatureFlagContext.
 *
 * @param {FC} WrappedComponent - The component to wrap with the FeatureFlagContext.
 * @returns {FC} The wrapped component with the FeatureFlagContext.
 */
const FeatureFlagProvider = (WrappedComponent) => {
  const [featureFlags, setFeatureFlags] = React.useState({});

  const toggleFeatureFlag = (id: string) => {
    setFeatureFlags((prevFlags) => ({ ...prevFlags, [id]: !prevFlags[id] }));
  };

  const isEnabled = (id: string) => featureFlags[id] || false;

  return (props) => (
    <FeatureFlagContext.Provider value={{ isEnabled, toggleFeatureFlag }}>
      <WrappedComponent {...props} />
    </FeatureFlagContext.Provider>
  );
};

// Create the FeatureFlagContext
export const FeatureFlagContext = createContext({});

// Export the FeatureFlagProvider and the FeatureFlagComponent
export { FeatureFlagProvider, FeatureFlagComponent };

In this updated version, I've added a `toggleFeatureFlag` function to the `FeatureFlagContext` to allow users to enable or disable feature flags dynamically. I've also added a button to toggle the feature flag in the `FeatureFlagComponent` and made the component more accessible by adding `aria-hidden` attributes to the message divs based on whether the feature flag is enabled or disabled. Lastly, I've made the component more maintainable by storing the feature flags in a state and creating a helper function `isEnabled` to check if a feature flag is enabled or not. The `FeatureFlagProvider` is used to wrap the component and provide the context.