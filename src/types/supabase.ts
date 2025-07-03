
import { Database } from "@/integrations/supabase/types";

// Manual type definitions for LPO tables (until auto-generated types are updated)
export interface SupabaseLpo {
  id: string;
  lpo_number: string | null;
  vendor_id: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  additional_percentage: number | null;
  additional_notes: string | null;
  date_created: string;
  updated_at: string;
}

export interface SupabaseLpoInsert {
  id?: string;
  lpo_number?: string | null;
  vendor_id: string;
  user_id: string;
  status?: string;
  payment_status?: string;
  total_amount?: number;
  additional_percentage?: number | null;
  additional_notes?: string | null;
  date_created?: string;
  updated_at?: string;
}

export interface SupabaseLpoUpdate {
  id?: string;
  lpo_number?: string | null;
  vendor_id?: string;
  user_id?: string;
  status?: string;
  payment_status?: string;
  total_amount?: number;
  additional_percentage?: number | null;
  additional_notes?: string | null;
  date_created?: string;
  updated_at?: string;
}

export interface SupabaseVendor {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseLpoItem {
  id: string;
  lpo_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// We'll need to manually define the LPO payment type since it's not in the auto-generated types yet
export interface SupabaseLpoPayment {
  id: string;
  lpo_id: string;
  amount: number;
  date: string;
  reference: string;
  created_at: string;
}
