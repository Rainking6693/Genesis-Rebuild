import { FC, useState, useEffect } from 'react';
import { sanitizeHtml } from './utils';
import { CommunityContext } from './context';
import { memo } from 'react';

// Import required types
import { Community } from './community'; // Assuming Community type is defined here

// Use named exports for better modularity and easier code navigation
export { MyComponent, MemoizedMyComponent };

// Define MyComponent interface
interface MyComponentProps {
  message: string;
  community?: Community; // Add community type if available
}

// Define MyComponent state interface
interface MyComponentState {
  sanitizedMessage: string | null;
}

// Define MyComponent component
const MyComponent: FC<MyComponentProps> = (props: MyComponentProps) => {
  const [state, setState] = useState<MyComponentState>({ sanitizedMessage: null });

  useEffect(() => {
    const sanitizedMessage = sanitizeHtml(props.message);
    setState({ sanitizedMessage });
  }, [props.message]);

  if (!state.sanitizedMessage) {
    return (
      <div>
        {/* Add aria-live attribute for accessibility */}
        <div aria-live="assertive">Error: Invalid or malicious content detected</div>
      </div>
    );
  }

  return (
    <CommunityContext.Consumer>
      {({ community }) => (
        <div
          dangerouslySetInnerHTML={{
            __html: state.sanitizedMessage,
          }}
        />
      )}
    </CommunityContext.Consumer>
  );
};

// Add error handling and sanitization for user-generated content
MyComponent.defaultProps = {
  message: '',
};

MyComponent.errorComponent = () => (
  // Use a functional component for better performance
  () => (
    <div>
      {/* Add aria-live attribute for accessibility */}
      <div aria-live="assertive">Error: Invalid or malicious content detected</div>
    </div>
  )
);

// Use memoization for performance optimization
export const MemoizedMyComponent = memo(MyComponent);

Changes made:

1. Added `Community` type to the `community` prop.
2. Changed `sanitizedMessage` state type to `string | null` to handle cases where sanitization fails.
3. Added `aria-live` attribute to error messages for better accessibility.
4. Wrapped the error component in a functional component for better performance.
5. Added type annotations for props and state.
6. Imported only the required types.
7. Used named exports for better modularity and easier code navigation.