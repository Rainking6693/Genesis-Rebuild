import React from 'react';
import PropTypes from 'prop-types';
import styles from './MyComponent.module.css';

interface Props {
  title: string;
  description?: string;
}

const MyComponent: React.FC<Props> = ({ title, description }) => {
  const descriptionId = `my-component-description-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.container} key="my-component" aria-labelledby={`${descriptionId} my-component-title`}>
      <h1 id={`my-component-title`} className={styles.title} role="heading" aria-level={1}>
        {title}
      </h1>
      <p id={descriptionId} className={styles.description}>
        {description || 'Welcome to MoodSync Commerce!'}
      </p>
    </div>
  );
};

MyComponent.defaultProps = {
  title: 'Welcome to MoodSync Commerce!',
  description: undefined,
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

MyComponent.displayName = 'MyComponent';

export { MyComponent };

import React from 'react';
import { MyComponent } from './MyComponent';

const App: React.FC = () => {
  return <MyComponent />;
};

App.displayName = 'App';

export default App;

import React from 'react';
import { MyComponent } from './MyComponent';

const OtherComponent: React.FC = () => {
  const title = 'Welcome to the Other Component!';
  const description = 'This is the Other Component.';

  return <MyComponent title={title} description={description} />;
};

OtherComponent.displayName = 'OtherComponent';

export default OtherComponent;

import React from 'react';
import PropTypes from 'prop-types';
import styles from './MyComponent.module.css';

interface Props {
  title: string;
  description?: string;
}

const MyComponent: React.FC<Props> = ({ title, description }) => {
  const descriptionId = `my-component-description-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.container} key="my-component" aria-labelledby={`${descriptionId} my-component-title`}>
      <h1 id={`my-component-title`} className={styles.title} role="heading" aria-level={1}>
        {title}
      </h1>
      <p id={descriptionId} className={styles.description}>
        {description || 'Welcome to MoodSync Commerce!'}
      </p>
    </div>
  );
};

MyComponent.defaultProps = {
  title: 'Welcome to MoodSync Commerce!',
  description: undefined,
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

MyComponent.displayName = 'MyComponent';

export { MyComponent };

import React from 'react';
import { MyComponent } from './MyComponent';

const App: React.FC = () => {
  return <MyComponent />;
};

App.displayName = 'App';

export default App;

import React from 'react';
import { MyComponent } from './MyComponent';

const OtherComponent: React.FC = () => {
  const title = 'Welcome to the Other Component!';
  const description = 'This is the Other Component.';

  return <MyComponent title={title} description={description} />;
};

OtherComponent.displayName = 'OtherComponent';

export default OtherComponent;

App.tsx:

OtherComponent.tsx: