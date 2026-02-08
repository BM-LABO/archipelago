import React, { useState, useEffect } from 'react';
import { 
  Waves, ExternalLink, Zap, Trash2, Plus, Settings, 
  ImageIcon, Link2, LogOut, FileText, ShieldCheck, Scale,
  User, Loader2, AlertCircle, CheckCircle2, Search, Store,
  CreditCard, ShoppingCart, Filter, ShieldAlert
} from 'lucide-react';

// --- Supabase 設定 ---
// これらのキーは「公開用」であり、Row Level Security (RLS) により保護されています。
// 管理用のマスターキーはコード内には含まれていません。
const SUPABASE_URL = "https://klfcasqzhblsiqeaacxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jBfLXgLzWG0_sJb-ce9rfQ_eJB4gHXJ";

// プラン定義
const SUBSCRIPTION_PLANS = [
  { id: 'light', name: 'ライト', monthlyPrice: 500, limit: 5, color: 'text-slate-500' },
  { id: 'standard', name: 'スタンダード', monthlyPrice: 1000, limit: 30, color: 'text-emerald-600' },
  { id: 'unlimited', name: '無制限', monthlyPrice: 2000, limit: 999, color: 'text-purple-600' }
];

export default function App() {
  const [view, setView] = useState('store'); 
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Supabase初期化
  useEffect(() => {
    const initSupabase = () => {
      if (window.supabase) {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setDb(client);
      } else {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
        script.async = true;
        script.onload = () => {
          const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          setDb(client);
        };
        document.head.appendChild(script);
      }
    };
    initSupabase();
  }, []);

  // データ取得
  useEffect(() => {
    if (!db) return;
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await db.from('items').select('*').order('created_at', { ascending: false });
      if (!error) setItems(data || []);
      setLoading(false);
    };
    fetchItems();
  }, [db]);

  const Navigation = () => (
    <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex flex-col cursor-pointer" onClick={() => setView('store')}>
          <div className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-black tracking-widest uppercase text-white">BM-LABO</h1>
          </div>
          <span className="text-[8px] font-bold text-emerald-400/60 tracking-[0.2em] uppercase mt-1">Archipelago System</span>
        </div>
        <div className="flex gap-4 items-center text-[10px] font-black uppercase tracking-widest">
          <button onClick={() => setView('store')} className={`transition-all ${view === 'store' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>カタログ</button>
          <button onClick={() => setView('faq')} className={`transition-all ${view === 'faq' ? 'text-emerald-400' : 'text-slate-400 hover:text-white'}`}>ガイド</button>
          <button className="px-4 py-2 border border-white/20 rounded-xl hover:bg-white/10 transition-all">ログイン</button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="bg-[#FCFDFD] min-h-screen font-sans text-slate-900">
      <Navigation />
      <main className="container mx-auto p-8 max-w-7xl min-h-[70vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">Connecting to Archipelago DB...</p>
          </div>
        ) : (
          view === 'store' ? (
            <div className="animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-xl">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-4">Catalog</h2>
                  <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] mt-2">SELECTED PLANTS FROM GROWERS</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.length === 0 ? (
                  <div className="col-span-full border-2 border-dashed border-slate-100 rounded-[2rem] py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-sm">
                    No Items Available
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
                      <div className="aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-200">
                        <ImageIcon size={40} />
                      </div>
                      <h3 className="font-black text-slate-800 mb-1">{item.name}</h3>
                      <div className="text-xl font-black text-slate-900 mb-6 italic">¥{item.price.toLocaleString()}</div>
                      <a href={item.mercariUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200">
                        <ExternalLink size={14} /> メルカリで見る
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center animate-in slide-in-from-bottom-4 duration-500">
              <ShieldCheck className="mx-auto text-emerald-500 mb-6" size={48} />
              <h2 className="text-2xl font-black uppercase mb-4">Platform Guide</h2>
              <p className="text-slate-500 leading-relaxed text-sm max-w-xl mx-auto">
                ARCHIPELAGOは、植物それぞれのルーツを大切にする出品者が、群島の島々のように集まるカタログ型プラットフォームです。
              </p>
            </div>
          )
        )}
      </main>
      <footer className="mt-20 border-t border-slate-100 py-16 text-center bg-white">
        <div className="mb-4">
          <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
            Official Site: <span className="text-emerald-600">archipelago-bm-labo.vercel.app</span>
          </p>
        </div>
        <p className="text-[10px] font-black text-slate-300 tracking-[0.5em] uppercase italic">
          &copy; 2024 BM-LABO / ARCHIPELAGO SYSTEM
        </p>
      </footer>
    </div>
  );
}
