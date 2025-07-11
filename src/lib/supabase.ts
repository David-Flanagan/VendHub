import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      machine_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_types: {
        Row: {
          id: string
          name: string
          machine_category_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          machine_category_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          machine_category_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      global_products: {
        Row: {
          id: string
          machine_category_id: string
          product_type_id: string
          brand: string
          product_name: string
          image: string
          in_global_catalog: boolean
          in_company_catalog: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          machine_category_id: string
          product_type_id: string
          brand: string
          product_name: string
          image: string
          in_global_catalog?: boolean
          in_company_catalog?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          machine_category_id?: string
          product_type_id?: string
          brand?: string
          product_name?: string
          image?: string
          in_global_catalog?: boolean
          in_company_catalog?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      company_products: {
        Row: {
          id: string
          product_id: string
          company_id: string
          base_price: number | null
          active_for_customer_building: boolean
          commission_enabled: boolean
          commission_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          company_id: string
          base_price?: number | null
          active_for_customer_building?: boolean
          commission_enabled?: boolean
          commission_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          company_id?: string
          base_price?: number | null
          active_for_customer_building?: boolean
          commission_enabled?: boolean
          commission_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      machine_templates: {
        Row: {
          id: string
          name: string
          machine_category_id: string
          description: string | null
          template_data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          machine_category_id: string
          description?: string | null
          template_data: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          machine_category_id?: string
          description?: string | null
          template_data?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 