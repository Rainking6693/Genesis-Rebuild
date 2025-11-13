import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
  componentName?: string;
}

const COMPONENT_NAME = 'SocialMediaPost';

const SocialMediaPost: FC<Props> = ({ componentName = COMPONENT_NAME, message, children, ...rest }) => {
  // Add support for additional props and children
  return (
    <div className={`social-media-post ${componentName}`} {...rest}>
      {message && <div>{message}</div>}
      {children}
    </div>
  );
};

const SocialMediaPostWithName: FC<Props> = ({ componentName = COMPONENT_NAME, message, children, ...rest }) => {
  return <SocialMediaPost componentName={componentName} message={message} children={children} {...rest} />;
};

// Export the default and named export for flexibility in usage
export { SocialMediaPost, SocialMediaPostWithName };

// Add a linting rule to enforce consistent naming for components
// e.g., `npm install eslint-plugin-react-naming-convention` and add to .eslintrc.json:
// {
//   "rules": {
//     "react-naming-convention/component-class-name-casing": ["error", { "componentClassName": "PascalCase" }]
//   }
// }

import React, { FC, ReactNode } from 'react';

interface Props {
  message: string;
  children?: ReactNode;
  componentName?: string;
}

const COMPONENT_NAME = 'SocialMediaPost';

const SocialMediaPost: FC<Props> = ({ componentName = COMPONENT_NAME, message, children, ...rest }) => {
  // Add support for additional props and children
  return (
    <div className={`social-media-post ${componentName}`} {...rest}>
      {message && <div>{message}</div>}
      {children}
    </div>
  );
};

const SocialMediaPostWithName: FC<Props> = ({ componentName = COMPONENT_NAME, message, children, ...rest }) => {
  return <SocialMediaPost componentName={componentName} message={message} children={children} {...rest} />;
};

// Export the default and named export for flexibility in usage
export { SocialMediaPost, SocialMediaPostWithName };

// Add a linting rule to enforce consistent naming for components
// e.g., `npm install eslint-plugin-react-naming-convention` and add to .eslintrc.json:
// {
//   "rules": {
//     "react-naming-convention/component-class-name-casing": ["error", { "componentClassName": "PascalCase" }]
//   }
// }