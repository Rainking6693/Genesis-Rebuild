// src/email_marketing/EmailMarketingService.ts

import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";

interface EmailData {
  toAddress: string;
  fromAddress: string;
  subject: string;
  body: string;
}

class EmailMarketingService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({ region: "us-east-1" }); // Replace with your AWS region
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    const { toAddress, fromAddress, subject, body } = emailData;

    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Body: {
          Text: { Data: body },
        },
        Subject: { Data: subject },
      },
      Source: fromAddress,
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.sesClient.send(command);

      if (response.$metadata.httpStatusCode === 200) {
        console.log("Email sent successfully!");
        return true;
      } else {
        console.error("Failed to send email:", response);
        return false;
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      // Implement robust error logging and monitoring here
      throw new Error(`Failed to send email: ${error.message}`); // Re-throw for handling upstream
    }
  }

  async subscribeUser(email: string): Promise<boolean> {
    // Placeholder for subscription logic (e.g., adding to a database)
    try {
      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation

      console.log(`User subscribed: ${email}`);
      return true;
    } catch (error: any) {
      console.error("Error subscribing user:", error);
      // Implement robust error logging and monitoring here
      return false;
    }
  }

  async unsubscribeUser(email: string): Promise<boolean> {
    // Placeholder for unsubscription logic (e.g., removing from a database)
    try {
      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation

      console.log(`User unsubscribed: ${email}`);
      return true;
    } catch (error: any) {
      console.error("Error unsubscribing user:", error);
      // Implement robust error logging and monitoring here
      return false;
    }
  }
}

export default EmailMarketingService;

// Example Usage (in a separate file, e.g., a route handler)
// const emailService = new EmailMarketingService();
// emailService.sendEmail({
//   toAddress: "recipient@example.com",
//   fromAddress: "sender@example.com",
//   subject: "Test Email",
//   body: "This is a test email from the EmailMarketingService."
// }).then(success => {
//   if (success) {
//     console.log("Email sent successfully");
//   } else {
//     console.error("Failed to send email");
//   }
// });

// src/email_marketing/EmailMarketingService.test.ts

import EmailMarketingService from './EmailMarketingService';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

jest.mock("@aws-sdk/client-ses");

describe('EmailMarketingService', () => {
  let emailService: EmailMarketingService;
  let mockSESClient: jest.Mocked<SESClient>;

  beforeEach(() => {
    mockSESClient = {
      send: jest.fn().mockResolvedValue({ $metadata: { httpStatusCode: 200 } })
    } as any; // Type assertion to satisfy TypeScript

    (SESClient as jest.Mock).mockImplementation(() => mockSESClient);

    emailService = new EmailMarketingService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email successfully', async () => {
    const emailData = {
      toAddress: 'test@example.com',
      fromAddress: 'sender@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };

    const result = await emailService.sendEmail(emailData);

    expect(result).toBe(true);
    expect(mockSESClient.send).toHaveBeenCalledTimes(1);
    // Add more specific assertions about the SendEmailCommand if needed
  });

  it('should handle email sending failure', async () => {
    mockSESClient.send.mockRejectedValue(new Error('SES Error'));

    const emailData = {
      toAddress: 'test@example.com',
      fromAddress: 'sender@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };

    await expect(emailService.sendEmail(emailData)).rejects.toThrow('Failed to send email: SES Error');
    expect(mockSESClient.send).toHaveBeenCalledTimes(1);
  });

  it('should subscribe a user successfully', async () => {
    const result = await emailService.subscribeUser('test@example.com');
    expect(result).toBe(true);
  });

  it('should unsubscribe a user successfully', async () => {
    const result = await emailService.unsubscribeUser('test@example.com');
    expect(result).toBe(true);
  });

  // Add more tests for error handling in subscribe/unsubscribe if needed
});

// src/email_marketing/interfaces.ts

export interface EmailData {
  toAddress: string;
  fromAddress: string;
  subject: string;
  body: string;
}

// src/email_marketing/utils.ts

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// src/email_marketing/EmailMarketingService.ts

import { SESClient, SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";

interface EmailData {
  toAddress: string;
  fromAddress: string;
  subject: string;
  body: string;
}

class EmailMarketingService {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({ region: "us-east-1" }); // Replace with your AWS region
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    const { toAddress, fromAddress, subject, body } = emailData;

    const params: SendEmailCommandInput = {
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Body: {
          Text: { Data: body },
        },
        Subject: { Data: subject },
      },
      Source: fromAddress,
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.sesClient.send(command);

      if (response.$metadata.httpStatusCode === 200) {
        console.log("Email sent successfully!");
        return true;
      } else {
        console.error("Failed to send email:", response);
        return false;
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      // Implement robust error logging and monitoring here
      throw new Error(`Failed to send email: ${error.message}`); // Re-throw for handling upstream
    }
  }

  async subscribeUser(email: string): Promise<boolean> {
    // Placeholder for subscription logic (e.g., adding to a database)
    try {
      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation

      console.log(`User subscribed: ${email}`);
      return true;
    } catch (error: any) {
      console.error("Error subscribing user:", error);
      // Implement robust error logging and monitoring here
      return false;
    }
  }

  async unsubscribeUser(email: string): Promise<boolean> {
    // Placeholder for unsubscription logic (e.g., removing from a database)
    try {
      // Simulate database operation
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation

      console.log(`User unsubscribed: ${email}`);
      return true;
    } catch (error: any) {
      console.error("Error unsubscribing user:", error);
      // Implement robust error logging and monitoring here
      return false;
    }
  }
}

export default EmailMarketingService;

// Example Usage (in a separate file, e.g., a route handler)
// const emailService = new EmailMarketingService();
// emailService.sendEmail({
//   toAddress: "recipient@example.com",
//   fromAddress: "sender@example.com",
//   subject: "Test Email",
//   body: "This is a test email from the EmailMarketingService."
// }).then(success => {
//   if (success) {
//     console.log("Email sent successfully");
//   } else {
//     console.error("Failed to send email");
//   }
// });

// src/email_marketing/EmailMarketingService.test.ts

import EmailMarketingService from './EmailMarketingService';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

jest.mock("@aws-sdk/client-ses");

describe('EmailMarketingService', () => {
  let emailService: EmailMarketingService;
  let mockSESClient: jest.Mocked<SESClient>;

  beforeEach(() => {
    mockSESClient = {
      send: jest.fn().mockResolvedValue({ $metadata: { httpStatusCode: 200 } })
    } as any; // Type assertion to satisfy TypeScript

    (SESClient as jest.Mock).mockImplementation(() => mockSESClient);

    emailService = new EmailMarketingService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email successfully', async () => {
    const emailData = {
      toAddress: 'test@example.com',
      fromAddress: 'sender@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };

    const result = await emailService.sendEmail(emailData);

    expect(result).toBe(true);
    expect(mockSESClient.send).toHaveBeenCalledTimes(1);
    // Add more specific assertions about the SendEmailCommand if needed
  });

  it('should handle email sending failure', async () => {
    mockSESClient.send.mockRejectedValue(new Error('SES Error'));

    const emailData = {
      toAddress: 'test@example.com',
      fromAddress: 'sender@example.com',
      subject: 'Test Subject',
      body: 'Test Body',
    };

    await expect(emailService.sendEmail(emailData)).rejects.toThrow('Failed to send email: SES Error');
    expect(mockSESClient.send).toHaveBeenCalledTimes(1);
  });

  it('should subscribe a user successfully', async () => {
    const result = await emailService.subscribeUser('test@example.com');
    expect(result).toBe(true);
  });

  it('should unsubscribe a user successfully', async () => {
    const result = await emailService.unsubscribeUser('test@example.com');
    expect(result).toBe(true);
  });

  // Add more tests for error handling in subscribe/unsubscribe if needed
});

// src/email_marketing/interfaces.ts

export interface EmailData {
  toAddress: string;
  fromAddress: string;
  subject: string;
  body: string;
}

// src/email_marketing/utils.ts

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}