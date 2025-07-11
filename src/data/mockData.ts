import { MachineCategory, ProductType, GlobalProduct, CompanyProduct } from '../types/catalog';

// Mock Machine Categories
export const mockMachineCategories: MachineCategory[] = [
  {
    id: '1',
    name: 'Snack',
    description: 'Snack vending machines',
    icon: '🍿'
  },
  {
    id: '2',
    name: 'Drink',
    description: 'Beverage vending machines',
    icon: '🥤'
  },
  {
    id: '3',
    name: 'Sunscreen',
    description: 'Sunscreen and personal care products',
    icon: '🧴'
  },
  {
    id: '4',
    name: 'Combo',
    description: 'Combination snack and drink machines',
    icon: '📦'
  }
];

// Mock Product Types
export const mockProductTypes: ProductType[] = [
  // Snack types
  { id: '1', name: 'Bagged Snack', machine_category_id: '1' },
  { id: '2', name: 'Candy Bar', machine_category_id: '1' },
  { id: '3', name: 'Chips', machine_category_id: '1' },
  { id: '4', name: 'Nuts', machine_category_id: '1' },
  
  // Drink types
  { id: '5', name: '12oz Can', machine_category_id: '2' },
  { id: '6', name: '16oz Bottle', machine_category_id: '2' },
  { id: '7', name: '20oz Bottle', machine_category_id: '2' },
  { id: '8', name: 'Energy Drink', machine_category_id: '2' },
  
  // Sunscreen types
  { id: '9', name: 'Spray Bottle', machine_category_id: '3' },
  { id: '10', name: 'Lotion Bottle', machine_category_id: '3' },
  { id: '11', name: 'Travel Size', machine_category_id: '3' },
  
  // Combo types
  { id: '12', name: 'Snack + Drink Bundle', machine_category_id: '4' },
  { id: '13', name: 'Meal Deal', machine_category_id: '4' }
];

// Mock Global Products
export const mockGlobalProducts: GlobalProduct[] = [];

// Mock Company Products
export const mockCompanyProducts: CompanyProduct[] = [
  {
    id: '1',
    product_id: '1',
    company_id: 'company-1',
    base_price: 1.50,
    active_for_customer_building: true,
    commission_enabled: true,
    commission_rate: 0.10,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    product_id: '3',
    company_id: 'company-1',
    base_price: 2.00,
    active_for_customer_building: false,
    commission_enabled: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]; 