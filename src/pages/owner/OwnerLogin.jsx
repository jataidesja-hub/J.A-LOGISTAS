import { Link } from 'react-router-dom';
import { Store, User, Lock, ExternalLink } from 'lucide-react';

export default function OwnerLogin() {
  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = '/lojista/dashboard';
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-zinc-800 p-4 rounded-2xl mb-4 border border-zinc-700 shadow-inner">
            <Store className="text-emerald-400" size={40} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Portal do Lojista
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Acesse para gerenciar sua loja e pedidos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Usuário / Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input 
                type="text" 
                placeholder="seunome@loja.com" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                required
              />
            </div>
            <div className="flex justify-end mt-2">
              <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">Esqueceu a senha?</a>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 mt-4"
          >
            Entrar no Portal
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">Ainda não tem uma loja?</p>
          <button className="mt-2 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 px-6 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2 mx-auto disabled">
            Cadastre-se <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
