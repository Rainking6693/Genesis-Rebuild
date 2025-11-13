import React, { ReactNode, useMemo } from 'react';

interface StripeCardProps {
  title: string;
  content: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const StripeCard: React.FC<StripeCardProps> = ({
  title,
  content,
  className = 'stripe-card',
  'aria-label': ariaLabel,
}) => {
  // Memoize the class names to avoid unnecessary re-renders
  const classNames = useMemo(() => {
    const baseClassName = 'stripe-card';
    const titleClassName = `${baseClassName}__title`;
    const contentClassName = `${baseClassName}__content`;

    return {
      base: className || baseClassName,
      title: titleClassName,
      content: contentClassName,
    };
  }, [className]);

  // Ensure the content is not null or undefined
  const safeContent = useMemo(() => content || null, [content]);

  return (
    <div className={classNames.base} aria-label={ariaLabel}>
      <h2 className={classNames.title}>{title}</h2>
      <div className={classNames.content}>{safeContent}</div>
    </div>
  );
};

export default StripeCard;

import React, { ReactNode, useMemo } from 'react';

interface StripeCardProps {
  title: string;
  content: ReactNode;
  className?: string;
  'aria-label'?: string;
}

const StripeCard: React.FC<StripeCardProps> = ({
  title,
  content,
  className = 'stripe-card',
  'aria-label': ariaLabel,
}) => {
  // Memoize the class names to avoid unnecessary re-renders
  const classNames = useMemo(() => {
    const baseClassName = 'stripe-card';
    const titleClassName = `${baseClassName}__title`;
    const contentClassName = `${baseClassName}__content`;

    return {
      base: className || baseClassName,
      title: titleClassName,
      content: contentClassName,
    };
  }, [className]);

  // Ensure the content is not null or undefined
  const safeContent = useMemo(() => content || null, [content]);

  return (
    <div className={classNames.base} aria-label={ariaLabel}>
      <h2 className={classNames.title}>{title}</h2>
      <div className={classNames.content}>{safeContent}</div>
    </div>
  );
};

export default StripeCard;