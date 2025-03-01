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
      admin_stats: {
        Row: {
          created_at: string
          id: number
          premium_users: number
          stats_date: string
          storage_used: number
          total_newsletters: number
          total_users: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: never
          premium_users?: number
          stats_date?: string
          storage_used?: number
          total_newsletters?: number
          total_users?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: never
          premium_users?: number
          stats_date?: string
          storage_used?: number
          total_newsletters?: number
          total_users?: number
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          access_token: string
          created_at: string | null
          email: string
          id: string
          is_connected: boolean | null
          last_sync: string | null
          provider: string
          refresh_token: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          email: string
          id?: string
          is_connected?: boolean | null
          last_sync?: string | null
          provider: string
          refresh_token?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          email?: string
          id?: string
          is_connected?: boolean | null
          last_sync?: string | null
          provider?: string
          refresh_token?: string | null
          user_id?: string
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          category_id: number | null
          content: string | null
          created_at: string
          email_id: string | null
          gmail_message_id: string | null
          gmail_thread_id: string | null
          id: number
          industry: string | null
          preview: string | null
          published_at: string | null
          sender: string | null
          sender_email: string | null
          title: string | null
        }
        Insert: {
          category_id?: number | null
          content?: string | null
          created_at?: string
          email_id?: string | null
          gmail_message_id?: string | null
          gmail_thread_id?: string | null
          id?: number
          industry?: string | null
          preview?: string | null
          published_at?: string | null
          sender?: string | null
          sender_email?: string | null
          title?: string | null
        }
        Update: {
          category_id?: number | null
          content?: string | null
          created_at?: string
          email_id?: string | null
          gmail_message_id?: string | null
          gmail_thread_id?: string | null
          id?: number
          industry?: string | null
          preview?: string | null
          published_at?: string | null
          sender?: string | null
          sender_email?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          premium: boolean | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          premium?: boolean | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          premium?: boolean | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      "saved items": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      saved_newsletters: {
        Row: {
          created_at: string
          id: number
          newsletter_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: never
          newsletter_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: never
          newsletter_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_newsletters_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_admin_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
