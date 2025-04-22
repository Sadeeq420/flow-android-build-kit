
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/types';

export const reportService = {
  async createReport(report: Omit<Report, 'id'>): Promise<Report> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('reports')
      .insert([{
        title: report.title,
        type: report.type,
        recipients: report.recipients,
        created_by: user.user.id,
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      type: data.type,
      dateSent: data.date_sent,
      recipients: data.recipients,
    };
  },

  async getReports(): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('date_sent', { ascending: false });

    if (error) throw error;

    return data.map(report => ({
      id: report.id,
      title: report.title,
      type: report.type,
      dateSent: report.date_sent,
      recipients: report.recipients,
    }));
  }
};
