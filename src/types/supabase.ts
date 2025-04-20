
import { Database } from "@/integrations/supabase/types";

// Type definitions for working with Supabase tables
export type SupabaseLpo = Database['public']['Tables']['lpos']['Row'];
export type SupabaseLpoInsert = Database['public']['Tables']['lpos']['Insert'];
export type SupabaseLpoUpdate = Database['public']['Tables']['lpos']['Update'];
export type SupabaseVendor = Database['public']['Tables']['vendors']['Row'];
export type SupabaseLpoItem = Database['public']['Tables']['lpo_items']['Row'];

// We'll need to manually define the LPO payment type since it's not in the auto-generated types yet
export interface SupabaseLpoPayment {
  id: string;
  lpo_id: string;
  amount: number;
  date: string;
  reference: string;
  created_at: string;
}
