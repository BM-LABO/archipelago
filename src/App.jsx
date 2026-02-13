import React, { useState, useEffect, useRef } from 'react';
import { 
  Waves, ExternalLink, Zap, Trash2, Plus, Settings, 
  ImageIcon, Link2, LogOut, FileText, ShieldCheck, Scale,
  User, Loader2, AlertCircle, CheckCircle2, Search, Store,
  CreditCard, ShoppingCart, Filter, ShieldAlert, ChevronDown, 
  LayoutGrid, Users, Mail, ClipboardCheck, ArrowRight, Info
} from 'lucide-react';

// --- Supabase 設定 ---
const SUPABASE_URL = "https://klfcasqzhblsiqeaacxx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jBfLXgLzWG0_sJb-ce9rfQ_eJB4gHXJ";

// プラン定義
const SUBSCRIPTION_PLANS = [
  { id: 'light', name: 'ライト島', monthlyPrice: 500, limit: 5, color: 'text-slate-500', bg: 'bg-slate-50', desc: 'まずは数点から紹介してみたい方に' },
  { id: 'standard', name: 'スタンダード島', monthlyPrice: 1000, limit: 30, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: '本格的にカタログとして活用したい方に' },
  { id: 'unlimited', name: 'プロ・アイランド', monthlyPrice: 2000, limit: 999, color: 'text-purple-600', bg: 'bg-purple-50', desc: '在庫制限なく、全ての植物を並べたい方に' }
];

export default function App() {
  const [view, setView] = useState('store'); // store, shops, faq, join, register, admin
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  // 重要事項同意ステート
  const [agreements, setAgreements] = useState({
    origin: false,
    external: false,
    fee: false,
    rules: false
  });

  useEffect(() => {
    const initSupabase = () => {
      if (window.supabase) {
        const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setDb(client);
      }
    };
    initSupabase();
  }, []);

  useEffect(() => {
    if (!db) return;
    const fetchData = async () => {
      setLoading(true);
      const { data } = await db.from('items').select('*').order('created_at', { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetchData();
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [db]);

  // マスター管理者ログイン（デモ用）
  const handleMasterLogin = () => {
    // 実際にはSupabase Authを使用しますが、開発中は特定のアドレスで擬似ログイン
    const email = prompt("管理用メールアドレスを入力してください");
    if (email === "master@bm-labo.com") {
      setUser({ id: 'master-admin', email: 'master@bm-labo.com' });
      setView('admin');
    } else {
      alert("認証に失敗しました。");
    }
  };

  // ナビゲーション
  const Navigation = () => {
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    return (
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto flex justify-between items-center px-2 md:px-4">
          <div className="flex flex-col cursor-pointer group" onClick={() => setView('store')}>
            <div className="flex items-center gap-2">
              <Waves className="h-5 w-5 md:h-6 md:w-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              <h1 className="text-lg md:text-xl font-black tracking-[0.15em] uppercase text-white leading-none">Archipelago</h1>
            </div>
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.1em] uppercase mt-1 ml-1 group-hover:text-white transition-colors">
              Produced by <span className="text-emerald-500">BM-LABO</span>
            </span>
          </div>

          <div className="flex gap-2 md:gap-4 items-center">
            <div className="relative">
              <button onClick={() => setIsCatalogOpen(!isCatalogOpen)} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${view === 'store' || view === 'shops' ? 'text-emerald-400 bg-emerald-900/30' : 'text-slate-300 hover:text-white'}`}>
                Catalog <ChevronDown size={14} />
              </button>
              {isCatalogOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 overflow-hidden">
                  <button onClick={() => { setView('store'); setIsCatalogOpen(false); }} className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    <LayoutGrid size={16} className="text-emerald-600" />
                    <span className="text-xs font-bold">全アイテム</span>
                  </button>
                  <button onClick={() => { setView('shops'); setIsCatalogOpen(false); }} className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    <Users size={16} className="text-purple-600" />
                    <span className="text-xs font-bold">ショップ一覧</span>
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => setView('faq')} className={`px-3 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${view === 'faq' ? 'text-emerald-400' : 'text-slate-300 hover:text-white'}`}>Guide</button>
            <button onClick={handleMasterLogin} className="px-3 py-1.5 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors text-[10px] md:text-xs font-bold">
              {user ? 'Admin' : 'Login'}
            </button>
          </div>
        </div>
      </nav>
    );
  };

  // 掲載案内ページ (Join View)
  const JoinView = () => (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-900 uppercase mb-4 tracking-tighter italic italic">Create Your Island</h2>
        <p className="text-slate-500 font-bold text-sm tracking-wider">Archipelago への掲載について</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-12">
        <div className="p-8 md:p-12">
          <h3 className="text-2xl font-black text-slate-800 mb-6 border-l-4 border-emerald-500 pl-4">植物の「ルーツ」を可視化する</h3>
          <p className="text-slate-600 leading-relaxed mb-8 text-sm md:text-base">
            Archipelagoは、単なる販売サイトではありません。あなたが丹精込めて育てた植物、その物語を「カタログ」として整理し、それを求める方へ繋ぐためのプラットフォームです。<br/><br/>
            複雑なECサイトの管理は不要です。販売は既に使い慣れた「メルカリ」などの外部サービスで行い、Archipelagoはその入り口となる「美しいギャラリー」として機能します。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-50 p-6 rounded-2xl">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> カタログ管理の簡略化</h4>
              <p className="text-xs text-slate-500 leading-relaxed">煩雑な在庫管理ではなく、SNSのポートフォリオのように自分の植物を並べることができます。</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl">
              <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> 既存サービスとの連携</h4>
              <p className="text-xs text-slate-500 leading-relaxed">決済や配送トラブルのリスクはメルカリ等の既存大手サービスに任せ、本質的な「紹介」に集中できます。</p>
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-800 mb-8 text-center uppercase tracking-widest">Pricing Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_PLANS.map(plan => (
              <div key={plan.id} className={`${plan.bg} p-8 rounded-[2rem] border border-transparent hover:border-emerald-300 transition-all flex flex-col`}>
                <div className={`${plan.color} font-black text-xs uppercase tracking-widest mb-2`}>{plan.name}</div>
                <div className="text-3xl font-black text-slate-900 mb-4 italic">¥{plan.monthlyPrice.toLocaleString()}<span className="text-xs not-italic text-slate-400"> /月</span></div>
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed mb-6 flex-grow">{plan.desc}</p>
                <div className="text-[10px] font-black text-slate-800 mb-6">掲載上限: {plan.limit}点</div>
                <button 
                  onClick={() => { setSelectedPlan(plan); setView('register'); }}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg"
                >
                  このプランで登録
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
        <Info className="text-amber-500 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-bold text-amber-900 mb-1">掲載に関する注意事項</h4>
          <p className="text-[11px] text-amber-800/80 leading-relaxed">
            掲載される植物は、原則としてご自身で管理・育成されたものに限ります。転売目的や知的財産権、特定外来生物法等に抵触する恐れのあるものは掲載できません。
          </p>
        </div>
      </div>
    </div>
  );

  // 重要事項同意・登録ページ
  const RegisterView = () => (
    <div className="max-w-2xl mx-auto py-10 animate-in zoom-in-95 duration-300">
      <button onClick={() => setView('join')} className="text-slate-400 text-[10px] font-bold uppercase mb-8 flex items-center gap-2 hover:text-slate-900">
        <ArrowRight className="rotate-180" size={14}/> 戻る
      </button>

      <div className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12 border border-slate-50">
        <div className="mb-10">
          <span className={`${selectedPlan?.color} text-[10px] font-black uppercase tracking-[0.2em]`}>{selectedPlan?.name}</span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">重要事項の確認</h2>
          <p className="text-xs text-slate-400 font-medium mt-1">安心なプラットフォーム運営のため、以下の項目をご確認ください。</p>
        </div>

        <div className="space-y-4 mb-10">
          {[
            { id: 'origin', label: '出品物は自身の管理下にある健全な個体であることを保証します。', desc: '出所不明な株や、病害虫の恐れがある個体の掲載は禁止されています。' },
            { id: 'external', label: '販売・決済は外部サービス（メルカリ等）で行うことを理解しました。', desc: 'Archipelago上では直接の決済は行われません。' },
            { id: 'fee', label: '月額費用の支払い及び、解約ルールに同意します。', desc: '利用料は先払い制となります。' },
            { id: 'rules', label: 'BM-LABOが定めるプラットフォーム規約を遵守します。', desc: '不適切な掲載と判断された場合、管理者の判断で掲載停止を行う場合があります。' }
          ].map((item) => (
            <label key={item.id} className={`block p-5 rounded-2xl border-2 transition-all cursor-pointer ${agreements[item.id] ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
              <div className="flex items-start gap-4">
                <div className="pt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                    checked={agreements[item.id]}
                    onChange={() => setAgreements(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  />
                </div>
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
          onClick={() => alert("外部決済サービス（Stripe等）へリダイレクトします")}
          className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
            Object.values(agreements).every(v => v) 
            ? 'bg-slate-900 text-white shadow-xl hover:bg-emerald-600' 
            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
          }`}
        >
          <ClipboardCheck size={18} /> お支払い手続きへ進む
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FCFDFD] min-h-screen font-sans text-slate-900">
      <Navigation />
      
      <main className="container mx-auto p-4 md:p-8 max-w-7xl min-h-[70vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Loading Islands...</p>
          </div>
        ) : (
          <>
            {view === 'store' && (
              <div className="animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                  <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-3">Item Catalog</h2>
                    <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em]">DISCOVER ROOTS & LEAVES</p>
                  </div>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input type="text" placeholder="植物名で検索..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {items.map(item => (
                    <div key={item.id} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-xl transition-all group hover:-translate-y-1">
                      <div className="aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-200 overflow-hidden relative">
                        <ImageIcon size={32} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                      </div>
                      <h3 className="font-black text-slate-800 mb-1 text-sm">{item.name}</h3>
                      <div className="text-lg font-black text-emerald-600 mb-4 italic">¥{item.price.toLocaleString()}</div>
                      <a href={item.mercariUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-slate-900 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg">
                        <ExternalLink size={12} /> メルカリで見る
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {view === 'shops' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-10">Sellers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6"><Store size={32} /></div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">奄美の裏庭</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">Archipelago発起人。奄美大島の自然で育った希少なヤシを中心にお届けします。</p>
                  </div>
                </div>
              </div>
            )}

            {view === 'faq' && (
              <div className="max-w-3xl mx-auto py-10 animate-in fade-in duration-500">
                <div className="text-center mb-16">
                  <ShieldCheck className="mx-auto text-emerald-500 mb-6" size={48} />
                  <h2 className="text-3xl font-black text-slate-900 uppercase mb-4 tracking-tight">Platform Guide</h2>
                  <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
                    ARCHIPELAGO（アーキペラゴ）は、植物それぞれのルーツを大切にする出品者が、群島の島々のように集まるカタログ型プラットフォームです。
                  </p>
                </div>
                <div className="grid gap-6 mb-16">
                  {[
                    { q: "購入方法は？", a: "各商品ページの「メルカリで見る」ボタンから、出品者の販売ページへ移動して購入手続きを行ってください。" },
                    { q: "運営について", a: "本プラットフォームは BM-LABO が運営・管理しています。" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">Q. {item.q}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed pl-6">{item.a}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-16 bg-slate-900 rounded-[2rem] p-10 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-900/20"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">For Growers</h3>
                    <p className="text-slate-300 text-xs font-bold mb-8 leading-relaxed">あなたもArchipelago「群島」に掲載してみませんか？</p>
                    <button onClick={() => setView('join')} className="bg-emerald-500 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all flex items-center gap-2 mx-auto">
                      <Mail size={14} /> 掲載を希望される方へ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {view === 'join' && <JoinView />}
            {view === 'register' && <RegisterView />}
            {view === 'admin' && <div className="text-center py-20 text-slate-400 font-black uppercase tracking-widest">Master Admin Mode Enabled</div>}
          </>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-100 py-16 text-center bg-white">
        <p className="text-[10px] font-black text-slate-300 tracking-[0.1em] uppercase italic">
          &copy; 2026 - {new Date().getFullYear()} BM-LABO / ARCHIPELAGO SYSTEM
        </p>
      </footer>
    </div>
  );
}
