import { useState, useEffect } from 'react';
import { Store, Users, Eye, Search, BarChart3, Plus, ExternalLink, Settings, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

const MOCK_STORES = [
  { id: 1, name: 'Pizzaria do Chef', owner: 'Chef Silva', email: 'chef@loja.com', customers: 1250, revenue: 15400, status: 'Ativo', trend: '+12%' },
  { id: 2, name: 'Burger & Co', owner: 'Marcos Burg', email: 'contato@burgerco.com', customers: 890, revenue: 8200, status: 'Ativo', trend: '+5%' },
  { id: 3, name: 'Açaí Tropical', owner: 'Carla Açaí', email: 'carla@acaitropical.com', customers: 430, revenue: 3100, status: 'Inativo', trend: '-2%' },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     async function fetchAdminData() {
        try {
           const { data } = await supabase.from('stores').select('*');
           if (data && data.length > 0) setStores(data); else setStores(MOCK_STORES);
        } catch (err) {
           setStores(MOCK_STORES);
        } finally {
           setLoading(false);
        }
     }
     fetchAdminData();
  }, []);

  const stats = [
    { label: 'Total de Lojas', value: '24', icon: Store, color: 'emerald', trend: '+3 este mês', trendUp: true },
    { label: 'Clientes Ativos', value: '14.2k', icon: Users, color: 'cyan', trend: '+12%', trendUp: true },
    { label: 'Faturamento Sistema', value: 'R$ 142k', icon: DollarSign, color: 'blue', trend: '-2%', trendUp: false },
  ];

  return (
    <Layout>
      <div className="p-8 lg:p-12 max-w-7xl mx-auto min-h-screen">
        {/* Admin Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 sticky top-0 bg-zinc-950/20 backdrop-blur-xl py-6 z-30 -mx-4 px-4 rounded-3xl border border-zinc-900/50 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-3xl text-slate-950 shadow-2xl shadow-cyan-500/20 ring-4 ring-white/5">
              <BarChart3 size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-50 uppercase tracking-tighter drop-shadow-lg">
                J.A <span className="text-cyan-500">Logistas</span> Admin
              </h1>
              <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Sistema em Tempo Real
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input 
                type="text" 
                placeholder="PROCURAR LOJISTA..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900/80 border border-zinc-800 rounded-2xl py-3 pl-12 pr-6 text-xs font-black uppercase tracking-widest text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500 transition-all w-full md:w-72 shadow-xl"
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-8 py-3 rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl shadow-cyan-500/30 border-t border-cyan-300"
            >
              <Plus size={18} strokeWidth={3} />
              Novo Lojista
            </motion.button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="space-y-10">
          {/* KPI Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-zinc-700 transition-all shadow-2xl shadow-black/40 group overflow-hidden relative"
              >
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}-500/5 blur-3xl pointer-events-none group-hover:bg-${stat.color}-500/10 transition-colors`} />
                <div className="space-y-2">
                  <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
                  <h3 className="text-5xl font-black text-slate-100 tracking-tighter drop-shadow-sm">{stat.value}</h3>
                  <div className={`flex items-center gap-1.5 text-xs font-black uppercase ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.trend}
                  </div>
                </div>
                <div className={`bg-${stat.color}-500/10 p-5 rounded-3xl text-${stat.color}-400 group-hover:scale-110 group-hover:bg-${stat.color}-500/20 transition-all border border-${stat.color}-500/20`}>
                  <stat.icon size={36} strokeWidth={2} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Management Console */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-900/20 backdrop-blur-2xl border border-zinc-800 rounded-[3rem] overflow-hidden shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] ring-1 ring-zinc-800"
          >
            <div className="p-10 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/30">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-2xl">
                  <TrendingUp className="text-emerald-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter">Console de Lojistas</h2>
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Gestão centralizada de parceiros</p>
                </div>
              </div>
              <button className="text-xs text-cyan-400 hover:text-cyan-300 font-black uppercase tracking-widest transition-all flex items-center gap-3 bg-cyan-950/20 px-6 py-3 rounded-2xl border border-cyan-900/30">
                EXPORTAR DADOS <ExternalLink size={14} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-600 text-[10px] font-black uppercase tracking-widest border-b border-zinc-900">
                    <th className="p-8 pl-10 font-black">Ref</th>
                    <th className="p-8 font-black">Establishment</th>
                    <th className="p-8 font-black">Administrator</th>
                    <th className="p-8 text-center font-black">Matrix Score</th>
                    <th className="p-8 text-right font-black">Gross Revenue</th>
                    <th className="p-8 text-center font-black">Operation</th>
                    <th className="p-8 text-center pr-10 font-black">Command</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/50">
                  {stores.map((store) => (
                    <tr key={store.id} className="group hover:bg-zinc-800/20 transition-all font-bold">
                      <td className="p-8 pl-10 text-zinc-700 text-sm font-black">#{String(store.id).padStart(3, '0')}</td>
                      <td className="p-8">
                        <div className="text-lg font-black text-slate-50 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{store.name}</div>
                        <div className="text-[10px] text-zinc-700 uppercase tracking-widest mt-1">NÍVEL PLATINUM</div>
                      </td>
                      <td className="p-8">
                        <div className="text-zinc-300 text-sm uppercase tracking-tighter">{store.owner}</div>
                        <div className="text-xs text-zinc-600 font-medium lowercase italic">{store.email}</div>
                      </td>
                      <td className="p-8 text-center">
                        <div className="inline-flex justify-center items-center gap-2 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800">
                          <Eye size={14} className="text-cyan-500" strokeWidth={3} /> 
                          <span className="text-slate-100 font-black">{store.customers}</span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <div className="text-emerald-400 text-xl font-black drop-shadow-lg">R$ {store.revenue.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-900 font-black uppercase tracking-widest">{store.trend} GROWTH</div>
                      </td>
                      <td className="p-8 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${store.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                          {store.status}
                        </span>
                      </td>
                      <td className="p-8 pr-10 text-center">
                        <div className="flex justify-center gap-2">
                           <button className="text-zinc-600 hover:text-cyan-400 transition-all p-3 bg-zinc-950/30 rounded-2xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20" title="Control Console">
                            <Settings size={20} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
