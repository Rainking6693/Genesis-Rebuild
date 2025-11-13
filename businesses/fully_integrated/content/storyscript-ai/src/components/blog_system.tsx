import React, { FC, ReactNode, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StoryScriptAIContext } from './StoryScriptAIContext';

interface Props {
  children: ReactNode;
  className?: string;
}

const Wrapper: FC<Props> = ({ children, className }) => {
  const { isDevelopment } = useContext(StoryScriptAIContext);

  const missingTitleError = () => {
    if (isDevelopment) {
      console.error('Missing required prop "title"');
    }
  };

  useEffect(() => {
    if (!children || !children.props || !children.props.title) {
      missingTitleError();
    }
  }, [children]);

  return <div className={className}>{children}</div>;
};

const MinimumContentLength = 1;

const MyComponent: FC<Props> = ({ title, subtitle, content, role, ariaLabel, dataTestid }) => {
  if (typeof title !== 'string' || title.length < MinimumContentLength) {
    throw new Error('Title must be a non-empty string');
  }

  if (typeof subtitle !== 'string' || subtitle.length < MinimumContentLength) {
    subtitle = '';
  }

  if (typeof content !== 'string' || content.length < MinimumContentLength) {
    throw new Error('Content must be a non-empty string');
  }

  return (
    <div data-testid={dataTestid} role={role}>
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div>{content}</div>
    </div>
  );
};

MyComponent.displayName = 'StoryScriptAI-BlogComponent';
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  content: PropTypes.string.isRequired,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  dataTestid: PropTypes.string,
};

const MemoizedMyComponent = React.memo(MyComponent);

export default () => (
  <Wrapper className="blog-component">
    <MemoizedMyComponent role="blog" aria-label="Blog post" data-testid="blog-post" />
  </Wrapper>
);

In this updated code, I've added a `Wrapper` component with a `className` prop for better styling and accessibility. The `Wrapper` now logs an error message in the console if the `MyComponent` is missing the `title` prop.

The `MyComponent` now has a `role`, `ariaLabel`, and `dataTestid` props for better accessibility and easier testing. I've also added checks for invalid `subtitle` and `content` prop lengths. Lastly, I've added a `MinimumContentLength` constant to define the minimum length for non-empty strings.