
import { supabase } from '@/integrations/supabase/client';
import { Reminder } from '@/types';

export const reminderService = {
  async createReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reminders')
      .insert([{
        title: reminder.title,
        date: reminder.date,
        time: reminder.time,
        notes: reminder.notes,
        user_id: user.user.id,
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      date: data.date,
      time: data.time,
      notes: data.notes,
    };
  },

  async getReminders(): Promise<Reminder[]> {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;

    return data.map(reminder => ({
      id: reminder.id,
      title: reminder.title,
      date: reminder.date,
      time: reminder.time,
      notes: reminder.notes,
    }));
  }
};
