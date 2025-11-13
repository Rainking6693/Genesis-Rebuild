import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
}

const ErrorComponent: FC<Props> = ({ errorMessage }) => {
  return (
    <div className="error-message" role="alert">
      {errorMessage}
    </div>
  );
};

// Add a custom error boundary component to handle errors at the component tree level
class CustomErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean } {
    // Log the error to an error reporting service
    // ...
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props, prevState: { hasError: boolean }) {
    if (prevState.hasError && !this.state.hasError) {
      // Clear any error message after it has been resolved
      this.clearErrorMessage();
    }
  }

  clearErrorMessage = () => {
    // Clear error message after a short delay to prevent flash of error
    setTimeout(() => {
      this.setState({ hasError: false });
    }, 5000);
  };

  render() {
    if (this.state.hasError) {
      // Render the error component
      return <ErrorComponent errorMessage="An error occurred. Please contact support." />;
    }

    // Otherwise, render children components
    const childrenWithErrorHandling = React.Children.map(this.props.children, (child: ReactNode) =>
      React.cloneElement(child as React.ReactElement<any>, {
        errorMessage: '', // Clear error message for child components
      })
    );

    return (
      <>
        {childrenWithErrorHandling}
        {this.state.hasError && <ErrorComponent errorMessage="" />}
      </>
    );
  }
}

// Wrap the MyComponent with the custom error boundary component
const MyComponentWrapped = (props: Props) => (
  <CustomErrorBoundary>
    <MyComponent {...props} />
  </CustomErrorBoundary>
);

export default MyComponentWrapped;

1. Added a `getDerivedStateFromError` lifecycle method to handle errors more efficiently.
2. Moved the `clearErrorMessage` method to the `CustomErrorBoundary` component for better organization.
3. Added a `componentDidUpdate` lifecycle method to clear the error message when it has been resolved.
4. Cloned the children components and passed an empty `errorMessage` prop to them to prevent them from showing their own error messages when wrapped in the `CustomErrorBoundary`.
5. Rendered the error component conditionally after the children components to ensure that it only appears when an error has occurred.
6. Added type annotations for props and children.
7. Updated the `MyComponentWrapped` function to accept props and pass them to the wrapped `MyComponent`.