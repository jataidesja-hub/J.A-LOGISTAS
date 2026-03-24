import { motion } from 'framer-motion';

export default function Layout({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-zinc-950 text-slate-50 selection:bg-cyan-500/30 overflow-x-hidden ${className}`}>
      {/* Background gradients for premium feel */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {children}
      </motion.div>
    </div>
  );
}
