import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

// Type aliases for easier use
type MachineCategory = Database['public']['Tables']['machine_categories']['Row']
type ProductType = Database['public']['Tables']['product_types']['Row']
type GlobalProduct = Database['public']['Tables']['global_products']['Row']
type CompanyProduct = Database['public']['Tables']['company_products']['Row']
type MachineTemplate = Database['public']['Tables']['machine_templates']['Row']

// Machine Categories
export const machineCategoryService = {
  async getAll(): Promise<MachineCategory[]> {
    const { data, error } = await supabase
      .from('machine_categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(category: Omit<MachineCategory, 'id' | 'created_at' | 'updated_at'>): Promise<MachineCategory> {
    const { data, error } = await supabase
      .from('machine_categories')
      .insert(category)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<MachineCategory>): Promise<MachineCategory> {
    const { data, error } = await supabase
      .from('machine_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async checkDependencies(id: string): Promise<{
    hasProductTypes: boolean;
    hasGlobalProducts: boolean;
    hasMachineTemplates: boolean;
    productTypesCount: number;
    globalProductsCount: number;
    machineTemplatesCount: number;
  }> {
    const [productTypesResult, globalProductsResult, machineTemplatesResult] = await Promise.all([
      supabase.from('product_types').select('id', { count: 'exact' }).eq('machine_category_id', id),
      supabase.from('global_products').select('id', { count: 'exact' }).eq('machine_category_id', id),
      supabase.from('machine_templates').select('id', { count: 'exact' }).eq('machine_category_id', id)
    ]);

    return {
      hasProductTypes: (productTypesResult.count || 0) > 0,
      hasGlobalProducts: (globalProductsResult.count || 0) > 0,
      hasMachineTemplates: (machineTemplatesResult.count || 0) > 0,
      productTypesCount: productTypesResult.count || 0,
      globalProductsCount: globalProductsResult.count || 0,
      machineTemplatesCount: machineTemplatesResult.count || 0
    };
  },

  async deleteDirect(id: string): Promise<{ deleted: boolean; count?: number }> {
    console.log('Service: Direct delete attempt for category ID:', id);
    
    // Try a direct delete without select to see if RLS is the issue
    const { error, count } = await supabase
      .from('machine_categories')
      .delete()
      .eq('id', id);
    
    console.log('Service: Direct delete result:', { count, error });
    
    if (error) {
      console.error('Service: Direct delete error:', error);
      throw error;
    }
    
    return { 
      deleted: (count || 0) > 0, 
      count: count || 0
    };
  },

  async delete(id: string): Promise<{ deleted: boolean; count?: number }> {
    console.log('Service: Attempting to delete category with ID:', id);
    
    // First, let's check if the category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('machine_categories')
      .select('id, name')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error('Service: Error checking if category exists:', checkError);
      throw checkError;
    }
    
    if (!existingCategory) {
      console.log('Service: Category not found');
      return { deleted: false, count: 0 };
    }
    
    console.log('Service: Category found:', existingCategory);
    
    // Now attempt the delete
    const { data, error, count } = await supabase
      .from('machine_categories')
      .delete()
      .eq('id', id)
      .select('id')
    
    console.log('Service: Delete operation result:', { data, count, error });
    
    if (error) {
      console.error('Service: Delete error:', error);
      throw error;
    }
    
    const deletedCount = count || (data ? data.length : 0);
    console.log('Service: Deleted count:', deletedCount);
    
    return { 
      deleted: deletedCount > 0, 
      count: deletedCount
    };
  }
}

// Product Types
export const productTypeService = {
  async getAll(): Promise<ProductType[]> {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async getByCategory(categoryId: string): Promise<ProductType[]> {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .eq('machine_category_id', categoryId)
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(type: Omit<ProductType, 'id' | 'created_at' | 'updated_at'>): Promise<ProductType> {
    const { data, error } = await supabase
      .from('product_types')
      .insert(type)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<ProductType>): Promise<ProductType> {
    const { data, error } = await supabase
      .from('product_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Global Products
export const globalProductService = {
  async getAll(): Promise<GlobalProduct[]> {
    const { data, error } = await supabase
      .from('global_products')
      .select(`
        *,
        machine_categories(name, icon),
        product_types(name)
      `)
      .order('product_name')
    
    if (error) throw error
    return data || []
  },

  async getByCategory(categoryId: string): Promise<GlobalProduct[]> {
    const { data, error } = await supabase
      .from('global_products')
      .select(`
        *,
        machine_categories(name, icon),
        product_types(name)
      `)
      .eq('machine_category_id', categoryId)
      .order('product_name')
    
    if (error) throw error
    return data || []
  },

  async create(product: Omit<GlobalProduct, 'id' | 'created_at' | 'updated_at'>): Promise<GlobalProduct> {
    const { data, error } = await supabase
      .from('global_products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<GlobalProduct>): Promise<GlobalProduct> {
    const { data, error } = await supabase
      .from('global_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('global_products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Company Products
export const companyProductService = {
  async getByCompany(companyId: string): Promise<(CompanyProduct & { global_products: GlobalProduct })[]> {
    const { data, error } = await supabase
      .from('company_products')
      .select(`
        *,
        global_products(
          *,
          machine_categories(name, icon),
          product_types(name)
        )
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async create(product: Omit<CompanyProduct, 'id' | 'created_at' | 'updated_at'>): Promise<CompanyProduct> {
    const { data, error } = await supabase
      .from('company_products')
      .insert(product)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<CompanyProduct>): Promise<CompanyProduct> {
    const { data, error } = await supabase
      .from('company_products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('company_products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async importFromGlobal(productId: string, companyId: string): Promise<CompanyProduct> {
    // Check if already exists
    const { data: existing } = await supabase
      .from('company_products')
      .select('id')
      .eq('product_id', productId)
      .eq('company_id', companyId)
      .single()
    
    if (existing) {
      throw new Error('Product already exists in company catalog')
    }

    // Create new company product
    const { data, error } = await supabase
      .from('company_products')
      .insert({
        product_id: productId,
        company_id: companyId,
        base_price: null,
        active_for_customer_building: false,
        commission_enabled: false,
        commission_rate: null
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Machine Templates
export const machineTemplateService = {
  async getAll(): Promise<MachineTemplate[]> {
    const { data, error } = await supabase
      .from('machine_templates')
      .select(`
        *,
        machine_categories(name, icon)
      `)
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async getByCategory(categoryId: string): Promise<MachineTemplate[]> {
    const { data, error } = await supabase
      .from('machine_templates')
      .select(`
        *,
        machine_categories(name, icon)
      `)
      .eq('machine_category_id', categoryId)
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(template: Omit<MachineTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<MachineTemplate> {
    const { data, error } = await supabase
      .from('machine_templates')
      .insert(template)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<MachineTemplate>): Promise<MachineTemplate> {
    const { data, error } = await supabase
      .from('machine_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('machine_templates')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
} 