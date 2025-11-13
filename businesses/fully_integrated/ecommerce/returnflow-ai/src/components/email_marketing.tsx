import React, { FC, ReactNode } from 'react';

interface Props {
  subject?: string;
  message?: string;
  lang?: string;
}

const MyComponent: FC<Props> = ({ subject = 'Untitled', message = 'No message provided.', lang = 'en' }) => {
  return (
    <div id="email-component" role="email" lang={lang}>
      <h1 aria-level={2}>{subject}</h1>
      <article role="article">
        <header role="banner">
          <h2 aria-level={1}>Email</h2>
        </header>
        <main role="main">{message}</main>
      </article>
    </div>
  );
};

export default MyComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  subject?: string;
  message?: string;
  lang?: string;
}

const MyComponent: FC<Props> = ({ subject = 'Untitled', message = 'No message provided.', lang = 'en' }) => {
  return (
    <div id="email-component" role="email" lang={lang}>
      <h1 aria-level={2}>{subject}</h1>
      <article role="article">
        <header role="banner">
          <h2 aria-level={1}>Email</h2>
        </header>
        <main role="main">{message}</main>
      </article>
    </div>
  );
};

export default MyComponent;