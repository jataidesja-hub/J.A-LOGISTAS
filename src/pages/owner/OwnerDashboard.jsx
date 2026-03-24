import { useState, useEffect } from 'react';
import { Store, Package, Users, Settings, LogOut, CheckCircle, Clock, TrendingUp, DollarSign, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

const MOCK_ORDERS = [
  { id: 101, customer: 'João Silva', items: '2x Pizza de Calabresa G', total: 131.8, type: 'Entrega', status: 'pending', time: '10 min atrás' },
  { id: 102, customer: 'Maria Oliveira', items: '1x Hamburguer Artesanal', total: 35.0, type: 'Retirada', status: 'preparing', time: '25 min atrás' },
  { id: 103, customer: 'Carlos Mendes', items: '3x Açaí 500ml', total: 45.0, type: 'Entrega', status: 'completed', time: '1 hr atrás' },
];

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
     async function fetchOwnerData() {
        const sessionStore = JSON.parse(localStorage.getItem('owner_session'));
        if (!sessionStore) {
           navigate('/lojista/login');
           return;
        }
        setStore(sessionStore);

        try {
           const { data: ordersData, error: ordersError } = await supabase
              .from('orders')
              .select('*')
              .eq('store_id', sessionStore.id)
              .order('created_at', { ascending: false });

           if (ordersData && ordersData.length > 0) {
              setOrders(ordersData);
           } else {
              setOrders([]); // No orders found
           }
        } catch (err) {
           console.error('Error fetching data:', err);
        } finally {
           setLoading(false);
        }
     }
     fetchOwnerData();
  }, [navigate]);

  const menuItems = [
    { id: 'orders', label: 'Pedidos Ativos', icon: Clock },
    { id: 'products', label: 'Cardápio Digital', icon: Package },
    { id: 'analytics', label: 'Performance', icon: TrendingUp },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <Layout className="flex min-h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar - Premium Neo-brutalism */}
      <aside className="w-80 border-r border-zinc-900 flex flex-col h-screen fixed top-0 left-0 bg-zinc-950/80 backdrop-blur-3xl z-40">
        <div className="p-10 border-b border-zinc-900 group">
          <Link to="/" className="flex items-center gap-4 group-hover:scale-105 transition-transform duration-500">
            <div className="bg-gradient-to-tr from-emerald-500 to-cyan-500 p-3 rounded-2xl text-slate-950 shadow-2xl shadow-emerald-500/20 transform -rotate-3 group-hover:rotate-0 transition-transform">
              <Store size={28} strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-black text-slate-50 uppercase tracking-tighter text-xl">
                {store?.name?.split(' ')[0] || 'Seu'} <span className="text-emerald-500">{store?.name?.split(' ')[1] || 'Dashboard'}</span>
              </h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">{store?.category || 'Ambiente Lojista'}</p>
            </div>

          </Link>
        </div>

        <nav className="p-6 flex-1 space-y-3 mt-4">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all relative font-black uppercase tracking-tighter text-sm group ${activeTab === item.id ? 'bg-zinc-900 text-emerald-400 border border-zinc-800 shadow-2xl shadow-black/40' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/40'}`}
            >
              {activeTab === item.id && (
                <motion.div layoutId="nav-pill" className="absolute left-2 w-1.5 h-6 bg-emerald-500 rounded-full" />
              )}
              <item.icon size={22} strokeWidth={activeTab === item.id ? 3 : 2} />
              {item.label}
              <ArrowRight size={16} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === item.id ? 'text-emerald-500' : ''}`} />
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-zinc-900">
          <Link to="/lojista/login" className="flex items-center justify-center gap-3 text-rose-500 hover:bg-rose-500/10 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-xs border border-transparent hover:border-rose-500/20">
            <LogOut size={18} strokeWidth={3} />
            Encerrar Sessão
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 p-12 overflow-y-auto min-h-screen">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-50 uppercase tracking-tighter drop-shadow-2xl">
              Dashboard <span className="text-zinc-800">Operational</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
               <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
               Controle de Fluxo • {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div className="flex gap-6">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 px-10 py-6 rounded-[2rem] shadow-2xl shadow-black/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
               <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Faturamento Total</span>
               <p className="text-emerald-400 font-black text-3xl tracking-tighter">R$ {(store?.revenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 px-10 py-6 rounded-[2rem] shadow-2xl shadow-black/40 relative overflow-hidden group">
               <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Clientes Ativos</span>
               <p className="text-cyan-400 font-black text-3xl tracking-tighter">{store?.customers || 0} hits</p>
            </div>

          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter flex items-center gap-4">
                   Gestão de Fila
                   <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
                </h2>
                <div className="flex gap-2">
                   {['Todos', 'Pendentes', 'Em Preparo', 'Finalizados'].map(filter => (
                     <button key={filter} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-500">
                       {filter}
                     </button>
                   ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {orders.map((order) => (
                  <motion.div 
                    key={order.id} 
                    whileHover={{ scale: 1.01 }}
                    className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-10 flex flex-col lg:flex-row justify-between lg:items-center gap-8 group hover:border-emerald-500/30 transition-all shadow-2xl"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
                          #{order.id}
                        </span>
                        <h3 className="text-2xl font-black text-slate-50 uppercase tracking-tighter">{order.customer}</h3>
                        <span className="bg-zinc-950 text-zinc-500 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-zinc-800">
                          {order.type}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-lg font-medium tracking-tight bg-zinc-950/50 p-4 rounded-2xl border border-zinc-900 shadow-inner">
                        {order.items}
                      </p>
                      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Clock size={12} strokeWidth={3} className="text-cyan-500" />
                        Recebido há {order.time}
                      </p>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest mb-1">Subtotal</p>
                        <span className="text-3xl font-black text-slate-50 tracking-tighter">R$ {order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {order.status === 'pending' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-10 py-5 rounded-[1.5rem] text-xs uppercase tracking-widest transition-all shadow-2xl shadow-emerald-500/20 border-t-2 border-emerald-300"
                          >
                            Aceitar Pedido
                          </motion.button>
                        )}
                        {order.status === 'preparing' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-10 py-5 rounded-[1.5rem] text-xs uppercase tracking-widest transition-all shadow-2xl shadow-cyan-500/20 border-t-2 border-cyan-300"
                          >
                            Finalizar Produção
                          </motion.button>
                        )}
                        {order.status === 'completed' && (
                          <span className="flex items-center gap-3 text-emerald-500 text-xs font-black uppercase tracking-widest bg-emerald-500/5 px-8 py-5 rounded-[1.5rem] border border-emerald-500/10">
                            <CheckCircle size={20} strokeWidth={3} /> Despachado
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[3rem] p-16 text-center shadow-2xl"
            >
              <div className="bg-cyan-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/20">
                <Package className="text-cyan-500" size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-50 uppercase tracking-tighter mb-4">Módulo de Estoque</h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm max-w-md mx-auto leading-loose">
                Em breve você poderá gerenciar seu cardápio, fotos dos produtos e precificação dinâmica diretamente por aqui.
              </p>
              <button className="mt-12 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-black px-10 py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] transition-all border border-zinc-700">
                Notificar Disponibilidade
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </Layout>
  );
}
