import { ValidationError } from 'class-validator';

interface Requirement {
  requirement: string;
  description: string;
  priority: number;
  category: string;
}

interface Requirements {
  [category: string]: Requirement[];
}

/**
 * Function to gather requirements for the Review Rocket SaaS platform.
 * This function should be called with an object argument containing the necessary requirements.
 * The object should include keys for each requirement, and values for their respective descriptions.
 *
 * @param requirements - An object containing the requirements and their respective details.
 * @throws {ValidationError} If any required fields are missing.
 */
function gatherRequirements(requirements: { [key: string]: string }): Requirements {
  const validationErrors: ValidationError[] = [];

  // Validate input
  const requiredFields = ['requirement', 'description'];
  Object.keys(requirements).forEach((key) => {
    requiredFields.forEach((field) => {
      if (!requirements[key] || !requirements[key].trim()) {
        validationErrors.push(new ValidationError(`The ${field} field is required.`, { children: { [key]: { message: `The ${field} field is required.` } } }));
      }
    });
  });

  if (validationErrors.length > 0) {
    throw new Error('Validation errors occurred: ' + validationErrors.map((error) => error.message).join(', '));
  }

  // Default category and priority
  const defaultCategory = 'functionality';
  const defaultPriority = 1;

  // Store the requirement in a secure and organized manner
  const requirementsObject: Requirements = {};
  Object.keys(requirements).forEach((key) => {
    const requirement = requirements[key];
    const category = key || defaultCategory;

    // Extract priority from the requirement string if it exists
    const priorityMatch = /-(\d+)$/.exec(requirement);
    let priority = Number.isNaN(priorityMatch[1]) ? defaultPriority : parseInt(priorityMatch[1]);

    // If the priority is not a number, set it to the default value
    if (isNaN(priority)) {
      priority = defaultPriority;
    }

    requirementsObject[category] = requirementsObject[category] || [];
    requirementsObject[category].push({ requirement, description: requirement.split('-')[0], priority });
  });

  return requirementsObject;
}

import { ValidationError } from 'class-validator';

interface Requirement {
  requirement: string;
  description: string;
  priority: number;
  category: string;
}

interface Requirements {
  [category: string]: Requirement[];
}

/**
 * Function to gather requirements for the Review Rocket SaaS platform.
 * This function should be called with an object argument containing the necessary requirements.
 * The object should include keys for each requirement, and values for their respective descriptions.
 *
 * @param requirements - An object containing the requirements and their respective details.
 * @throws {ValidationError} If any required fields are missing.
 */
function gatherRequirements(requirements: { [key: string]: string }): Requirements {
  const validationErrors: ValidationError[] = [];

  // Validate input
  const requiredFields = ['requirement', 'description'];
  Object.keys(requirements).forEach((key) => {
    requiredFields.forEach((field) => {
      if (!requirements[key] || !requirements[key].trim()) {
        validationErrors.push(new ValidationError(`The ${field} field is required.`, { children: { [key]: { message: `The ${field} field is required.` } } }));
      }
    });
  });

  if (validationErrors.length > 0) {
    throw new Error('Validation errors occurred: ' + validationErrors.map((error) => error.message).join(', '));
  }

  // Default category and priority
  const defaultCategory = 'functionality';
  const defaultPriority = 1;

  // Store the requirement in a secure and organized manner
  const requirementsObject: Requirements = {};
  Object.keys(requirements).forEach((key) => {
    const requirement = requirements[key];
    const category = key || defaultCategory;

    // Extract priority from the requirement string if it exists
    const priorityMatch = /-(\d+)$/.exec(requirement);
    let priority = Number.isNaN(priorityMatch[1]) ? defaultPriority : parseInt(priorityMatch[1]);

    // If the priority is not a number, set it to the default value
    if (isNaN(priority)) {
      priority = defaultPriority;
    }

    requirementsObject[category] = requirementsObject[category] || [];
    requirementsObject[category].push({ requirement, description: requirement.split('-')[0], priority });
  });

  return requirementsObject;
}