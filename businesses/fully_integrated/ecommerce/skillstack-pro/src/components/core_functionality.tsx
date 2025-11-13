import React, { FC, ReactNode, Key, ReactElement } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

interface Props {
  message: ReactNode[];
}

const sanitize = (html: string) => DOMPurify.sanitize(html);

const SkillStackProMicroLessonDisplay: FC<Props> = ({ message }) => {
  const sanitizedMessage = message.map((node: ReactNode, index: Key) => {
    if (typeof node === 'string') {
      return <span key={index} dangerouslySetInnerHTML={{ __html: sanitize(node) }} />;
    }
    return node;
  });

  return <div>{sanitizedMessage}</div>;
};

SkillStackProMicroLessonDisplay.defaultProps = {
  message: [],
};

SkillStackProMicroLessonDisplay.propTypes = {
  message: PropTypes.arrayOf(PropTypes.node).isRequired,
};

const MemoizedSkillStackProMicroLessonDisplay = React.memo(SkillStackProMicroLessonDisplay);

export default MemoizedSkillStackProMicroLessonDisplay;

In this updated code, I've used the `DOMPurify` library for sanitizing user-provided HTML, which is a more secure and robust method compared to `dangerouslySetInnerHTML`. I've also added a `Key` prop to each `span` element for better accessibility and performance.

For better maintainability, I've extracted the sanitization logic into a separate function, making it easier to update the sanitization method in the future if needed. Lastly, I've added a check for the type of the node before rendering it as a string with `dangerouslySetInnerHTML`, ensuring that only strings are sanitized and rendered, improving the resiliency of the component.