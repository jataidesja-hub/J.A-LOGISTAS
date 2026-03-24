import { Link } from 'react-router-dom';
import { Store, ShoppingBag } from 'lucide-react';

const MOCK_STORES = [
  { id: 1, name: 'Pizzaria do Chef', description: 'As melhores pizzas da região', logo: '🍕' },
  { id: 2, name: 'Burger & Co', description: 'Hambúrgueres artesanais incríveis', logo: '🍔' },
  { id: 3, name: 'Açaí Tropical', description: 'O açaí mais refrescante', logo: '🍇' },
];

export default function StoreList() {
  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-10 mt-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
          <Store className="text-emerald-400" size={32} />
          J.A Lojistas
        </h1>
      </header>
      
      <main>
        <h2 className="text-xl text-zinc-400 mb-6 font-medium">Lojas disponíveis perto de você</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_STORES.map((store) => (
            <Link 
              key={store.id} 
              to={`/loja/${store.id}`}
              className="group block bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all hover:bg-zinc-800/80 hover:border-emerald-500/50 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{store.logo}</div>
              <h3 className="text-2xl font-semibold mb-2 text-zinc-100">{store.name}</h3>
              <p className="text-zinc-500 text-sm line-clamp-2">{store.description}</p>
              
              <div className="mt-6 flex items-center text-emerald-400 font-medium text-sm group-hover:text-emerald-300">
                <ShoppingBag size={16} className="mr-2" />
                Ver produtos
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
