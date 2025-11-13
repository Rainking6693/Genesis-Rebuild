import React, { FC, DefaultHTMLProps, ReactNode } from 'react';
import DOMPurify from 'dompurify';

interface Props extends DefaultHTMLProps<HTMLDivElement> {
  message: string;
}

type RestProps = Omit<DefaultHTMLProps<HTMLDivElement>, keyof Props>;

type FunctionalComponentReturnType = React.ReactElement<Props>;

type ValidateMessageReturnType = string;

const validateMessage = (message: string): ValidateMessageReturnType => {
  try {
    return DOMPurify.sanitize(message);
  } catch (error) {
    console.error('Invalid message:', error);
    return '';
  }
};

const FunctionalComponent: FC<Props> = ({ message, ...rest }: Props & RestProps) => {
  if (!message.trim()) return null;

  const ariaLabel = 'Ecommerce message';
  const validatedMessage = validateMessage(message);

  return <div {...rest} dangerouslySetInnerHTML={{ __html: validatedMessage }} aria-label={ariaLabel} />;
};

FunctionalComponent.defaultProps = {
  message: validateMessage('Welcome to ClimateScore Pro'),
} as Props;

interface ComponentDefaultProps extends Props {
  // Add any additional defaultProps here
}

export type DefaultProps = ComponentDefaultProps;

export { FunctionalComponent, DefaultProps };

In this updated code, I added error handling for invalid messages, checked for empty messages, and added types for the `rest` props, the `FunctionalComponent` return value, the `validateMessage` function return value, and the `ComponentDefaultProps`. This makes the component more resilient, handles edge cases, and is more maintainable.