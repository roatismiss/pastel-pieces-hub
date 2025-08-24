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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          like_count: number | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          like_count?: number | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          like_count?: number | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          comment_count: number | null
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          is_anonymous: boolean | null
          like_count: number | null
          mood: string | null
          tags: string[] | null
          title: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          like_count?: number | null
          mood?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_anonymous?: boolean | null
          like_count?: number | null
          mood?: string | null
          tags?: string[] | null
          title?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          current_participants: number | null
          description: string | null
          event_date: string
          id: string
          is_active: boolean | null
          location: string | null
          max_participants: number | null
          price: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          event_date: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          price?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_participants?: number | null
          description?: string | null
          event_date?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          price?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapist_applications: {
        Row: {
          admin_notes: string | null
          applied_at: string
          bio: string | null
          certificate_urls: string[] | null
          certifications: string[] | null
          created_at: string
          cv_document_url: string | null
          education: string
          email: string
          full_name: string
          id: string
          languages: string[] | null
          license_document_url: string | null
          license_number: string
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specialization: string
          status: string
          updated_at: string
          user_id: string
          years_experience: number
        }
        Insert: {
          admin_notes?: string | null
          applied_at?: string
          bio?: string | null
          certificate_urls?: string[] | null
          certifications?: string[] | null
          created_at?: string
          cv_document_url?: string | null
          education: string
          email: string
          full_name: string
          id?: string
          languages?: string[] | null
          license_document_url?: string | null
          license_number: string
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialization: string
          status?: string
          updated_at?: string
          user_id: string
          years_experience: number
        }
        Update: {
          admin_notes?: string | null
          applied_at?: string
          bio?: string | null
          certificate_urls?: string[] | null
          certifications?: string[] | null
          created_at?: string
          cv_document_url?: string | null
          education?: string
          email?: string
          full_name?: string
          id?: string
          languages?: string[] | null
          license_document_url?: string | null
          license_number?: string
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialization?: string
          status?: string
          updated_at?: string
          user_id?: string
          years_experience?: number
        }
        Relationships: []
      }
      therapist_appointments: {
        Row: {
          appointment_date: string
          client_id: string
          created_at: string
          duration: number | null
          id: string
          notes: string | null
          price: number
          status: string | null
          therapist_id: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          client_id: string
          created_at?: string
          duration?: number | null
          id?: string
          notes?: string | null
          price: number
          status?: string | null
          therapist_id: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          client_id?: string
          created_at?: string
          duration?: number | null
          id?: string
          notes?: string | null
          price?: number
          status?: string | null
          therapist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_appointments_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          therapist_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          therapist_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          therapist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_availability_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_earnings: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string
          id: string
          processed_at: string | null
          status: string | null
          therapist_id: string
          transaction_type: string | null
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string | null
          therapist_id: string
          transaction_type?: string | null
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string | null
          therapist_id?: string
          transaction_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_earnings_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "therapist_appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "therapist_earnings_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_events: {
        Row: {
          created_at: string
          current_participants: number | null
          description: string | null
          event_date: string
          id: string
          is_active: boolean | null
          location: string | null
          max_participants: number | null
          price: number | null
          therapist_id: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          event_date: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          price?: number | null
          therapist_id: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          current_participants?: number | null
          description?: string | null
          event_date?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          max_participants?: number | null
          price?: number | null
          therapist_id?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_events_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_followers: {
        Row: {
          created_at: string
          id: string
          therapist_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          therapist_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          therapist_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapist_followers_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_posts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          tags: string[] | null
          therapist_id: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          therapist_id: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          therapist_id?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_posts_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapist_profile_views: {
        Row: {
          id: string
          therapist_id: string
          viewed_at: string
          viewer_id: string | null
        }
        Insert: {
          id?: string
          therapist_id: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Update: {
          id?: string
          therapist_id?: string
          viewed_at?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "therapist_profile_views_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
        ]
      }
      therapists: {
        Row: {
          application_id: string | null
          availability: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          languages: string[] | null
          name: string
          price: number
          rating: number | null
          review_count: number | null
          specialization: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          name: string
          price: number
          rating?: number | null
          review_count?: number | null
          specialization: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          availability?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          name?: string
          price?: number
          rating?: number | null
          review_count?: number | null
          specialization?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
