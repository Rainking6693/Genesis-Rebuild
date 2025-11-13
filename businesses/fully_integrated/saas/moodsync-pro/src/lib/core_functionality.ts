import React, { FC, ReactNode } from 'react';

// Interface for props
interface Props {
  children?: string; // Changed children to string for better error handling
  label?: string;
}

// Named export for better readability and maintainability
export const MyComponent: FC<Props> = ({ children, label }) => {
  if (!children || !children.trim()) {
    throw new Error('Children prop must be a non-empty string.');
  }

  return (
    <div role="presentation">
      {label && <div role="label">{label}</div>}
      <div>{children}</div>
    </div>
  );
};

// Default props
MyComponent.defaultProps = {
  children: 'Default message',
  label: undefined,
};

// Linting configuration using eslint-plugin-react for TypeScript
const eslintConfig = {
  "parser": "@typescript-eslint/parser",
  "plugins": ["react", "@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint"
  ],
  "rules": {
    // Add your custom rules here
  }
};

// Save the eslint configuration to .eslintrc.json
module.exports = eslintConfig;