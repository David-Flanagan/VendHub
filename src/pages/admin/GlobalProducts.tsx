import { useState, useEffect } from 'react';
import { GlobalProduct, CreateGlobalProductForm, MachineCategory, ProductType } from '../../types/catalog';
import { globalProductService, machineCategoryService, productTypeService } from '../../services/supabase';

export default function AdminGlobalProducts() {
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [categories, setCategories] = useState<MachineCategory[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CreateGlobalProductForm>({
    machine_category_id: '',
    product_type_id: '',
    brand: '',
    product_name: '',
    image: '',
    add_to_global_catalog: true,
    add_to_company_catalog: false
  });

  // Load products from Supabase on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadProductTypes();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await globalProductService.getAll();
      setProducts(data);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await machineCategoryService.getAll();
      setCategories(data);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProductTypes = async () => {
    try {
      const data = await productTypeService.getAll();
      setProductTypes(data);
    } catch (err: any) {
      console.error('Failed to load product types:', err);
    }
  };

  const handleAdd = async () => {
    if (!formData.brand.trim() || !formData.product_name.trim() || 
        !formData.machine_category_id || !formData.product_type_id) return;
    
    try {
      const newProduct = await globalProductService.create({
        machine_category_id: formData.machine_category_id,
        product_type_id: formData.product_type_id,
        brand: formData.brand,
        product_name: formData.product_name,
        image: formData.image || 'https://via.placeholder.com/150x150?text=Product',
        in_global_catalog: formData.add_to_global_catalog,
        in_company_catalog: formData.add_to_company_catalog
      });
      
      setProducts([...products, newProduct]);
      setFormData({
        machine_category_id: '',
        product_type_id: '',
        brand: '',
        product_name: '',
        image: '',
        add_to_global_catalog: true,
        add_to_company_catalog: false
      });
      setIsAdding(false);
    } catch (err: any) {
      console.error('Failed to create product:', err);
      alert('Failed to create product: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await globalProductService.delete(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err: any) {
        console.error('Failed to delete product:', err);
        alert('Failed to delete product: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      machine_category_id: '',
      product_type_id: '',
      brand: '',
      product_name: '',
      image: '',
      add_to_global_catalog: true,
      add_to_company_catalog: false
    });
    setIsAdding(false);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getProductTypeName = (typeId: string) => {
    return productTypes.find(type => type.id === typeId)?.name || 'Unknown';
  };

  const filteredProductTypes = formData.machine_category_id 
    ? productTypes.filter(type => type.machine_category_id === formData.machine_category_id)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Global Products</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Add Product
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        </div>
      )}

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Machine Category *
              </label>
              <select
                value={formData.machine_category_id}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  machine_category_id: e.target.value,
                  product_type_id: '' // Reset product type when category changes
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Type *
              </label>
              <select
                value={formData.product_type_id}
                onChange={(e) => setFormData({ ...formData, product_type_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.machine_category_id}
              >
                <option value="">Select a product type</option>
                {filteredProductTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Coca-Cola, Doritos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Classic Cola, Nacho Cheese Chips"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          {/* Checkboxes */}
          <div className="mt-4 space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.add_to_global_catalog}
                onChange={(e) => setFormData({ ...formData, add_to_global_catalog: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Add to Global Catalog</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.add_to_company_catalog}
                onChange={(e) => setFormData({ ...formData, add_to_company_catalog: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Add to Company Catalog</span>
            </label>
          </div>

          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
            >
              Add Product
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

      {/* Products List */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">All Products ({products.length})</h3>
            <button
              onClick={loadProducts}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Refresh
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No products found. Add your first product above.
              </div>
            ) : (
              <>
                {products.map((product) => (
                  <div key={product.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.image} 
                        alt={product.product_name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{product.product_name}</h4>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                        <p className="text-xs text-gray-500">
                          {getCategoryName(product.machine_category_id)} • {getProductTypeName(product.product_type_id)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        {product.in_global_catalog && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Global</span>
                        )}
                        {product.in_company_catalog && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Company</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 