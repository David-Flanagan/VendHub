-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create machine_categories table
CREATE TABLE machine_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product_types table
CREATE TABLE product_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    machine_category_id UUID NOT NULL REFERENCES machine_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, machine_category_id)
);

-- Create global_products table
CREATE TABLE global_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_category_id UUID NOT NULL REFERENCES machine_categories(id) ON DELETE CASCADE,
    product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
    brand VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    image TEXT,
    in_global_catalog BOOLEAN DEFAULT true,
    in_company_catalog BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create company_products table
CREATE TABLE company_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES global_products(id) ON DELETE CASCADE,
    company_id UUID NOT NULL, -- This will be linked to auth.users or a separate companies table
    base_price DECIMAL(10,2),
    active_for_customer_building BOOLEAN DEFAULT false,
    commission_enabled BOOLEAN DEFAULT false,
    commission_rate DECIMAL(5,2), -- Percentage (0-100)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(product_id, company_id)
);

-- Create machine_templates table
CREATE TABLE machine_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    machine_category_id UUID NOT NULL REFERENCES machine_categories(id) ON DELETE CASCADE,
    description TEXT,
    template_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_product_types_category ON product_types(machine_category_id);
CREATE INDEX idx_global_products_category ON global_products(machine_category_id);
CREATE INDEX idx_global_products_type ON global_products(product_type_id);
CREATE INDEX idx_company_products_company ON company_products(company_id);
CREATE INDEX idx_company_products_product ON company_products(product_id);
CREATE INDEX idx_machine_templates_category ON machine_templates(machine_category_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_machine_categories_updated_at BEFORE UPDATE ON machine_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_types_updated_at BEFORE UPDATE ON product_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_products_updated_at BEFORE UPDATE ON global_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_products_updated_at BEFORE UPDATE ON company_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_machine_templates_updated_at BEFORE UPDATE ON machine_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE machine_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Machine Categories: Read-only for all authenticated users, full access for admins
CREATE POLICY "Machine categories are viewable by everyone" ON machine_categories FOR SELECT USING (true);
CREATE POLICY "Machine categories are insertable by admins" ON machine_categories FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Machine categories are updatable by admins" ON machine_categories FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Machine categories are deletable by admins" ON machine_categories FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Product Types: Read-only for all authenticated users, full access for admins
CREATE POLICY "Product types are viewable by everyone" ON product_types FOR SELECT USING (true);
CREATE POLICY "Product types are insertable by admins" ON product_types FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Product types are updatable by admins" ON product_types FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Product types are deletable by admins" ON product_types FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Global Products: Read-only for all authenticated users, full access for admins
CREATE POLICY "Global products are viewable by everyone" ON global_products FOR SELECT USING (true);
CREATE POLICY "Global products are insertable by admins" ON global_products FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Global products are updatable by admins" ON global_products FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Global products are deletable by admins" ON global_products FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Company Products: Users can only access their own company's products
CREATE POLICY "Company products are viewable by company owner" ON company_products FOR SELECT USING (company_id::text = auth.jwt() ->> 'company_id');
CREATE POLICY "Company products are insertable by company owner" ON company_products FOR INSERT WITH CHECK (company_id::text = auth.jwt() ->> 'company_id');
CREATE POLICY "Company products are updatable by company owner" ON company_products FOR UPDATE USING (company_id::text = auth.jwt() ->> 'company_id');
CREATE POLICY "Company products are deletable by company owner" ON company_products FOR DELETE USING (company_id::text = auth.jwt() ->> 'company_id');

-- Machine Templates: Read-only for all authenticated users, full access for admins
CREATE POLICY "Machine templates are viewable by everyone" ON machine_templates FOR SELECT USING (true);
CREATE POLICY "Machine templates are insertable by admins" ON machine_templates FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Machine templates are updatable by admins" ON machine_templates FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Machine templates are deletable by admins" ON machine_templates FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Insert sample data
INSERT INTO machine_categories (name, description, icon) VALUES
('Snack', 'Snack vending machines', '🍿'),
('Drink', 'Beverage vending machines', '🥤'),
('Sunscreen', 'Sunscreen and personal care products', '🧴'),
('Combo', 'Combination snack and drink machines', '📦');

-- Insert sample product types
INSERT INTO product_types (name, machine_category_id) VALUES
('Bagged Snack', (SELECT id FROM machine_categories WHERE name = 'Snack')),
('Candy Bar', (SELECT id FROM machine_categories WHERE name = 'Snack')),
('Chips', (SELECT id FROM machine_categories WHERE name = 'Snack')),
('Nuts', (SELECT id FROM machine_categories WHERE name = 'Snack')),
('12oz Can', (SELECT id FROM machine_categories WHERE name = 'Drink')),
('16oz Bottle', (SELECT id FROM machine_categories WHERE name = 'Drink')),
('20oz Bottle', (SELECT id FROM machine_categories WHERE name = 'Drink')),
('Energy Drink', (SELECT id FROM machine_categories WHERE name = 'Drink')),
('Spray Bottle', (SELECT id FROM machine_categories WHERE name = 'Sunscreen')),
('Lotion Bottle', (SELECT id FROM machine_categories WHERE name = 'Sunscreen')),
('Travel Size', (SELECT id FROM machine_categories WHERE name = 'Sunscreen')),
('Snack + Drink Bundle', (SELECT id FROM machine_categories WHERE name = 'Combo')),
('Meal Deal', (SELECT id FROM machine_categories WHERE name = 'Combo'));

-- Insert sample global products
INSERT INTO global_products (machine_category_id, product_type_id, brand, product_name, image, in_global_catalog, in_company_catalog) VALUES
((SELECT id FROM machine_categories WHERE name = 'Snack'), (SELECT id FROM product_types WHERE name = 'Bagged Snack'), 'Doritos', 'Nacho Cheese Tortilla Chips', 'https://via.placeholder.com/150x150?text=Doritos', true, false),
((SELECT id FROM machine_categories WHERE name = 'Snack'), (SELECT id FROM product_types WHERE name = 'Candy Bar'), 'Snickers', 'Chocolate Bar', 'https://via.placeholder.com/150x150?text=Snickers', true, false),
((SELECT id FROM machine_categories WHERE name = 'Drink'), (SELECT id FROM product_types WHERE name = '12oz Can'), 'Coca-Cola', 'Classic Cola', 'https://via.placeholder.com/150x150?text=Coca-Cola', true, false),
((SELECT id FROM machine_categories WHERE name = 'Drink'), (SELECT id FROM product_types WHERE name = '16oz Bottle'), 'Pepsi', 'Pepsi Max', 'https://via.placeholder.com/150x150?text=Pepsi', true, false),
((SELECT id FROM machine_categories WHERE name = 'Sunscreen'), (SELECT id FROM product_types WHERE name = 'Spray Bottle'), 'Coppertone', 'SPF 30 Spray', 'https://via.placeholder.com/150x150?text=Coppertone', true, false); 