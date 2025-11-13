import { v4 as uuidv4 } from 'uuid';
import { ContentRepository } from '../repositories/contentRepository';
import { UserRepository } from '../repositories/userRepository';
import { AuthenticationService } from '../services/authenticationService';
import { ContentService } from '../services/contentService';
import { Logger } from '../utils/logger';
import { Content, User } from '../models'; // Add this import for the User and Content models

class CustomerSupportBot {
  private contentRepository: ContentRepository;
  private userRepository: UserRepository;
  private authenticationService: AuthenticationService;
  private contentService: ContentService;
  private logger: Logger;

  constructor() {
    this.contentRepository = new ContentRepository();
    this.userRepository = new UserRepository();
    this.authenticationService = new AuthenticationService();
    this.contentService = new ContentService();
    this.logger = new Logger('CustomerSupportBot');
  }

  // Add a new function to handle edge cases where the user is not found in the database
  async handleUserNotFound(userId: string): Promise<void> {
    this.logger.error(`Unable to find user with ID: ${userId}`);
  }

  // Update the handleMessage function to call handleUserNotFound if the user is not found
  async handleMessage(message: string, userId: string): Promise<void> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        await this.handleUserNotFound(userId);
        return;
      }

      const authenticatedUser = await this.authenticationService.authenticateUser(user);
      if (!authenticatedUser) {
        this.logger.error(`Unable to authenticate user: ${user.id}`);
        return;
      }

      const relevantContent = await this.contentService.getRelevantContent(authenticatedUser.role, message);
      if (relevantContent.length === 0) {
        this.logger.info(`No relevant content found for message: ${message}`);
        return;
      }

      const scheduledContent = await this.contentRepository.scheduleContent(relevantContent, user.id);
      this.logger.info(`Scheduled content for user with ID: ${user.id}`);
    } catch (error) {
      this.logger.error(`Error handling message for user with ID: ${userId}: ${error.message}`);
    }
  }
}

export { CustomerSupportBot };

import { v4 as uuidv4 } from 'uuid';
import { ContentRepository } from '../repositories/contentRepository';
import { UserRepository } from '../repositories/userRepository';
import { AuthenticationService } from '../services/authenticationService';
import { ContentService } from '../services/contentService';
import { Logger } from '../utils/logger';
import { Content, User } from '../models'; // Add this import for the User and Content models

class CustomerSupportBot {
  private contentRepository: ContentRepository;
  private userRepository: UserRepository;
  private authenticationService: AuthenticationService;
  private contentService: ContentService;
  private logger: Logger;

  constructor() {
    this.contentRepository = new ContentRepository();
    this.userRepository = new UserRepository();
    this.authenticationService = new AuthenticationService();
    this.contentService = new ContentService();
    this.logger = new Logger('CustomerSupportBot');
  }

  // Add a new function to handle edge cases where the user is not found in the database
  async handleUserNotFound(userId: string): Promise<void> {
    this.logger.error(`Unable to find user with ID: ${userId}`);
  }

  // Update the handleMessage function to call handleUserNotFound if the user is not found
  async handleMessage(message: string, userId: string): Promise<void> {
    try {
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        await this.handleUserNotFound(userId);
        return;
      }

      const authenticatedUser = await this.authenticationService.authenticateUser(user);
      if (!authenticatedUser) {
        this.logger.error(`Unable to authenticate user: ${user.id}`);
        return;
      }

      const relevantContent = await this.contentService.getRelevantContent(authenticatedUser.role, message);
      if (relevantContent.length === 0) {
        this.logger.info(`No relevant content found for message: ${message}`);
        return;
      }

      const scheduledContent = await this.contentRepository.scheduleContent(relevantContent, user.id);
      this.logger.info(`Scheduled content for user with ID: ${user.id}`);
    } catch (error) {
      this.logger.error(`Error handling message for user with ID: ${userId}: ${error.message}`);
    }
  }
}

export { CustomerSupportBot };