import { MoodTracker } from './moodTracker';
import { ProductRecommender } from './productRecommender';
import { NotificationService } from './notificationService';

interface SupportBotOptions {
  moodTracker: MoodTracker;
  productRecommender: ProductRecommender;
  notificationService: NotificationService;
}

interface NotificationService {
  sendMessage(userId: number, message: string): Promise<void>;
}

export class CustomerSupportBot {
  private options: SupportBotOptions;

  constructor(options: SupportBotOptions) {
    this.options = options;
  }

  private validateUserId(userId: number): void {
    if (typeof userId !== 'number') {
      throw new Error('Invalid user ID');
    }
  }

  private handleInvalidUserId(userId: number): void {
    console.error(`Invalid user ID: ${userId}`);
  }

  private validateNotificationService(notificationService: NotificationService): void {
    if (!notificationService || !notificationService.sendMessage) {
      throw new Error('Invalid NotificationService');
    }
  }

  private handleInvalidNotificationService(notificationService: NotificationService): void {
    console.error(`Invalid NotificationService: ${JSON.stringify(notificationService)}`);
  }

  private validateProduct(product: any): void {
    if (!product || !product.name) {
      throw new Error('Invalid product');
    }
  }

  private handleInvalidProduct(product: any): void {
    console.error(`Invalid product: ${JSON.stringify(product)}`);
  }

  private validateMessage(message: string): void {
    if (!message) {
      throw new Error('Invalid message');
    }
  }

  private handleInvalidMessage(message: string): void {
    console.error(`Invalid message: ${message}`);
  }

  public async handleUserRequest(userId: number): Promise<void> {
    this.validateUserId(userId);

    try {
      const { moodTracker, productRecommender, notificationService } = this.options;

      const userMood = await moodTracker.getUserMood(userId);
      let recommendedProducts: any[] = [];

      if (!userMood) {
        this.handleInvalidUserId(userId);
        return;
      }

      recommendedProducts = await productRecommender.recommendProducts(userMood);

      if (!recommendedProducts || recommendedProducts.length === 0) {
        return;
      }

      this.validateNotificationService(notificationService);

      await notificationService.sendMessage(userId, `We've found some products you might like based on your current mood:`);
      recommendedProducts.forEach((product) => {
        this.validateProduct(product);
        notificationService.sendMessage(userId, `- ${product.name}`);
      });
    } catch (error) {
      console.error(`Error handling user request for user ID: ${userId}`, error);
    }
  }
}

import { MoodTracker } from './moodTracker';
import { ProductRecommender } from './productRecommender';
import { NotificationService } from './notificationService';

interface SupportBotOptions {
  moodTracker: MoodTracker;
  productRecommender: ProductRecommender;
  notificationService: NotificationService;
}

interface NotificationService {
  sendMessage(userId: number, message: string): Promise<void>;
}

export class CustomerSupportBot {
  private options: SupportBotOptions;

  constructor(options: SupportBotOptions) {
    this.options = options;
  }

  private validateUserId(userId: number): void {
    if (typeof userId !== 'number') {
      throw new Error('Invalid user ID');
    }
  }

  private handleInvalidUserId(userId: number): void {
    console.error(`Invalid user ID: ${userId}`);
  }

  private validateNotificationService(notificationService: NotificationService): void {
    if (!notificationService || !notificationService.sendMessage) {
      throw new Error('Invalid NotificationService');
    }
  }

  private handleInvalidNotificationService(notificationService: NotificationService): void {
    console.error(`Invalid NotificationService: ${JSON.stringify(notificationService)}`);
  }

  private validateProduct(product: any): void {
    if (!product || !product.name) {
      throw new Error('Invalid product');
    }
  }

  private handleInvalidProduct(product: any): void {
    console.error(`Invalid product: ${JSON.stringify(product)}`);
  }

  private validateMessage(message: string): void {
    if (!message) {
      throw new Error('Invalid message');
    }
  }

  private handleInvalidMessage(message: string): void {
    console.error(`Invalid message: ${message}`);
  }

  public async handleUserRequest(userId: number): Promise<void> {
    this.validateUserId(userId);

    try {
      const { moodTracker, productRecommender, notificationService } = this.options;

      const userMood = await moodTracker.getUserMood(userId);
      let recommendedProducts: any[] = [];

      if (!userMood) {
        this.handleInvalidUserId(userId);
        return;
      }

      recommendedProducts = await productRecommender.recommendProducts(userMood);

      if (!recommendedProducts || recommendedProducts.length === 0) {
        return;
      }

      this.validateNotificationService(notificationService);

      await notificationService.sendMessage(userId, `We've found some products you might like based on your current mood:`);
      recommendedProducts.forEach((product) => {
        this.validateProduct(product);
        notificationService.sendMessage(userId, `- ${product.name}`);
      });
    } catch (error) {
      console.error(`Error handling user request for user ID: ${userId}`, error);
    }
  }
}