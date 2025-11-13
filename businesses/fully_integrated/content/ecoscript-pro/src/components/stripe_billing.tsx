import React, { FC, PropsWithChildren, ReactNode } from 'react';
import { sanitizeHtml } from 'dangerously-set-html-content-editable';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';

const StripeBillingMessage: FC<PropsWithChildren<{ message?: string }>> = ({ message = 'No billing message provided', children }) => {
  const COMPONENT_NAME = 'StripeBillingMessage';

  const sanitizedMessage = sanitizeHtml(message);

  const containerStyles = css`
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.5;
  `;

  return (
    <div data-testid={COMPONENT_NAME} data-name={COMPONENT_NAME} aria-label="Stripe Billing Message" key={COMPONENT_NAME}>
      {children && (
        <div className={containerStyles} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
      {children && <div dangerouslySetInnerHTML={{ __html: children }} />}
    </div>
  );
};

StripeBillingMessage.propTypes = {
  message: PropTypes.string,
};

export default StripeBillingMessage;

import React, { FC, PropsWithChildren, ReactNode } from 'react';
import { sanitizeHtml } from 'dangerously-set-html-content-editable';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';

const StripeBillingMessage: FC<PropsWithChildren<{ message?: string }>> = ({ message = 'No billing message provided', children }) => {
  const COMPONENT_NAME = 'StripeBillingMessage';

  const sanitizedMessage = sanitizeHtml(message);

  const containerStyles = css`
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.5;
  `;

  return (
    <div data-testid={COMPONENT_NAME} data-name={COMPONENT_NAME} aria-label="Stripe Billing Message" key={COMPONENT_NAME}>
      {children && (
        <div className={containerStyles} dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      )}
      {children && <div dangerouslySetInnerHTML={{ __html: children }} />}
    </div>
  );
};

StripeBillingMessage.propTypes = {
  message: PropTypes.string,
};

export default StripeBillingMessage;