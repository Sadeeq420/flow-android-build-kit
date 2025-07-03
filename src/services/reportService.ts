
import { Report } from '@/types';

export const reportService = {
  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    // Mock implementation - return the report with a generated ID
    return {
      id: `report-${Date.now()}`,
      title: report.title,
      type: report.type,
      dateSent: new Date().toISOString(),
      recipients: report.recipients,
    };
  },

  async getReports(): Promise<Report[]> {
    // Return mock data since reports table doesn't exist yet
    return [
      {
        id: '1',
        title: 'Monthly LPO Report',
        type: 'Monthly',
        dateSent: new Date().toISOString(),
        recipients: ['admin@example.com']
      },
      {
        id: '2',
        title: 'Vendor Payment Summary',
        type: 'Weekly',
        dateSent: new Date().toISOString(),
        recipients: ['finance@example.com']
      }
    ];
  }
};
