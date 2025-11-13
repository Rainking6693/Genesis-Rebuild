import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  id: string;
  role?: string;
  ariaLabel: string;
  className?: string;
  title?: string;
  subject?: string;
  message?: string;
  errorMessage?: string;
}

const MyEmailComponent: FC<Props> = ({
  id,
  role,
  ariaLabel,
  className,
  title,
  subject,
  message,
  errorMessage,
  ...rest
}) => {
  if (!subject || !message) {
    return (
      <div {...rest} aria-label={ariaLabel}>
        {errorMessage || 'Error: Subject or message is missing.'}
      </div>
    );
  }

  return (
    <div
      id={id}
      role={role}
      aria-label={ariaLabel}
      className={className}
      title={title}
      style={{ maxWidth: '100%', maxHeight: '500px', overflow: 'auto', ...rest.style }}
      tabIndex={0}
    >
      <h2 id={`${id}-subject`} title={title || subject}>
        {subject}
      </h2>
      <div id={`${id}-message`}>{message}</div>
    </div>
  );
};

export default MyEmailComponent;

In this updated code, I've added the `errorMessage` prop to provide a more flexible error message. I've also extended the `Props` interface with `DetailedHTMLProps` to include common HTML attributes for better maintainability. Additionally, I've separated the style object from the `rest` props to make it more readable.