import { SentimentAnalyzer } from './sentiment-analyzer';
import { BrandVoiceTrainer } from './brand-voice-trainer';

interface ReviewResponse {
  platform: string;
  reviewId: string;
  sentiment: string; // positive, negative, neutral
  text: string; // review text
  reviewerName?: string; // Optional reviewer name for personalized responses
  reviewerEmail?: string; // Optional reviewer email for direct follow-up
  [key: string]: any; // Allow for extensibility with custom fields
}

interface ReviewResponseOptions {
  review: ReviewResponse;
  brandVoice?: string; // Make brandVoice optional
  defaultNegativeResponse?: string;
  defaultPositiveResponse?: string;
  defaultNeutralResponse?: string;
  contactEmail?: string;
  [key: string]: any; // Allow for extensibility with custom fields
}

const DEFAULT_CONTACT_EMAIL = 'support@example.com';
const DEFAULT_REVIEWER_NAME = 'Valued Customer';
const DEFAULT_NEGATIVE_RESPONSE = "Dear {reviewerName}, we're truly sorry to hear about your experience. We value your feedback and are committed to making things right. Please contact us at {contactEmail} so we can address your concerns. Thank you for bringing this to our attention.";
const DEFAULT_POSITIVE_RESPONSE = "Thank you, {reviewerName}, for taking the time to share your positive feedback! We're thrilled to hear that you're happy with our service. Your satisfaction is our top priority, and we're glad we could meet your expectations. Keep the reviews coming!";
const DEFAULT_NEUTRAL_RESPONSE = "Hello {reviewerName}, we appreciate your feedback. It helps us improve our service. If you have any specific comments or suggestions, please don't hesitate to share them with us. Thank you for choosing Review Rocket!";
const DEFAULT_EMPTY_REVIEW_RESPONSE = "Hello {reviewerName}, thank you for your feedback. We appreciate you taking the time to share your thoughts.";

class ReviewRocket {
  private sentimentAnalyzer: SentimentAnalyzer;
  private brandVoiceTrainer: BrandVoiceTrainer;
  private readonly defaultContactEmail: string;

  constructor(contactEmail: string = DEFAULT_CONTACT_EMAIL) {
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.brandVoiceTrainer = new BrandVoiceTrainer();
    this.defaultContactEmail = contactEmail;
  }

  /**
   * Generates a response to a review based on its sentiment and brand voice.
   * @param review The review object containing the review details.
   * @param options Optional parameters to customize the response generation.
   * @returns A promise that resolves to the generated response string.  Rejects on error.
   * @throws Error if sentiment analysis or brand voice training fails.
   */
  public async generateResponse(review: ReviewResponse, options: ReviewResponseOptions = {}): Promise<string> {
    if (!review) {
      throw new Error('Review object cannot be null or undefined.');
    }

    if (typeof review.text !== 'string') {
      console.warn('Review text is not a string. Returning a default neutral response.');
      return this.getDefaultNeutralResponse(review, options);
    }

    const trimmedText = review.text.trim();
    if (trimmedText === '') {
      console.warn('Review text is empty. Returning a default neutral response.');
      return this.getDefaultNeutralResponse(review, options);
    }

    try {
      const sentiment = await this.analyzeSentiment(trimmedText);
      const brandVoice = options.brandVoice ? await this.trainBrandVoice(sentiment) : ''; // Only train if brandVoice is provided

      let responseText = this.getResponseText(review, sentiment, options);

      return this.applyBrandVoice(responseText, brandVoice);

    } catch (error: any) { // Explicitly type error as any
      console.error('Error generating response:', error);
      // Provide more context in the error message
      throw new Error(`Failed to generate response for review ID ${review.reviewId} on platform ${review.platform}: ${error.message}`);
    }
  }

  private async analyzeSentiment(text: string): Promise<string> {
    try {
      const sentiment = await this.sentimentAnalyzer.analyze(text);
      if (!['positive', 'negative', 'neutral'].includes(sentiment)) {
        console.warn(`Invalid sentiment returned from analyzer: ${sentiment}. Defaulting to neutral.`);
        return 'neutral'; // Handle unexpected sentiment values
      }
      return sentiment;
    } catch (error: any) {
      console.error('Sentiment analysis failed:', error);
      // Consider a fallback sentiment or a circuit breaker pattern if the sentiment analyzer is consistently failing.
      throw new Error('Failed to analyze sentiment: ' + error.message);
    }
  }

  private async trainBrandVoice(sentiment: string): Promise<string> {
    try {
      return await this.brandVoiceTrainer.train(sentiment);
    } catch (error: any) {
      console.error('Brand voice training failed:', error);
      // Consider a fallback brand voice or a circuit breaker pattern if the trainer is consistently failing.
      throw new Error('Failed to train brand voice: ' + error.message);
    }
  }

  private getResponseText(review: ReviewResponse, sentiment: string, options: ReviewResponseOptions): string {
    const reviewerName = review.reviewerName || DEFAULT_REVIEWER_NAME;
    const contactEmail = options?.contactEmail || this.defaultContactEmail;

    let responseText: string;

    switch (sentiment) {
      case 'negative':
        responseText = options?.defaultNegativeResponse || DEFAULT_NEGATIVE_RESPONSE;
        break;
      case 'positive':
        responseText = options?.defaultPositiveResponse || DEFAULT_POSITIVE_RESPONSE;
        break;
      default:
        responseText = options?.defaultNeutralResponse || DEFAULT_NEUTRAL_RESPONSE;
    }

    // Replace placeholders with actual values.  Use a helper function for clarity and testability.
    return this.replacePlaceholders(responseText, { reviewerName, contactEmail });
  }

  private getDefaultNeutralResponse(review: ReviewResponse, options: ReviewResponseOptions): string {
    const reviewerName = review.reviewerName || DEFAULT_REVIEWER_NAME;
    const responseText = options?.defaultNeutralResponse || DEFAULT_EMPTY_REVIEW_RESPONSE;
    return this.replacePlaceholders(responseText, { reviewerName });
  }

  private applyBrandVoice(text: string, brandVoice: string): string {
    if (!brandVoice || brandVoice.trim() === '') {
      console.warn('Brand voice is empty or whitespace. Returning original text.');
      return text;
    }

    // More robust brand voice application using a configuration object.
    // Example:
    // const brandVoiceConfig = {
    //   replacements: [
    //     { find: 'Review Rocket', replace: brandVoice, caseInsensitive: true },
    //     { find: 'customer', replace: 'client', caseInsensitive: false }
    //   ],
    //   prefix: 'We at [Brand] are...',
    //   suffix: 'Thanks from [Brand]!'
    // };
    // return this.applyBrandVoiceConfig(text, brandVoiceConfig);

    // Simple replacement as before, but with trim to avoid whitespace issues.
    const regex = new RegExp('Review Rocket', 'gi');
    return text.replace(regex, brandVoice.trim());
  }

  private replacePlaceholders(text: string, data: { [key: string]: string }): string {
    let replacedText = text;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const placeholder = new RegExp(`{${key}}`, 'g');
        replacedText = replacedText.replace(placeholder, data[key]);
      }
    }
    return replacedText;
  }

  // Example of a more configurable brand voice application (not used in the main flow, but kept for illustration)
  private applyBrandVoiceConfig(text: string, config: any): string {
    let modifiedText = text;

    if (config.replacements && Array.isArray(config.replacements)) {
      config.replacements.forEach((replacement: any) => {
        const regex = new RegExp(replacement.find, replacement.caseInsensitive ? 'gi' : 'g');
        modifiedText = modifiedText.replace(regex, replacement.replace);
      });
    }

    if (config.prefix) {
      modifiedText = config.prefix + ' ' + modifiedText;
    }

    if (config.suffix) {
      modifiedText += ' ' + config.suffix;
    }

    return modifiedText;
  }
}

export { ReviewRocket, ReviewResponse, ReviewResponseOptions };

import { SentimentAnalyzer } from './sentiment-analyzer';
import { BrandVoiceTrainer } from './brand-voice-trainer';

interface ReviewResponse {
  platform: string;
  reviewId: string;
  sentiment: string; // positive, negative, neutral
  text: string; // review text
  reviewerName?: string; // Optional reviewer name for personalized responses
  reviewerEmail?: string; // Optional reviewer email for direct follow-up
  [key: string]: any; // Allow for extensibility with custom fields
}

interface ReviewResponseOptions {
  review: ReviewResponse;
  brandVoice?: string; // Make brandVoice optional
  defaultNegativeResponse?: string;
  defaultPositiveResponse?: string;
  defaultNeutralResponse?: string;
  contactEmail?: string;
  [key: string]: any; // Allow for extensibility with custom fields
}

const DEFAULT_CONTACT_EMAIL = 'support@example.com';
const DEFAULT_REVIEWER_NAME = 'Valued Customer';
const DEFAULT_NEGATIVE_RESPONSE = "Dear {reviewerName}, we're truly sorry to hear about your experience. We value your feedback and are committed to making things right. Please contact us at {contactEmail} so we can address your concerns. Thank you for bringing this to our attention.";
const DEFAULT_POSITIVE_RESPONSE = "Thank you, {reviewerName}, for taking the time to share your positive feedback! We're thrilled to hear that you're happy with our service. Your satisfaction is our top priority, and we're glad we could meet your expectations. Keep the reviews coming!";
const DEFAULT_NEUTRAL_RESPONSE = "Hello {reviewerName}, we appreciate your feedback. It helps us improve our service. If you have any specific comments or suggestions, please don't hesitate to share them with us. Thank you for choosing Review Rocket!";
const DEFAULT_EMPTY_REVIEW_RESPONSE = "Hello {reviewerName}, thank you for your feedback. We appreciate you taking the time to share your thoughts.";

class ReviewRocket {
  private sentimentAnalyzer: SentimentAnalyzer;
  private brandVoiceTrainer: BrandVoiceTrainer;
  private readonly defaultContactEmail: string;

  constructor(contactEmail: string = DEFAULT_CONTACT_EMAIL) {
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.brandVoiceTrainer = new BrandVoiceTrainer();
    this.defaultContactEmail = contactEmail;
  }

  /**
   * Generates a response to a review based on its sentiment and brand voice.
   * @param review The review object containing the review details.
   * @param options Optional parameters to customize the response generation.
   * @returns A promise that resolves to the generated response string.  Rejects on error.
   * @throws Error if sentiment analysis or brand voice training fails.
   */
  public async generateResponse(review: ReviewResponse, options: ReviewResponseOptions = {}): Promise<string> {
    if (!review) {
      throw new Error('Review object cannot be null or undefined.');
    }

    if (typeof review.text !== 'string') {
      console.warn('Review text is not a string. Returning a default neutral response.');
      return this.getDefaultNeutralResponse(review, options);
    }

    const trimmedText = review.text.trim();
    if (trimmedText === '') {
      console.warn('Review text is empty. Returning a default neutral response.');
      return this.getDefaultNeutralResponse(review, options);
    }

    try {
      const sentiment = await this.analyzeSentiment(trimmedText);
      const brandVoice = options.brandVoice ? await this.trainBrandVoice(sentiment) : ''; // Only train if brandVoice is provided

      let responseText = this.getResponseText(review, sentiment, options);

      return this.applyBrandVoice(responseText, brandVoice);

    } catch (error: any) { // Explicitly type error as any
      console.error('Error generating response:', error);
      // Provide more context in the error message
      throw new Error(`Failed to generate response for review ID ${review.reviewId} on platform ${review.platform}: ${error.message}`);
    }
  }

  private async analyzeSentiment(text: string): Promise<string> {
    try {
      const sentiment = await this.sentimentAnalyzer.analyze(text);
      if (!['positive', 'negative', 'neutral'].includes(sentiment)) {
        console.warn(`Invalid sentiment returned from analyzer: ${sentiment}. Defaulting to neutral.`);
        return 'neutral'; // Handle unexpected sentiment values
      }
      return sentiment;
    } catch (error: any) {
      console.error('Sentiment analysis failed:', error);
      // Consider a fallback sentiment or a circuit breaker pattern if the sentiment analyzer is consistently failing.
      throw new Error('Failed to analyze sentiment: ' + error.message);
    }
  }

  private async trainBrandVoice(sentiment: string): Promise<string> {
    try {
      return await this.brandVoiceTrainer.train(sentiment);
    } catch (error: any) {
      console.error('Brand voice training failed:', error);
      // Consider a fallback brand voice or a circuit breaker pattern if the trainer is consistently failing.
      throw new Error('Failed to train brand voice: ' + error.message);
    }
  }

  private getResponseText(review: ReviewResponse, sentiment: string, options: ReviewResponseOptions): string {
    const reviewerName = review.reviewerName || DEFAULT_REVIEWER_NAME;
    const contactEmail = options?.contactEmail || this.defaultContactEmail;

    let responseText: string;

    switch (sentiment) {
      case 'negative':
        responseText = options?.defaultNegativeResponse || DEFAULT_NEGATIVE_RESPONSE;
        break;
      case 'positive':
        responseText = options?.defaultPositiveResponse || DEFAULT_POSITIVE_RESPONSE;
        break;
      default:
        responseText = options?.defaultNeutralResponse || DEFAULT_NEUTRAL_RESPONSE;
    }

    // Replace placeholders with actual values.  Use a helper function for clarity and testability.
    return this.replacePlaceholders(responseText, { reviewerName, contactEmail });
  }

  private getDefaultNeutralResponse(review: ReviewResponse, options: ReviewResponseOptions): string {
    const reviewerName = review.reviewerName || DEFAULT_REVIEWER_NAME;
    const responseText = options?.defaultNeutralResponse || DEFAULT_EMPTY_REVIEW_RESPONSE;
    return this.replacePlaceholders(responseText, { reviewerName });
  }

  private applyBrandVoice(text: string, brandVoice: string): string {
    if (!brandVoice || brandVoice.trim() === '') {
      console.warn('Brand voice is empty or whitespace. Returning original text.');
      return text;
    }

    // More robust brand voice application using a configuration object.
    // Example:
    // const brandVoiceConfig = {
    //   replacements: [
    //     { find: 'Review Rocket', replace: brandVoice, caseInsensitive: true },
    //     { find: 'customer', replace: 'client', caseInsensitive: false }
    //   ],
    //   prefix: 'We at [Brand] are...',
    //   suffix: 'Thanks from [Brand]!'
    // };
    // return this.applyBrandVoiceConfig(text, brandVoiceConfig);

    // Simple replacement as before, but with trim to avoid whitespace issues.
    const regex = new RegExp('Review Rocket', 'gi');
    return text.replace(regex, brandVoice.trim());
  }

  private replacePlaceholders(text: string, data: { [key: string]: string }): string {
    let replacedText = text;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const placeholder = new RegExp(`{${key}}`, 'g');
        replacedText = replacedText.replace(placeholder, data[key]);
      }
    }
    return replacedText;
  }

  // Example of a more configurable brand voice application (not used in the main flow, but kept for illustration)
  private applyBrandVoiceConfig(text: string, config: any): string {
    let modifiedText = text;

    if (config.replacements && Array.isArray(config.replacements)) {
      config.replacements.forEach((replacement: any) => {
        const regex = new RegExp(replacement.find, replacement.caseInsensitive ? 'gi' : 'g');
        modifiedText = modifiedText.replace(regex, replacement.replace);
      });
    }

    if (config.prefix) {
      modifiedText = config.prefix + ' ' + modifiedText;
    }

    if (config.suffix) {
      modifiedText += ' ' + config.suffix;
    }

    return modifiedText;
  }
}

export { ReviewRocket, ReviewResponse, ReviewResponseOptions };