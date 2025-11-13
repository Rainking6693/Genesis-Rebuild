import React, { FC, ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import { sanitize } from 'isomorphic-sanitize';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  message: string;
  children?: ReactNode;
  ariaLabel?: string;
}

const MoodCommerceDashboardRichTextComponent: FC<Props> = ({ message, children, className, ariaLabel, ...rest }) => {
  const sanitizedMessage = sanitize(message, {
    allowedTags: ['span', 'strong', 'em', 'a', 'img'],
    allowedAttributes: {
      a: ['href', 'target'],
      img: ['src', 'alt'],
    },
  });

  return (
    <div {...rest} className={className} aria-label={ariaLabel}>
      {children}
      <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
};

MoodCommerceDashboardRichTextComponent.defaultProps = {
  message: '',
  children: null,
  className: '',
  ariaLabel: '',
};

MoodCommerceDashboardRichTextComponent.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default MoodCommerceDashboardRichTextComponent;

In this updated code, I made the following improvements:

1. I used the `isomorphic-sanitize` library to sanitize the `message` prop, allowing only specific tags and attributes.
2. I extended the `HTMLAttributes` interface to include all possible HTML attributes that can be passed to the root `div` element.
3. I added the `rest` object to pass any additional attributes to the root `div` element.
4. I added a `allowedAttributes` configuration to the sanitizer for the `a` and `img` tags to allow passing `href`, `target`, `src`, and `alt` attributes.
5. I used the `DetailedHTMLProps` type to include the `ref` and `key` props.
6. I added a `span`, `strong`, and `em` tag to the allowedTags to support HTML formatting.
7. I added a `strong` tag to the allowedTags to support bold text.
8. I added an `em` tag to the allowedTags to support italic text.
9. I added an `a` tag to the allowedTags to support hyperlinks.
10. I added an `img` tag to the allowedTags to support images.
11. I added a `target` attribute to the allowedAttributes for the `a` tag to support opening links in a new tab.
12. I added an `alt` attribute to the allowedAttributes for the `img` tag to support accessibility.
13. I used a more descriptive component name.