import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
  message: string;
  disabled?: boolean;
}

const MyComponent: FC<Props> = ({ message, disabled }) => {
  const validatedMessage = useMemo(() => validateMessage(message), [message]);
  return <div>{validatedMessage}</div>;
};

const validateMessage = (message: string): string => {
  if (!message || message.includes('<script>')) {
    throw new Error('Invalid or potentially dangerous message');
  }
  return message;
};

MyComponent.defaultProps = {
  message: '',
  disabled: false,
};

export const MemoizedMyComponent = React.memo(MyComponent);

interface State {
  incomeData: { [platform: string]: number };
  error: Error | null;
  loading: boolean;
}

interface Props {
  onTaxOptimization: (optimization: string) => void;
}

class CreatorCash extends React.Component<Props, State> {
  state = {
    incomeData: {},
    error: null,
    loading: true,
  };

  componentDidMount() {
    this.fetchIncomeData();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.incomeData !== this.state.incomeData) {
      this.calculateTaxOptimization();
    }
  }

  fetchIncomeData = useCallback(async () => {
    try {
      const data = await fetchIncomeDataFromAPIs();
      this.setState({ incomeData: data, error: null, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }, []);

  calculateTaxOptimization = useCallback(() => {
    if (this.state.error || !this.state.incomeData) {
      console.error(this.state.error);
      return;
    }

    const optimization = calculateOptimalTaxStrategy(this.state.incomeData);
    this.props.onTaxOptimization(optimization);
  }, [this.state.incomeData, this.state.error]);

  render() {
    return (
      <div>
        {this.state.error && <div>Error fetching income data: {this.state.error.message}</div>}
        {Object.entries(this.state.incomeData).map(([platform, income]) => (
          <MyComponent key={platform} message={`${platform}: ${income}`} />
        ))}

        <MyComponent key="loading" message={this.state.loading ? 'Loading...' : ''} disabled={this.state.loading} />

        <button onClick={this.calculateTaxOptimization} disabled={!!this.state.error || this.state.loading}>
          Optimize Taxes
        </button>
      </div>
    );
  }
}

export default CreatorCash;

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

interface Props {
  message: string;
  disabled?: boolean;
}

const MyComponent: FC<Props> = ({ message, disabled }) => {
  const validatedMessage = useMemo(() => validateMessage(message), [message]);
  return <div>{validatedMessage}</div>;
};

const validateMessage = (message: string): string => {
  if (!message || message.includes('<script>')) {
    throw new Error('Invalid or potentially dangerous message');
  }
  return message;
};

MyComponent.defaultProps = {
  message: '',
  disabled: false,
};

export const MemoizedMyComponent = React.memo(MyComponent);

interface State {
  incomeData: { [platform: string]: number };
  error: Error | null;
  loading: boolean;
}

interface Props {
  onTaxOptimization: (optimization: string) => void;
}

class CreatorCash extends React.Component<Props, State> {
  state = {
    incomeData: {},
    error: null,
    loading: true,
  };

  componentDidMount() {
    this.fetchIncomeData();
  }

  componentDidUpdate(_, prevState) {
    if (prevState.incomeData !== this.state.incomeData) {
      this.calculateTaxOptimization();
    }
  }

  fetchIncomeData = useCallback(async () => {
    try {
      const data = await fetchIncomeDataFromAPIs();
      this.setState({ incomeData: data, error: null, loading: false });
    } catch (error) {
      this.setState({ error, loading: false });
    }
  }, []);

  calculateTaxOptimization = useCallback(() => {
    if (this.state.error || !this.state.incomeData) {
      console.error(this.state.error);
      return;
    }

    const optimization = calculateOptimalTaxStrategy(this.state.incomeData);
    this.props.onTaxOptimization(optimization);
  }, [this.state.incomeData, this.state.error]);

  render() {
    return (
      <div>
        {this.state.error && <div>Error fetching income data: {this.state.error.message}</div>}
        {Object.entries(this.state.incomeData).map(([platform, income]) => (
          <MyComponent key={platform} message={`${platform}: ${income}`} />
        ))}

        <MyComponent key="loading" message={this.state.loading ? 'Loading...' : ''} disabled={this.state.loading} />

        <button onClick={this.calculateTaxOptimization} disabled={!!this.state.error || this.state.loading}>
          Optimize Taxes
        </button>
      </div>
    );
  }
}

export default CreatorCash;