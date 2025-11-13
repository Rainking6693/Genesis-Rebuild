import { validate as isEmail } from 'email-validator';

type ValidateEmailResult = isEmail.EmailValidationResult;

function validateEmail(email: string): ValidateEmailResult {
  const result: ValidateEmailResult = {
    valid: false,
    errors: [],
  };

  if (!email) {
    result.errors.push('Email is required');
  } else if (!isEmail(email)) {
    result.errors.push('Invalid email format');
  }

  if (result.errors.length === 0) {
    result.valid = true;
  }

  return result;
}

import { validate as isEmail } from 'email-validator';

type ValidateEmailResult = isEmail.EmailValidationResult;

function validateEmail(email: string): ValidateEmailResult {
  const result: ValidateEmailResult = {
    valid: false,
    errors: [],
  };

  if (!email) {
    result.errors.push('Email is required');
  } else if (!isEmail(email)) {
    result.errors.push('Invalid email format');
  }

  if (result.errors.length === 0) {
    result.valid = true;
  }

  return result;
}