import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, ShoppingBag, Search, MapPin, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function StoreList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data as fallback
  const MOCK_STORES = [
    { id: 1, name: 'Pizzaria do Chef', description: 'As melhores pizzas artesanais da região com massa de fermentação natural.', logo: '🍕', rating: 4.8, category: 'Pizza', deliveryTime: '30-45' },
    { id: 2, name: 'Burger & Co', description: 'Hambúrgueres suculentos grelhados no fogo com ingredientes selecionados.', logo: '🍔', rating: 4.9, category: 'Lanches', deliveryTime: '20-35' },
    { id: 3, name: 'Açaí Tropical', description: 'O açaí mais gelado e refrescante com acompanhamentos ilimitados.', logo: '🍇', rating: 4.7, category: 'Sobremesa', deliveryTime: '15-25' },
    { id: 4, name: 'Sushi Zen', description: 'Culinária japonesa moderna com peixes frescos e ambiente exclusivo.', logo: '🍱', rating: 4.9, category: 'Japonesa', deliveryTime: '40-60' },
  ];

  useEffect(() => {
    async function fetchStores() {
      try {
        const { data, error } = await supabase.from('stores').select('*');
        if (error) throw error;
        if (data && data.length > 0) setStores(data);
        else setStores(MOCK_STORES);
      } catch (err) {
        setStores(MOCK_STORES);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <motion.div 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="space-y-2"
            >
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-4 tracking-tighter">
                <Store className="text-emerald-400" size={56} strokeWidth={2.5} />
                J.A Lojistas
              </h1>
              <p className="text-zinc-500 text-lg flex items-center gap-2 font-medium">
                <MapPin size={18} className="text-cyan-500" />
                Sua vitrine virtual favorita • São Paulo, SP
              </p>
            </motion.div>

            <motion.div 
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className="relative group w-full md:w-96"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Busque por loja ou produto..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-900/50 backdrop-blur-xl border-2 border-zinc-800 rounded-3xl py-4 pl-14 pr-6 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all shadow-2xl shadow-black/20"
              />
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-3">
            {['Todos', 'Pizza', 'Lanches', 'Japonesa', 'Brasileira', 'Bebidas'].map(cat => (
              <button 
                key={cat}
                className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm font-bold text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all hover:bg-emerald-500/5"
              >
                {cat}
              </button>
            ))}
          </div>
        </header>
        
        <main>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStores.map((store, index) => (
                  <motion.div
                    key={store.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      to={`/loja/${store.id}`}
                      className="group block bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-8 transition-all hover:bg-zinc-800/80 hover:border-emerald-500/30 hover:-translate-y-2 shadow-2xl shadow-black/40 relative overflow-hidden"
                    >
                      {/* Accent corner */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start mb-6">
                        <div className="text-6xl group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                          {store.logo}
                        </div>
                        <div className="flex items-center gap-1 bg-zinc-950/80 px-3 py-1.5 rounded-2xl border border-zinc-800">
                          <Star size={14} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-black text-slate-100">{store.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-3xl font-black mb-3 text-slate-50 group-hover:text-emerald-400 transition-colors tracking-tight uppercase">
                        {store.name}
                      </h3>
                      <p className="text-zinc-500 text-base line-clamp-2 leading-relaxed font-medium">
                        {store.description}
                      </p>
                      
                      <div className="mt-8 pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-zinc-400 text-sm font-bold uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <Clock size={16} className="text-emerald-500" />
                            {store.deliveryTime} min
                          </span>
                        </div>
                        <div className="p-3 bg-emerald-500 rounded-2xl text-slate-950 transform group-hover:rotate-12 transition-transform shadow-lg shadow-emerald-500/30">
                          <ShoppingBag size={20} strokeWidth={3} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          {!loading && filteredStores.length === 0 && (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-zinc-100">Nenhuma loja encontrada</h3>
              <p className="text-zinc-500 mt-2">Tente buscar por outro termo ou categoria</p>
            </div>
          )}
        </main>

        <footer className="mt-24 pt-12 border-t border-zinc-900 text-center">
          <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-xs">
            © 2026 J.A Logistas • Powered by Antigravity AI
          </p>
        </footer>
      </div>
    </Layout>
  );
}
