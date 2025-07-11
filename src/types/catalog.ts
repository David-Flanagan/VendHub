// Machine Category Types
export interface MachineCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

// Product Type Types
export interface ProductType {
  id: string;
  name: string;
  machine_category_id: string;
  created_at: string;
  updated_at: string;
}

// Global Product Types
export interface GlobalProduct {
  id: string;
  machine_category_id: string;
  product_type_id: string;
  brand: string;
  product_name: string;
  image: string;
  in_global_catalog: boolean;
  in_company_catalog: boolean;
  created_at: string;
  updated_at: string;
}

// Company Product Types
export interface CompanyProduct {
  id: string;
  product_id: string; // FK to GlobalProduct
  company_id: string;
  base_price: number | null;
  active_for_customer_building: boolean;
  commission_enabled: boolean;
  commission_rate?: number;
  created_at: string;
  updated_at: string;
}

// Extended Company Product with Global Product data
export interface CompanyProductWithGlobal extends CompanyProduct {
  global_product: GlobalProduct;
}

// Machine Template Types
export interface MachineTemplate {
  id: string;
  name: string;
  machine_category_id: string;
  description?: string;
  template_data: any; // JSON data for machine configuration
  created_at: string;
  updated_at: string;
}

// Form Types
export interface CreateGlobalProductForm {
  machine_category_id: string;
  product_type_id: string;
  brand: string;
  product_name: string;
  image: string;
  add_to_global_catalog: boolean;
  add_to_company_catalog: boolean;
}

export interface UpdateCompanyProductForm {
  base_price: number | null;
  active_for_customer_building: boolean;
  commission_enabled: boolean;
  commission_rate?: number;
}

// Filter Types
export interface CatalogFilters {
  machine_category_id?: string;
  product_type_id?: string;
  search?: string;
}

// Navigation Types
export type CatalogView = 'products' | 'machine-templates'; 