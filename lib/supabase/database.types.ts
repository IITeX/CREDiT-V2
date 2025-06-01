export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: "individual" | "organization" | "verifier"
          organization_name: string | null
          organization_type: string | null
          verification_status: "pending" | "verified" | "rejected"
          created_at: string
          updated_at: string
          avatar_url: string | null
          bio: string | null
          website: string | null
          location: string | null
          icp_principal: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role: "individual" | "organization" | "verifier"
          organization_name?: string | null
          organization_type?: string | null
          verification_status?: "pending" | "verified" | "rejected"
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          icp_principal?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: "individual" | "organization" | "verifier"
          organization_name?: string | null
          organization_type?: string | null
          verification_status?: "pending" | "verified" | "rejected"
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          icp_principal?: string | null
        }
      }
      credentials: {
        Row: {
          id: string
          user_id: string
          title: string
          type: string
          issuer: string
          description: string | null
          issue_date: string
          verification_status: "pending" | "verified" | "rejected"
          verifier_id: string | null
          blockchain_hash: string | null
          ipfs_hash: string | null
          created_at: string
          updated_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          type: string
          issuer: string
          description?: string | null
          issue_date: string
          verification_status?: "pending" | "verified" | "rejected"
          verifier_id?: string | null
          blockchain_hash?: string | null
          ipfs_hash?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          type?: string
          issuer?: string
          description?: string | null
          issue_date?: string
          verification_status?: "pending" | "verified" | "rejected"
          verifier_id?: string | null
          blockchain_hash?: string | null
          ipfs_hash?: string | null
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
      }
      verification_requests: {
        Row: {
          id: string
          credential_id: string
          verifier_email: string
          status: "pending" | "verified" | "rejected"
          verification_token: string
          expires_at: string
          created_at: string
          updated_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          credential_id: string
          verifier_email: string
          status?: "pending" | "verified" | "rejected"
          verification_token: string
          expires_at: string
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          credential_id?: string
          verifier_email?: string
          status?: "pending" | "verified" | "rejected"
          verification_token?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
          notes?: string | null
        }
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
  }
}
