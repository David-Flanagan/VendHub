import { useState, useEffect } from 'react';
import { companyProductService } from '../../services/supabase';
import { UpdateCompanyProductForm } from '../../types/catalog';

type CompanyProductWithGlobal = {
  id: string;
  product_id: string;
  company_id: string;
  base_price: number | null;
  active_for_customer_building: boolean;
  commission_enabled: boolean;
  commission_rate: number | null;
  created_at: string;
  updated_at: string;
  global_products: {
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
  };
};

export default function CompanyProducts() {
  const [companyProducts, setCompanyProducts] = useState<CompanyProductWithGlobal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateCompanyProductForm>({
    base_price: null,
    active_for_customer_building: false,
    commission_enabled: false,
    commission_rate: 0
  });

  // TODO: Replace with actual company ID from auth context
  const companyId = 'company-1'; // This should come from user authentication

  useEffect(() => {
    fetchCompanyProducts();
  }, []);

  const fetchCompanyProducts = async () => {
    try {
      setLoading(true);
      const data = await companyProductService.getByCompany(companyId);
      setCompanyProducts(data);
    } catch (error) {
      console.error('Error fetching company products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: CompanyProductWithGlobal) => {
    setEditingId(product.id);
    setFormData({
      base_price: product.base_price,
      active_for_customer_building: product.active_for_customer_building,
      commission_enabled: product.commission_enabled,
      commission_rate: product.commission_rate || 0
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    // Check activation gatekeeping
    if (formData.active_for_customer_building && !formData.base_price) {
      alert('Set base price before activating.');
      return;
    }

    try {
      await companyProductService.update(editingId, {
        base_price: formData.base_price,
        active_for_customer_building: formData.active_for_customer_building,
        commission_enabled: formData.commission_enabled,
        commission_rate: formData.commission_rate
      });

      await fetchCompanyProducts();
      setFormData({
        base_price: null,
        active_for_customer_building: false,
        commission_enabled: false,
        commission_rate: 0
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      base_price: null,
      active_for_customer_building: false,
      commission_enabled: false,
      commission_rate: 0
    });
    setEditingId(null);
  };

  const handleToggleActive = async (productId: string, currentActive: boolean) => {
    const product = companyProducts.find(cp => cp.id === productId);
    if (!product) return;

    if (!currentActive && !product.base_price) {
      alert('Set base price before activating.');
      return;
    }

    try {
      await companyProductService.update(productId, {
        active_for_customer_building: !currentActive
      });

      await fetchCompanyProducts();
    } catch (error) {
      console.error('Error toggling product active status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Company Products</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Company Products</h1>
      </div>

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Products</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {companyProducts.map((product) => (
            <div key={product.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src={product.global_products.image} 
                    alt={product.global_products.product_name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{product.global_products.product_name}</h4>
                    <p className="text-sm text-gray-600">{product.global_products.brand}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {product.active_for_customer_building && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                      )}
                      {product.commission_enabled && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Commission</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Base Price</p>
                    <p className="font-medium text-gray-900">
                      {product.base_price ? `$${product.base_price.toFixed(2)}` : 'Not set'}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(product.id, product.active_for_customer_building)}
                      className={`text-sm font-medium ${
                        product.active_for_customer_building
                          ? 'text-red-600 hover:text-red-800'
                          : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {product.active_for_customer_building ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {editingId === product.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Edit Product Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.base_price || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          base_price: e.target.value ? parseFloat(e.target.value) : null 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={formData.commission_rate || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          commission_rate: e.target.value ? parseFloat(e.target.value) : 0 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                        disabled={!formData.commission_enabled}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.active_for_customer_building}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          active_for_customer_building: e.target.checked 
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active for Customer Building</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.commission_enabled}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          commission_enabled: e.target.checked 
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Enable Commission</span>
                    </label>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleUpdate}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
                    >
                      Update Product
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {companyProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No products in your company catalog yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Import products from the global catalog to get started.
          </p>
        </div>
      )}
    </div>
  );
} 