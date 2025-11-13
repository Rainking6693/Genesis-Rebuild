import { WellnessReport, EmployeeData, WellnessMetrics, Intervention, HRContact } from './types';

// Custom validation functions

function isEmployeeData(employeeData: any): employeeData is EmployeeData {
  return (
    typeof employeeData.name === 'string' &&
    typeof employeeData.email === 'string' &&
    employeeData.name.length > 0 &&
    employeeData.email.includes('@')
  );
}

function isWellnessMetrics(wellnessMetrics: any): wellnessMetrics is WellnessMetrics {
  return (
    typeof wellnessMetrics.scores === 'object' &&
    typeof wellnessMetrics.checkInHistory === 'object'
  );
}

function isInterventionRecommendations(interventionRecommendations: any): interventionRecommendations is Intervention[] {
  return Array.isArray(interventionRecommendations);
}

function isHRContact(HRContact: any): HRContact is HRContact {
  return (
    typeof HRContact.name === 'string' &&
    typeof HRContact.email === 'string' &&
    typeof HRContact.phone === 'string'
  );
}

// Cache for wellness status to improve performance
const wellnessStatusCache: { [key: string]: WellnessReport } = {};

// Main function to generate wellness report
function generateWellnessReport(
  employeeData: EmployeeData,
  wellnessMetrics: WellnessMetrics,
  interventionRecommendations: Intervention[],
  HRContact: HRContact
): WellnessReport {
  if (!isEmployeeData(employeeData)) {
    throw new Error('Invalid employee data: name and email are required.');
  }
  if (!isWellnessMetrics(wellnessMetrics)) {
    throw new Error('Invalid wellness metrics: scores and checkInHistory are required.');
  }
  if (!isInterventionRecommendations(interventionRecommendations)) {
    throw new Error('Invalid intervention recommendations: must be an array.');
  }
  if (!isHRContact(HRContact)) {
    throw new Error('Invalid HR contact: name, email, and phone are required.');
  }

  const wellnessStatusKey = JSON.stringify([employeeData, wellnessMetrics]);
  if (wellnessStatusCache[wellnessStatusKey]) {
    return wellnessStatusCache[wellnessStatusKey];
  }

  const wellnessStatus = calculateWellnessStatus(wellnessMetrics);
  const recommendations = filterRelevantInterventions(interventionRecommendations, wellnessStatus);

  // Perform additional analysis and calculations based on employeeData and wellnessMetrics if needed

  const wellnessReport: WellnessReport = {
    employeeName: employeeData.name,
    employeeEmail: employeeData.email,
    wellnessStatus,
    recommendations,
    hrContact: HRContact
  };

  wellnessStatusCache[wellnessStatusKey] = wellnessReport;
  return wellnessReport;
}

import { WellnessReport, EmployeeData, WellnessMetrics, Intervention, HRContact } from './types';

// Custom validation functions

function isEmployeeData(employeeData: any): employeeData is EmployeeData {
  return (
    typeof employeeData.name === 'string' &&
    typeof employeeData.email === 'string' &&
    employeeData.name.length > 0 &&
    employeeData.email.includes('@')
  );
}

function isWellnessMetrics(wellnessMetrics: any): wellnessMetrics is WellnessMetrics {
  return (
    typeof wellnessMetrics.scores === 'object' &&
    typeof wellnessMetrics.checkInHistory === 'object'
  );
}

function isInterventionRecommendations(interventionRecommendations: any): interventionRecommendations is Intervention[] {
  return Array.isArray(interventionRecommendations);
}

function isHRContact(HRContact: any): HRContact is HRContact {
  return (
    typeof HRContact.name === 'string' &&
    typeof HRContact.email === 'string' &&
    typeof HRContact.phone === 'string'
  );
}

// Cache for wellness status to improve performance
const wellnessStatusCache: { [key: string]: WellnessReport } = {};

// Main function to generate wellness report
function generateWellnessReport(
  employeeData: EmployeeData,
  wellnessMetrics: WellnessMetrics,
  interventionRecommendations: Intervention[],
  HRContact: HRContact
): WellnessReport {
  if (!isEmployeeData(employeeData)) {
    throw new Error('Invalid employee data: name and email are required.');
  }
  if (!isWellnessMetrics(wellnessMetrics)) {
    throw new Error('Invalid wellness metrics: scores and checkInHistory are required.');
  }
  if (!isInterventionRecommendations(interventionRecommendations)) {
    throw new Error('Invalid intervention recommendations: must be an array.');
  }
  if (!isHRContact(HRContact)) {
    throw new Error('Invalid HR contact: name, email, and phone are required.');
  }

  const wellnessStatusKey = JSON.stringify([employeeData, wellnessMetrics]);
  if (wellnessStatusCache[wellnessStatusKey]) {
    return wellnessStatusCache[wellnessStatusKey];
  }

  const wellnessStatus = calculateWellnessStatus(wellnessMetrics);
  const recommendations = filterRelevantInterventions(interventionRecommendations, wellnessStatus);

  // Perform additional analysis and calculations based on employeeData and wellnessMetrics if needed

  const wellnessReport: WellnessReport = {
    employeeName: employeeData.name,
    employeeEmail: employeeData.email,
    wellnessStatus,
    recommendations,
    hrContact: HRContact
  };

  wellnessStatusCache[wellnessStatusKey] = wellnessReport;
  return wellnessReport;
}