import axios from 'axios';

export const EcoConvertAPI = axios.create({
  baseURL: 'https://api.eco-convert.com/v1',
});

// ActionPlan.ts
interface ActionPlan {
  action: string;
  description: string;
  estimatedCost: number;
  estimatedSavings: number;
  estimatedROI: number;
}

// Scorecard.ts
interface Scorecard {
  score: number;
  message: string;
}

// ApiError.ts
interface ApiError {
  message: string;
}

// EcoConvertAI.tsx
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EcoConvertAPI } from '../services/EcoConvertAPI';
import ActionPlanList from './ActionPlanList';
import ScorecardComponent from './ScorecardComponent';

interface Props {
  businessId: string;
}

const EcoConvertAI: FunctionComponent<Props> = ({ businessId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [scorecard, setScorecard] = useState<Scorecard>({ score: 0, message: '' });
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const validateBusinessId = (id: string) => {
      if (!id || id.length <= 0) {
        setError({ message: t('invalid_business_id') });
        return;
      }
      fetchData();
    };

    const fetchData = async () => {
      try {
        const response = await EcoConvertAPI.getActionPlan(businessId);
        if (response.data && response.data.actionPlans && response.data.scorecard) {
          setActionPlans(response.data.actionPlans);
          setScorecard(response.data.scorecard);
        } else {
          setError({ message: t('api_response_error') });
        }
      } catch (error) {
        setError({ message: error.message });
      } finally {
        setLoading(false);
      }
    };

    validateBusinessId(businessId);
  }, [businessId, t]);

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{t(error.message)}</p>
      </div>
    );
  }

  return (
    <div>
      <ActionPlanList actionPlans={actionPlans} formatCurrency={formatCurrency} />
      <ScorecardComponent scorecard={scorecard} formatCurrency={formatCurrency} />
      <button
        aria-label={t('share_scorecard')}
        onClick={() => window.navigator.share({ text: t('share_scorecard') })}
      >
        {t('share_scorecard')}
      </button>
    </div>
  );
};

export default EcoConvertAI;

// ActionPlanList.tsx
import React from 'react';
import { ActionPlan } from './EcoConvertAI';

interface Props {
  actionPlans: ActionPlan[];
  formatCurrency: (value: number) => string;
}

const ActionPlanList: React.FC<Props> = ({ actionPlans, formatCurrency }) => {
  return (
    <ul>
      {actionPlans.map((actionPlan) => (
        <li key={actionPlan.action}>
          {actionPlan.action}: {actionPlan.description}
          <br />
          Estimated Cost: {formatCurrency(actionPlan.estimatedCost)}
          <br />
          Estimated Savings: {formatCurrency(actionPlan.estimatedSavings)}
          <br />
          Estimated ROI: {(actionPlan.estimatedROI * 100).toFixed(2)}%
        </li>
      ))}
    </ul>
  );
};

export default ActionPlanList;

// ScorecardComponent.tsx
import React from 'react';

interface Props {
  scorecard: {
    score: number;
    message: string;
  };
  formatCurrency: (value: number) => string;
}

const ScorecardComponent: React.FC<Props> = ({ scorecard, formatCurrency }) => {
  return (
    <div>
      <h2>Sustainability Scorecard</h2>
      <p>{scorecard.message}</p>
      <p>Score: {scorecard.score}</p>
      <p>Total Estimated Savings: {formatCurrency(scorecard.score)}</p>
    </div>
  );
};

export default ScorecardComponent;

This updated code includes type checking for the API response data, error handling for the API calls, accessibility improvements, a loading state for the components, a function to format the currency values, a function to handle internationalization, a function to validate the businessId, and a function to handle edge cases where the API response might not contain the necessary data.