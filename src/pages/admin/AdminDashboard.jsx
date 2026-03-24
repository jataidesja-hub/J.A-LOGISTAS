import { useState } from 'react';
import { Store, Users, Eye, Search, BarChart3, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_STORES = [
  { id: 1, name: 'Pizzaria do Chef', owner: 'Chef Silva', email: 'chef@loja.com', customers: 1250, revenue: 15400, status: 'Ativo' },
  { id: 2, name: 'Burger & Co', owner: 'Marcos Burg', email: 'contato@burgerco.com', customers: 890, revenue: 8200, status: 'Ativo' },
  { id: 3, name: 'Açaí Tropical', owner: 'Carla Açaí', email: 'carla@acaitropical.com', customers: 430, revenue: 3100, status: 'Inativo' },
];

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col p-6">
      {/* Header Admin */}
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-900 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-10 w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-xl text-slate-950 shadow-lg shadow-cyan-500/20">
            <Store size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-50">J.A Lojistas Admin</h1>
            <p className="text-zinc-500 text-sm">Painel Administrativo do Sistema</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar lojista..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 transition-colors w-64"
            />
          </div>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20">
            <Plus size={18} />
            Novo Lojista
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-colors">
            <div>
              <p className="text-zinc-500 text-sm mb-1">Total de Lojas</p>
              <h3 className="text-3xl font-bold text-slate-100">24<span className="text-sm text-emerald-400 font-normal ml-2">+3 este mês</span></h3>
            </div>
            <div className="bg-cyan-500/10 p-4 rounded-full text-cyan-400">
              <Store size={32} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-colors">
            <div>
              <p className="text-zinc-500 text-sm mb-1">Clientes Ativos</p>
              <h3 className="text-3xl font-bold text-slate-100">14.2k<span className="text-sm text-emerald-400 font-normal ml-2">+12%</span></h3>
            </div>
            <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-400">
              <Users size={32} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-colors">
            <div>
              <p className="text-zinc-500 text-sm mb-1">Faturamento Sistema</p>
              <h3 className="text-3xl font-bold text-slate-100">R$ 142k<span className="text-sm text-emerald-400 font-normal ml-2">Total</span></h3>
            </div>
            <div className="bg-blue-500/10 p-4 rounded-full text-blue-400">
              <BarChart3 size={32} />
            </div>
          </div>
        </div>

        {/* Lojistas Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-50">Lojistas Cadastrados</h2>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1">
              Ver todos <ExternalLink size={14} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 border-b border-zinc-800 text-zinc-500 text-sm">
                  <th className="p-4 font-medium pl-6">ID</th>
                  <th className="p-4 font-medium">Nome da Loja</th>
                  <th className="p-4 font-medium">Responsável</th>
                  <th className="p-4 font-medium text-center">Acessos</th>
                  <th className="p-4 font-medium text-right">Faturamento</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-center pr-6">Ações</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_STORES.map((store) => (
                  <tr key={store.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-sm">
                    <td className="p-4 pl-6 text-zinc-400">#{store.id}</td>
                    <td className="p-4 font-medium text-slate-100">{store.name}</td>
                    <td className="p-4">
                      <div className="text-zinc-300">{store.owner}</div>
                      <div className="text-xs text-zinc-500">{store.email}</div>
                    </td>
                    <td className="p-4 text-center text-zinc-400">
                      <div className="flex justify-center items-center gap-1">
                        <Eye size={14} /> {store.customers}
                      </div>
                    </td>
                    <td className="p-4 text-right text-emerald-400 font-medium">R$ {store.revenue.toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${store.status === 'Ativo' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button className="text-zinc-500 hover:text-cyan-400 transition-colors p-1" title="Visualizar">
                        <Eye size={18} />
                      </button>
                      <button className="text-zinc-500 hover:text-emerald-400 transition-colors p-1 ml-2" title="Editar">
                        <Settings size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
