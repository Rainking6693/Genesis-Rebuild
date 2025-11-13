import React, { useState, useEffect } from 'react';
import { useClipboard } from 'react-use';
import { Link } from 'react-router-dom';

const COPY_RATE_LIMIT = 5; // Adjust this value as needed
let copyAttempts = 0;

const MyComponent = () => {
  const [copyError, setCopyError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [text, , setText] = useClipboard('');

  useEffect(() => {
    if (text) {
      setCopySuccess(true);
      copyAttempts = 0;
    }
  }, [text]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('Your product link');
    } catch (err) {
      setCopyError(true);
      copyAttempts++;
      if (copyAttempts >= COPY_RATE_LIMIT) {
        alert('Error: Unable to copy to clipboard. Please manually copy the link.');
      }
    }
  };

  return (
    <div>
      <button onClick={copyToClipboard}>Copy to clipboard</button>
      {copyError && <p>Error: Unable to copy to clipboard. Please try again.</p>}
      {copySuccess && <p className="copy-message-success">Copied!</p>}
      <Link to="/terms-and-conditions">Terms and Conditions</Link>
    </div>
  );
};

export default MyComponent;

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders the component', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Copy to clipboard')).toBeInTheDocument();
  });

  it('calls copyToClipboard on button click', () => {
    const mockCopyToClipboard = jest.fn();
    const { getByText } = render(<MyComponent copyToClipboard={mockCopyToClipboard} />);
    fireEvent.click(getByText('Copy to clipboard'));
    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1);
  });

  it('shows copy success message after copying to clipboard', () => {
    const { getByText, queryByText } = render(<MyComponent />);
    fireEvent.click(getByText('Copy to clipboard'));
    expect(getByText('Copied!')).toBeInTheDocument();
    expect(queryByText('Error: Unable to copy to clipboard. Please try again.')).toBeNull();
  });

  it('shows copy error message when copy fails', () => {
    const { getByText, queryByText } = render(<MyComponent />);
    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Copy error'));
    fireEvent.click(getByText('Copy to clipboard'));
    expect(getByText('Error: Unable to copy to clipboard. Please try again.')).toBeInTheDocument();
    expect(queryByText('Copied!')).toBeNull();
  });
});

import React, { useState, useEffect } from 'react';
import { useClipboard } from 'react-use';
import { Link } from 'react-router-dom';

const COPY_RATE_LIMIT = 5; // Adjust this value as needed
let copyAttempts = 0;

const MyComponent = () => {
  const [copyError, setCopyError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [text, , setText] = useClipboard('');

  useEffect(() => {
    if (text) {
      setCopySuccess(true);
      copyAttempts = 0;
    }
  }, [text]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText('Your product link');
    } catch (err) {
      setCopyError(true);
      copyAttempts++;
      if (copyAttempts >= COPY_RATE_LIMIT) {
        alert('Error: Unable to copy to clipboard. Please manually copy the link.');
      }
    }
  };

  return (
    <div>
      <button onClick={copyToClipboard}>Copy to clipboard</button>
      {copyError && <p>Error: Unable to copy to clipboard. Please try again.</p>}
      {copySuccess && <p className="copy-message-success">Copied!</p>}
      <Link to="/terms-and-conditions">Terms and Conditions</Link>
    </div>
  );
};

export default MyComponent;

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders the component', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Copy to clipboard')).toBeInTheDocument();
  });

  it('calls copyToClipboard on button click', () => {
    const mockCopyToClipboard = jest.fn();
    const { getByText } = render(<MyComponent copyToClipboard={mockCopyToClipboard} />);
    fireEvent.click(getByText('Copy to clipboard'));
    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1);
  });

  it('shows copy success message after copying to clipboard', () => {
    const { getByText, queryByText } = render(<MyComponent />);
    fireEvent.click(getByText('Copy to clipboard'));
    expect(getByText('Copied!')).toBeInTheDocument();
    expect(queryByText('Error: Unable to copy to clipboard. Please try again.')).toBeNull();
  });

  it('shows copy error message when copy fails', () => {
    const { getByText, queryByText } = render(<MyComponent />);
    jest.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Copy error'));
    fireEvent.click(getByText('Copy to clipboard'));
    expect(getByText('Error: Unable to copy to clipboard. Please try again.')).toBeInTheDocument();
    expect(queryByText('Copied!')).toBeNull();
  });
});

For unit testing, you can create a test file named `MyComponent.test.tsx`: