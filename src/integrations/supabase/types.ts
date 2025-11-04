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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      clubs: {
        Row: {
          address: string | null
          affiliation_date: string | null
          city: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          name: string
          postal_code: string | null
          president_name: string | null
          region: string | null
          status: Database["public"]["Enums"]["license_status"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          affiliation_date?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name: string
          postal_code?: string | null
          president_name?: string | null
          region?: string | null
          status?: Database["public"]["Enums"]["license_status"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          affiliation_date?: string | null
          city?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          name?: string
          postal_code?: string | null
          president_name?: string | null
          region?: string | null
          status?: Database["public"]["Enums"]["license_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      licenses: {
        Row: {
          address_proof_url: string | null
          club_id: string | null
          club_membership_proof_url: string | null
          created_at: string | null
          expiry_date: string | null
          id: string
          identity_document_url: string | null
          issue_date: string | null
          license_number: string | null
          medical_certificate_url: string | null
          photo_url: string | null
          status: Database["public"]["Enums"]["license_status"] | null
          type: Database["public"]["Enums"]["license_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_proof_url?: string | null
          club_id?: string | null
          club_membership_proof_url?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          identity_document_url?: string | null
          issue_date?: string | null
          license_number?: string | null
          medical_certificate_url?: string | null
          photo_url?: string | null
          status?: Database["public"]["Enums"]["license_status"] | null
          type: Database["public"]["Enums"]["license_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_proof_url?: string | null
          club_id?: string | null
          club_membership_proof_url?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          identity_document_url?: string | null
          issue_date?: string | null
          license_number?: string | null
          medical_certificate_url?: string | null
          photo_url?: string | null
          status?: Database["public"]["Enums"]["license_status"] | null
          type?: Database["public"]["Enums"]["license_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "licenses_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string | null
          id: string
          match_date: string | null
          notes: string | null
          round_number: number | null
          score_validated: boolean | null
          table_number: number | null
          team_a_player1_id: string | null
          team_a_player2_id: string | null
          team_a_points: number | null
          team_a_score: number | null
          team_b_player1_id: string | null
          team_b_player2_id: string | null
          team_b_points: number | null
          team_b_score: number | null
          tournament_id: string
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
          winner: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_date?: string | null
          notes?: string | null
          round_number?: number | null
          score_validated?: boolean | null
          table_number?: number | null
          team_a_player1_id?: string | null
          team_a_player2_id?: string | null
          team_a_points?: number | null
          team_a_score?: number | null
          team_b_player1_id?: string | null
          team_b_player2_id?: string | null
          team_b_points?: number | null
          team_b_score?: number | null
          tournament_id: string
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          winner?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_date?: string | null
          notes?: string | null
          round_number?: number | null
          score_validated?: boolean | null
          table_number?: number | null
          team_a_player1_id?: string | null
          team_a_player2_id?: string | null
          team_a_points?: number | null
          team_a_score?: number | null
          team_b_player1_id?: string | null
          team_b_player2_id?: string | null
          team_b_points?: number | null
          team_b_score?: number | null
          tournament_id?: string
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_team_a_player1_id_fkey"
            columns: ["team_a_player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_a_player2_id_fkey"
            columns: ["team_a_player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_player1_id_fkey"
            columns: ["team_b_player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_team_b_player2_id_fkey"
            columns: ["team_b_player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          emergency_contact: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          phone: string | null
          photo_url: string | null
          postal_code: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          emergency_contact?: string | null
          first_name: string
          gender?: string | null
          id: string
          last_name: string
          phone?: string | null
          photo_url?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          emergency_contact?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          phone?: string | null
          photo_url?: string | null
          postal_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rankings: {
        Row: {
          id: string
          last_updated: string | null
          matches_drawn: number | null
          matches_lost: number | null
          matches_played: number | null
          matches_won: number | null
          previous_rank: number | null
          rank: number | null
          season: string
          total_points: number | null
          user_id: string
        }
        Insert: {
          id?: string
          last_updated?: string | null
          matches_drawn?: number | null
          matches_lost?: number | null
          matches_played?: number | null
          matches_won?: number | null
          previous_rank?: number | null
          rank?: number | null
          season: string
          total_points?: number | null
          user_id: string
        }
        Update: {
          id?: string
          last_updated?: string | null
          matches_drawn?: number | null
          matches_lost?: number | null
          matches_played?: number | null
          matches_won?: number | null
          previous_rank?: number | null
          rank?: number | null
          season?: string
          total_points?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rankings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournament_registrations: {
        Row: {
          checked_in: boolean | null
          id: string
          partner_id: string | null
          payment_status: string | null
          registration_date: string | null
          team_name: string | null
          tournament_id: string
          user_id: string
        }
        Insert: {
          checked_in?: boolean | null
          id?: string
          partner_id?: string | null
          payment_status?: string | null
          registration_date?: string | null
          team_name?: string | null
          tournament_id: string
          user_id: string
        }
        Update: {
          checked_in?: boolean | null
          id?: string
          partner_id?: string | null
          payment_status?: string | null
          registration_date?: string | null
          team_name?: string | null
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_registrations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registrations_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          city: string | null
          club_id: string | null
          coefficient: number | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          end_date: string | null
          entry_fee: number | null
          id: string
          latitude: number | null
          location: string | null
          longitude: number | null
          max_participants: number | null
          name: string
          organizer_id: string | null
          region: string | null
          start_date: string
          status: Database["public"]["Enums"]["tournament_status"] | null
          type: Database["public"]["Enums"]["tournament_type"]
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          club_id?: string | null
          coefficient?: number | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_participants?: number | null
          name: string
          organizer_id?: string | null
          region?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["tournament_status"] | null
          type: Database["public"]["Enums"]["tournament_type"]
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          club_id?: string | null
          coefficient?: number | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          id?: string
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          max_participants?: number | null
          name?: string
          organizer_id?: string | null
          region?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["tournament_status"] | null
          type?: Database["public"]["Enums"]["tournament_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      is_free_club_eligible: { Args: never; Returns: boolean }
      is_free_license_eligible: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "organizer" | "club_admin" | "player"
      license_status: "pending" | "approved" | "rejected" | "expired"
      license_type: "individual" | "club"
      tournament_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      tournament_type: "local" | "regional" | "national"
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
      app_role: ["admin", "organizer", "club_admin", "player"],
      license_status: ["pending", "approved", "rejected", "expired"],
      license_type: ["individual", "club"],
      tournament_status: ["upcoming", "ongoing", "completed", "cancelled"],
      tournament_type: ["local", "regional", "national"],
    },
  },
} as const
