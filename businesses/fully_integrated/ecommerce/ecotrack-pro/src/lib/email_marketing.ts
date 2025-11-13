import { EmailService } from './email_service';
import { SustainabilityBadgeService } from './sustainability_badge_service';
import { CarbonOffsetService } from './carbon_offset_service';
import { ComplianceReportService } from './compliance_report_service';

type Report = {
  businessName?: string; // Add optional business name property to Report type
};

type Badge = {
  level: string;
  image: string;
};

type Offsets = {
  quantity: number;
  type: string;
  image: string;
};

export function sendEmailCampaign(businessId: number, campaignId: number): Promise<void> {
  // Initialize services
  const emailService = new EmailService();
  const sustainabilityBadgeService = new SustainabilityBadgeService();
  const carbonOffsetService = new CarbonOffsetService();
  const complianceReportService = new ComplianceReportService();

  // Fetch the business's sustainability data
  return complianceReportService.getReport(businessId)
    .catch((error) => {
      console.error(`Error fetching report for businessId ${businessId}:`, error);
      throw new Error('Report not found');
    })
    .then((report: Report | null) => {
      if (!report) {
        throw new Error('Report not found');
      }

      // Generate sustainability badge and carbon offset recommendations
      return sustainabilityBadgeService.generateBadge(report)
        .catch((error) => {
          console.error(`Error generating badge for report:`, error);
          throw new Error('Badge not generated');
        })
        .then((badge: Badge | null) => {
          if (!badge) {
            throw new Error('Badge not generated');
          }
          return carbonOffsetService.recommendOffsets(report)
            .catch((error) => {
              console.error(`Error recommending offsets for report:`, error);
              throw new Error('Offsets not recommended');
            });
        })
        .then((offsets: Offsets | null) => {
          if (!offsets) {
            throw new Error('Offsets not recommended');
          }

          // Compile email content with badge and offset information
          const emailContent = `
            Dear ${report?.businessName || 'Business Name'},

            We are excited to announce that you have earned a ${badge.level} Sustainability Badge for your efforts in reducing your environmental impact!

            <img src="${badge.image}" alt="Sustainability Badge">

            To further improve your sustainability, we recommend offsetting ${offsets.quantity} ${offsets.type} emissions.

            <img src="${offsets.image}" alt="Carbon Offset">

            To learn more about our recommendations and how to offset your emissions, visit our website: ${process.env.ECOTRACK_WEBSITE_URL}

            Best Regards,
            The EcoTrack Pro Team
          `;

          // Send the email campaign
          return emailService.send(businessId, campaignId, emailContent);
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    });
}

import { EmailService } from './email_service';
import { SustainabilityBadgeService } from './sustainability_badge_service';
import { CarbonOffsetService } from './carbon_offset_service';
import { ComplianceReportService } from './compliance_report_service';

type Report = {
  businessName?: string; // Add optional business name property to Report type
};

type Badge = {
  level: string;
  image: string;
};

type Offsets = {
  quantity: number;
  type: string;
  image: string;
};

export function sendEmailCampaign(businessId: number, campaignId: number): Promise<void> {
  // Initialize services
  const emailService = new EmailService();
  const sustainabilityBadgeService = new SustainabilityBadgeService();
  const carbonOffsetService = new CarbonOffsetService();
  const complianceReportService = new ComplianceReportService();

  // Fetch the business's sustainability data
  return complianceReportService.getReport(businessId)
    .catch((error) => {
      console.error(`Error fetching report for businessId ${businessId}:`, error);
      throw new Error('Report not found');
    })
    .then((report: Report | null) => {
      if (!report) {
        throw new Error('Report not found');
      }

      // Generate sustainability badge and carbon offset recommendations
      return sustainabilityBadgeService.generateBadge(report)
        .catch((error) => {
          console.error(`Error generating badge for report:`, error);
          throw new Error('Badge not generated');
        })
        .then((badge: Badge | null) => {
          if (!badge) {
            throw new Error('Badge not generated');
          }
          return carbonOffsetService.recommendOffsets(report)
            .catch((error) => {
              console.error(`Error recommending offsets for report:`, error);
              throw new Error('Offsets not recommended');
            });
        })
        .then((offsets: Offsets | null) => {
          if (!offsets) {
            throw new Error('Offsets not recommended');
          }

          // Compile email content with badge and offset information
          const emailContent = `
            Dear ${report?.businessName || 'Business Name'},

            We are excited to announce that you have earned a ${badge.level} Sustainability Badge for your efforts in reducing your environmental impact!

            <img src="${badge.image}" alt="Sustainability Badge">

            To further improve your sustainability, we recommend offsetting ${offsets.quantity} ${offsets.type} emissions.

            <img src="${offsets.image}" alt="Carbon Offset">

            To learn more about our recommendations and how to offset your emissions, visit our website: ${process.env.ECOTRACK_WEBSITE_URL}

            Best Regards,
            The EcoTrack Pro Team
          `;

          // Send the email campaign
          return emailService.send(businessId, campaignId, emailContent);
        })
        .catch((error) => {
          console.error(error);
          throw error;
        });
    });
}