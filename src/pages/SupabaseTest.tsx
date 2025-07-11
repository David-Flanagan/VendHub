import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test the connection by fetching machine categories
      const { data, error } = await supabase
        .from('machine_categories')
        .select('*')
        .limit(5);

      if (error) {
        throw error;
      }

      setCategories(data || []);
      console.log('Supabase connection successful!', data);
    } catch (err: any) {
      console.error('Supabase connection failed:', err);
      setError(err.message || 'Failed to connect to Supabase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Connection Status</h2>
        
        {loading && (
          <div className="text-blue-600">
            Testing Supabase connection...
          </div>
        )}
        
        {error && (
          <div className="text-red-600 mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="text-green-600 mb-4">
            <strong>✅ Success!</strong> Connected to Supabase successfully.
          </div>
        )}

        {categories.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Sample Data (Machine Categories)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={testSupabaseConnection}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Test Connection Again
        </button>
      </div>
    </div>
  );
} 