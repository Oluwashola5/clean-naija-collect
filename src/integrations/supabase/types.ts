export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          created_at: string
          id: string
          is_default: boolean
          label: string
          lga: string
          postal_code: string | null
          state: string
          street: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          lga: string
          postal_code?: string | null
          state: string
          street: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          is_default?: boolean
          label?: string
          lga?: string
          postal_code?: string | null
          state?: string
          street?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      approval_requests: {
        Row: {
          company_id: string
          company_name: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["approval_status"]
        }
        Insert: {
          company_id: string
          company_name: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["approval_status"]
        }
        Update: {
          company_id?: string
          company_name?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["approval_status"]
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "waste_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_requests: {
        Row: {
          company_id: string
          company_name: string
          created_at: string
          household_id: string
          household_name: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id: string
          company_name: string
          created_at?: string
          household_id: string
          household_name: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          company_name?: string
          created_at?: string
          household_id?: string
          household_name?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "waste_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_requests_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_service_areas: {
        Row: {
          company_id: string
          id: string
          service_area_id: string
        }
        Insert: {
          company_id: string
          id?: string
          service_area_id: string
        }
        Update: {
          company_id?: string
          id?: string
          service_area_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_service_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "waste_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_service_areas_service_area_id_fkey"
            columns: ["service_area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      household_profiles: {
        Row: {
          address: string
          created_at: string
          id: string
          lga: string
          phone: string
          state: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          lga: string
          phone: string
          state: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          lga?: string
          phone?: string
          state?: string
          user_id?: string
        }
        Relationships: []
      }
      issue_reports: {
        Row: {
          address: string
          company_id: string | null
          company_name: string | null
          created_at: string
          description: string
          household_id: string
          household_name: string
          id: string
          image_url: string | null
          service_area_id: string | null
          status: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at: string
        }
        Insert: {
          address: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description: string
          household_id: string
          household_name: string
          id?: string
          image_url?: string | null
          service_area_id?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
          title: string
          updated_at?: string
        }
        Update: {
          address?: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string
          household_id?: string
          household_name?: string
          id?: string
          image_url?: string | null
          service_area_id?: string | null
          status?: Database["public"]["Enums"]["issue_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "issue_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "waste_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_reports_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issue_reports_service_area_id_fkey"
            columns: ["service_area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      pickup_requests: {
        Row: {
          address: string
          company_id: string | null
          company_name: string | null
          created_at: string
          description: string
          household_id: string
          household_name: string
          id: string
          scheduled_date: string
          service_area_id: string | null
          status: Database["public"]["Enums"]["pickup_status"]
          updated_at: string
          waste_type: string
        }
        Insert: {
          address: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description: string
          household_id: string
          household_name: string
          id?: string
          scheduled_date: string
          service_area_id?: string | null
          status?: Database["public"]["Enums"]["pickup_status"]
          updated_at?: string
          waste_type: string
        }
        Update: {
          address?: string
          company_id?: string | null
          company_name?: string | null
          created_at?: string
          description?: string
          household_id?: string
          household_name?: string
          id?: string
          scheduled_date?: string
          service_area_id?: string | null
          status?: Database["public"]["Enums"]["pickup_status"]
          updated_at?: string
          waste_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pickup_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "waste_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_requests_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "household_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pickup_requests_service_area_id_fkey"
            columns: ["service_area_id"]
            isOneToOne: false
            referencedRelation: "service_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      service_areas: {
        Row: {
          created_at: string
          id: string
          lga: string
          name: string
          state: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          lga: string
          name: string
          state: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          lga?: string
          name?: string
          state?: string
          status?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      waste_companies: {
        Row: {
          address: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          registration_number: string
          status: Database["public"]["Enums"]["approval_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          registration_number: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          registration_number?: string
          status?: Database["public"]["Enums"]["approval_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "company" | "household"
      approval_status: "pending" | "approved" | "rejected"
      issue_status:
        | "New"
        | "Under Review"
        | "Assigned"
        | "In Progress"
        | "Resolved"
        | "Closed"
      pickup_status:
        | "Pending"
        | "Assigned"
        | "In Progress"
        | "Completed"
        | "Cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "company", "household"],
      approval_status: ["pending", "approved", "rejected"],
      issue_status: [
        "New",
        "Under Review",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed",
      ],
      pickup_status: [
        "Pending",
        "Assigned",
        "In Progress",
        "Completed",
        "Cancelled",
      ],
    },
  },
} as const
