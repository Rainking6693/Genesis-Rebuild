import React from 'react';
import { forwardRef } from 'react';

type UserName = string;

interface Props {
  userName: UserName;
}

const EcoFriendlyGreeting: React.ForwardRefRenderFunction<HTMLHeadingElement, Props> = (
  { userName },
  ref
) => {
  return (
    <h1 ref={ref} aria-label="Eco-friendly greeting">
      Welcome, {userName}! Your eco-friendly journey starts here!
    </h1>
  );
};

export default forwardRef(EcoFriendlyGreeting);

// EcoSpendTracker/components/EcoFriendlyGreeting.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import EcoFriendlyGreeting from './EcoFriendlyGreeting';

describe('EcoFriendlyGreeting', () => {
  it('renders the correct greeting', () => {
    const { getByText } = render(<EcoFriendlyGreeting userName="John Doe" />);
    expect(getByText(/Welcome, John Doe/i)).toBeInTheDocument();
  });

  it('handles empty user names', () => {
    const { getByText } = render(<EcoFriendlyGreeting userName="" />);
    expect(getByText(/Welcome,/i)).toBeInTheDocument();
  });

  it('has an aria-label', () => {
    const { getByRole } = render(<EcoFriendlyGreeting userName="John Doe" />);
    const greeting = getByRole('heading');
    expect(greeting).toHaveAttribute('aria-label', 'Eco-friendly greeting');
  });
});

In the updated component, we've used the `forwardRef` function to provide a ref to the `h1` element, which can be useful for testing or for accessibility purposes. We've also added an `aria-label` attribute to improve accessibility.

In the tests, we've added a test for handling empty user names and a test to ensure the `aria-label` attribute is present. This helps ensure that the component is more resilient, covers edge cases, and is more accessible.