import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import * as chalk from 'chalk';

interface Deployment {
  environment: string;
  force: boolean;
}

function deployToProduction(env: string, force = false): Promise<void> {
  const deployment: Deployment = {
    environment: env,
    force,
  };

  // Check if the provided environment is valid
  const validEnvironments = ['development', 'staging', 'production'];
  if (!validEnvironments.includes(deployment.environment)) {
    throw new Error(`Invalid environment: ${deployment.environment}`);
  }

  // Check if the deployment is forced or if the current deployment matches the target environment
  const currentDeploymentFile = path.join(process.cwd(), '.current-deployment');
  let currentDeployment: Deployment | null = null;

  try {
    const currentDeploymentContent = fs.readFileSync(currentDeploymentFile, 'utf-8');
    currentDeployment = JSON.parse(currentDeploymentContent);
  } catch (err) {
    // If the current deployment file doesn't exist or is invalid, assume no deployment is currently active
  }

  if (
    (!currentDeployment || currentDeployment.environment !== deployment.environment) &&
    (!deployment.force)
  ) {
    throw new Error('Another deployment is currently active or forced deployment is not enabled.');
  }

  // Perform deployment logic here (e.g., build, deploy, etc.)
  console.log(
    chalk.green(`Deploying to ${deployment.environment} environment${deployment.force ? ' (forced)' : ''}`)
  );

  // Update the current deployment file
  fs.writeFileSync(
    currentDeploymentFile,
    JSON.stringify(deployment),
    { encoding: 'utf-8', flag: 'w' }
  );

  return Promise.resolve();
}

import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import * as chalk from 'chalk';

interface Deployment {
  environment: string;
  force: boolean;
}

function deployToProduction(env: string, force = false): Promise<void> {
  const deployment: Deployment = {
    environment: env,
    force,
  };

  // Check if the provided environment is valid
  const validEnvironments = ['development', 'staging', 'production'];
  if (!validEnvironments.includes(deployment.environment)) {
    throw new Error(`Invalid environment: ${deployment.environment}`);
  }

  // Check if the deployment is forced or if the current deployment matches the target environment
  const currentDeploymentFile = path.join(process.cwd(), '.current-deployment');
  let currentDeployment: Deployment | null = null;

  try {
    const currentDeploymentContent = fs.readFileSync(currentDeploymentFile, 'utf-8');
    currentDeployment = JSON.parse(currentDeploymentContent);
  } catch (err) {
    // If the current deployment file doesn't exist or is invalid, assume no deployment is currently active
  }

  if (
    (!currentDeployment || currentDeployment.environment !== deployment.environment) &&
    (!deployment.force)
  ) {
    throw new Error('Another deployment is currently active or forced deployment is not enabled.');
  }

  // Perform deployment logic here (e.g., build, deploy, etc.)
  console.log(
    chalk.green(`Deploying to ${deployment.environment} environment${deployment.force ? ' (forced)' : ''}`)
  );

  // Update the current deployment file
  fs.writeFileSync(
    currentDeploymentFile,
    JSON.stringify(deployment),
    { encoding: 'utf-8', flag: 'w' }
  );

  return Promise.resolve();
}