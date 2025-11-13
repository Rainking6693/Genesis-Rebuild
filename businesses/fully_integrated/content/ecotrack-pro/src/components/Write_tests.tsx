import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { TestRenderer, act } from 'react-test-renderer';
import userEvent from '@testing-library/user-event';

interface Props {
  /**
   * The message to be displayed in the component.
   */
  message: string;

  /**
   * Optional className for styling the component.
   */
  className?: string;

  /**
   * Optional id for accessibility purposes.
   */
  id?: string;

  /**
   * Optional aria-label for accessibility purposes.
   */
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, className, id, ariaLabel }) => {
  /**
   * Renders the component with the provided message and optional attributes.
   */
  return (
    <div id={id} className={className} aria-label={ariaLabel}>
      {message}
    </div>
  );
};

MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
};

MyComponent.defaultProps = {
  className: '',
  id: undefined,
  ariaLabel: 'MyComponent',
};

describe('MyComponent', () => {
  it('renders the provided message', () => {
    const testMessage = 'Test Message';
    const { getByText } = render(<MyComponent message={testMessage} />);
    expect(getByText(testMessage)).toBeInTheDocument();
  });

  it('handles missing message', () => {
    const { container } = render(<MyComponent />);
    expect(container.firstChild).toHaveTextContent('');
  });

  it('handles missing id', () => {
    const { getByTestId } = render(<MyComponent id="test-id" />);
    expect(getByTestId('test-id')).toBeInTheDocument();
  });

  it('handles missing className', () => {
    const { container } = render(<MyComponent className="test-class" />);
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('handles missing aria-label', () => {
    const { getByTestId } = render(<MyComponent aria-label="test-aria-label" />);
    expect(getByTestId('test-aria-label')).toHaveAttribute('aria-label', 'test-aria-label');
  });

  it('passes accessibility test', () => {
    const { getByTestId } = render(<MyComponent id="test-id" aria-label="Test Message" />);
    const element = getByTestId('test-id');
    userEvent.click(element);
    expect(element).toHaveFocus();
  });
});

function render(component: React.ReactElement) {
  const renderer = new TestRenderer<PropsWithChildren<Props>>();
  return renderer.render(component);
}

export default MyComponent;