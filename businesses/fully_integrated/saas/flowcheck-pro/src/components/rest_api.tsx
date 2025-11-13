import { useMemo, useState } from 'react';
import { sanitizeUserInput, validateEmployeeId, validateBurnoutScore } from '../../security/input_sanitization';
import { EmployeeIdInvalidError, BurnoutScoreInvalidError } from '../../errors';
import { IEmployeeData } from './EmployeeDataInterface';

interface Props {
  employeeId: string;
  burnoutScore: number;
}

const FunctionalComponent: React.FC<Props> = ({ employeeId, burnoutScore }) => {
  const [error, setError] = useState<Error | null>(null);
  const [employeeData, setEmployeeData] = useState<IEmployeeData | null>(null);

  const validateInputs = useMemo(() => {
    let valid = true;
    const errors: Error[] = [];

    const validateEmployeeIdResult = validateEmployeeId(employeeId);
    if (validateEmployeeIdResult instanceof Error) {
      errors.push(validateEmployeeIdResult);
      valid = false;
    }

    const validateBurnoutScoreResult = validateBurnoutScore(burnoutScore);
    if (validateBurnoutScoreResult instanceof Error) {
      errors.push(validateBurnoutScoreResult);
      valid = false;
    }

    if (!valid) {
      setError(errors[0]);
      return;
    }

    setError(null);
    return errors;
  }, [employeeId, burnoutScore]);

  const sanitizedEmployeeId = useMemo(() => {
    if (error) {
      throw error;
    }
    return sanitizeUserInput(employeeId);
  }, [employeeId, error]);

  const employeeDataObj: IEmployeeData = {
    id: sanitizedEmployeeId,
    burnoutScore,
  };

  const message = useMemo(() => {
    if (error) {
      throw error;
    }
    return `Employee ID: ${sanitizedEmployeeId}, Burnout Score: ${burnoutScore}`;
  }, [employeeId, burnoutScore, sanitizedEmployeeId, error]);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (validateInputs.length > 0) {
    return <div>{validateInputs.map((error) => error.message).join(', ')}</div>;
  }

  setEmployeeData(employeeDataObj);
  return <div>{message}</div>;
};

export default FunctionalComponent;

import { useMemo, useState } from 'react';
import { sanitizeUserInput, validateEmployeeId, validateBurnoutScore } from '../../security/input_sanitization';
import { EmployeeIdInvalidError, BurnoutScoreInvalidError } from '../../errors';
import { IEmployeeData } from './EmployeeDataInterface';

interface Props {
  employeeId: string;
  burnoutScore: number;
}

const FunctionalComponent: React.FC<Props> = ({ employeeId, burnoutScore }) => {
  const [error, setError] = useState<Error | null>(null);
  const [employeeData, setEmployeeData] = useState<IEmployeeData | null>(null);

  const validateInputs = useMemo(() => {
    let valid = true;
    const errors: Error[] = [];

    const validateEmployeeIdResult = validateEmployeeId(employeeId);
    if (validateEmployeeIdResult instanceof Error) {
      errors.push(validateEmployeeIdResult);
      valid = false;
    }

    const validateBurnoutScoreResult = validateBurnoutScore(burnoutScore);
    if (validateBurnoutScoreResult instanceof Error) {
      errors.push(validateBurnoutScoreResult);
      valid = false;
    }

    if (!valid) {
      setError(errors[0]);
      return;
    }

    setError(null);
    return errors;
  }, [employeeId, burnoutScore]);

  const sanitizedEmployeeId = useMemo(() => {
    if (error) {
      throw error;
    }
    return sanitizeUserInput(employeeId);
  }, [employeeId, error]);

  const employeeDataObj: IEmployeeData = {
    id: sanitizedEmployeeId,
    burnoutScore,
  };

  const message = useMemo(() => {
    if (error) {
      throw error;
    }
    return `Employee ID: ${sanitizedEmployeeId}, Burnout Score: ${burnoutScore}`;
  }, [employeeId, burnoutScore, sanitizedEmployeeId, error]);

  if (error) {
    return <div>{error.message}</div>;
  }

  if (validateInputs.length > 0) {
    return <div>{validateInputs.map((error) => error.message).join(', ')}</div>;
  }

  setEmployeeData(employeeDataObj);
  return <div>{message}</div>;
};

export default FunctionalComponent;