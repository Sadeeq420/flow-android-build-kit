
import { supabase } from '@/integrations/supabase/client';
import { Vendor } from '@/types';
import { SupabaseVendor } from '@/types/supabase';

export const vendorService = {
  async createVendor(vendor: Omit<Vendor, "id">): Promise<Vendor> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert([vendor])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating vendor:', error);
        throw error;
      }

      return {
        id: data.id,
        ...vendor
      };
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },

  async getVendors(): Promise<Vendor[]> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*');

      if (error) {
        console.error('Error fetching vendors:', error);
        throw error;
      }

      return data.map((vendor: SupabaseVendor) => ({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone || '',
        address: vendor.address || ''
      }));
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  async getVendorByEmail(email: string): Promise<Vendor | null> {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching vendor by email:', error);
        throw error;
      }
      
      if (!data) {
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        address: data.address || ''
      };
    } catch (error) {
      console.error('Error fetching vendor by email:', error);
      throw error;
    }
  }
};
