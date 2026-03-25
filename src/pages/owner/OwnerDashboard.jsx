import { useState, useEffect } from 'react';
import { Store, Package, Users, Settings, LogOut, CheckCircle, Clock, TrendingUp, DollarSign, Plus, ArrowRight, Trash2, Edit, Save, Info, Image as ImageIcon, Upload, X, Phone, MessageSquare, Shield } from 'lucide-react';


import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { supabase } from '../../lib/supabaseClient';

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [storeSettings, setStoreSettings] = useState({ name: '', description: '', category: '', email: '', password: '' });

  const navigate = useNavigate();

  async function fetchOwnerData() {
    setLoading(true);
    const sessionStore = JSON.parse(localStorage.getItem('owner_session'));
    if (!sessionStore) {
       navigate('/lojista/login');
       return;
    }
    setStore(sessionStore);
    setStoreSettings({
      name: sessionStore.name || '',
      description: sessionStore.description || '',
      category: sessionStore.category || '',
      email: sessionStore.email || '',
      password: sessionStore.password || ''
    });

    try {
       const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('store_id', sessionStore.id)
          .order('created_at', { ascending: false });

       const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', sessionStore.id)
          .order('created_at', { ascending: false });

       const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name');

       setOrders(ordersData || []);
       setProducts(productsData || []);
       setCategories(categoriesData || []);
    } catch (err) {
       console.error('Error fetching data:', err);
    } finally {
       setLoading(false);
    }
  }

  useEffect(() => {
     fetchOwnerData();

     // Real-time subscription for new orders
     const sessionStore = JSON.parse(localStorage.getItem('owner_session'));
     if (sessionStore?.id) {
       const channel = supabase
         .channel('orders-realtime')
         .on(
           'postgres_changes',
           {
             event: 'INSERT',
             schema: 'public',
             table: 'orders',
             filter: `store_id=eq.${sessionStore.id}`,
           },
           (payload) => {
             console.log('Novo pedido recebido!', payload);
             setOrders((prev) => [payload.new, ...prev]);
             // Tocar um som opcionalmente ou mostrar aviso
           }
         )
         .subscribe();

       return () => {
         supabase.removeChannel(channel);
       };
     }
  }, [navigate]);


  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = editingProduct?.image_url || null;

      // Upload image if selected
      if (newProduct.image) {
        const file = newProduct.image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${store.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category || (categories.length > 0 ? categories[0].name : 'Geral'),
        image_url: imageUrl
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([{
          ...productData,
          store_id: store.id
        }]);
        if (error) throw error;
      }
      
      setShowProductModal(false);
      setEditingProduct(null);
      setNewProduct({ name: '', description: '', price: '', category: '', image: null });
      setImagePreview(null);
      fetchOwnerData();
    } catch (err) {
      alert('Erro ao salvar produto: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Deseja excluir este produto do cardápio?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchOwnerData();
    } catch (err) {
      alert('Erro ao excluir produto: ' + err.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (error) throw error;
      fetchOwnerData();
    } catch (err) {
      alert('Erro ao atualizar pedido: ' + err.message);
    }
  };

  const sendWhatsAppStatus = (order) => {
    const rawPhone = order.customer_whatsapp;
    if (!rawPhone) {
      alert('Número de WhatsApp não disponível para este pedido.');
      return;
    }
    
    // Clean phone number (remove non-digits, and ensure it has country code)
    let phone = rawPhone.replace(/\D/g, '');
    if (phone.length === 11) phone = '55' + phone;

    let message = '';
    if (order.status === 'pending') {
      message = `Olá ${order.customer_name}! Recebemos seu pedido #${order.id.slice(0,5)} e já vamos começar a preparar! 🚀`;
    } else if (order.status === 'preparing') {
      message = `Olá ${order.customer_name}! Seu pedido #${order.id.slice(0,5)} está pronto e ${order.delivery_type === 'delivery' ? 'saindo para entrega' : 'disponível para retirada'}! ✅`;
    } else {
      message = `Olá ${order.customer_name}! Seu pedido #${order.id.slice(0,5)} foi finalizado. Esperamos que goste! ❤️`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const handleUpdateSettings = async (e) => {

    e.preventDefault();
    try {
      const { error } = await supabase.from('stores').update({
        name: storeSettings.name,
        description: storeSettings.description,
        category: storeSettings.category,
        email: storeSettings.email,
        password: storeSettings.password
      }).eq('id', store.id);

      if (error) throw error;

      const updatedStore = { ...store, ...storeSettings };
      localStorage.setItem('owner_session', JSON.stringify(updatedStore));
      setStore(updatedStore);
      alert('Configurações da loja salvas com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar configurações: ' + err.message);
    }
  };

  const menuItems = [
    { id: 'orders', label: 'Pedidos Ativos', icon: Clock },
    { id: 'products', label: 'Cardápio Digital', icon: Package },
    { id: 'analytics', label: 'Performance', icon: TrendingUp },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <Layout className="flex min-h-screen bg-zinc-950 overflow-hidden">
      {/* Sidebar - Premium Neo-brutalism */}
      <aside className="w-80 border-r border-zinc-900 flex flex-col h-screen fixed top-0 left-0 bg-zinc-950/80 backdrop-blur-3xl z-40">
        <div className="p-10 border-b border-zinc-900 group">
          <Link to="/" className="flex items-center gap-4 group-hover:scale-105 transition-transform duration-500">
            <div className="bg-gradient-to-tr from-emerald-500 to-cyan-500 p-3 rounded-2xl text-slate-950 shadow-2xl shadow-emerald-500/20 transform -rotate-3 group-hover:rotate-0 transition-transform">
              <Store size={28} strokeWidth={3} />
            </div>
            <div>
              <h2 className="font-black text-slate-50 uppercase tracking-tighter text-xl">
                {store && store.name ? store.name.split(' ')[0] : 'Seu'} <span className="text-emerald-500">{store && store.name && store.name.split(' ').length > 1 ? store.name.split(' ').slice(1).join(' ') : 'Dashboard'}</span>
              </h2>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">{store?.category || 'Ambiente Lojista'}</p>
            </div>
          </Link>
        </div>

        <nav className="p-6 flex-1 space-y-3 mt-4">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all relative font-black uppercase tracking-tighter text-sm group ${activeTab === item.id ? 'bg-zinc-900 text-emerald-400 border border-zinc-800 shadow-2xl shadow-black/40' : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900/40'}`}
            >
              {activeTab === item.id && (
                <motion.div layoutId="nav-pill" className="absolute left-2 w-1.5 h-6 bg-emerald-500 rounded-full" />
              )}
              <item.icon size={22} strokeWidth={activeTab === item.id ? 3 : 2} />
              {item.label}
              <ArrowRight size={16} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === item.id ? 'text-emerald-500' : ''}`} />
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-zinc-900">
          <button onClick={() => { localStorage.removeItem('owner_session'); navigate('/lojista/login'); }} className="w-full flex items-center justify-center gap-3 text-rose-500 hover:bg-rose-500/10 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-xs border border-transparent hover:border-rose-500/20">
            <LogOut size={18} strokeWidth={3} />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-80 p-12 overflow-y-auto min-h-screen">
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-16 gap-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-50 uppercase tracking-tighter drop-shadow-2xl">
              Painel <span className="text-zinc-800">Operacional</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
               <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
               Controle de Fluxo • {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div className="flex gap-6">
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 px-10 py-6 rounded-[2rem] shadow-2xl shadow-black/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
               <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Faturamento Total</span>
               <p className="text-emerald-400 font-black text-3xl tracking-tighter">R$ {(store?.revenue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 px-10 py-6 rounded-[2rem] shadow-2xl shadow-black/40 relative overflow-hidden group">
               <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Clientes Ativos</span>
               <p className="text-cyan-400 font-black text-3xl tracking-tighter">{store?.customers || 0} hits</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter flex items-center gap-4">
                   Gestão de Fila
                   <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-transparent rounded-full" />
                </h2>
                <div className="flex gap-2">
                   {['Todos', 'Pendentes', 'Em Preparo', 'Finalizados'].map(filter => (
                     <button key={filter} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-colors text-zinc-500">
                       {filter}
                     </button>
                   ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {orders.length === 0 ? (
                  <div className="py-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem]">
                    <Clock className="mx-auto text-zinc-600 mb-4" size={48} />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Nenhum pedido no momento</p>
                  </div>
                ) : orders.map((order) => (
                  <motion.div 
                    key={order.id} 
                    whileHover={{ scale: 1.01 }}
                    className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] p-10 flex flex-col lg:flex-row justify-between lg:items-center gap-8 group hover:border-emerald-500/30 transition-all shadow-2xl"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">
                          #{order.id.slice(0,5)}
                        </span>
                        <h3 className="text-2xl font-black text-slate-50 uppercase tracking-tighter">{order.customer_name}</h3>
                        <span className="bg-zinc-950 text-zinc-500 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-zinc-800">
                          {order.delivery_type === 'delivery' ? 'Entrega' : 'Retirada'}
                        </span>
                        {order.customer_whatsapp && (
                          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                            <Phone size={12} />
                            <span className="text-[10px] font-black">{order.customer_whatsapp}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-zinc-400 text-lg font-medium tracking-tight bg-zinc-950/50 p-4 rounded-2xl border border-zinc-900 shadow-inner">
                        {Array.isArray(order.items) ? (
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="text-emerald-500 font-black">{item.quantity}x</span>
                                <span className="text-zinc-200 uppercase tracking-tighter font-bold">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>{typeof order.items === 'string' ? order.items : 'Ver Detalhes do Pedido...'}</p>
                        )}
                      </div>

                      <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Clock size={12} strokeWidth={3} className="text-cyan-500" />
                        Criado às {new Date(order.created_at).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>

                    <div className="flex items-center gap-12">
                      <div className="text-right">
                        <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest mb-1">Subtotal</p>
                        <span className="text-3xl font-black text-slate-50 tracking-tighter">R$ {order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {order.status === 'pending' && (
                          <div className="flex gap-2">
                             <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                updateOrderStatus(order.id, 'preparing');
                                sendWhatsAppStatus(order);
                              }}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-8 py-5 rounded-[1.5rem] text-xs uppercase tracking-widest transition-all shadow-2xl shadow-emerald-500/20 border-t-2 border-emerald-300 flex items-center gap-2"
                            >
                              Aceitar e Notificar <MessageSquare size={16} />
                            </motion.button>
                          </div>
                        )}
                        {order.status === 'preparing' && (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              updateOrderStatus(order.id, 'completed');
                              sendWhatsAppStatus(order);
                            }}
                            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-8 py-5 rounded-[1.5rem] text-xs uppercase tracking-widest transition-all shadow-2xl shadow-cyan-500/20 border-t-2 border-cyan-300 flex items-center gap-2"
                          >
                            Finalizar e Notificar <MessageSquare size={16} />
                          </motion.button>
                        )}
                        {order.status === 'completed' && (
                          <div className="flex gap-3">
                            <span className="flex items-center gap-3 text-emerald-500 text-xs font-black uppercase tracking-widest bg-emerald-500/5 px-8 py-5 rounded-[1.5rem] border border-emerald-500/10">
                              <CheckCircle size={20} strokeWidth={3} /> Despachado
                            </span>
                            <button 
                              onClick={() => sendWhatsAppStatus(order)}
                              className="p-5 bg-zinc-800 text-zinc-400 rounded-[1.5rem] hover:text-emerald-400 transition-colors border border-zinc-700"
                            >
                              <MessageSquare size={20} />
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter flex items-center gap-4">
                   Gestão de Cardápio
                   <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
                </h2>
                <button 
                  onClick={() => {
                     setEditingProduct(null);
                     setNewProduct({ name: '', description: '', price: '', category: categories[0]?.name || 'Geral', image: null });
                     setImagePreview(null);
                     setShowProductModal(true);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border-t border-cyan-300 shadow-xl shadow-cyan-500/20"
                >
                  <Plus size={16} strokeWidth={3} />
                  Adicionar Produto
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <div className="col-span-full py-20 text-center bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem]">
                    <Package className="mx-auto text-zinc-600 mb-4" size={48} />
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Nenhum produto cadastrado</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div key={product.id} className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between group hover:border-cyan-500/30 transition-colors overflow-hidden">
                      {product.image_url && (
                        <div className="h-48 w-full -mt-8 -mx-8 mb-6 overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
                        </div>
                      )}
                      <div>
                        <div className="flex justify-between items-start mb-6">
                           <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">{product.category || 'Geral'}</span>
                           <span className="text-2xl font-black text-emerald-400">R$ {parseFloat(product.price).toFixed(2)}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-50 uppercase tracking-tight mb-3">{product.name}</h3>
                        <p className="text-zinc-400 text-sm font-medium line-clamp-2 leading-relaxed">{product.description || 'Produto sem descrição.'}</p>
                      </div>
                      <div className="mt-8 pt-6 border-t border-zinc-800/50 flex gap-3">
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                             setNewProduct({ name: product.name, description: product.description || '', price: product.price, category: product.category, image: null });
                             setImagePreview(product.image_url || null);
                             setShowProductModal(true);
                          }}
                          className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-zinc-400 bg-zinc-950/80 rounded-xl hover:text-cyan-400 border border-zinc-800 hover:border-cyan-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit size={14} /> Editar
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="w-12 flex items-center justify-center text-zinc-500 bg-zinc-950/80 rounded-xl hover:text-rose-500 hover:bg-rose-500/10 border border-zinc-800 hover:border-rose-500/30 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl"
            >
               <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter flex items-center gap-4 mb-8">
                   Configurações da Loja
                   <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-transparent rounded-full" />
               </h2>
               
               <form onSubmit={handleUpdateSettings} className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-12 rounded-[3.5rem] shadow-2xl space-y-8">
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block ml-2">Nome da Loja Exibido aos Clientes</label>
                   <input type="text" value={storeSettings.name} onChange={e => setStoreSettings({...storeSettings, name: e.target.value})} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-3xl py-5 px-8 text-sm font-bold text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors shadow-inner" required />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block ml-2">Tipo de Empreendimento</label>
                     <select value={storeSettings.category} onChange={e => setStoreSettings({...storeSettings, category: e.target.value})} className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-3xl py-5 px-8 text-sm font-bold text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors appearance-none shadow-inner" required>
                       {categories.map(c => (
                         <option key={c.id} value={c.name}>{c.name}</option>
                       ))}
                       {categories.length === 0 && <option value="Geral">Geral</option>}
                     </select>
                   </div>
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block ml-2">Slogan / Descrição Curta</label>
                     <input type="text" value={storeSettings.description} onChange={e => setStoreSettings({...storeSettings, description: e.target.value})} placeholder="Slogan da sua marca..." className="w-full bg-zinc-950 border-2 border-zinc-800 rounded-3xl py-5 px-8 text-sm font-bold text-zinc-100 focus:outline-none focus:border-blue-500 transition-colors shadow-inner" />
                   </div>
                 </div>

                 <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/30">
                   <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
                     <Shield size={16} /> Autenticação e Acesso
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block ml-2">E-mail de Login Corporativo</label>
                       <input type="email" value={storeSettings.email} onChange={e => setStoreSettings({...storeSettings, email: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors" required />
                     </div>
                     <div>
                       <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block ml-2">Nova Chave de Acesso (Senha)</label>
                       <input type="text" value={storeSettings.password} onChange={e => setStoreSettings({...storeSettings, password: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors" required />
                     </div>
                   </div>
                 </div>
                 
                 <div className="pt-6">
                   <button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-50 font-black px-12 py-6 rounded-full text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 w-full hover:scale-[1.01] active:scale-[0.99] border-t-2 border-white/10">
                     <Save size={20} className="drop-shadow-md" />
                     Efetivar Alterações Seguras
                   </button>
                 </div>
               </form>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[3rem] p-16 text-center shadow-2xl"
            >
              <div className="bg-rose-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-500/20">
                <TrendingUp className="text-rose-500" size={48} />
              </div>
              <h2 className="text-4xl font-black text-slate-50 uppercase tracking-tighter mb-4">Relatórios de Performance</h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm max-w-md mx-auto leading-loose">
                Módulo analítico em desenvolvimento. Em breve, gráficos de vendas e estatísticas estarão disponíveis aqui.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl z-10"
            >
              <h2 className="text-3xl font-black text-slate-50 uppercase tracking-tighter mb-8">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Nome Original do Produto</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Custo ao Cliente (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Categoria</label>
                  <select 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-cyan-500 appearance-none transition-colors"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    {categories.length === 0 && <option value="Geral">Geral</option>}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Descrição dos Ingredientes / Conteúdo</label>
                  <textarea 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-sm font-bold text-zinc-100 focus:outline-none focus:border-cyan-500 h-24 resize-none transition-colors"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">Foto do Produto</label>
                  <div className="relative group">
                    {imagePreview ? (
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-zinc-800 border-dashed group-hover:border-cyan-500/50 transition-colors">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => { setImagePreview(null); setNewProduct({...newProduct, image: null}); }}
                          className="absolute top-2 right-2 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-colors shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-zinc-500 mb-3 group-hover:text-cyan-500 transition-colors" />
                          <p className="text-xs text-zinc-500 font-black uppercase tracking-widest group-hover:text-cyan-400 font-bold">Clique para enviar foto</p>
                          <p className="text-[10px] text-zinc-600 mt-2 font-bold">PNG, JPG ou JPEG (Máx. 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setNewProduct({...newProduct, image: file});
                              setImagePreview(URL.createObjectURL(file));
                            }
                          }} 
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 py-4 bg-zinc-800 text-zinc-400 font-black uppercase tracking-widest text-xs rounded-2xl hover:text-zinc-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={uploading}
                    className={`flex-1 py-4 bg-cyan-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploading ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
