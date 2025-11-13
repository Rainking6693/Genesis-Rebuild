import React, { useCallback, useEffect, useId, useState } from 'react';
import { useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { CarbonFootprintService } from './services/CarbonFootprintService';

interface Props {
  businessId: string;
}

interface State {
  loading: boolean;
  carbonFootprint: number | null;
  esgReport: string | null;
  error: string | null;
}

const MyComponent: React.FC<Props> = (props) => {
  const id = useId();
  const [state, setState] = useState<State>({ loading: true, carbonFootprint: null, esgReport: null, error: null });
  const carbonFootprintService = useMemo(() => CarbonFootprintService.getInstance(), []);

  const fetchData = useCallback(async () => {
    try {
      setState({ ...state, loading: true });
      const carbonFootprint = await carbonFootprintService.calculate(props.businessId);
      const esgReport = await carbonFootprintService.generateESGReport(props.businessId);
      setState({
        loading: false,
        carbonFootprint: carbonFootprint !== undefined ? carbonFootprint : null,
        esgReport: esgReport !== undefined ? esgReport : null,
        error: null,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        setState({
          loading: false,
          carbonFootprint: null,
          esgReport: null,
          error: error.message,
        });
      } else {
        setState({
          loading: false,
          carbonFootprint: null,
          esgReport: null,
          error: 'An unexpected error occurred.',
        });
      }
    }
  }, [props.businessId, carbonFootprintService]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (state.loading) {
    return <div id={id} aria-busy={true}>Loading...</div>;
  }

  return (
    <div id={id} aria-labelledby={`${id}-label`}>
      <h2 id={`${id}-label`}>Carbon Footprint</h2>
      {state.error ? <div role="alert">{state.error}</div> : <div>{state.carbonFootprint || 0}</div>}
      <h2 id={`${id}-esg-report-label`}>ESG Report</h2>
      {state.error ? <div role="alert">{state.error}</div> : <div>{state.esgReport || ''}</div>}
    </div>
  );
};

export default MyComponent;

// CarbonFootprintService.ts
import axios, { AxiosError } from 'axios';

export class CarbonFootprintService {
  private static instance: CarbonFootprintService;

  private constructor() {}

  public static getInstance(): CarbonFootprintService {
    if (!CarbonFootprintService.instance) {
      CarbonFootprintService.instance = new CarbonFootprintService();
    }

    return CarbonFootprintService.instance;
  }

  public async calculate(businessId: string): Promise<number> {
    const response = await axios.get(`/api/carbon-footprint/${businessId}`);
    if (response.data === undefined) {
      throw new Error('Unexpected response from server');
    }
    return response.data;
  }

  public async generateESGReport(businessId: string): Promise<string> {
    const response = await axios.get(`/api/esg-report/${businessId}`);
    if (response.data === undefined) {
      throw new Error('Unexpected response from server');
    }
    return response.data;
  }
}

This updated code includes better error handling, a loading state, accessibility improvements, and optimizations using `useCallback` and `useMemo`.