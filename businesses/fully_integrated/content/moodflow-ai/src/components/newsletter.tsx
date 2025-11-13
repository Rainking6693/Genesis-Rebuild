import React, { PropsWithChildren } from 'react';

interface Props {
  subject: string;
  message: string;
  callToAction?: string;
  className?: string;
  dataTestid?: string;
}

const MyComponent: React.FC<Props> = ({
  subject,
  message,
  callToAction = 'Click here for more resources',
  children,
  className,
  dataTestid,
}) => {
  if (!children) {
    children = (
      <>
        <p>{message}</p>
        {callToAction && <p>{callToAction}</p>}
      </>
    );
  }

  return (
    <div data-testid={dataTestid}>
      <h2 aria-label="Newsletter title" role="heading" className={className}>
        {subject}
      </h2>
      {children}
    </div>
  );
};

export default MyComponent;

In this updated version, I've added type checking for the `children` prop and handled the case when it's not provided. I've also added a `className` prop to allow for custom styling and a `data-testid` attribute for easier testing. Lastly, I've added a `role` attribute to the `h2` element for better accessibility.