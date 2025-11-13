import React, { PropsWithChildren, DefaultHTMLProps, DetailedHTMLProps } from 'react';
import { sanitizeUserInput } from '../../utils/security';

type CustomDivProps = Omit<DefaultHTMLProps<HTMLDivElement>, keyof DetailedHTMLProps<HTMLDivElement, HTMLDivElement>>;

interface Props extends CustomDivProps {
  subject?: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ subject = 'ClimateCommit Sustainability Update', children, ...rest }) => {
  const sanitizedMessage = sanitizeUserInput(children);

  // Add aria-label for accessibility
  const divProps: Props = {
    ...(subject && { 'aria-label': subject }),
    dangerouslySetInnerHTML: { __html: sanitizedMessage },
    ...rest,
  };

  return <div {...divProps} />;
};

export default FunctionalComponent;

import React, { PropsWithChildren, DefaultHTMLProps, DetailedHTMLProps } from 'react';
import { sanitizeUserInput } from '../../utils/security';

type CustomDivProps = Omit<DefaultHTMLProps<HTMLDivElement>, keyof DetailedHTMLProps<HTMLDivElement, HTMLDivElement>>;

interface Props extends CustomDivProps {
  subject?: string;
  message: string;
}

const FunctionalComponent: React.FC<Props> = ({ subject = 'ClimateCommit Sustainability Update', children, ...rest }) => {
  const sanitizedMessage = sanitizeUserInput(children);

  // Add aria-label for accessibility
  const divProps: Props = {
    ...(subject && { 'aria-label': subject }),
    dangerouslySetInnerHTML: { __html: sanitizedMessage },
    ...rest,
  };

  return <div {...divProps} />;
};

export default FunctionalComponent;