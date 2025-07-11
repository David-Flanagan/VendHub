-- Fix RLS Policies for VendHub
-- Run this in your Supabase SQL editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Machine categories are insertable by admins" ON machine_categories;
DROP POLICY IF EXISTS "Machine categories are updatable by admins" ON machine_categories;
DROP POLICY IF EXISTS "Machine categories are deletable by admins" ON machine_categories;

DROP POLICY IF EXISTS "Product types are insertable by admins" ON product_types;
DROP POLICY IF EXISTS "Product types are updatable by admins" ON product_types;
DROP POLICY IF EXISTS "Product types are deletable by admins" ON product_types;

DROP POLICY IF EXISTS "Global products are insertable by admins" ON global_products;
DROP POLICY IF EXISTS "Global products are updatable by admins" ON global_products;
DROP POLICY IF EXISTS "Global products are deletable by admins" ON global_products;

DROP POLICY IF EXISTS "Machine templates are insertable by admins" ON machine_templates;
DROP POLICY IF EXISTS "Machine templates are updatable by admins" ON machine_templates;
DROP POLICY IF EXISTS "Machine templates are deletable by admins" ON machine_templates;

-- Create new policies that allow authenticated users
-- Machine Categories
CREATE POLICY "Machine categories are insertable by authenticated users" ON machine_categories 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Machine categories are updatable by authenticated users" ON machine_categories 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Machine categories are deletable by authenticated users" ON machine_categories 
FOR DELETE USING (auth.role() = 'authenticated');

-- Product Types
CREATE POLICY "Product types are insertable by authenticated users" ON product_types 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Product types are updatable by authenticated users" ON product_types 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Product types are deletable by authenticated users" ON product_types 
FOR DELETE USING (auth.role() = 'authenticated');

-- Global Products
CREATE POLICY "Global products are insertable by authenticated users" ON global_products 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Global products are updatable by authenticated users" ON global_products 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Global products are deletable by authenticated users" ON global_products 
FOR DELETE USING (auth.role() = 'authenticated');

-- Machine Templates
CREATE POLICY "Machine templates are insertable by authenticated users" ON machine_templates 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Machine templates are updatable by authenticated users" ON machine_templates 
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Machine templates are deletable by authenticated users" ON machine_templates 
FOR DELETE USING (auth.role() = 'authenticated'); 