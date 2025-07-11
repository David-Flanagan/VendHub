-- Update RLS Policies to use the new user_roles system
-- Run this in your Supabase SQL editor

-- First, make sure RLS is enabled on all tables
ALTER TABLE machine_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_templates ENABLE ROW LEVEL SECURITY;

-- Drop old policies that check for JWT role
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

-- Create new policies that check the user_roles table for admin role
-- Machine Categories
CREATE POLICY "Machine categories are insertable by admins"
  ON machine_categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Machine categories are updatable by admins"
  ON machine_categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Machine categories are deletable by admins"
  ON machine_categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Product Types
CREATE POLICY "Product types are insertable by admins"
  ON product_types FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Product types are updatable by admins"
  ON product_types FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Product types are deletable by admins"
  ON product_types FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Global Products
CREATE POLICY "Global products are insertable by admins"
  ON global_products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Global products are updatable by admins"
  ON global_products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Global products are deletable by admins"
  ON global_products FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Machine Templates
CREATE POLICY "Machine templates are insertable by admins"
  ON machine_templates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Machine templates are updatable by admins"
  ON machine_templates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE POLICY "Machine templates are deletable by admins"
  ON machine_templates FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  ); 