import { useState, useEffect } from 'react';
import { machineCategoryService } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { MachineCategory } from '../../types/catalog';

export default function AdminMachineCategories() {
  const [categories, setCategories] = useState<MachineCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dependencies, setDependencies] = useState<Record<string, any>>({});
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await machineCategoryService.getAll();
      setCategories(data);
      
      // Check dependencies for all categories
      const deps: Record<string, any> = {};
      for (const category of data) {
        try {
          deps[category.id] = await machineCategoryService.checkDependencies(category.id);
        } catch (error) {
          console.error(`Error checking dependencies for category ${category.id}:`, error);
          deps[category.id] = { hasProductTypes: false, hasGlobalProducts: false, hasMachineTemplates: false };
        }
      }
      setDependencies(deps);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    
    try {
      await machineCategoryService.create({
        name: formData.name,
        description: formData.description || null,
        icon: formData.icon || null
      });

      await fetchCategories();
      setFormData({ name: '', description: '', icon: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleEdit = (category: MachineCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description ?? '',
      icon: category.icon ?? ''
    });
  };

  const handleUpdate = async () => {
    if (!formData.name.trim() || !editingId) return;
    
    try {
      await machineCategoryService.update(editingId, {
        name: formData.name,
        description: formData.description || null,
        icon: formData.icon || null
      });

      await fetchCategories();
      setFormData({ name: '', description: '', icon: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const debugDelete = async (id: string) => {
    console.log('=== DEBUG DELETE OPERATION ===');
    console.log('Category ID to delete:', id);
    
    // Step 1: Check if category exists
    try {
      const { data: category, error } = await supabase
        .from('machine_categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error finding category:', error);
        return;
      }
      
      console.log('Category found:', category);
      
      // Step 2: Check current user
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      // Step 3: Try direct delete
      const { data: deleteData, error: deleteError, count } = await supabase
        .from('machine_categories')
        .delete()
        .eq('id', id)
        .select();
      
      console.log('Delete result:', { deleteData, deleteError, count });
      
      if (deleteError) {
        console.error('Delete error:', deleteError);
      } else {
        console.log('Delete successful, affected rows:', count);
      }
      
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      console.log('Checking dependencies for category ID:', id);
      const dependencies = await machineCategoryService.checkDependencies(id);
      console.log('Dependencies found:', dependencies);
      
      if (dependencies.hasProductTypes || dependencies.hasGlobalProducts || dependencies.hasMachineTemplates) {
        const message = `Cannot delete this category because it has dependencies:\n` +
          `${dependencies.productTypesCount} product type(s)\n` +
          `${dependencies.globalProductsCount} global product(s)\n` +
          `${dependencies.machineTemplatesCount} machine template(s)\n\n` +
          `Please remove all dependencies first.`;
        alert(message);
        return;
      }

      console.log('Attempting to delete category with ID:', id);
      
      // Try direct delete first (bypasses potential RLS issues)
      let result;
      try {
        result = await machineCategoryService.deleteDirect(id);
        console.log('Direct delete operation completed:', result);
      } catch (directError) {
        console.log('Direct delete failed, trying regular delete:', directError);
        result = await machineCategoryService.delete(id);
        console.log('Regular delete operation completed:', result);
      }
      
      if (result.deleted && result.count && result.count > 0) {
        console.log(`Successfully deleted ${result.count} category(ies)`);
        await fetchCategories();
      } else {
        console.warn('Delete operation completed but no rows were affected');
        alert('Category was not found or could not be deleted. This might be due to permissions or the category not existing.');
      }
    } catch (error: any) {
      console.error('Error deleting category:', error);
      
      // Provide user-friendly error messages based on the error type
      if (error.message?.includes('foreign key') || error.message?.includes('violates')) {
        alert('Cannot delete this category because it is being used by products or product types. Please remove all associated products and product types first.');
      } else if (error.message?.includes('permission') || error.message?.includes('policy') || error.message?.includes('JWT')) {
        alert('You do not have permission to delete this category. You may need admin privileges. Please contact an administrator.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        alert('Network error. Please check your internet connection and try again.');
      } else {
        alert(`Failed to delete category: ${error.message || 'Unknown error occurred'}`);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', icon: '' });
    setIsAdding(false);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Machine Categories</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Machine Categories</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Add Category
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Snack, Drink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an icon</option>
                <option value="🍿">🍿</option>
                <option value="🥤">🥤</option>
                <option value="🧴">🧴</option>
                <option value="📦">📦</option>
                <option value="🍫">🍫</option>
                <option value="🥨">🥨</option>
                <option value="☕">☕</option>
                <option value="🧃">🧃</option>
                <option value="🍪">🍪</option>
                <option value="🥜">🥜</option>
                <option value="🍎">🍎</option>
                <option value="🥪">🥪</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
            >
              {editingId ? 'Update' : 'Add'} Category
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

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Categories</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {categories.map((category) => {
            const categoryDeps = dependencies[category.id];
            const hasDependencies = categoryDeps && (
              categoryDeps.hasProductTypes || 
              categoryDeps.hasGlobalProducts || 
              categoryDeps.hasMachineTemplates
            );
            
            return (
              <div key={category.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                    {hasDependencies && (
                      <div className="mt-1">
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          Has dependencies: {categoryDeps.productTypesCount} types, {categoryDeps.globalProductsCount} products
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => debugDelete(category.id)}
                    className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                    title="Debug delete operation"
                  >
                    Debug
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    disabled={hasDependencies}
                    className={`text-sm font-medium ${
                      hasDependencies 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-red-600 hover:text-red-800'
                    }`}
                    title={hasDependencies ? 'Cannot delete: has dependencies' : 'Delete category'}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 