import React, { FC, ReactNode } from 'react';
import { StressLensAI } from '../../../constants';

type Props = {
  subject: string;
  message: string;
  descriptionId?: string; // Adding a prop for a description ID for accessibility
  className?: string; // Adding a prop for custom classes
};

const FunctionalComponent: FC<Props> = ({ subject, message, descriptionId, className }) => {
  // Adding a default value for the className prop and checking for null or undefined values
  const classes = className ?? '';

  // Adding a default value for the descriptionId prop and checking for null or undefined values
  const descriptionIdValue = descriptionId ?? '';

  // Adding a role attribute for accessibility
  return (
    <div className={classes} role="article" aria-describedby={descriptionIdValue}>
      <h1 id={descriptionIdValue}>{subject}</h1>
      <p>{message}</p>
      <p>Powered by {StressLensAI}</p>
    </div>
  );
};

// Adding a type for the StressLensAI constant for better type safety
type StressLensAI = 'StressLens AI';

export default FunctionalComponent;

In this code, I've added a `descriptionId` prop to provide a unique ID for the `h1` element, which can be used as the `aria-describedby` value. This helps screen readers provide a more meaningful context for the heading. I've also added null checks for the `className` and `descriptionId` props to ensure that the component behaves correctly when these props are not provided.