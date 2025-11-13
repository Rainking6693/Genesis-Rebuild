import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Memoize the rendering of the component to improve performance
  const renderedTitle = useMemo(() => <h1 className="my-component__title">{title}</h1>, [title]);
  const renderedContent = useMemo(() => <p className="my-component__content">{content}</p>, [content]);

  // Memoize the event handler to improve performance
  const handleClick = useCallback(() => {
    console.log(`Clicked on "${title}"`);
  }, [title]);

  return (
    <div className="my-component" aria-label={title} onClick={handleClick}>
      {/* Render the title and content using the memoized values */}
      {renderedTitle}
      {renderedContent}
    </div>
  );
});

export default MyComponent;

import React, { memo, useMemo, useCallback } from 'react';

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = memo(({ title, content }) => {
  // Memoize the rendering of the component to improve performance
  const renderedTitle = useMemo(() => <h1 className="my-component__title">{title}</h1>, [title]);
  const renderedContent = useMemo(() => <p className="my-component__content">{content}</p>, [content]);

  // Memoize the event handler to improve performance
  const handleClick = useCallback(() => {
    console.log(`Clicked on "${title}"`);
  }, [title]);

  return (
    <div className="my-component" aria-label={title} onClick={handleClick}>
      {/* Render the title and content using the memoized values */}
      {renderedTitle}
      {renderedContent}
    </div>
  );
});

export default MyComponent;