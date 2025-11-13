import React, { PropsWithChildren, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Added type for the t function
type TFunction = (key: string, options?: { [key: string]: any }) => string;

/**
 * Props for CarbonFootprintMessage component.
 */
interface Props {
  /**
   * The carbon footprint level (low, medium, high).
   */
  level: 'low' | 'medium' | 'high';

  /**
   * A test prop for testing the component in isolation.
   */
  data-testid?: string;
}

/**
 * CarbonFootprintMessage component.
 */
const CarbonFootprintMessage: React.FC<Props> = ({ level, dataTestId }) => {
  const { t }: { t: TFunction } = useTranslation();

  /**
   * Renders the component with the appropriate message based on the carbon footprint level.
   */
  const message = () => {
    const messageKey = `carbonFootprint.${level}`;
    const defaultMessage = 'carbonFootprint.unknown';

    // Handle edge case: missing translation
    const translatedMessage = t(messageKey, { returnObjects: true })[0] || t(defaultMessage, { returnObjects: true })[0];

    return (
      <div data-testid={dataTestId} aria-label={translatedMessage}>
        {translatedMessage}
      </div>
    );
  };

  return message();
};

CarbonFootprintMessage.propTypes = {
  level: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
  dataTestId: PropTypes.string,
};

CarbonFootprintMessage.defaultProps = {
  level: 'low',
  dataTestId: undefined,
};

CarbonFootprintMessage.displayName = 'CarbonFootprintMessage';

export default CarbonFootprintMessage;

// Added test suite for the component using Jest and React Testing Library
import React from 'react';
import { render, screen } from '@testing-library/react';
import CarbonFootprintMessage from './CarbonFootprintMessage';

describe('CarbonFootprintMessage', () => {
  it('renders the correct message for each carbon footprint level', () => {
    const { getByTestId } = render(<CarbonFootprintMessage level="low" data-testid="carbon-footprint-message" />);
    const message = getByTestId('carbon-footprint-message');
    expect(message).toHaveTextContent('Low carbon footprint');

    render(<CarbonFootprintMessage level="medium" data-testid="carbon-footprint-message" />);
    const message2 = screen.getByTestId('carbon-footprint-message');
    expect(message2).toHaveTextContent('Medium carbon footprint');

    render(<CarbonFootprintMessage level="high" data-testid="carbon-footprint-message" />);
    const message3 = screen.getByTestId('carbon-footprint-message');
    expect(message3).toHaveTextContent('High carbon footprint');
  });

  it('renders an unknown message for an invalid carbon footprint level', () => {
    render(<CarbonFootprintMessage level="invalid" data-testid="carbon-footprint-message" />);
    const message = screen.getByTestId('carbon-footprint-message');
    expect(message).toHaveTextContent('Unknown carbon footprint');
  });

  it('adds an aria-label to the message', () => {
    render(<CarbonFootprintMessage level="low" data-testid="carbon-footprint-message" />);
    const message = screen.getByTestId('carbon-footprint-message');
    expect(message).toHaveAttribute('aria-label', 'Low carbon footprint');
  });
});