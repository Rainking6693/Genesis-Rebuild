import { v4 as uuidv4 } from 'uuid';

// Function to generate unique referral codes for the Test E-Commerce Store
export function generateReferralCode(quantity: number): string[] {
  const referralCodes: string[] = [];
  const codePattern = 'TEST-REF-{5}'; // Pattern for the referral code format

  // Ensure the pattern is consistent with the business context
  if (!codePattern.match(/^TEST-REF-\w{5}$/)) {
    throw new Error('Invalid referral code pattern');
  }

  // Loop through the requested quantity of referral codes
  for (let i = 0; i < quantity; i++) {
    let code = codePattern;

    // Replace the placeholders in the pattern with a unique UUID
    code = code.replace('{5}', uuidv4().slice(0, 5));

    // Check if the generated code is unique before adding it to the array
    if (!referralCodes.includes(code)) {
      referralCodes.push(code);
    } else {
      // If the code is not unique, generate a new one and continue the loop
      i--;
    }
  }

  return referralCodes;
}

// Function to check if a referral code is valid for the Test E-Commerce Store
export function isValidReferralCode(code: string): boolean {
  // Check if the code matches the pattern and length of the generated referral codes
  return code.match(/^TEST-REF-\w{5}$/) && code.length === 20;
}

// Function to validate the referral code format and length
function validateReferralCodeFormat(code: string): boolean {
  return code.match(/^TEST-REF-\w{5}$/) && code.length === 20;
}

// Function to generate unique referral codes for the Test E-Commerce Store
// This function also checks if the generated code is valid before adding it to the array
export async function generateAndValidateReferralCode(quantity: number): Promise<string[]> {
  const referralCodes: string[] = [];
  const codePattern = 'TEST-REF-{5}'; // Pattern for the referral code format

  // Ensure the pattern is consistent with the business context
  if (!codePattern.match(/^TEST-REF-\w{5}$/)) {
    throw new Error('Invalid referral code pattern');
  }

  // Loop through the requested quantity of referral codes
  for (let i = 0; i < quantity; i++) {
    let code = codePattern;

    // Replace the placeholders in the pattern with a unique UUID
    code = code.replace('{5}', uuidv4().slice(0, 5));

    // Check if the generated code is valid before adding it to the array
    if (validateReferralCodeFormat(code)) {
      if (!referralCodes.includes(code)) {
        referralCodes.push(code);
      } else {
        // If the code is not unique, generate a new one and continue the loop
        i--;
      }
    } else {
      // If the code is not valid, generate a new one and continue the loop
      i--;
    }
  }

  return referralCodes;
}

// Function to handle edge cases when generating referral codes
async function generateReferralCodeWithRetry(quantity: number): Promise<string[]> {
  let generatedCodes: string[] = [];
  let attempts = 10; // Set a maximum number of attempts to avoid infinite loops

  while (generatedCodes.length < quantity && attempts > 0) {
    generatedCodes = await generateAndValidateReferralCode(quantity);
    attempts--;
  }

  if (generatedCodes.length < quantity) {
    throw new Error('Failed to generate the required number of unique referral codes');
  }

  return generatedCodes;
}

// Function to handle edge cases when checking if a referral code is valid
function isValidReferralCodeWithRetry(code: string): boolean {
  let attempts = 3; // Set a maximum number of attempts to avoid infinite loops

  while (attempts > 0 && !isValidReferralCode(code)) {
    code = code.toUpperCase(); // Handle case sensitivity
    attempts--;
  }

  return attempts > 0;
}

import { v4 as uuidv4 } from 'uuid';

// Function to generate unique referral codes for the Test E-Commerce Store
export function generateReferralCode(quantity: number): string[] {
  const referralCodes: string[] = [];
  const codePattern = 'TEST-REF-{5}'; // Pattern for the referral code format

  // Ensure the pattern is consistent with the business context
  if (!codePattern.match(/^TEST-REF-\w{5}$/)) {
    throw new Error('Invalid referral code pattern');
  }

  // Loop through the requested quantity of referral codes
  for (let i = 0; i < quantity; i++) {
    let code = codePattern;

    // Replace the placeholders in the pattern with a unique UUID
    code = code.replace('{5}', uuidv4().slice(0, 5));

    // Check if the generated code is unique before adding it to the array
    if (!referralCodes.includes(code)) {
      referralCodes.push(code);
    } else {
      // If the code is not unique, generate a new one and continue the loop
      i--;
    }
  }

  return referralCodes;
}

// Function to check if a referral code is valid for the Test E-Commerce Store
export function isValidReferralCode(code: string): boolean {
  // Check if the code matches the pattern and length of the generated referral codes
  return code.match(/^TEST-REF-\w{5}$/) && code.length === 20;
}

// Function to validate the referral code format and length
function validateReferralCodeFormat(code: string): boolean {
  return code.match(/^TEST-REF-\w{5}$/) && code.length === 20;
}

// Function to generate unique referral codes for the Test E-Commerce Store
// This function also checks if the generated code is valid before adding it to the array
export async function generateAndValidateReferralCode(quantity: number): Promise<string[]> {
  const referralCodes: string[] = [];
  const codePattern = 'TEST-REF-{5}'; // Pattern for the referral code format

  // Ensure the pattern is consistent with the business context
  if (!codePattern.match(/^TEST-REF-\w{5}$/)) {
    throw new Error('Invalid referral code pattern');
  }

  // Loop through the requested quantity of referral codes
  for (let i = 0; i < quantity; i++) {
    let code = codePattern;

    // Replace the placeholders in the pattern with a unique UUID
    code = code.replace('{5}', uuidv4().slice(0, 5));

    // Check if the generated code is valid before adding it to the array
    if (validateReferralCodeFormat(code)) {
      if (!referralCodes.includes(code)) {
        referralCodes.push(code);
      } else {
        // If the code is not unique, generate a new one and continue the loop
        i--;
      }
    } else {
      // If the code is not valid, generate a new one and continue the loop
      i--;
    }
  }

  return referralCodes;
}

// Function to handle edge cases when generating referral codes
async function generateReferralCodeWithRetry(quantity: number): Promise<string[]> {
  let generatedCodes: string[] = [];
  let attempts = 10; // Set a maximum number of attempts to avoid infinite loops

  while (generatedCodes.length < quantity && attempts > 0) {
    generatedCodes = await generateAndValidateReferralCode(quantity);
    attempts--;
  }

  if (generatedCodes.length < quantity) {
    throw new Error('Failed to generate the required number of unique referral codes');
  }

  return generatedCodes;
}

// Function to handle edge cases when checking if a referral code is valid
function isValidReferralCodeWithRetry(code: string): boolean {
  let attempts = 3; // Set a maximum number of attempts to avoid infinite loops

  while (attempts > 0 && !isValidReferralCode(code)) {
    code = code.toUpperCase(); // Handle case sensitivity
    attempts--;
  }

  return attempts > 0;
}