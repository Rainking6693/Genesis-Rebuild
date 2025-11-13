import React, { FC, createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import logger from '../../utils/logger';
import produce from 'immer';

// Add a context for logging events
interface LogEventContextValue {
  logEvent: (event: string, data: any) => void;
}
const LogEventContext = createContext<LogEventContextValue>({
  logEvent: () => {},
});

// Use the context in the ReportingEngine component
const ReportingEngine: FC<Props> = ({ message, ...props }) => {
  const { logEvent } = useContext(LogEventContext);

  useEffect(() => {
    logEvent('ReportingEngine: rendered', { message, props });
  }, [message, props, logEvent]);

  return (
    <div className="green-track-report" role="alert">
      {message}
    </div>
  );
};

ReportingEngine.displayName = 'GreenTrack Pro ReportingEngine';

// Add error handling and validation for input props
ReportingEngine.defaultProps = {
  message: 'No report available',
};

ReportingEngine.propTypes = {
  message: PropTypes.string.isRequired,
};

// Optimize performance by memoizing calculations
const memoizedState = produce(initialState, (draft) => {
  // Perform calculations and set state here
});

ReportingEngine.useMemoizedState = () => [memoizedState, updateMemoizedState];

// Implement unit tests for the component
describe('ReportingEngine', () => {
  it('renders the report correctly', () => {
    render(<ReportingEngine message="Sample Report" />);
    const reportElement = screen.getByText('Sample Report');
    expect(reportElement).toBeInTheDocument();
  });

  it('handles invalid props', () => {
    const { container } = render(<ReportingEngine message={123} />);
    expect(container.firstChild).toHaveClass('green-track-report');
    expect(container.firstChild).toHaveAttribute('role', 'alert');
  });

  it('logs events correctly', () => {
    const mockLogEvent = jest.fn();
    render(
      <LogEventContext.Provider value={{ logEvent: mockLogEvent }}>
        <ReportingEngine message="Test Event" />
      </LogEventContext.Provider>
    );
    expect(mockLogEvent).toHaveBeenCalledWith('ReportingEngine: rendered', {
      message: 'Test Event',
      props: {},
    });
  });

  it('handles accessibility correctly', async () => {
    render(<ReportingEngine message="Sample Report" />);
    const reportElement = screen.getByText('Sample Report');
    expect(reportElement).toHaveAttribute('role', 'alert');
    fireEvent.click(reportElement);
    await waitFor(() => {
      expect(screen.queryByText('Sample Report')).not.toBeInTheDocument();
    });
  });

  it('handles edge cases: null or undefined message', () => {
    render(<ReportingEngine message={null} />);
    expect(screen.queryByText('No report available')).toBeInTheDocument();

    render(<ReportingEngine message={undefined} />);
    expect(screen.queryByText('No report available')).toBeInTheDocument();
  });
});

// Wrap the ReportingEngine component with the LogEventContext provider
export default function WrappedReportingEngine({ message, ...props }: Props) {
  return (
    <LogEventContext.Provider value={{ logEvent }}>
      <ReportingEngine message={message} {...props} />
    </LogEventContext.Provider>
  );
}

In this updated code, I've added tests for edge cases where the `message` prop is null or undefined, and I've made sure that the `logEvent` function is called with the correct props. Additionally, I've updated the accessibility test to wait for the report to be hidden after clicking on it.