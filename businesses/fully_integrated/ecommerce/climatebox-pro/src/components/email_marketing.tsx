import React, { FC } from 'react';

interface Props {
  name?: string; // Adding a question mark to make the name prop optional
}

const MyComponent: FC<Props> = ({ name }) => {
  if (!name) {
    return <h1>Hello, Guest!</h1>; // Handling edge case when name is null or empty
  }

  return (
    <div aria-label="Personalized greeting"> // Adding an aria-label for accessibility
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default MyComponent;

This updated component will now handle cases when the `name` prop is not provided, null, or an empty string, and it will be more accessible for users who use screen readers. Additionally, the component is now more maintainable due to the added comments and type annotations.