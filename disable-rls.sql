-- Temporarily disable RLS for testing
-- Run this in your Supabase SQL editor

-- Disable RLS on all tables for testing
ALTER TABLE machine_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE machine_templates DISABLE ROW LEVEL SECURITY;

-- To re-enable RLS later, run:
-- ALTER TABLE machine_categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE global_products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE company_products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE machine_templates ENABLE ROW LEVEL SECURITY; 