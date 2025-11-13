import { SentimentAnalyzer, FakeReviewDetector, ResponseGenerator } from './interfaces';

export interface Review {
  content: string;
  length: number;
}

export interface ReviewProcessorOptions {
  sentimentAnalyzer: SentimentAnalyzer;
  fakeReviewDetector: FakeReviewDetector;
  responseGenerator: ResponseGenerator;
  maxReviewLength?: number;
  minReviewLength?: number;
}

export class ReviewProcessor {
  private options: ReviewProcessorOptions;

  constructor(options?: ReviewProcessorOptions) {
    this.options = this.validateOptions(options);
  }

  private validateOptions(options?: ReviewProcessorOptions): ReviewProcessorOptions {
    if (!options) {
      options = {
        maxReviewLength: 500,
        minReviewLength: 1,
      };
    }

    if (
      !options.sentimentAnalyzer ||
      !options.fakeReviewDetector ||
      !options.responseGenerator ||
      typeof options.sentimentAnalyzer !== 'object' ||
      typeof options.fakeReviewDetector !== 'object' ||
      typeof options.responseGenerator !== 'object'
    ) {
      throw new Error('Invalid ReviewProcessorOptions');
    }

    return options;
  }

  public validateReview(review: string): Review {
    const reviewObj: Review = {
      content: review,
      length: review.length,
    };

    if (!reviewObj.content || reviewObj.length < this.options.minReviewLength || reviewObj.length > this.options.maxReviewLength) {
      throw new Error(`Invalid review: ${reviewObj.content}. Review length should be between ${this.options.minReviewLength} and ${this.options.maxReviewLength}`);
    }

    return reviewObj;
  }

  public processReview(review: string, brandVoice: string, options?: ReviewProcessorOptions): string | null {
    const validatedReview = this.validateReview(review);

    try {
      // Detect sentiment of the review
      const sentiment = this.options.sentimentAnalyzer.analyze(validatedReview.content);

      // Detect if the review is fake
      const isFake = this.options.fakeReviewDetector.detect(validatedReview.content);

      // Generate a personalized response based on the sentiment and brand voice
      const response = this.options.responseGenerator.generate(validatedReview.content, sentiment, brandVoice);

      return response;
    } catch (error) {
      this.handleError(error, validatedReview.content);
      return null;
    }
  }

  private handleError(error: Error, reviewContent: string) {
    console.error(`Error processing review "${reviewContent}": ${error.message}`);
  }
}

import { SentimentAnalyzer, FakeReviewDetector, ResponseGenerator } from './interfaces';

export interface Review {
  content: string;
  length: number;
}

export interface ReviewProcessorOptions {
  sentimentAnalyzer: SentimentAnalyzer;
  fakeReviewDetector: FakeReviewDetector;
  responseGenerator: ResponseGenerator;
  maxReviewLength?: number;
  minReviewLength?: number;
}

export class ReviewProcessor {
  private options: ReviewProcessorOptions;

  constructor(options?: ReviewProcessorOptions) {
    this.options = this.validateOptions(options);
  }

  private validateOptions(options?: ReviewProcessorOptions): ReviewProcessorOptions {
    if (!options) {
      options = {
        maxReviewLength: 500,
        minReviewLength: 1,
      };
    }

    if (
      !options.sentimentAnalyzer ||
      !options.fakeReviewDetector ||
      !options.responseGenerator ||
      typeof options.sentimentAnalyzer !== 'object' ||
      typeof options.fakeReviewDetector !== 'object' ||
      typeof options.responseGenerator !== 'object'
    ) {
      throw new Error('Invalid ReviewProcessorOptions');
    }

    return options;
  }

  public validateReview(review: string): Review {
    const reviewObj: Review = {
      content: review,
      length: review.length,
    };

    if (!reviewObj.content || reviewObj.length < this.options.minReviewLength || reviewObj.length > this.options.maxReviewLength) {
      throw new Error(`Invalid review: ${reviewObj.content}. Review length should be between ${this.options.minReviewLength} and ${this.options.maxReviewLength}`);
    }

    return reviewObj;
  }

  public processReview(review: string, brandVoice: string, options?: ReviewProcessorOptions): string | null {
    const validatedReview = this.validateReview(review);

    try {
      // Detect sentiment of the review
      const sentiment = this.options.sentimentAnalyzer.analyze(validatedReview.content);

      // Detect if the review is fake
      const isFake = this.options.fakeReviewDetector.detect(validatedReview.content);

      // Generate a personalized response based on the sentiment and brand voice
      const response = this.options.responseGenerator.generate(validatedReview.content, sentiment, brandVoice);

      return response;
    } catch (error) {
      this.handleError(error, validatedReview.content);
      return null;
    }
  }

  private handleError(error: Error, reviewContent: string) {
    console.error(`Error processing review "${reviewContent}": ${error.message}`);
  }
}