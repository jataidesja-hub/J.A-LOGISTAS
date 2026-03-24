import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-5 rounded-3xl flex justify-between items-center hover:border-emerald-500/50 hover:bg-zinc-800/80 transition-all shadow-xl shadow-black/20"
    >
      <div className="flex-1 pr-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">Destaque</span>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{product.name}</h3>
        </div>
        <p className="text-zinc-400 text-sm mt-1 leading-relaxed line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xl font-black text-emerald-400">R$ {product.price.toFixed(2)}</span>
          {quantity > 0 && <span className="text-zinc-600 text-sm">| total R$ {(product.price * quantity).toFixed(2)}</span>}
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        {quantity > 0 ? (
          <div className="flex flex-col items-center gap-2 bg-zinc-950/50 border border-zinc-800 rounded-2xl p-1 shadow-inner">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onAdd(product)} 
              className="p-3 bg-emerald-500 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20 active:translate-y-0.5"
            >
              <Plus size={20} strokeWidth={3} />
            </motion.button>
            <span className="w-8 text-center font-black text-slate-50 text-xl py-1">{quantity}</span>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(product.id)} 
              className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-100 border border-zinc-700 active:translate-y-0.5 transition-colors"
            >
              <Minus size={20} strokeWidth={3} />
            </motion.button>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAdd(product)}
            className="group/btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black p-5 rounded-3xl transition-all shadow-xl shadow-emerald-500/20 flex flex-col items-center gap-1 active:translate-y-0.5"
          >
            <Plus size={24} strokeWidth={3} />
            <span className="text-[10px] uppercase font-bold px-1">Add</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
