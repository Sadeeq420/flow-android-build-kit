export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          changed_fields: string[] | null
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changed_fields?: string[] | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      battery_records: {
        Row: {
          battery_type: string
          created_at: string
          date_issued: string
          id: string
          is_active: boolean
          make: string
          position_number: number
          serial_number: string
          truck_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          battery_type: string
          created_at?: string
          date_issued: string
          id?: string
          is_active?: boolean
          make: string
          position_number: number
          serial_number: string
          truck_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          battery_type?: string
          created_at?: string
          date_issued?: string
          id?: string
          is_active?: boolean
          make?: string
          position_number?: number
          serial_number?: string
          truck_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      fuel_records: {
        Row: {
          created_at: string
          date: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          issued_to: string
          issuer: string
          quantity: number
          receipt_url: string | null
          site: string | null
          truck_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          issued_to: string
          issuer: string
          quantity: number
          receipt_url?: string | null
          site?: string | null
          truck_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          issued_to?: string
          issuer?: string
          quantity?: number
          receipt_url?: string | null
          site?: string | null
          truck_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_at: string
          id: string
          item_name: string
          item_type: string
          photo_url: string | null
          stock_balance: number
          supplier: string | null
          threshold: number
          unit_cost: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_name: string
          item_type: string
          photo_url?: string | null
          stock_balance?: number
          supplier?: string | null
          threshold?: number
          unit_cost?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_name?: string
          item_type?: string
          photo_url?: string | null
          stock_balance?: number
          supplier?: string | null
          threshold?: number
          unit_cost?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string
          date: string
          id: string
          issued_to: string | null
          issuer: string
          item_id: string
          notes: string | null
          quantity: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          issued_to?: string | null
          issuer: string
          item_id: string
          notes?: string | null
          quantity: number
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          issued_to?: string | null
          issuer?: string
          item_id?: string
          notes?: string | null
          quantity?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      lpo_items: {
        Row: {
          created_at: string
          description: string
          id: string
          lpo_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          lpo_id: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          lpo_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "lpo_items_lpo_id_fkey"
            columns: ["lpo_id"]
            isOneToOne: false
            referencedRelation: "lpos"
            referencedColumns: ["id"]
          },
        ]
      }
      lpo_payments: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          lpo_id: string
          reference: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          id?: string
          lpo_id: string
          reference: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          lpo_id?: string
          reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "lpo_payments_lpo_id_fkey"
            columns: ["lpo_id"]
            isOneToOne: false
            referencedRelation: "lpos"
            referencedColumns: ["id"]
          },
        ]
      }
      lpos: {
        Row: {
          additional_notes: string | null
          additional_percentage: number | null
          date_created: string
          id: string
          lpo_number: string | null
          payment_status: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          additional_notes?: string | null
          additional_percentage?: number | null
          date_created?: string
          id?: string
          lpo_number?: string | null
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          additional_notes?: string | null
          additional_percentage?: number | null
          date_created?: string
          id?: string
          lpo_number?: string | null
          payment_status?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lpos_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          cost: number | null
          created_at: string
          daily_maintenance: boolean | null
          description: string | null
          document_urls: string[] | null
          greasing_done: boolean | null
          id: string
          mileage: number
          next_service_due: number | null
          service_date: string
          service_type: string | null
          truck_id: string
          updated_at: string
          user_id: string
          washing_done: boolean | null
        }
        Insert: {
          cost?: number | null
          created_at?: string
          daily_maintenance?: boolean | null
          description?: string | null
          document_urls?: string[] | null
          greasing_done?: boolean | null
          id?: string
          mileage: number
          next_service_due?: number | null
          service_date: string
          service_type?: string | null
          truck_id: string
          updated_at?: string
          user_id: string
          washing_done?: boolean | null
        }
        Update: {
          cost?: number | null
          created_at?: string
          daily_maintenance?: boolean | null
          description?: string | null
          document_urls?: string[] | null
          greasing_done?: boolean | null
          id?: string
          mileage?: number
          next_service_due?: number | null
          service_date?: string
          service_type?: string | null
          truck_id?: string
          updated_at?: string
          user_id?: string
          washing_done?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tire_records: {
        Row: {
          created_at: string
          date_issued: string
          id: string
          is_active: boolean
          make: string
          position_number: number
          serial_number: string
          tire_type: string
          truck_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_issued: string
          id?: string
          is_active?: boolean
          make: string
          position_number: number
          serial_number: string
          tire_type: string
          truck_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_issued?: string
          id?: string
          is_active?: boolean
          make?: string
          position_number?: number
          serial_number?: string
          tire_type?: string
          truck_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          account_name: string | null
          account_number: string | null
          address: string | null
          bank_name: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          address?: string | null
          bank_name?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          address?: string | null
          bank_name?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_system_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "supervisor" | "user"
      fuel_type: "petrol" | "diesel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "supervisor", "user"],
      fuel_type: ["petrol", "diesel"],
    },
  },
} as const
