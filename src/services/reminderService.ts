
import { Reminder } from '@/types';

export const reminderService = {
  async createReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder> {
    // Mock implementation - return the reminder with a generated ID
    return {
      id: `reminder-${Date.now()}`,
      title: reminder.title,
      date: reminder.date,
      time: reminder.time,
      notes: reminder.notes,
    };
  },

  async getReminders(): Promise<Reminder[]> {
    // Return mock data since reminders table doesn't exist yet
    return [];
  }
};
