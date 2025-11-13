import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { EcoCreatorHubClient } from '../clients/ecocreatorhub.client';
import { SustainabilityContent } from '../models/sustainability-content.model';

type EmailMarketingOptions = {
  to: string;
  subject: string;
  content: string;
  brandPartnership?: boolean;
  sustainabilityContent?: SustainabilityContent;
  fallbackEmail?: string; // Added for resiliency in case the primary email fails
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function emailMarketing(options: EmailMarketingOptions): Promise<void> {
  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    text: options.content,
  };

  if (options.brandPartnership && options.sustainabilityContent) {
    const client = new EcoCreatorHubClient();
    const impactMetrics = await client.getBrandImpactMetrics(options.sustainabilityContent.id);

    // Added altText for accessibility
    const altText = `Environmental impact metrics for a new brand partnership`;
    mailOptions.html = `
      <p>Dear ${options.to},</p>
      <p>We are excited to announce a new brand partnership opportunity with ${options.to}. Here are the real-time environmental impact metrics for this collaboration:</p>
      <ul>
        <li>CO2 emissions reduction: ${impactMetrics.co2Reduction} tons</li>
        <li>Water savings: ${impactMetrics.waterSavings} gallons</li>
        <li>Tree planting: ${impactMetrics.treePlanting} trees</li>
      </ul>
      <p>Let's make a difference together!</p>
    `;
    mailOptions.html += `<div style="display:none;">${altText}</div>`; // Added hidden div for screen readers
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    if (options.fallbackEmail) {
      // If fallbackEmail is provided, send the email to the fallback address
      await emailMarketing({ ...options, to: options.fallbackEmail });
    } else {
      // Log the error for troubleshooting
      console.error(`Error sending email: ${error}`);
    }
  }
}

export { emailMarketing };

This version of the code checks if both `brandPartnership` and `sustainabilityContent` are provided before attempting to fetch impact metrics. This helps prevent potential null errors and improves the resiliency of the email_marketing function. Additionally, the code structure has been improved for better readability and maintainability.