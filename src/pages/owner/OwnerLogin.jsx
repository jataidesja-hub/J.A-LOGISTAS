import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ShoppingBag, ArrowRight, Lock, Mail, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Logic for supabase login would go here
      // For now, simulating a small delay before navigating
      await new Promise(r => setTimeout(r, 1500));
      navigate('/lojista/dashboard');
    } catch (err) {
      alert('Erro ao entrar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="flex items-center justify-center p-6 bg-zinc-950 overflow-hidden relative">
      {/* Visual background noise/dots for texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-zinc-900/60 backdrop-blur-3xl border border-zinc-800 rounded-[3.5rem] p-12 lg:p-16 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.8)] relative z-10"
      >
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="bg-gradient-to-tr from-emerald-500 to-cyan-500 p-5 rounded-[2.5rem] text-zinc-950 shadow-2xl shadow-emerald-500/20 mb-8 border-t-2 border-emerald-300 transform active:scale-95 transition-transform cursor-pointer"
          >
            <Store size={48} strokeWidth={3} />
          </motion.div>
          <h1 className="text-5xl font-black text-slate-50 uppercase tracking-tighter mb-3 drop-shadow-2xl">
            Painel <span className="text-emerald-500">Master</span>
          </h1>
          <p className="text-zinc-600 font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-cyan-500" />
            Portal Gerencial do Parceiro
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="group">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-4 block transition-colors group-focus-within:text-emerald-500">
                  Acesso Restrito • Email
               </label>
               <div className="relative overflow-hidden rounded-[2rem]">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={20} strokeWidth={2.5} />
                  <input 
                    type="email" 
                    placeholder="DIGITE SEU EMAIL CORPORATIVO..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950/80 border-2 border-zinc-800 rounded-[2rem] py-6 pl-16 pr-8 text-xs font-black uppercase tracking-widest text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                    required
                  />
               </div>
            </div>

            <div className="group">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2 ml-4 block transition-colors group-focus-within:text-cyan-500">
                  Segurança • Chave de Acesso
               </label>
               <div className="relative overflow-hidden rounded-[2rem]">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-500 transition-colors" size={20} strokeWidth={2.5} />
                  <input 
                    type="password" 
                    placeholder="INFORME SUA SENHA..." 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-950/80 border-2 border-zinc-800 rounded-[2rem] py-6 pl-16 pr-8 text-xs font-black uppercase tracking-widest text-zinc-100 placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
                    required
                  />
               </div>
            </div>
          </div>

          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-slate-50 hover:bg-white text-zinc-950 font-black py-6 rounded-[2.5rem] flex items-center justify-center gap-3 transition-all relative overflow-hidden group shadow-2xl shadow-emerald-500/10 active:translate-y-0.5"
          >
            {loading ? (
              <Loader2 className="animate-spin text-zinc-950" size={24} strokeWidth={3} />
            ) : (
              <>
                <span className="text-sm uppercase tracking-widest">Autenticar Agora</span>
                <ChevronRight size={20} strokeWidth={4} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
            
            {/* Visual shine on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite] pointer-events-none" />
          </motion.button>
        </form>

        <div className="mt-16 flex flex-col items-center gap-6">
           <Link to="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
              <ShoppingBag size={14} className="group-hover:-rotate-12 transition-transform" /> 
              Visualizar como Cliente
           </Link>
           <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.5em] mt-8">
              Protocolo J.A Secure • 2026
           </p>
        </div>
      </motion.div>

      {/* Decorative Floating Elements */}
      <div className="fixed bottom-10 right-10 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-4 rounded-3xl flex items-center gap-4 text-xs font-bold text-zinc-500 pointer-events-none">
        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        Sessão Encriptada
      </div>
    </Layout>
  );
}
