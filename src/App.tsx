import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import pages
import AdminMachineCategories from './pages/admin/MachineCategories';
import AdminProductTypes from './pages/admin/ProductTypes';
import AdminGlobalProducts from './pages/admin/GlobalProducts';
import CatalogImport from './pages/catalog/ImportProducts';
import CompanyProducts from './pages/company/Products';
import SupabaseTest from './pages/SupabaseTest';
import Login from './pages/Login';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                VendHub
              </h1>
              <p className="text-sm text-gray-600">
                Global Catalog Management System
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-6">
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link 
                  to="/admin/machine-categories" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin
                </Link>
                <Link 
                  to="/catalog/import-products" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Catalog
                </Link>
                <Link 
                  to="/company/products" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Company
                </Link>
                <Link 
                  to="/test" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Test
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/machine-categories" element={<AdminMachineCategories />} />
          <Route path="/admin/product-types" element={<AdminProductTypes />} />
          <Route path="/admin/global-products" element={<AdminGlobalProducts />} />
          
          {/* Catalog Routes */}
          <Route path="/catalog/import-products" element={<CatalogImport />} />
          
          {/* Company Routes */}
          <Route path="/company/products" element={<CompanyProducts />} />
          
          {/* Test Route */}
          <Route path="/test" element={<SupabaseTest />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Home Page Component
function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to VendHub
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your vending machine catalogs with ease. From global product management 
          to company-specific customization, VendHub provides everything you need.
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link 
          to="/admin/machine-categories"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-2xl mb-2">🏷️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Machine Categories</h3>
          <p className="text-sm text-gray-600">Manage snack, drink, and other machine categories</p>
        </Link>

        <Link 
          to="/admin/product-types"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-2xl mb-2">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Types</h3>
          <p className="text-sm text-gray-600">Define product types for each machine category</p>
        </Link>

        <Link 
          to="/admin/global-products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-2xl mb-2">🌍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Products</h3>
          <p className="text-sm text-gray-600">Manage the global product catalog</p>
        </Link>

        <Link 
          to="/catalog/import-products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="text-2xl mb-2">📥</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Products</h3>
          <p className="text-sm text-gray-600">Import products to your company catalog</p>
        </Link>
      </div>

      {/* System Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Global Scope</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Machine Categories (Admin defined)</li>
              <li>• Product Types (Admin defined)</li>
              <li>• Global Products (Created by Admin)</li>
              <li>• Machine Templates (Global defaults)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Company Scope</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Company Products (Copied from Global)</li>
              <li>• Pricing & Availability</li>
              <li>• Commission Settings</li>
              <li>• Customer Building Activation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 