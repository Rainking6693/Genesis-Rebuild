import { isNumber } from 'util';

type AverageReviewScore = number;
type ReviewScore = number;

function isValidScore(score: ReviewScore): boolean {
  return score >= 1 && score <= 5;
}

function isValidArrayOfScores(scores: ReviewScore[]): boolean {
  return scores.every(isValidScore);
}

function calculateAverageReviewScore(scores: ReviewScore[]): AverageReviewScore | null {
  if (!Array.isArray(scores) || !isValidArrayOfScores(scores)) {
    return null;
  }

  const total = scores.reduce((acc, score) => acc + score, 0);
  const average = total / scores.length;

  // Round the average score to two decimal places
  return Math.round(average * 100) / 100;
}

const score1 = 4;
const score2 = 5;
const scores: ReviewScore[] = [score1, score2];
const averageScore = calculateAverageReviewScore(scores);
console.log(averageScore); // Output: 4.5

import { isNumber } from 'util';

type AverageReviewScore = number;
type ReviewScore = number;

function isValidScore(score: ReviewScore): boolean {
  return score >= 1 && score <= 5;
}

function isValidArrayOfScores(scores: ReviewScore[]): boolean {
  return scores.every(isValidScore);
}

function calculateAverageReviewScore(scores: ReviewScore[]): AverageReviewScore | null {
  if (!Array.isArray(scores) || !isValidArrayOfScores(scores)) {
    return null;
  }

  const total = scores.reduce((acc, score) => acc + score, 0);
  const average = total / scores.length;

  // Round the average score to two decimal places
  return Math.round(average * 100) / 100;
}

const score1 = 4;
const score2 = 5;
const scores: ReviewScore[] = [score1, score2];
const averageScore = calculateAverageReviewScore(scores);
console.log(averageScore); // Output: 4.5