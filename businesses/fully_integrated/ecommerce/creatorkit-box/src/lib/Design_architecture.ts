import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLArticleElement>, HTMLArticleElement> {
  message: string;
}

const EcommerceBox: FC<Props> = ({ className, style, message, role, 'data-testid': dataTestId, ...rest }) => {
  return (
    <article className={className} style={style} role={role} data-testid={dataTestId} dangerouslySetInnerHTML={{ __html: message }} {...rest} />
  );
};

EcommerceBox.defaultProps = {
  className: '',
  style: {},
  message: '',
  role: 'alert',
};

EcommerceBox.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  message: PropTypes.string.isRequired,
  role: PropTypes.string,
  'data-testid': PropTypes.string,
};

export { EcommerceBox as default };
export { EcommerceBox };

In this updated code, I've used the `<article>` element for better accessibility, added a default `role` of 'alert' to help screen readers, and added a `data-testid` attribute for easier testing. I've also made the component more modular by exporting it as a named export and using a more descriptive component name.