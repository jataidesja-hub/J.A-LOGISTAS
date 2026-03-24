import { Plus, Minus, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-5 rounded-3xl flex gap-6 hover:border-emerald-500/50 hover:bg-zinc-800/80 transition-all shadow-xl shadow-black/20 overflow-hidden relative"
    >
      {/* Product Image */}
      {product.image_url ? (
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 to-transparent" />
        </div>
      ) : (
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-zinc-950/50 border border-zinc-800 flex-shrink-0 flex items-center justify-center text-zinc-700">
          <Info size={32} />
        </div>
      )}

      <div className="flex-1 min-w-0 py-1">
        <div className="flex flex-col mb-1 pt-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 mb-1">{product.category || 'Geral'}</span>
          <h3 className="text-xl font-black text-slate-100 group-hover:text-emerald-400 transition-colors uppercase tracking-tight truncate">{product.name}</h3>
        </div>
        <p className="text-zinc-500 text-sm mt-1 leading-relaxed line-clamp-2 font-medium">{product.description || 'Nenhuma descrição disponível.'}</p>
        
        <div className="flex items-center gap-3 mt-4">
          <span className="text-2xl font-black text-emerald-400 tracking-tighter shadow-sm">R$ {parseFloat(product.price).toFixed(2)}</span>
          {quantity > 0 && <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">| Total R$ {(product.price * quantity).toFixed(2)}</span>}
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center gap-2 pr-2">
        {quantity > 0 ? (
          <div className="flex flex-col items-center gap-1.5 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-1 shadow-2xl backdrop-blur-md">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onAdd(product)} 
              className="p-3 bg-emerald-500 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20 active:translate-y-0.5"
            >
              <Plus size={20} strokeWidth={3} />
            </motion.button>
            <span className="w-8 text-center font-black text-slate-50 text-xl">{quantity}</span>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(product.id)} 
              className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-400 border border-zinc-800 active:translate-y-0.5 transition-colors"
            >
              <Minus size={20} strokeWidth={3} />
            </motion.button>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAdd(product)}
            className="group/btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black p-5 rounded-[2rem] transition-all shadow-xl shadow-emerald-500/20 flex flex-col items-center gap-1 active:translate-y-0.5 border-t-2 border-emerald-300"
          >
            <Plus size={24} strokeWidth={4} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

