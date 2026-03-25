-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DATAS J.A LOGISTAS (V2 - IDEMPOTENTE)
-- Copie e cole este código no "SQL Editor" do seu painel Supabase e clique em "Run"

-- 1. Tabela de Lojas (Stores)
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner text, -- Nome do lojista
  description text,
  logo text,
  rating float DEFAULT 5.0,
  category text,
  delivery_time text,
  email text UNIQUE,
  password text, -- Apenas para teste, o ideal é usar Auth
  revenue numeric DEFAULT 0,
  customers integer DEFAULT 0,
  status text DEFAULT 'Ativo',
  owner_id uuid REFERENCES auth.users(id),
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 1.1 Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Default categories previously inserted here have been removed as per user request to manage entirely via Admin panel
-- 2. Tabela de Produtos (Products)
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  category text,
  image_url text, -- URL da foto do produto
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

-- 4. Habilitar Políticas de Segurança (Row Level Security)
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 5. Criar Políticas (Removendo se já existirem para evitar erro)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Acesso público de leitura para lojas" ON stores;
    CREATE POLICY "Acesso público de leitura para lojas" ON stores FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Acesso público de leitura para produtos" ON products;
    CREATE POLICY "Acesso público de leitura para produtos" ON products FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Acesso público para criação de pedidos" ON orders;
    CREATE POLICY "Acesso público para criação de pedidos" ON orders FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Acesso público de leitura para pedidos" ON orders;
    CREATE POLICY "Acesso público de leitura para pedidos" ON orders FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Acesso público de leitura para categorias" ON categories;
    CREATE POLICY "Acesso público de leitura para categorias" ON categories FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Admin full access for products" ON products;
    CREATE POLICY "Admin full access for products" ON products FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin full access for orders" ON orders;
    CREATE POLICY "Admin full access for orders" ON orders FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin full access for stores" ON stores;
    CREATE POLICY "Admin full access for stores" ON stores FOR ALL USING (true);

    DROP POLICY IF EXISTS "Admin full access for categories" ON categories;
    CREATE POLICY "Admin full access for categories" ON categories FOR ALL USING (true);
END $$;

-- 6. Configuração de Storage (Opcional - Criar balde de imagens)
-- Copie esta parte se ainda não criou o bucket 'product-images' no painel
/*
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Acesso público de leitura para fotos" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Acesso público para upload de fotos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Acesso público para deletar fotos" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
*/

-- 7. Garantir que todas as colunas necessárias existam (em caso de migração)
ALTER TABLE stores ADD COLUMN IF NOT EXISTS owner text;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS password text;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS status text DEFAULT 'Ativo';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS revenue numeric DEFAULT 0;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS customers integer DEFAULT 0;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS longitude double precision;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS delivery_fee_base numeric DEFAULT 5.00;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS delivery_fee_per_km numeric DEFAULT 2.00;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS primary_color text DEFAULT '#10b981';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS background_color text DEFAULT '#09090b';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS font_color text DEFAULT '#f8fafc';

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS category text;


