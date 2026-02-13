import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, ExternalLink, Zap, Trash2, Plus, Settings, 
  ImageIcon, Link2, LogOut, FileText, ShieldCheck, Scale,
  User, Loader2, AlertCircle, CheckCircle2, Search, Store,
  CreditCard, ShoppingCart, Filter, ShieldAlert, ChevronDown, 
  LayoutGrid, Users, ClipboardCheck, ArrowRight, Info, Calendar,
  BarChart3, Eye, Edit3, PlusCircle, AlertTriangle, Grid, Map
} from 'lucide-react';

// --- Supabase 設定 ---
const SUPABASE_URL = "https://klfcasqzhblsiqeaacxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jBfLXgLzWG0_sJb-ce9rfQ_eJB4gHXJ";

// プラン定義
const SUBSCRIPTION_PLANS = [
  { id: 'light', name: 'ライト', monthlyPrice: 500, yearlyPrice: 5000, limit: 5, color: 'text-slate-500', bg: 'bg-slate-50', desc: 'まずは数点から掲載してみたい方に' },
  { id: 'standard', name: 'スタンダード', monthlyPrice: 1000, yearlyPrice: 10000, limit: 20, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: '本格的にカタログとして活用したい方に' },
  { id: 'premium', name: 'プレミアム', monthlyPrice: 2000, yearlyPrice: 20000, limit: 50, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'より多くの植物を並べたい方に' }
];

export default function App() {
  const [view, setView] = useState('store'); // store, shops, faq, join, register, admin, mypage, newItem
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // 重要事項同意ステート
  const [agreements, setAgreements] = useState({
    origin: false,
    mercariRule: false,
    fee: false,
    noLiability: false
  });

  // 初期化
  useEffect(() => {
    const initSupabase = () => {
      if (window.supabase) {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setDb(client);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.async = true;
      script.onload = () => {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setDb(client);
      };
      document.head.appendChild(script);
    };
    initSupabase();
  }, []);

  // データ取得
  useEffect(() => {
    if (!db) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await db.from('items').select('*').order('created_at', { ascending: false });
        setItems(data || []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, [db]);

  // ログインシミュレーション
  const handleLogin = (type) => {
    if (type === 'master') {
      const email = prompt("マスター管理用メールアドレス");
      if (email === "master@bm-labo.com") {
        setUser({ id: 'master', email: 'master@bm-labo.com', name: 'System Admin' });
        setIsAdmin(true);
        setView('admin');
      }
    } else if (type === 'test') {
      setUser({ 
        id: 'user_amami', 
        name: '奄美の裏庭。', 
        email: 'test@example.com',
        plan: 'premium',
        isFree: true,
        expiry: '2099-12-31',
        limit: 50
      });
      setIsAdmin(false);
      setView('mypage');
    }
  };

  // ナビゲーション
  const Navigation = () => (
    <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex flex-col cursor-pointer group" onClick={() => setView('store')}>
          <div className="flex items-center gap-2">
            <Waves className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-black tracking-widest uppercase italic">Archipelago</h1>
          </div>
          <span className="text-[9px] font-bold text-slate-400 mt-1 ml-1 uppercase">Produced by <span className="text-emerald-500">BM-LABO</span></span>
        </div>

        <div className="flex gap-6 items-center">
          {/* Catalog Dropdown */}
          <div className="relative">
            <button 
              onMouseEnter={() => setIsCatalogOpen(true)}
              onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${['store', 'shops'].includes(view) ? 'text-emerald-400' : 'text-slate-300 hover:text-white'}`}
            >
              Catalog <ChevronDown size={12} className={`transition-transform ${isCatalogOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCatalogOpen && (
              <div 
                onMouseLeave={() => setIsCatalogOpen(false)}
                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-150"
              >
                <button 
                  onClick={() => { setView('store'); setIsCatalogOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 group transition-colors"
                >
                  <Grid size={14} className="text-slate-400 group-hover:text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">All Items</span>
                    <span className="text-[8px] text-slate-400 font-bold">全ての植物を一覧表示</span>
                  </div>
                </button>
                <button 
                  onClick={() => { setView('shops'); setIsCatalogOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 group transition-colors"
                >
                  <Map size={14} className="text-slate-400 group-hover:text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">By Shops</span>
                    <span className="text-[8px] text-slate-400 font-bold">出品者ごとに表示</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setView('faq')} className={`text-[10px] font-black uppercase tracking-widest ${view === 'faq' ? 'text-emerald-400' : 'text-slate-300 hover:text-white'}`}>Guide</button>
          
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setView(isAdmin ? 'admin' : 'mypage')}
                className="bg-emerald-600/20 text-emerald-400 px-3 py-1.5 rounded-lg text-[10px] font-black border border-emerald-600/30"
              >
                {isAdmin ? 'MASTER ADMIN' : 'MY PAGE'}
              </button>
              <button onClick={() => {setUser(null); setIsAdmin(false); setView('store');}} className="text-slate-400 hover:text-white"><LogOut size={16}/></button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => handleLogin('test')} className="px-3 py-1.5 border border-slate-600 rounded-lg text-[10px] font-bold">User Login</button>
              <button onClick={() => handleLogin('master')} className="px-3 py-1.5 bg-slate-800 rounded-lg text-[10px] font-bold">Admin</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  // ショップ一覧表示（ダミー）
  const ShopsView = () => (
    <div className="animate-in fade-in">
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-3">Island Shops</h2>
        <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em]">EXPLORE THE UNIQUE GROWERS</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-emerald-200 transition-all cursor-pointer">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 font-black text-xl italic group-hover:scale-110 transition-transform">奄</div>
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-1">奄美の裏庭。</h3>
            <p className="text-[10px] text-slate-400 font-bold mb-4">希少な熱帯植物とコーデックスを中心に掲載</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{items.length} Items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // マイページ（ユーザー画面）
  const MyPageView = () => {
    const myItems = items.filter(i => i.seller_id === user?.id);
    return (
      <div className="max-w-5xl mx-auto py-8 animate-in fade-in">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">{user?.name} 管理パネル</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Dashboard / {user?.plan} Plan</p>
          </div>
          <button onClick={() => setView('newItem')} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all">
            <PlusCircle size={16} /> 新規掲載アイテムを追加
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 text-slate-400 mb-4">
              <LayoutGrid size={18} /> <span className="text-[10px] font-black uppercase">掲載状況</span>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-black text-slate-900">{myItems.length} <span className="text-xs text-slate-400">/ {user?.limit}</span></div>
              <div className="text-[10px] font-bold text-emerald-500">残り {user?.limit - myItems.length} 枠</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 text-slate-400 mb-4">
              <Calendar size={18} /> <span className="text-[10px] font-black uppercase">契約プラン</span>
            </div>
            <div className="text-xl font-black text-slate-900 mb-1 capitalize">{user?.plan}</div>
            <div className="text-[10px] font-bold text-slate-400">有効期限: {user?.isFree ? '無期限 (Test Acc)' : user?.expiry}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 text-slate-400 mb-4">
              <BarChart3 size={18} /> <span className="text-[10px] font-black uppercase">月間PV (仮)</span>
            </div>
            <div className="text-3xl font-black text-slate-900">0 <span className="text-xs text-slate-400">views</span></div>
          </div>
        </div>

        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">掲載中の商品</h3>
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">商品名</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">価格</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">メルカリURL</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">{item.name}</td>
                  <td className="px-6 py-4 text-xs font-black text-emerald-600">¥{item.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[10px] text-blue-500 underline truncate max-w-[150px]">{item.mercariUrl}</td>
                  <td className="px-6 py-4 flex items-center gap-4">
                    <button className="text-slate-400 hover:text-slate-900 transition-colors"><Edit3 size={16}/></button>
                    <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))}
              {myItems.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    掲載中の商品はまだありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // マスター管理画面
  const MasterAdminView = () => (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">MASTER ADMINISTRATION</h2>
        <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">System Controller</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
          <div className="text-[10px] font-black text-emerald-400 mb-2 uppercase">Total Users</div>
          <div className="text-4xl font-black">1 <span className="text-xs text-slate-500">active</span></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 mb-2 uppercase">Total Items</div>
          <div className="text-4xl font-black text-slate-900">{items.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 mb-2 uppercase">Pending Payments</div>
          <div className="text-4xl font-black text-amber-500">0</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 mb-2 uppercase">System Health</div>
          <div className="text-xs font-black text-emerald-500 flex items-center gap-1 mt-4">
            <CheckCircle2 size={14}/> ONLINE
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">利用者アカウント一覧</h3>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Filter size={16}/></button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Shop Name</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Plan</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Items</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <tr className="hover:bg-slate-50/50">
              <td className="px-6 py-4">
                <div className="text-xs font-black text-slate-900">奄美の裏庭。</div>
                <div className="text-[9px] text-slate-400 font-bold">test@example.com</div>
              </td>
              <td className="px-6 py-4"><span className="text-[9px] font-black bg-purple-100 text-purple-600 px-2 py-1 rounded-full uppercase">Premium (Free)</span></td>
              <td className="px-6 py-4"><span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded-full uppercase">Active</span></td>
              <td className="px-6 py-4 text-xs font-bold text-slate-700">{items.filter(i=>i.seller_id==='user_amami').length} / 50</td>
              <td className="px-6 py-4 flex gap-3">
                <button className="text-slate-400 hover:text-slate-900"><Edit3 size={16}/></button>
                <button className="text-slate-400 hover:text-red-500"><ShieldAlert size={16}/></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // 掲載案内・プラン
  const JoinView = () => (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 uppercase mb-4 tracking-tighter italic">Create Your Island</h2>
        <p className="text-slate-500 font-bold text-sm tracking-wider">メルカリ出品をより美しくカタログ化</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {SUBSCRIPTION_PLANS.map(plan => (
          <div key={plan.id} className={`${plan.bg} p-8 rounded-[2.5rem] border border-transparent hover:border-emerald-300 transition-all flex flex-col shadow-sm`}>
            <div className={`${plan.color} font-black text-xs uppercase tracking-widest mb-2`}>{plan.name}</div>
            <div className="text-3xl font-black text-slate-900 mb-1 italic">¥{plan.monthlyPrice.toLocaleString()}<span className="text-xs not-italic text-slate-400"> /月</span></div>
            <div className="text-[10px] font-bold text-slate-400 mb-6">年払なら 2ヶ月分お得 ¥{plan.yearlyPrice.toLocaleString()}/年</div>
            <p className="text-[10px] font-bold text-slate-500 leading-relaxed mb-6 flex-grow">{plan.desc}</p>
            <div className="text-[10px] font-black text-slate-800 mb-8 border-t border-slate-200 pt-4">掲載上限: {plan.limit}点</div>
            
            <div className="space-y-3">
              <button 
                onClick={() => { setSelectedPlan({...plan, mode: 'monthly'}); setView('register'); }}
                className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg"
              >
                月間契約で登録
              </button>
              <button 
                onClick={() => { setSelectedPlan({...plan, mode: 'yearly'}); setView('register'); }}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-md"
              >
                年間契約で登録
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
        <h4 className="text-sm font-black text-amber-900 mb-4 flex items-center gap-2"><AlertTriangle size={18}/> 掲載に関する厳守事項</h4>
        <ul className="space-y-3 text-[11px] text-amber-800 font-bold leading-relaxed">
          <li className="flex gap-2"><span>・</span> <span>メルカリ内での商品説明やメッセージ等で、本サイト（Archipelago）へ誘導する行為（URLの記載等）は、メルカリの利用規約で禁止されています。</span></li>
          <li className="flex gap-2 text-red-600"><span>・</span> <span>万が一、利用者様がメルカリ側からペナルティやアカウント停止等の措置を受けた場合、当サービスは一切の責任を負いかねます。トラブルには関与いたしません。</span></li>
          <li className="flex gap-2"><span>・</span> <span>掲載する植物は、原則としてご自身で管理・育成されたもの、かつ法的に問題のない個体（特定外来生物法等）に限ります。</span></li>
        </ul>
      </div>
    </div>
  );

  // 重要事項同意・登録
  const RegisterView = () => (
    <div className="max-w-2xl mx-auto py-10">
      <button onClick={() => setView('join')} className="text-slate-400 text-[10px] font-bold uppercase mb-8 flex items-center gap-2 hover:text-slate-900">
        <ArrowRight className="rotate-180" size={14}/> 戻る
      </button>

      <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-slate-50">
        <div className="mb-10">
          <span className={`${selectedPlan?.color} text-[10px] font-black uppercase tracking-[0.2em]`}>{selectedPlan?.name} Plan ({selectedPlan?.mode === 'yearly' ? '年間契約' : '月間契約'})</span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">利用規約への同意</h2>
        </div>

        <div className="space-y-4 mb-10">
          {[
            { id: 'origin', label: '掲載物は自身の管理下にある個体であることを保証します。', desc: '盗掘品、転売品、病害虫の恐れがある個体の掲載は厳禁です。' },
            { id: 'mercariRule', label: 'メルカリ側で本サイトへの誘導を行わないことを約束します。', desc: 'メルカリの規約違反による損害については、利用者の自己責任となります。' },
            { id: 'fee', label: 'プランの支払いに同意します。', desc: '支払完了後にアカウントが有効化されます。' },
            { id: 'noLiability', label: 'メルカリとのトラブルについて、当方は責任を負わないことに同意します。', desc: '運営は情報の掲載場所を提供するのみであり、取引・規約問題には介入しません。' }
          ].map((item) => (
            <label key={item.id} className={`block p-5 rounded-2xl border-2 transition-all cursor-pointer ${agreements[item.id] ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
              <div className="flex items-start gap-4">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 accent-emerald-500 mt-1"
                  checked={agreements[item.id]}
                  onChange={() => setAgreements(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                />
                <div>
                  <div className="text-xs font-black text-slate-800 leading-tight mb-1">{item.label}</div>
                  <div className="text-[10px] text-slate-400 font-bold tracking-tight">{item.desc}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        <button 
          disabled={!Object.values(agreements).every(v => v)}
          className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all ${
            Object.values(agreements).every(v => v) 
            ? 'bg-slate-900 text-white shadow-xl hover:bg-emerald-600' 
            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          {selectedPlan?.mode === 'yearly' ? `年間 ¥${selectedPlan?.yearlyPrice.toLocaleString()} お支払いへ` : `月間 ¥${selectedPlan?.monthlyPrice.toLocaleString()} お支払いへ`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FCFDFD] min-h-screen font-sans text-slate-900" onClick={() => setIsCatalogOpen(false)}>
      <Navigation />
      
      <main className="container mx-auto p-4 md:p-8 max-w-7xl min-h-[70vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
          </div>
        ) : (
          <>
            {view === 'store' && (
              <div className="animate-in fade-in">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                  <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-3">Item Catalog</h2>
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em]">THE ROOTS OF PLANTS ON MERCARI</p>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input type="text" placeholder="植物名で検索..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-bold" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map(item => (
                    <div key={item.id} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-xl transition-all group">
                      <div className="aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-200 overflow-hidden relative">
                        <ImageIcon size={32} />
                      </div>
                      <h3 className="font-black text-slate-800 mb-1 text-sm">{item.name}</h3>
                      <div className="text-lg font-black text-emerald-600 mb-4 italic">¥{item.price.toLocaleString()}</div>
                      <a href={item.mercariUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-900 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                        <ExternalLink size={12} /> メルカリで見る
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'shops' && <ShopsView />}

            {view === 'faq' && (
              <div className="max-w-3xl mx-auto py-10">
                <div className="text-center mb-16">
                  <ShieldCheck className="mx-auto text-emerald-500 mb-6" size={48} />
                  <h2 className="text-3xl font-black text-slate-900 uppercase mb-4 tracking-tight">Platform Guide</h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
                    ARCHIPELAGOは、メルカリに出品された植物を、独自のストーリーと共にカタログ化する場所です。
                  </p>
                </div>
                <div className="grid gap-6 mb-16">
                  {[
                    { q: "購入方法は？", a: "各商品ページの「メルカリで見る」ボタンから、メルカリ内の販売ページへ移動して購入手続きを行ってください。" },
                    { q: "直接取引はできますか？", a: "トラブル防止のため、すべての取引はメルカリのシステムを介して行われます。" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">Q. {item.q}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed pl-6">{item.a}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-900 rounded-[2rem] p-10 text-center relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">For Growers</h3>
                    <p className="text-slate-300 text-xs font-bold mb-8 leading-relaxed">あなたの植物をカタログに掲載しませんか？</p>
                    <button onClick={() => setView('join')} className="bg-emerald-500 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all mx-auto">
                      掲載を希望される方へ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {view === 'join' && <JoinView />}
            {view === 'register' && <RegisterView />}
            {view === 'mypage' && <MyPageView />}
            {view === 'admin' && <MasterAdminView />}
            {view === 'newItem' && (
              <div className="max-w-xl mx-auto py-10">
                <button onClick={() => setView('mypage')} className="text-slate-400 text-[10px] font-bold uppercase mb-8 flex items-center gap-2"><ArrowRight className="rotate-180" size={14}/> 戻る</button>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50">
                   <h2 className="text-xl font-black text-slate-900 mb-8 border-l-4 border-emerald-500 pl-4">新規アイテム登録</h2>
                   <div className="space-y-6">
                      <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">植物名</label><input className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-bold" placeholder="例: ヤシ苗 A-1"/></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">価格</label><input className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-bold" placeholder="5000"/></div>
                      <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">メルカリ商品URL</label><input className="w-full bg-slate-50 border-none rounded-xl p-4 text-xs font-bold" placeholder="https://jp.mercari.com/item/..."/></div>
                      <button className="w-full bg-slate-900 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest">掲載を申請する</button>
                   </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-100 py-16 text-center bg-white">
        <p className="text-[10px] font-black text-slate-300 tracking-[0.1em] uppercase italic">
          &copy; 2026 ARCHIPELAGO SYSTEM / BM-LABO
        </p>
      </footer>
    </div>
  );
}
