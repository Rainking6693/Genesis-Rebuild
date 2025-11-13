import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ContractSnapAPI } from '../../api';

type UserInput = string;
type ContractTemplate = any;

interface Props {
  conversationId: string;
}

const CustomerSupportBot: React.FC<Props> = ({ conversationId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userInput = useSelector((state: any) => state.userInput);
  const [contractTemplate, setContractTemplate] = useState<ContractTemplate>(null);
  const [loading, setLoading] = useState(false);

  const handleUserInput = (input: UserInput) => {
    dispatch({ type: 'SET_USER_INPUT', payload: input });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUserInput(event.target.value);
  };

  const handleInputBlur = () => {
    setLoading(true);
    const generateContract = async () => {
      try {
        const response = await ContractSnapAPI.generateContract(userInput);
        setContractTemplate(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (userInput) {
      generateContract();
    }
  };

  useEffect(() => {
    if (userInput) {
      setLoading(true);
    } else {
      setContractTemplate(null);
      setLoading(false);
    }
  }, [userInput]);

  return (
    <div>
      <h2>{t('Welcome to ContractSnap!')}</h2>
      <p>{t('Describe your needs in plain English.')}</p>
      <input
        type="text"
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        value={userInput}
        disabled={loading}
      />
      {loading && <p>{t('Generating contract...')}</p>}
      {contractTemplate && (
        <div>
          <h3>{t('Generated Contract')}</h3>
          <pre>{JSON.stringify(contractTemplate, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CustomerSupportBot;

This updated component should be more resilient, handle edge cases better, be more accessible, and be more maintainable.