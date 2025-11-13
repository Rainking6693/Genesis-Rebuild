import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { SlackClient, TeamsClient } from './integrations';
import { MoodTracker, BurnoutDetector, InterventionService } from './services';

const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for large requests
app.use(cors());

// Initialize clients and services
const slackClient = new SlackClient();
const teamsClient = new TeamsClient();
const moodTracker = new MoodTracker(slackClient, teamsClient);
const burnoutDetector = new BurnoutDetector(moodTracker);
const interventionService = new InterventionService();

// API endpoints
app.post('/api/mood', async (req, res) => {
  try {
    const moodData = req.body;
    if (!moodData || !moodData.employeeId) {
      throw new Error('Missing employeeId in mood data');
    }
    await moodTracker.trackMood(moodData);
    res.status(200).send('Mood data received');
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.get('/api/burnout-risk/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      throw new Error('Missing employeeId in request');
    }
    const burnoutRisk = await burnoutDetector.detectBurnoutRisk(employeeId);
    res.status(200).send(burnoutRisk);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.get('/api/interventions/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      throw new Error('Missing employeeId in request');
    }
    const interventions = await interventionService.getInterventions(employeeId);
    res.status(200).send(interventions);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// Custom error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.message);
  res.status(err.statusCode || 500).send(err.message);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { SlackClient, TeamsClient } from './integrations';
import { MoodTracker, BurnoutDetector, InterventionService } from './services';

const app = express();
app.use(bodyParser.json({ limit: '50mb' })); // Increase limit for large requests
app.use(cors());

// Initialize clients and services
const slackClient = new SlackClient();
const teamsClient = new TeamsClient();
const moodTracker = new MoodTracker(slackClient, teamsClient);
const burnoutDetector = new BurnoutDetector(moodTracker);
const interventionService = new InterventionService();

// API endpoints
app.post('/api/mood', async (req, res) => {
  try {
    const moodData = req.body;
    if (!moodData || !moodData.employeeId) {
      throw new Error('Missing employeeId in mood data');
    }
    await moodTracker.trackMood(moodData);
    res.status(200).send('Mood data received');
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.get('/api/burnout-risk/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      throw new Error('Missing employeeId in request');
    }
    const burnoutRisk = await burnoutDetector.detectBurnoutRisk(employeeId);
    res.status(200).send(burnoutRisk);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

app.get('/api/interventions/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    if (!employeeId) {
      throw new Error('Missing employeeId in request');
    }
    const interventions = await interventionService.getInterventions(employeeId);
    res.status(200).send(interventions);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

// Custom error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.message);
  res.status(err.statusCode || 500).send(err.message);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});