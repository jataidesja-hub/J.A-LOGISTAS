import { useState } from 'react';
import { Store, Package, Users, Settings, LogOut, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ORDERS = [
  { id: 101, customer: 'João Silva', items: '2x Pizza de Calabresa', total: 91.8, type: 'Entrega', status: 'pending', time: '10 min atrás' },
  { id: 102, customer: 'Maria Oliveira', items: '1x Hamburguer Artesanal', total: 35.0, type: 'Retirada', status: 'doing', time: '25 min atrás' },
  { id: 103, customer: 'Carlos Mendes', items: '3x Açaí 500ml', total: 45.0, type: 'Entrega', status: 'completed', time: '1 hr atrás' },
];

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col h-screen sticky top-0 bg-zinc-900/50 backdrop-blur-md">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
            <Store size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-50">Minha Loja</h2>
            <p className="text-xs text-zinc-500">Pizzaria do Chef</p>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
          >
            <Clock size={20} />
            Pedidos em Andamento
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
          >
            <Package size={20} />
            Meus Produtos
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'}`}
          >
            <Settings size={20} />
            Configurações da Loja
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800 text-sm">
          <Link to="/lojista/login" className="flex items-center gap-2 text-red-400 hover:bg-red-400/10 px-4 py-2 rounded-lg transition-colors">
            <LogOut size={16} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Painel do Lojista</h1>
            <p className="text-zinc-400 mt-1">Bem-vindo de volta! Aqui estão os pedidos de hoje.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl">
              <span className="text-zinc-500 text-sm whitespace-nowrap">Faturamento Hoje</span>
              <p className="text-emerald-400 font-bold text-xl">R$ 171,80</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl">
              <span className="text-zinc-500 text-sm whitespace-nowrap">Pedidos Totais</span>
              <p className="text-cyan-400 font-bold text-xl">3</p>
            </div>
          </div>
        </header>

        {activeTab === 'orders' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
              <Clock className="text-emerald-400" size={24} />
              Lista de Separação (Pedidos Recebidos)
            </h2>
            
            <div className="space-y-4">
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-zinc-700 transition-colors">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-400">#{order.id}</span>
                      <span className="text-zinc-100 font-medium">{order.customer}</span>
                      <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-xs border border-zinc-700">{order.type}</span>
                    </div>
                    <p className="text-zinc-400 text-sm mt-1">{order.items}</p>
                    <p className="text-zinc-500 text-xs mt-2 flex items-center gap-1">
                      <Clock size={12} />
                      {order.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-lg font-bold text-slate-50">R$ {order.total.toFixed(2)}</span>
                    
                    <div className="flex items-center gap-2">
                      {order.status === 'pending' && (
                        <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                          Aceitar e Preparar
                        </button>
                      )}
                      {order.status === 'doing' && (
                        <button className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                          Marcar como Pronto
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded border border-emerald-400/20">
                          <CheckCircle size={16} /> Entregue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
              <Package className="text-cyan-400" size={24} />
              Gerenciar Produtos
            </h2>
            <p className="text-zinc-500">Área para adicionar, editar ou excluir produtos e seus valores (Em construção)...</p>
          </div>
        )}
      </main>
    </div>
  );
}
