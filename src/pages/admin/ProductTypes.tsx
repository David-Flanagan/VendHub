import { useState, useEffect } from 'react';
import { productTypeService, machineCategoryService } from '../../services/supabase';
import { ProductType, MachineCategory } from '../../types/catalog';

export default function AdminProductTypes() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<MachineCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    machine_category_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch both product types and categories
      const [productTypesData, categoriesData] = await Promise.all([
        productTypeService.getAll(),
        machineCategoryService.getAll()
      ]);

      setProductTypes(productTypesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.machine_category_id) return;
    
    try {
      await productTypeService.create({
        name: formData.name,
        machine_category_id: formData.machine_category_id
      });

      await fetchData();
      setFormData({ name: '', machine_category_id: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding product type:', error);
    }
  };

  const handleEdit = (productType: ProductType) => {
    setEditingId(productType.id);
    setFormData({
      name: productType.name,
      machine_category_id: productType.machine_category_id
    });
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !formData.machine_category_id || !editingId) return;
    
    try {
      await productTypeService.update(editingId, {
        name: formData.name,
        machine_category_id: formData.machine_category_id
      });

      await fetchData();
      setFormData({ name: '', machine_category_id: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating product type:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product type?')) return;
    
    try {
      await productTypeService.delete(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting product type:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', machine_category_id: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Product Types</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">Loading product types...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Types</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Add Product Type
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Product Type' : 'Add New Product Type'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 12oz Can, Bagged Snack"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Machine Category *
              </label>
              <select
                value={formData.machine_category_id}
                onChange={(e) => setFormData({ ...formData, machine_category_id: e.target.value })}
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
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
            >
              {editingId ? 'Update' : 'Add'} Product Type
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

      {/* Product Types List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Product Types</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {productTypes.map((productType) => (
            <div key={productType.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{productType.name}</h4>
                <p className="text-sm text-gray-600">
                  Category: {getCategoryName(productType.machine_category_id)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(productType)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(productType.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 