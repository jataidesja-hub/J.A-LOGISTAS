import { useState, useEffect } from 'react';
import { Store, Users, Eye, Search, BarChart3, Plus, ExternalLink, Settings, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

const MOCK_STORES = [];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', owner: '', email: '', category: 'Geral' });

  // Stats calculate dynamically from stores data
  const totalStores = stores.length;
  const totalCustomers = stores.reduce((acc, s) => acc + (s.customers || 0), 0);
  const totalRevenue = stores.reduce((acc, s) => acc + (s.revenue || 0), 0);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('stores').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setStores(data || []);
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('stores').insert([
        { 
          name: newStore.name, 
          owner: newStore.owner, 
          email: newStore.email, 
          category: newStore.category,
          logo: '🏪',
          rating: 5.0,
          status: 'Ativo'
        }
      ]);
      if (error) throw error;
      setShowAddModal(false);
      setNewStore({ name: '', owner: '', email: '', category: 'Geral' });
      fetchAdminData();
    } catch (err) {
      alert('Erro ao adicionar lojista: ' + err.message);
    }
  };

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.owner && s.owner.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = [
    { label: 'Total de Lojas', value: totalStores.toString(), icon: Store, color: 'emerald', trend: 'Lojas cadastradas', trendUp: true },
    { label: 'Clientes Ativos', value: totalCustomers >= 1000 ? `${(totalCustomers/1000).toFixed(1)}k` : totalCustomers.toString(), icon: Users, color: 'cyan', trend: 'Total de acessos', trendUp: true },
    { label: 'Faturamento Sistema', value: `R$ ${(totalRevenue/1000).toFixed(1)}k`, icon: DollarSign, color: 'blue', trend: 'Volume transacionado', trendUp: true },
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
              onClick={() => setShowAddModal(true)}
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
                  {loading ? (
                    <tr><td colSpan={7} className="p-20 text-center text-zinc-600 font-bold uppercase tracking-widest animate-pulse">Sincronizando com Supabase...</td></tr>
                  ) : filteredStores.length === 0 ? (
                    <tr><td colSpan={7} className="p-20 text-center text-zinc-600 font-bold uppercase tracking-widest text-sm">Nenhum lojista encontrado no banco de dados.</td></tr>
                  ) : (
                    filteredStores.map((store) => (
                      <tr key={store.id} className="group hover:bg-zinc-800/20 transition-all font-bold">
                        <td className="p-8 pl-10 text-zinc-700 text-sm font-black truncate max-w-[100px]">#{store.id.toString().slice(0, 5)}</td>
                        <td className="p-8">
                          <div className="text-lg font-black text-slate-50 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{store.name}</div>
                          <div className="text-[10px] text-zinc-700 uppercase tracking-widest mt-1">{store.category || 'Nível Platina'}</div>
                        </td>
                        <td className="p-8">
                          <div className="text-zinc-300 text-sm uppercase tracking-tighter">{store.owner || 'Sem Responsável'}</div>
                          <div className="text-xs text-zinc-600 font-medium lowercase italic">{store.email || 'Email não cadastrado'}</div>
                        </td>
                        <td className="p-8 text-center">
                          <div className="inline-flex justify-center items-center gap-2 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800">
                            <Eye size={14} className="text-cyan-500" strokeWidth={3} /> 
                            <span className="text-slate-100 font-black">{store.customers || 0}</span>
                          </div>
                        </td>
                        <td className="p-8 text-right">
                          <div className="text-emerald-400 text-xl font-black drop-shadow-lg">R$ {(store.revenue || 0).toLocaleString()}</div>
                          <div className="text-[10px] text-emerald-900 font-black uppercase tracking-widest">CRESCIMENTO</div>
                        </td>
                        <td className="p-8 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${store.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                            {store.status || 'Ativo'}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Store Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl z-10"
            >
              <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter mb-8">Novo Lojista</h2>
              <form onSubmit={handleAddStore} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Nome da Empresa</label>
                    <input 
                      type="text" 
                      required
                      placeholder="EX: PIZZARIA DO CHEF"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-cyan-500"
                      value={newStore.name}
                      onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Nome do Responsável</label>
                    <input 
                      type="text" 
                      required
                      placeholder="NOME COMPLETO"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-cyan-500"
                      value={newStore.owner}
                      onChange={(e) => setNewStore({...newStore, owner: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Email de Contato</label>
                    <input 
                      type="email" 
                      required
                      placeholder="EMAIL@EXEMPLO.COM"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-cyan-500"
                      value={newStore.email}
                      onChange={(e) => setNewStore({...newStore, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Categoria</label>
                    <select 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-cyan-500 appearance-none"
                      value={newStore.category}
                      onChange={(e) => setNewStore({...newStore, category: e.target.value})}
                    >
                      <option value="Pizza">Pizza</option>
                      <option value="Lanches">Lanches</option>
                      <option value="Japonesa">Japonesa</option>
                      <option value="Sobremesa">Sobremesa</option>
                      <option value="Bebidas">Bebidas</option>
                      <option value="Geral">Geral</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-zinc-750 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-colors shadow-xl shadow-cyan-500/20"
                  >
                    Confirmar Cadastro
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
