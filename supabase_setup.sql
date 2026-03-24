-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DATAS J.A LOGISTAS
-- Copie e cole este código no "SQL Editor" do seu painel Supabase e clique em "Run"

-- 1. Tabela de Lojas (Stores)
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  logo text,
  rating float DEFAULT 5.0,
  category text,
  delivery_time text,
  revenue numeric DEFAULT 0,
  customers integer DEFAULT 0,
  status text DEFAULT 'Ativo',
  owner_id uuid REFERENCES auth.users(id),
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Produtos (Products)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  delivery_type text, -- 'delivery' ou 'pickup'
  status text DEFAULT 'pending', -- 'pending', 'preparing', 'completed'
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Inserir Dados Iniciais (Exemplo)
INSERT INTO stores (name, description, logo, category, delivery_time, rating) 
VALUES 
('Pizzaria do Chef', 'As melhores pizzas artesanais da região.', '🍕', 'Pizza', '30-45', 4.8),
('Burger & Co', 'Hambúrgueres suculentos e selecionados.', '🍔', 'Lanches', '20-35', 4.9);

-- 5. Habilitar Políticas de Segurança (Row Level Security)
-- Por enquanto, habilitamos acesso público apenas para leitura (Select)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público de leitura para lojas" ON stores FOR SELECT USING (true);
CREATE POLICY "Acesso público de leitura para produtos" ON products FOR SELECT USING (true);
CREATE POLICY "Acesso público para criação de pedidos" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público de leitura para pedidos" ON orders FOR SELECT USING (true);
