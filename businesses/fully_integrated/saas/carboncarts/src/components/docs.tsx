import React, { FC } from 'react';
import { CarbonCartsBranding } from '../../branding';

type CarbonCartsBrandingType = {
  primaryColor: string;
};

interface Props {
  title: string;
  subtitle: string;
  message: string;
  branding?: CarbonCartsBrandingType;
}

const MyComponent: FC<Props> = ({ title, subtitle, message, branding }) => {
  const primaryColor = branding ? branding.primaryColor : '#000';

  return (
    <div>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div>{message}</div>
      <div>
        <strong style={{ color: primaryColor }}>Powered by CarbonCarts</strong>
      </div>
      {/* Add ARIA attributes for accessibility */}
      <div aria-label="Powered by CarbonCarts">
        <img
          src="/carbons-logo.svg"
          alt="CarbonCarts logo"
          width="100"
          height="30"
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
};

MyComponent.defaultProps = {
  branding: {
    primaryColor: '#000',
  },
};

export default MyComponent;

In this updated code, I've added a `branding` prop to the component, which allows for customization of the primary color. I've also added a default prop for `branding` in case it's not provided. Additionally, I've added a `style={{ objectFit: 'contain' }}` to the logo image to ensure it maintains its aspect ratio.