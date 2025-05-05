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
      admin_levels: {
        Row: {
          admin_permissions: string[] | null
          course_permissions: string[] | null
          description: string
          id: number
          lead_permissions: string[] | null
          level_permissions: string[] | null
          name: string
          student_permissions: string[] | null
          teacher_permissions: string[] | null
        }
        Insert: {
          admin_permissions?: string[] | null
          course_permissions?: string[] | null
          description: string
          id: number
          lead_permissions?: string[] | null
          level_permissions?: string[] | null
          name: string
          student_permissions?: string[] | null
          teacher_permissions?: string[] | null
        }
        Update: {
          admin_permissions?: string[] | null
          course_permissions?: string[] | null
          description?: string
          id?: number
          lead_permissions?: string[] | null
          level_permissions?: string[] | null
          name?: string
          student_permissions?: string[] | null
          teacher_permissions?: string[] | null
        }
        Relationships: []
      }
      blocked_hours: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_recurring: boolean | null
          reason: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_recurring?: boolean | null
          reason?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          reason?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_hours_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          location: string | null
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      class_types: {
        Row: {
          created_at: string
          description: string
          duration_metric: string
          duration_value: number | null
          id: string
          image: string | null
          location: string
          max_students: number
          name: string
          price_inr: number
        }
        Insert: {
          created_at?: string
          description: string
          duration_metric: string
          duration_value?: number | null
          id?: string
          image?: string | null
          location?: string
          max_students: number
          name: string
          price_inr: number
        }
        Update: {
          created_at?: string
          description?: string
          duration_metric?: string
          duration_value?: number | null
          id?: string
          image?: string | null
          location?: string
          max_students?: number
          name?: string
          price_inr?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          base_price: number | null
          class_types_data: Json | null
          created_at: string
          description: string
          discount_code: string | null
          discount_metric: string | null
          discount_validity: string | null
          discount_value: number | null
          duration: string
          duration_type: string
          final_price: number | null
          gst_rate: number | null
          id: string
          image: string
          instructor_ids: string[] | null
          is_gst_applicable: boolean | null
          level: string
          skill: string
          student_ids: string[] | null
          students: number
          title: string
        }
        Insert: {
          base_price?: number | null
          class_types_data?: Json | null
          created_at?: string
          description: string
          discount_code?: string | null
          discount_metric?: string | null
          discount_validity?: string | null
          discount_value?: number | null
          duration: string
          duration_type?: string
          final_price?: number | null
          gst_rate?: number | null
          id?: string
          image: string
          instructor_ids?: string[] | null
          is_gst_applicable?: boolean | null
          level: string
          skill: string
          student_ids?: string[] | null
          students?: number
          title: string
        }
        Update: {
          base_price?: number | null
          class_types_data?: Json | null
          created_at?: string
          description?: string
          discount_code?: string | null
          discount_metric?: string | null
          discount_validity?: string | null
          discount_value?: number | null
          duration?: string
          duration_type?: string
          final_price?: number | null
          gst_rate?: number | null
          id?: string
          image?: string
          instructor_ids?: string[] | null
          is_gst_applicable?: boolean | null
          level?: string
          skill?: string
          student_ids?: string[] | null
          students?: number
          title?: string
        }
        Relationships: []
      }
      custom_users: {
        Row: {
          address: string | null
          admin_level_name: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_number: string | null
          emergency_contact_relation: string | null
          first_name: string
          gender: string | null
          guardian_relation: string | null
          id: string
          id_proof: string | null
          id_proof_aadhaar: string | null
          id_proof_pan: string | null
          last_name: string
          nationality: string | null
          parent_name: string | null
          password_hash: string
          permanent_address: string | null
          personal_email: string | null
          primary_phone: string | null
          profile_photo: string | null
          role: string
          secondary_phone: string | null
          trial_classes: string[] | null
          whatsapp_enabled: boolean | null
        }
        Insert: {
          address?: string | null
          admin_level_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          emergency_contact_relation?: string | null
          first_name: string
          gender?: string | null
          guardian_relation?: string | null
          id?: string
          id_proof?: string | null
          id_proof_aadhaar?: string | null
          id_proof_pan?: string | null
          last_name: string
          nationality?: string | null
          parent_name?: string | null
          password_hash: string
          permanent_address?: string | null
          personal_email?: string | null
          primary_phone?: string | null
          profile_photo?: string | null
          role: string
          secondary_phone?: string | null
          trial_classes?: string[] | null
          whatsapp_enabled?: boolean | null
        }
        Update: {
          address?: string | null
          admin_level_name?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_number?: string | null
          emergency_contact_relation?: string | null
          first_name?: string
          gender?: string | null
          guardian_relation?: string | null
          id?: string
          id_proof?: string | null
          id_proof_aadhaar?: string | null
          id_proof_pan?: string | null
          last_name?: string
          nationality?: string | null
          parent_name?: string | null
          password_hash?: string
          permanent_address?: string | null
          personal_email?: string | null
          primary_phone?: string | null
          profile_photo?: string | null
          role?: string
          secondary_phone?: string | null
          trial_classes?: string[] | null
          whatsapp_enabled?: boolean | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          age: number | null
          channel: string | null
          created_at: string
          email: string
          id: string
          interested_courses: string[] | null
          interested_skills: string[] | null
          lead_quality: number | null
          location: string | null
          name: string
          owner: string | null
          phone: string | null
          remarks: string | null
          secondary_phone: string | null
          source: string | null
          stage: string | null
          status: string | null
          user_id: string | null
          whatsapp_enabled: boolean | null
        }
        Insert: {
          age?: number | null
          channel?: string | null
          created_at?: string
          email: string
          id?: string
          interested_courses?: string[] | null
          interested_skills?: string[] | null
          lead_quality?: number | null
          location?: string | null
          name: string
          owner?: string | null
          phone?: string | null
          remarks?: string | null
          secondary_phone?: string | null
          source?: string | null
          stage?: string | null
          status?: string | null
          user_id?: string | null
          whatsapp_enabled?: boolean | null
        }
        Update: {
          age?: number | null
          channel?: string | null
          created_at?: string
          email?: string
          id?: string
          interested_courses?: string[] | null
          interested_skills?: string[] | null
          lead_quality?: number | null
          location?: string | null
          name?: string
          owner?: string | null
          phone?: string | null
          remarks?: string | null
          secondary_phone?: string | null
          source?: string | null
          stage?: string | null
          status?: string | null
          user_id?: string | null
          whatsapp_enabled?: boolean | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          course_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          order_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          course_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          course_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_course"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          course_id: string | null
          created_at: string | null
          currency: string
          id: string
          metadata: Json | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          course_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          course_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          metadata?: Json | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      teacher_bank_details: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: string
          bank_proof: string | null
          created_at: string | null
          id: string
          ifsc_code: string
          upi_id: string | null
          user_id: string | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name: string
          bank_proof?: string | null
          created_at?: string | null
          id?: string
          ifsc_code: string
          upi_id?: string | null
          user_id?: string | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: string
          bank_proof?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string
          upi_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_bank_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_professional: {
        Row: {
          bio: string | null
          class_experience: string[] | null
          comfortable_genres: string[] | null
          created_at: string | null
          curriculum_experience: string | null
          id: string
          instagram_link: string | null
          musical_projects: string | null
          pay_slips_files: string[] | null
          performance_photo: string | null
          performances: string | null
          previous_institutes: Json | null
          primary_instrument: string | null
          primary_instrument_level: string | null
          relieving_letter: string | null
          secondary_instrument: string | null
          secondary_instrument_level: string | null
          signature_strength: string | null
          teaching_experience_years: number | null
          teaching_philosophy: string | null
          user_id: string | null
          youtube_link: string | null
        }
        Insert: {
          bio?: string | null
          class_experience?: string[] | null
          comfortable_genres?: string[] | null
          created_at?: string | null
          curriculum_experience?: string | null
          id?: string
          instagram_link?: string | null
          musical_projects?: string | null
          pay_slips_files?: string[] | null
          performance_photo?: string | null
          performances?: string | null
          previous_institutes?: Json | null
          primary_instrument?: string | null
          primary_instrument_level?: string | null
          relieving_letter?: string | null
          secondary_instrument?: string | null
          secondary_instrument_level?: string | null
          signature_strength?: string | null
          teaching_experience_years?: number | null
          teaching_philosophy?: string | null
          user_id?: string | null
          youtube_link?: string | null
        }
        Update: {
          bio?: string | null
          class_experience?: string[] | null
          comfortable_genres?: string[] | null
          created_at?: string | null
          curriculum_experience?: string | null
          id?: string
          instagram_link?: string | null
          musical_projects?: string | null
          pay_slips_files?: string[] | null
          performance_photo?: string | null
          performances?: string | null
          previous_institutes?: Json | null
          primary_instrument?: string | null
          primary_instrument_level?: string | null
          relieving_letter?: string | null
          secondary_instrument?: string | null
          secondary_instrument_level?: string | null
          signature_strength?: string | null
          teaching_experience_years?: number | null
          teaching_philosophy?: string | null
          user_id?: string | null
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_professional_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_qualifications: {
        Row: {
          additional_certifications: string | null
          created_at: string | null
          graduation_year: number | null
          id: string
          institution: string | null
          qualification: string
          qualifying_certificate: string | null
          specialization: string | null
          user_id: string | null
        }
        Insert: {
          additional_certifications?: string | null
          created_at?: string | null
          graduation_year?: number | null
          id?: string
          institution?: string | null
          qualification: string
          qualifying_certificate?: string | null
          specialization?: string | null
          user_id?: string | null
        }
        Update: {
          additional_certifications?: string | null
          created_at?: string | null
          graduation_year?: number | null
          id?: string
          institution?: string | null
          qualification?: string
          qualifying_certificate?: string | null
          specialization?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_qualifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          component: string | null
          created_at: string | null
          id: string
          page_url: string | null
          user_id: string
        }
        Insert: {
          action: string
          component?: string | null
          created_at?: string | null
          id?: string
          page_url?: string | null
          user_id: string
        }
        Update: {
          action?: string
          component?: string | null
          created_at?: string | null
          id?: string
          page_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          event_type: string
          id: string
          is_blocked: boolean | null
          metadata: Json | null
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          event_type: string
          id?: string
          is_blocked?: boolean | null
          metadata?: Json | null
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          event_type?: string
          id?: string
          is_blocked?: boolean | null
          metadata?: Json | null
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "custom_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
