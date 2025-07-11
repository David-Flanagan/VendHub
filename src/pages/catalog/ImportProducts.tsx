import { useState, useEffect } from 'react';
import { globalProductService, machineCategoryService, productTypeService, companyProductService } from '../../services/supabase';
import { GlobalProduct, CatalogFilters } from '../../types/catalog';

export default function CatalogImport() {
  const [products, setProducts] = useState<GlobalProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CatalogFilters>({});
  const [view, setView] = useState<'products' | 'machine-templates'>('products');

  // TODO: Replace with actual company ID from auth context
  const companyId = 'company-1'; // This should come from user authentication

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, productTypesData] = await Promise.all([
        globalProductService.getAll(),
        machineCategoryService.getAll(),
        productTypeService.getAll()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setProductTypes(productTypesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  const getProductTypeName = (typeId: string) => {
    return productTypes.find(type => type.id === typeId)?.name || 'Unknown';
  };

  const filteredProducts = products.filter(product => {
    if (filters.machine_category_id && product.machine_category_id !== filters.machine_category_id) {
      return false;
    }
    if (filters.product_type_id && product.product_type_id !== filters.product_type_id) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        product.brand.toLowerCase().includes(searchLower) ||
        product.product_name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const handleAddToCatalog = async (productId: string) => {
    try {
      await companyProductService.importFromGlobal(productId, companyId);
      alert(`Product added to your company catalog successfully!`);
    } catch (error: any) {
      if (error.message === 'Product already exists in company catalog') {
        alert('This product is already in your company catalog.');
      } else {
        console.error('Error adding product to catalog:', error);
        alert('Failed to add product to catalog. Please try again.');
      }
    }
  };

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const categoryId = product.machine_category_id;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {} as Record<string, GlobalProduct[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Import Products</h1>
      </div>

      {/* Navigation Toggles */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setView('products')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === 'products'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setView('machine-templates')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              view === 'machine-templates'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Machine Templates
          </button>
        </div>
      </div>

      {view === 'products' && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Machine Category
                </label>
                <select
                  value={filters.machine_category_id || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    machine_category_id: e.target.value || undefined 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type
                </label>
                <select
                  value={filters.product_type_id || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    product_type_id: e.target.value || undefined 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {productTypes
                    .filter(type => !filters.machine_category_id || type.machine_category_id === filters.machine_category_id)
                    .map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by brand or product name..."
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="space-y-6">
            {Object.entries(groupedProducts).map(([categoryId, categoryProducts]) => (
              <div key={categoryId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {getCategoryName(categoryId)}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-3">
                          <img 
                            src={product.image} 
                            alt={product.product_name}
                            className="w-16 h-16 rounded object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{product.product_name}</h4>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                            <p className="text-xs text-gray-500">{getProductTypeName(product.product_type_id)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCatalog(product.id)}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                        >
                          Add to My Catalog
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'machine-templates' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Machine Templates</h3>
          <p className="text-gray-600">
            Machine templates functionality will be implemented here. This will allow operators 
            to import pre-configured machine layouts and configurations.
          </p>
        </div>
      )}
    </div>
  );
} 