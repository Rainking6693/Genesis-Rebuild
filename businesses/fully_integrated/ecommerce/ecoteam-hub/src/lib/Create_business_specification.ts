import { debounce } from 'lodash';

// ...

const debouncedHandleMessageChange = debounce(handleMessageChange, 500);

const MyComponent: FC<Props> = ({ message }) => {
  // ...

  const [customError, setCustomError] = React.useState('');

  // ...

  return (
    <div>
      <label htmlFor="message">Message:</label>
      <input
        type="text"
        id="message"
        value={message}
        onChange={debouncedHandleMessageChange}
      />
      {customError && <p>{customError}</p>}
      <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(message) }} />
    </div>
  );
};

// ...

MyComponent.resetCustomError = () => {
  setCustomError('');
};

import { debounce } from 'lodash';

// ...

const debouncedHandleMessageChange = debounce(handleMessageChange, 500);

const MyComponent: FC<Props> = ({ message }) => {
  // ...

  const [customError, setCustomError] = React.useState('');

  // ...

  return (
    <div>
      <label htmlFor="message">Message:</label>
      <input
        type="text"
        id="message"
        value={message}
        onChange={debouncedHandleMessageChange}
      />
      {customError && <p>{customError}</p>}
      <div dangerouslySetInnerHTML={{ __html: sanitizeMessage(message) }} />
    </div>
  );
};

// ...

MyComponent.resetCustomError = () => {
  setCustomError('');
};