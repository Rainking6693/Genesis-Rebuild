import React from 'react';

interface MessageProps {
  message: string;
  isHidden?: boolean;
  testId?: string;
  className?: string;
  hiddenMessageClassName?: string;
}

const MessageWrapper = ({ children, isHidden, hiddenMessageClassName }) => {
  if (isHidden) {
    return (
      <div className={`hidden ${hiddenMessageClassName || ''}`}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

const MessageWithDefaults: React.FC<MessageProps> = ({ message, isHidden = false, testId = 'message', className, hiddenMessageClassName }) => {
  return (
    <MessageWrapper isHidden={isHidden} hiddenMessageClassName={hiddenMessageClassName}>
      <div data-testid={testId} role="alert" className={className}>
        {message}
      </div>
    </MessageWrapper>
  );
};

export { MessageWithDefaults as Message };

// GreenTrackProFeatureFlags.tsx
import React from 'react';
import { Message } from './Message';

const GreenTrackProFeatureFlags = () => {
  const message = 'Welcome to GreenTrack Pro, your AI-powered sustainability tracking platform.';
  return <Message message={message} />;
};

export default GreenTrackProFeatureFlags;

// MyComponent.tsx
import React from 'react';
import { Message } from './Message';

const MyComponent = () => {
  return (
    <div>
      <Message message="Welcome to my component!" testId="my-component-message" className="my-custom-class" hiddenMessageClassName="hidden-message" />
    </div>
  );
};

export default MyComponent;

Now, you can use the `Message` component in your application wherever needed:

// App.tsx
import React from 'react';
import { Message } from './Message';

const App = () => {
  return (
    <div>
      <h1>My Application</h1>
      <Message message="Welcome to my application!" />
    </div>
  );
};

export default App;