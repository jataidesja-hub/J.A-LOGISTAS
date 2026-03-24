import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Send, MapPin, Star, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../lib/supabaseClient';

export default function StoreDetails() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function fetchData() {
      try {
        const { data: storeData } = await supabase.from('stores').select('*').eq('id', storeId).single();
        const { data: prodData } = await supabase.from('products').select('*').eq('store_id', storeId);
        
        setStore(storeData || null);
        setProducts(prodData || []);
      } catch (err) {
        console.error('Error fetching store:', err);
        setStore(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [storeId]);

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (!newCart[productId]) return prev;
      if (newCart[productId].quantity > 1) {
        newCart[productId].quantity -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleFinishOrder = async () => {
    if (cartItems.length === 0) return;
    
    // In a real app, send this to Supabase orders table
    alert(`🛸 Pedido enviado!\nTotal: R$ ${total.toFixed(2)}\nObrigado por comprar conosco!`);
    setCart({});
  };

  if (loading) return <Layout><div className="flex items-center justify-center min-h-screen font-black text-2xl uppercase tracking-tighter text-emerald-500 animate-pulse">Carregando Vitrine...</div></Layout>;

  return (
    <Layout>
      <header className="bg-zinc-900/50 backdrop-blur-2xl border-b border-zinc-800 sticky top-0 z-20 px-8 py-6 w-full shadow-2xl shadow-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="p-3 hover:bg-zinc-800 bg-zinc-900/50 rounded-[1.5rem] border border-zinc-800 transition-all text-zinc-400 group active:scale-95">
              <ArrowLeft size={24} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-slate-50 uppercase tracking-tighter flex items-center gap-3">
                {store?.name}
                <div className="flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-700 text-sm font-bold ml-2">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {store?.rating}
                </div>
              </h1>
              <div className="flex items-center gap-4 mt-1">
                 <p className="text-sm text-emerald-500 font-black uppercase flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <Clock size={14} strokeWidth={3} /> {store?.deliveryTime} min
                 </p>
                 <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-zinc-600" /> Aberto agora
                 </p>
              </div>
            </div>
          </div>
          
          <div className="flex lg:hidden relative">
            <ShoppingCart size={28} className="text-emerald-400" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-slate-100 text-zinc-950 font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 flex flex-col lg:flex-row gap-12 relative">
        {/* Product List */}
        <div className="flex-1 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter flex items-center gap-3">
                Cardápio Principal
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  quantity={cart[product.id]?.quantity || 0}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </section>

          <div className="p-8 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex items-center justify-center gap-4 text-zinc-600 font-bold uppercase tracking-widest text-sm">
            <Info size={20} />
            Novos produtos em breve
          </div>
        </div>

        {/* Floating Cart (Sidebar) */}
        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="lg:w-[24rem] h-fit md:sticky top-32"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-1 shadow-2xl shadow-black/60 relative overflow-hidden ring-1 ring-zinc-800">
                {/* Cart Header */}
                <div className="p-8 pb-4">
                  <h2 className="text-3xl font-black flex items-center gap-3 text-slate-50 uppercase tracking-tighter mb-1">
                    Carrinho
                    <ShoppingCart size={24} className="text-emerald-400" strokeWidth={3} />
                  </h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest tracking-loose">Sua reserva de delícias</p>
                </div>

                <div className="px-8 space-y-4 mb-8 max-h-[25rem] overflow-y-auto custom-scrollbar pr-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                      <div className="flex-1">
                        <span className="text-slate-100 font-black text-sm uppercase tracking-tight block">
                          <span className="text-emerald-500 text-xs mr-2">{item.quantity}X</span> 
                          {item.name}
                        </span>
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">R$ {item.price.toFixed(2)}/un</span>
                      </div>
                      <span className="text-emerald-400 font-black text-base ml-2">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="px-8 space-y-2 mb-8">
                  <div className="flex gap-2 p-1.5 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                    <button 
                      onClick={() => setDeliveryType('delivery')}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-tighter rounded-xl transition-all ${deliveryType === 'delivery' ? 'bg-zinc-800 text-emerald-400 shadow-xl border border-emerald-500/20' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      Entrega
                    </button>
                    <button 
                      onClick={() => setDeliveryType('pickup')}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-tighter rounded-xl transition-all ${deliveryType === 'pickup' ? 'bg-zinc-800 text-emerald-400 shadow-xl border border-emerald-500/20' : 'text-zinc-600 hover:text-zinc-400'}`}
                    >
                      Retirada
                    </button>
                  </div>
                </div>

                <div className="px-8 pb-8 pt-6 border-t border-zinc-800 bg-zinc-950/20">
                  <div className="flex justify-between items-end mb-8">
                    <div className="space-y-1">
                        <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Valor final</p>
                        <h4 className="text-slate-50 font-black text-4xl uppercase tracking-tighter drop-shadow-lg">
                          R$ {total.toFixed(2)}
                        </h4>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinishOrder}
                    className="group-buy w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-500/30 active:translate-y-0.5 border-t-4 border-emerald-400"
                  >
                    <Send size={24} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                    <span className="text-xl uppercase tracking-tighter">Enviar Pedido</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </Layout>
  );
}
