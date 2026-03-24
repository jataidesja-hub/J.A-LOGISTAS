import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, ArrowRight, Lock, Mail, Loader2, Sparkles, ChevronRight, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Simulating a small delay
      await new Promise(r => setTimeout(r, 1200));

      // Credenciais fornecidas pelo usuário
      if (email === 'jataides.ja@gmail.com' && password === 'Sabre0858') {
        localStorage.setItem('admin_session', 'true');
        navigate('/admin');
      } else {
        setError('Credenciais administrativas inválidas.');
      }
    } catch (err) {
      setError('Erro ao processar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="flex items-center justify-center p-6 bg-zinc-950 overflow-hidden relative min-h-screen">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0ea5e910_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-zinc-900/40 backdrop-blur-2xl border border-zinc-800/50 rounded-[3rem] p-10 lg:p-14 shadow-[0_32px_128px_-20px_rgba(0,0,0,0.9)] relative z-10"
      >
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="bg-gradient-to-br from-cyan-500 to-blue-600 p-5 rounded-3xl text-zinc-950 shadow-2xl shadow-cyan-500/20 mb-8 border border-white/10"
          >
            <Shield size={44} strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-50 uppercase tracking-tighter mb-2">
            Acesso <span className="text-cyan-500 text-glow">Admin</span>
          </h1>
          <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-2">
            <Lock size={12} className="text-blue-500" />
            Terminal de Controle Central
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-4 block group-focus-within:text-cyan-500 transition-colors">
                  ID de Operador
               </label>
               <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    placeholder="EMAIL DO ADMINISTRADOR" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-5 pl-16 pr-8 text-xs font-bold tracking-widest text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all shadow-xl"
                    required
                  />
               </div>
            </div>

            <div className="group">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-4 block group-focus-within:text-blue-500 transition-colors">
                  Chave Mestra
               </label>
               <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="password" 
                    placeholder="SENHA DE ACESSO" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl py-5 pl-16 pr-8 text-xs font-bold tracking-widest text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-all shadow-xl"
                    required
                  />
               </div>
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center py-2"
            >
              ⚠️ {error}
            </motion.p>
          )}

          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-2xl shadow-cyan-500/10"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} strokeWidth={4} />
            ) : (
              <>
                <span className="text-xs uppercase tracking-widest">Inicializar Dashboard</span>
                <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-12 flex flex-col items-center gap-4">
           <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
              <LayoutDashboard size={14} className="group-hover:-rotate-12 transition-transform" /> 
              Voltar ao Marketplace
           </Link>
        </div>
      </motion.div>
    </Layout>
  );
}
