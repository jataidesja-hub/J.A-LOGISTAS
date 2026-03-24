import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Plus, Minus, Send } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Pizza de Calabresa', price: 45.9, description: 'Molho, queijo, calabresa fresca e cebola.' },
  { id: 2, name: 'Pizza Marguerita', price: 42.0, description: 'Molho de tomate fresco, manjericão e queijo.' },
  { id: 3, name: 'Coca Cola 2L', price: 12.0, description: 'Refrigerante gelado.' },
];

export default function StoreDetails() {
  const { storeId } = useParams();
  const [cart, setCart] = useState({});
  const [deliveryType, setDeliveryType] = useState('delivery'); // delivery or pickup

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (!newCart[productId]) return prev;
      if (newCart[productId].quantity > 1) {
        newCart[productId].quantity -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartItems = Object.values(cart);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleFinishOrder = () => {
    if (cartItems.length === 0) return alert('Carrinho vazio!');
    // Here we would create the order in Supabase
    alert(`Pedido finalizado!\nTotal: R$ ${total.toFixed(2)}\nTipo: ${deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}`);
    setCart({});
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-10 px-6 py-4 flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-50">Loja {storeId}</h1>
          <p className="text-sm text-zinc-400">Aberto agora</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        {/* Product List */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-100">Cardápio</h2>
          <div className="space-y-4">
            {MOCK_PRODUCTS.map((product) => (
              <div key={product.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center group hover:border-zinc-700 transition-colors">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-medium text-slate-100">{product.name}</h3>
                  <p className="text-zinc-500 text-sm mt-1">{product.description}</p>
                  <p className="text-emerald-400 font-semibold mt-2">R$ {product.price.toFixed(2)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {cart[product.id] ? (
                    <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-1">
                      <button onClick={() => removeFromCart(product.id)} className="p-1.5 hover:bg-zinc-700 rounded-md text-zinc-300">
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-medium text-slate-50">{cart[product.id].quantity}</span>
                      <button onClick={() => addToCart(product)} className="p-1.5 hover:bg-zinc-700 rounded-md text-zinc-300">
                        <Plus size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold py-2 px-4 rounded-xl transition-colors"
                    >
                      Adicionar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart */}
        {cartItems.length > 0 && (
          <div className="w-full lg:w-96 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <ShoppingCart size={24} className="text-emerald-400" />
              Seu Pedido
            </h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm border-b border-zinc-800/50 pb-2">
                  <span className="text-zinc-300">
                    <span className="text-zinc-500 mr-2">{item.quantity}x</span> 
                    {item.name}
                  </span>
                  <span className="text-emerald-400 font-medium">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6 p-1 bg-zinc-800/50 rounded-xl">
              <button 
                onClick={() => setDeliveryType('delivery')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${deliveryType === 'delivery' ? 'bg-zinc-700 text-slate-50' : 'text-zinc-400 hover:text-zinc-300'}`}
              >
                Entrega
              </button>
              <button 
                onClick={() => setDeliveryType('pickup')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${deliveryType === 'pickup' ? 'bg-zinc-700 text-slate-50' : 'text-zinc-400 hover:text-zinc-300'}`}
              >
                Retirada
              </button>
            </div>

            <div className="border-t border-zinc-800 pt-4 mb-6">
              <div className="flex justify-between items-center text-xl font-bold">
                <span className="text-zinc-100">Total</span>
                <span className="text-emerald-400">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleFinishOrder}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Send size={20} />
              Finalizar Pedido
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
