import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define a type for the component's props
type GreetingProps = DetailedHTMLProps<HTMLHeadingElement, HTMLHeadingElement> & {
  name: string;
  className?: string; // Make className optional
};

// Add a namespace for better organization and maintainability
namespace ReturnSense {
  export const Greeting: FunctionComponent<GreetingProps> = ({ className, name, ...rest }) => {
    // Use a more semantic HTML element for accessibility
    const element = 'h1' as React.ElementType;

    // Add a role attribute for screen readers
    const headingRole = 'heading';

    // Add a default className for better encapsulation
    const greetingClass = `return-sense-greeting ${className || ''}`;

    // Handle edge cases where name is undefined or empty
    const formattedName = name ? `Welcome, ${name}!` : 'Welcome!';

    // Return the component with the updated properties
    return <element className={greetingClass} role={headingRole} {...rest}>{formattedName}</element>;
  };
}

// Export the component under the defined namespace for better encapsulation
export { ReturnSense.Greeting };

import React, { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define a type for the component's props
type GreetingProps = DetailedHTMLProps<HTMLHeadingElement, HTMLHeadingElement> & {
  name: string;
  className?: string; // Make className optional
};

// Add a namespace for better organization and maintainability
namespace ReturnSense {
  export const Greeting: FunctionComponent<GreetingProps> = ({ className, name, ...rest }) => {
    // Use a more semantic HTML element for accessibility
    const element = 'h1' as React.ElementType;

    // Add a role attribute for screen readers
    const headingRole = 'heading';

    // Add a default className for better encapsulation
    const greetingClass = `return-sense-greeting ${className || ''}`;

    // Handle edge cases where name is undefined or empty
    const formattedName = name ? `Welcome, ${name}!` : 'Welcome!';

    // Return the component with the updated properties
    return <element className={greetingClass} role={headingRole} {...rest}>{formattedName}</element>;
  };
}

// Export the component under the defined namespace for better encapsulation
export { ReturnSense.Greeting };