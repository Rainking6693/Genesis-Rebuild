import React, { useEffect } from 'react';
import { useSEO } from 'react-seo-optimization';

interface Props {
  title: string;
  description?: string;
  message: string;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ title, description = '', message, className }) => {
  const { setTitle, setDescription } = useSEO();

  useEffect(() => {
    if (setTitle && title.length > 0) {
      setTitle(title);
    }
    if (setDescription && description.length > 0 && description.length <= 160) {
      setDescription(description);
    }
  }, [title, description]);

  return (
    <div className={className} style={{ minWidth: '320px', minHeight: '240px', role: 'main', aria-label: 'Main content' }}>
      <html lang="en">
        <head>
          <meta name="description" content={description} />
          <meta name="noindex" content={description.length > 160 ? 'follow' : ''} />
        </head>
        <main>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </main>
      </html>
    </div>
  );
};

export default MyComponent;

import React, { useEffect } from 'react';
import { useSEO } from 'react-seo-optimization';

interface Props {
  title: string;
  description?: string;
  message: string;
  className?: string;
}

const MyComponent: React.FC<Props> = ({ title, description = '', message, className }) => {
  const { setTitle, setDescription } = useSEO();

  useEffect(() => {
    if (setTitle && title.length > 0) {
      setTitle(title);
    }
    if (setDescription && description.length > 0 && description.length <= 160) {
      setDescription(description);
    }
  }, [title, description]);

  return (
    <div className={className} style={{ minWidth: '320px', minHeight: '240px', role: 'main', aria-label: 'Main content' }}>
      <html lang="en">
        <head>
          <meta name="description" content={description} />
          <meta name="noindex" content={description.length > 160 ? 'follow' : ''} />
        </head>
        <main>
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: message }} />
        </main>
      </html>
    </div>
  );
};

export default MyComponent;