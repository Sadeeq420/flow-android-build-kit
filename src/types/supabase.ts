
import { Database } from "@/integrations/supabase/types";

// Type definitions for working with Supabase tables
export type SupabaseLpo = Database['public']['Tables']['lpos']['Row'];
export type SupabaseLpoInsert = Database['public']['Tables']['lpos']['Insert'];
export type SupabaseLpoUpdate = Database['public']['Tables']['lpos']['Update'];
export type SupabaseVendor = Database['public']['Tables']['vendors']['Row'];
export type SupabaseLpoItem = Database['public']['Tables']['lpo_items']['Row'];
export type SupabaseLpoPayment = Database['public']['Tables']['lpo_payments']['Row'];
