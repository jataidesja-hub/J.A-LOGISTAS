import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Send, MapPin, Star, Clock, Info, CheckCircle, User, Phone, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { supabase } from '../../lib/supabaseClient';


export default function StoreDetails() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);





  useEffect(() => {
    async function fetchData() {
      try {
        const { data: storeData } = await supabase.from('stores').select('*').eq('id', storeId).single();
        const { data: prodData } = await supabase.from('products').select('*').eq('store_id', storeId);
        
        setStore(storeData || null);
        setProducts(prodData || []);
      } catch (err) {
        console.error('Error fetching store:', err);
        setStore(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [storeId]);

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
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'delivery' ? (parseFloat(store?.delivery_fee) || 0) : 0;
  const total = subtotal + deliveryFee;


  const handleFinishOrder = async () => {
    if (cartItems.length === 0) return;
    if (!customerName || !customerWhatsapp) {
      alert('Por favor, preencha seu nome e WhatsApp para continuar.');
      return;
    }
    if (deliveryType === 'delivery' && !customerAddress) {
      alert('Por favor, preencha seu endereço para a entrega.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        store_id: storeId,
        customer_name: customerName,
        customer_whatsapp: customerWhatsapp,
        customer_address: customerAddress,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: total,
        delivery_type: deliveryType,
        status: 'pending'
      };


      const { data, error } = await supabase.from('orders').insert([orderData]).select();
      
      if (error) throw error;

      setCart({});
      setCustomerName('');
      setCustomerWhatsapp('');
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Erro ao enviar pedido: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) return <Layout><div className="flex items-center justify-center min-h-screen font-black text-2xl uppercase tracking-tighter text-emerald-500 animate-pulse">Carregando Vitrine...</div></Layout>;

  const primaryColor = store?.primary_color || '#10b981';
  const bgColor = store?.background_color || '#09090b';
  const fontColor = store?.font_color || '#f8fafc';

  return (
    <Layout className="transition-colors duration-500" style={{ backgroundColor: bgColor, color: fontColor }}>
      <header className="bg-zinc-900/50 backdrop-blur-2xl border-b border-zinc-800 sticky top-0 z-20 px-8 py-6 w-full shadow-2xl shadow-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="p-3 hover:bg-zinc-800 bg-zinc-900/50 rounded-[1.5rem] border border-zinc-800 transition-all text-zinc-400 group active:scale-95">
              <ArrowLeft size={24} strokeWidth={2.5} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 overflow-hidden border border-zinc-800 flex items-center justify-center text-3xl shadow-xl">
                 {store?.logo?.startsWith('http') ? (
                   <img src={store.logo} className="w-full h-full object-cover" alt="Logo" />
                 ) : (
                   store?.logo || '🏪'
                 )}
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3" style={{ color: fontColor }}>
                  {store?.name}
                  <div className="flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-lg border border-zinc-700 text-sm font-bold ml-2">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    {store?.rating}
                  </div>
                </h1>
                <div className="flex items-center gap-4 mt-1">
                   <p className="text-sm font-black uppercase flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{ color: primaryColor, backgroundColor: `${primaryColor}1a` }}>
                      <Clock size={14} strokeWidth={3} /> {store?.deliveryTime} min
                   </p>
                   {store?.address && (
                     <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={14} className="text-zinc-600" /> {store.address}
                     </p>
                   )}
                </div>
              </div>
            </div>
          </div>

          
          <div className="flex lg:hidden relative">
            <ShoppingCart size={28} className="text-emerald-400" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-slate-100 text-zinc-950 font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8 flex flex-col lg:flex-row gap-12 relative">
        {/* Product List */}
        <div className="flex-1 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tighter flex items-center gap-3">
                Cardápio Principal
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  quantity={cart[product.id]?.quantity || 0}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </section>

          <div className="p-8 bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex items-center justify-center gap-4 text-zinc-600 font-bold uppercase tracking-widest text-sm">
            <Info size={20} />
            Novos produtos em breve
          </div>
        </div>

        {/* Floating Cart (Sidebar) */}
        <AnimatePresence>
          {cartItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="lg:w-[24rem] h-fit md:sticky top-32"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-1 shadow-2xl shadow-black/60 relative overflow-hidden ring-1 ring-zinc-800">
                {/* Cart Header */}
                <div className="p-8 pb-4">
                  <h2 className="text-3xl font-black flex items-center gap-3 text-slate-50 uppercase tracking-tighter mb-1">
                    Carrinho
                    <ShoppingCart size={24} className="text-emerald-400" strokeWidth={3} />
                  </h2>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest tracking-loose">Sua reserva de delícias</p>
                </div>

                <div className="px-8 space-y-4 mb-8 max-h-[25rem] overflow-y-auto custom-scrollbar pr-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                      <div className="flex-1">
                        <span className="text-slate-100 font-black text-sm uppercase tracking-tight block">
                          <span className="text-emerald-500 text-xs mr-2">{item.quantity}X</span> 
                          {item.name}
                        </span>
                        <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">R$ {item.price.toFixed(2)}/un</span>
                      </div>
                      <span className="text-emerald-400 font-black text-base ml-2">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="px-8 space-y-4 mb-8">
                  <div className="space-y-4">
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input 
                        type="text" 
                        placeholder="Seu Nome" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <input 
                        type="tel" 
                        placeholder="WhatsApp (ex: 11999999999)" 
                        value={customerWhatsapp}
                        onChange={(e) => setCustomerWhatsapp(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-100 focus:outline-none transition-colors"
                        style={{ borderColor: primaryColor + '33', focusBorderColor: primaryColor }}
                      />
                    </div>
                    {deliveryType === 'delivery' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="relative"
                      >
                        <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input 
                          type="text" 
                          placeholder="Endereço de Entrega Completo" 
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-100 focus:outline-none transition-colors"
                          style={{ borderColor: primaryColor + '33' }}
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-2 p-1.5 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                    <button 
                      onClick={() => setDeliveryType('delivery')}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-tighter rounded-xl transition-all ${deliveryType === 'delivery' ? 'bg-zinc-800 shadow-xl border border-zinc-700' : 'text-zinc-600 hover:text-zinc-400'}`}
                      style={deliveryType === 'delivery' ? { color: primaryColor, borderColor: `${primaryColor}33` } : {}}
                    >
                      Entrega
                    </button>
                    <button 
                      onClick={() => setDeliveryType('pickup')}
                      className={`flex-1 py-3 text-xs font-black uppercase tracking-tighter rounded-xl transition-all ${deliveryType === 'pickup' ? 'bg-zinc-800 shadow-xl border border-zinc-700' : 'text-zinc-600 hover:text-zinc-400'}`}
                      style={deliveryType === 'pickup' ? { color: primaryColor, borderColor: `${primaryColor}33` } : {}}
                    >
                      Retirada
                    </button>
                  </div>
                </div>


                <div className="px-8 pb-8 pt-6 border-t border-zinc-800 bg-zinc-950/20">
                  <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="flex justify-between items-center text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                        <span>Taxa de Entrega</span>
                        <span style={{ color: primaryColor }}>R$ {deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end pt-2">
                      <div className="space-y-1">
                          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Valor final</p>
                          <h4 className="font-black text-4xl uppercase tracking-tighter drop-shadow-lg" style={{ color: fontColor }}>
                            R$ {total.toFixed(2)}
                          </h4>
                      </div>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinishOrder}
                    disabled={isSubmitting}
                    className={`group-buy w-full text-slate-950 font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-2xl active:translate-y-0.5 border-t-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: primaryColor, borderColor: 'rgba(255,255,255,0.2)', boxShadow: `0 20px 40px ${primaryColor}33` }}
                  >
                    <Send size={24} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                    <span className="text-xl uppercase tracking-tighter">{isSubmitting ? 'Enviando...' : 'Enviar Pedido'}</span>
                  </motion.button>


                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[3rem] p-12 text-center shadow-2xl shadow-emerald-500/10"
            >
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border shadow-2xl" style={{ backgroundColor: `${primaryColor}1a`, borderColor: `${primaryColor}33` }}>
                <CheckCircle size={48} strokeWidth={2.5} style={{ color: primaryColor }} />
              </div>
              <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter mb-4 leading-none">
                Pedido <span style={{ color: primaryColor }}>Confirmado!</span>
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-10 leading-relaxed">
                Agora o lojista irá preparar <br /> sua entrega com carinho.
              </p>
              
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-slate-200 font-black py-5 rounded-[1.5rem] uppercase tracking-tighter transition-all border border-zinc-700 shadow-xl"
              >
                Entendido, obrigado!
              </button>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </Layout>

  );
}
