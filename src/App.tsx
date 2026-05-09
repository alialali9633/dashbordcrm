/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Users, CheckSquare, Wallet, CreditCard, 
  Target, Rocket, ShieldCheck, FileText, Trash2, 
  User, Users2, Settings, Plus, LogOut, Menu, X, Search, Bell, PenTool, Mail,
  ChevronLeft, ChevronRight, Command, Zap, Search as SearchIcon, Filter, ArrowRightLeft, TrendingUp,
  Briefcase, DollarSign, PieChart as PieChartIcon
} from 'lucide-react';
import { CRMProvider, useCRM, COUNTRIES, CURRENCIES } from './store';
import { cn, formatCurrency } from './lib/utils';

// --- Command Palette Component ---
const CommandPalette = ({ isOpen, onClose, setActiveSection }: any) => {
  const [search, setSearch] = useState('');
  const { clients, leads, tasks, invoices } = useCRM();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        (window as any).toggleCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'إضافة عميل جديد', icon: Users, action: () => (window as any).openModal('client'), section: 'clients' },
    { label: 'إصدار فاتورة', icon: CreditCard, action: () => (window as any).openModal('invoice'), section: 'finance' },
    { label: 'إنشاء مهمة', icon: CheckSquare, action: () => (window as any).openModal('task'), section: 'tasks' },
    { label: 'تسجيل مصروف', icon: Wallet, action: () => (window as any).openModal('expense'), section: 'expenses' },
  ];

  const searchResults = [
    ...clients.filter(c => !c.isDeleted && c.name.toLowerCase().includes(search.toLowerCase())).map(c => ({ label: c.name, type: 'عميل', section: 'clients' })),
    ...leads.filter(l => !l.isDeleted && l.fullName.toLowerCase().includes(search.toLowerCase())).map(l => ({ label: l.fullName, type: 'فرصة', section: 'pipeline' })),
    ...tasks.filter(t => !t.isDeleted && t.title.toLowerCase().includes(search.toLowerCase())).map(t => ({ label: t.title, type: 'مهمة', section: 'tasks' })),
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-bg-deep/60 backdrop-blur-md"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-bg-card border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col"
        >
          <div className="flex items-center gap-4 p-6 border-b border-white/5 bg-bg-main/50">
            <SearchIcon className="w-5 h-5 text-accent-purple" />
            <input 
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن عميل، صفقة، أو فعل سريع... (CTRL+K)"
              className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:text-text-tertiary"
            />
            <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 text-[10px] text-text-tertiary font-mono">
              <span>ESC</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[50vh] p-4 space-y-6 custom-scrollbar">
            {search.length > 0 ? (
              <div className="space-y-4">
                <h4 className="px-4 text-[10px] font-black uppercase text-text-tertiary tracking-[0.2em]">نتائج البحث</h4>
                <div className="space-y-1">
                  {searchResults.map((result, i) => (
                    <button 
                      key={i}
                      onClick={() => { setActiveSection(result.section); onClose(); }}
                      className="w-full flex items-center justify-between p-4 bg-bg-main border border-white/5 rounded-xl hover:border-accent-purple/40 hover:bg-accent-purple/[0.02] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-black uppercase text-text-tertiary group-hover:text-accent-purple">{result.type}</div>
                        <span className="font-bold">{result.label}</span>
                      </div>
                      <ArrowRightLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-accent-purple" />
                    </button>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="text-center py-12 text-text-tertiary font-bold italic">لا توجد نتائج مطابقة لـ "{search}"</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="px-4 mb-3 text-[10px] font-black uppercase text-text-tertiary tracking-[0.2em] flex items-center gap-2">
                    <Zap className="w-3 h-3 text-accent-amber" /> أفعال سريعة
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, i) => (
                      <button 
                        key={i}
                        onClick={() => { action.action(); onClose(); }}
                        className="flex items-center gap-3 p-4 bg-bg-main border border-white/5 rounded-xl hover:border-accent-purple/40 hover:bg-accent-purple/[0.02] transition-all text-right group"
                      >
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-purple/20 transition-colors">
                          <action.icon className="w-4 h-4 text-text-secondary group-hover:text-accent-purple" />
                        </div>
                        <span className="font-bold text-sm">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                   <h4 className="px-4 mb-3 text-[10px] font-black uppercase text-text-tertiary tracking-[0.2em]">الانتقال السريع</h4>
                   <div className="grid grid-cols-3 gap-2">
                      {[ 
                        { label: 'لوحة التحكم', section: 'dashboard' },
                        { label: 'المحاسبة', section: 'accounting' },
                        { label: 'المصاريف', section: 'expenses' },
                        { label: 'الفريق', section: 'team' },
                        { label: 'الإعدادات', section: 'settings' },
                        { label: 'سلة المهملات', section: 'trash' },
                      ].map((link, i) => (
                        <button 
                          key={i}
                          onClick={() => { setActiveSection(link.section); onClose(); }}
                          className="p-3 bg-bg-main border border-white/5 rounded-xl text-center text-xs font-bold hover:border-white/20 transition-all"
                        >
                          {link.label}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-bg-main/80 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
             <div className="flex gap-4">
                <span className="flex items-center gap-1"><Command className="w-3 h-3" /> + K للبحث</span>
             </div>
             <span>EASYGROW CRM SMART CONSOLE</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- Dashboard Component ---
const Dashboard = ({ setActiveSection }: { setActiveSection: (s: string) => void }) => {
  const { clients, invoices, tasks, settings, user, team, leads } = useCRM();
  
  const activeClients = clients.filter(c => !c.isDeleted);
  const paidInvoices = invoices.filter(i => !i.isDeleted && i.paymentStatus === 'مدفوع');
  const totalRevenue = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingTasks = tasks.filter(t => !t.isDeleted && t.status !== 'مكتملة');
  const overdueInvoices = invoices.filter(i => !i.isDeleted && i.paymentStatus === 'متأخر');

  const stats = [
    { label: 'إجمالي العملاء', value: activeClients.length, growth: '+12.4%', icon: Users, color: 'text-accent-purple', bg: 'bg-accent-purple/10', trendDesc: 'منذ الشهر الماضي' },
    { label: 'صافي الإيرادات', value: formatCurrency(totalRevenue, settings?.currency), growth: '+24.8%', icon: Wallet, color: 'text-accent-green', bg: 'bg-accent-green/10', trendDesc: 'مقارنة بالربع السابق' },
    { label: 'معدل المهام', value: `${Math.round((tasks.filter(t => t.status === 'مكتملة').length / (tasks.length || 1)) * 100)}%`, growth: '+5.2%', icon: CheckSquare, color: 'text-accent-amber', bg: 'bg-accent-amber/10', trendDesc: 'تحسن في الإنتاجية' },
    { label: 'التدفق المالي', value: formatCurrency(totalRevenue * 0.7, settings?.currency), growth: '-3.1%', icon: DollarSign, color: 'text-accent-red', bg: 'bg-accent-red/10', trendDesc: 'تنبيه: مصروفات متزايدة' },
  ];

  const insights = [
    { text: 'أداء الوكالة في نمو مستمر! حققت أرباحاً صافية أعلى بـ ٢٤٪ مقارنة بالأرباح المتوقعة لهذا الشهر 💰', type: 'success' },
    { text: `تحذير: لديك ${overdueInvoices.length} فواتير متأخرة الدفع بقيمة إجمالية ${formatCurrency(overdueInvoices.reduce((a,b) => a+b.amount,0), settings?.currency)} ⚠️`, type: 'warning' },
    { text: 'ذكاء الأعمال: معظم عملائك يفضلون باقة "التميز"، ننصح بتركيز جهود التسويق عليها 🧠', type: 'info' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="relative group p-1">
         <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10 rounded-3xl"></div>
         <div className="bg-bg-card/40 border border-white/5 p-12 rounded-3xl relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(200,184,255,0.05),transparent_70%)]"></div>
            <div className="relative z-10">
               <div className="flex items-center gap-4 mb-4">
                  <div className="px-3 py-1 bg-accent-purple/10 border border-accent-purple/20 rounded-full text-[10px] font-black text-accent-purple uppercase tracking-[0.2em]">Command Center Active</div>
                  <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
               </div>
               <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary mb-4 tracking-tight leading-[1.2] italic">
                 نظام CRM ذكي <br /> 
                 <span className="text-accent-purple italic not-italic">لتنمية وكالتك وزيادة أرباحك.</span>
               </h2>
               <p className="text-text-secondary text-sm md:text-base font-bold max-w-xl mb-10 leading-relaxed opacity-70">
                 إدارة العملاء والفواتير والمصروفات والمهام من منصة واحدة سهلة وسريعة. صُمم خصيصاً ليناسب احتياجات الوكالات العصرية.
               </p>
               <div className="flex flex-wrap gap-4">
                  <button onClick={() => (window as any).toggleCommandPalette()} className="bg-white text-bg-deep font-black px-8 py-4 rounded-2xl text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-white/10 flex items-center gap-3">
                    <Zap className="w-5 h-5 fill-current" /> ابدأ الأفعال الذكية
                  </button>
                  <button onClick={() => setActiveSection('accounting')} className="bg-transparent border-2 border-white/10 hover:border-accent-purple/50 backdrop-blur-md px-8 py-4 rounded-2xl text-sm font-black hover:bg-white/5 transition-all text-text-primary">المركز المالي</button>
               </div>
            </div>
            <div className="absolute left-[-5%] bottom-[-20%] w-[40%] h-[80%] bg-accent-purple/10 rounded-full blur-[120px]"></div>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'إضافة عميل', icon: Users, action: 'client', color: 'bg-accent-purple' },
          { label: 'إنشاء فاتورة', icon: FileText, action: 'invoice', color: 'bg-accent-green' },
          { label: 'تسجيل مصروف', icon: Wallet, action: 'expense', color: 'bg-accent-amber' },
          { label: 'إضافة مهمة', icon: CheckSquare, action: 'task', color: 'bg-accent-red' },
        ].map((item, i) => (
          <button 
            key={i}
            onClick={() => (window as any).openModal(item.action)}
            className="flex items-center gap-3 p-4 bg-bg-card border border-white/5 rounded-2xl hover:border-white/20 transition-all group shadow-xl shadow-black/20"
          >
            <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", item.color, "bg-opacity-10")}>
              <item.icon className={cn("w-4 h-4", item.color.replace('bg-', 'text-'))} />
            </div>
            <span className="text-[10px] md:text-xs font-black text-text-primary whitespace-nowrap tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 bg-bg-card border border-white/5 rounded-3xl hover:border-accent-purple/30 transition-all group relative overflow-hidden shadow-2xl shadow-black/40"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-accent-purple/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-8">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-500 shadow-lg", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn("text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1", 
                stat.growth.startsWith('+') ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'
              )}>
                {stat.growth.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                {stat.growth}
              </div>
            </div>
            <div className="text-3xl lg:text-4xl xl:text-5xl font-black mb-3 text-text-primary group-hover:translate-x-[-4px] transition-transform font-mono tracking-tight truncate">
              {stat.value}
            </div>
            <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.25em]">
              {stat.label}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
               <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider">{stat.trendDesc}</span>
               <ArrowRightLeft className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-bg-card rounded-3xl border border-white/5 p-8 shadow-2xl shadow-black/20">
             <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-2xl font-black italic tracking-tighter">Smart Insights</h3>
                   <p className="text-[10px] text-text-tertiary font-black uppercase tracking-widest mt-1">ذكاء اصطناعي يحلل بياناتك الآن</p>
                </div>
                <div className="bg-bg-main p-1.5 rounded-xl border border-white/5 flex gap-1">
                   <div className="w-2 h-2 rounded-full bg-accent-purple"></div>
                   <div className="w-2 h-2 rounded-full bg-white/10"></div>
                   <div className="w-2 h-2 rounded-full bg-white/10"></div>
                </div>
             </div>
             <div className="space-y-3">
                {insights.map((insight, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    key={i} 
                    className="flex items-center gap-4 p-5 bg-bg-main/50 border border-white/5 rounded-2xl hover:border-white/10 transition-all cursor-default group"
                  >
                    <div className={cn("w-2 h-2 rounded-full ring-4 shrink-0 transition-all group-hover:scale-150", 
                      insight.type === 'success' ? 'bg-accent-green ring-accent-green/10' : 
                      insight.type === 'warning' ? 'bg-accent-amber ring-accent-amber/10' : 'bg-accent-purple ring-accent-purple/10'
                    )}></div>
                    <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition-colors">{insight.text}</span>
                  </motion.div>
                ))}
             </div>
          </div>

          <div className="bg-bg-card rounded-3xl border border-white/5 p-8 shadow-2xl shadow-black/20">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic tracking-tighter">Live Monitor</h3>
              <button onClick={() => setActiveSection('clients')} className="text-[10px] font-black text-accent-purple uppercase tracking-widest hover:underline px-4 py-2 bg-accent-purple/5 rounded-xl transition-all">Full View</button>
            </div>
            <div className="space-y-4">
              {activeClients.slice(0, 4).map(client => (
                <div 
                  key={client.id} 
                  onClick={() => setActiveSection('clients')}
                  className="flex items-center justify-between p-5 bg-bg-main/30 rounded-2xl border border-white/5 hover:border-accent-purple/30 group transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-accent-purple/0 group-hover:bg-accent-purple/[0.01] transition-all"></div>
                  <div className="flex items-center gap-5 relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bg-card to-bg-main border border-white/10 flex items-center justify-center text-accent-purple font-black shadow-lg group-hover:scale-110 transition-transform">
                      {client.name[0]}
                    </div>
                    <div>
                      <div className="font-black text-text-primary group-hover:text-accent-purple transition-all italic">{client.name}</div>
                      <div className="text-[10px] text-text-tertiary uppercase font-black tracking-widest mt-1">{client.service}</div>
                    </div>
                  </div>
                  <div className="text-right relative">
                    <div className="font-mono font-black text-sm text-text-primary group-hover:text-accent-green transition-colors">{formatCurrency(client.monthlyPrice, settings?.currency)}</div>
                    <div className={cn(
                      "text-[9px] font-black uppercase px-2 py-0.5 rounded-md mt-1 inline-block border",
                      client.paymentStatus === 'مدفوع' ? 'bg-accent-green/5 text-accent-green border-accent-green/10' : 
                      client.paymentStatus === 'معلق' ? 'bg-accent-amber/5 text-accent-amber border-accent-amber/10' : 'bg-accent-red/5 text-accent-red border-accent-red/10'
                    )}>
                      {client.paymentStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-bg-card rounded-3xl border border-white/5 p-8 shadow-2xl shadow-black/20 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-purple via-accent-amber to-accent-red"></div>
              <h3 className="text-xl font-black mb-8 italic tracking-tighter">Activity Feed</h3>
              <div className="space-y-8 relative after:absolute after:inset-y-0 after:right-4 after:w-px after:bg-white/10">
                 {[ 
                   { user: 'سارة علي', action: 'اعتمدت فاتورة', target: '#4412', time: 'منذ ٢ دقيقة', color: 'bg-accent-purple' },
                   { user: 'محمد أحمد', action: 'أضاف عميل جديد', target: 'نور الشمري', time: 'منذ ١٥ دقيقة', color: 'bg-accent-green' },
                   { user: 'النظام', action: 'أغلق مهمة', target: 'تجديد السيرفر', time: 'منذ ساعة', color: 'bg-accent-amber' },
                   { user: 'عبدالله', action: 'سجل مصروف', target: 'رواتب', time: 'منذ ٢ ساعة', color: 'bg-accent-red' },
                 ].map((act, i) => (
                   <div key={i} className="flex gap-5 text-sm relative z-10 group">
                     <div className={cn("w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-bg-deep font-black shadow-lg shadow-white/5", act.color)}>
                        {act.user[0]}
                     </div>
                     <div className="flex-1 pt-1.5 overflow-hidden">
                        <div className="text-text-primary font-bold text-xs leading-relaxed truncate">
                          {act.user} <span className="text-text-tertiary font-normal mx-1">{act.action}</span> <span className="text-accent-purple underline decoration-accent-purple/30 cursor-pointer">{act.target}</span>
                        </div>
                        <div className="text-[10px] text-text-muted mt-1.5 uppercase font-black tracking-wider">{act.time}</div>
                     </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-accent-purple p-8 rounded-3xl shadow-2xl shadow-accent-purple/20 relative group overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 -mr-16 -mt-16 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              <TrendingUp className="w-12 h-12 text-bg-deep mb-6" />
              <h4 className="text-bg-deep text-2xl font-black tracking-tight leading-tight italic">انتقل لمستوى <br /> أعمق بالتقارير.</h4>
              <p className="text-bg-deep/60 text-xs font-bold mt-2">تحليل مفصل لكل حركة في مؤسستك.</p>
              <div className="mt-8">
                 <button onClick={() => setActiveSection('accounting')} className="bg-bg-deep text-white px-6 py-3 rounded-2xl text-xs font-black hover:px-8 transition-all">اكتشف الآن</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Clients Section ---
const ClientsSection = () => {
  const { clients, deleteClient, settings } = useCRM();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const filtered = clients.filter(c => !c.isDeleted && (c.name.includes(search) || c.service.includes(search)));

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tighter uppercase">قائمة العملاء</h2>
          <p className="text-text-secondary text-xs font-bold">
            {filtered.length} عميل نشط في النظام
            {selectedIds.length > 0 && <span className="mr-2 text-accent-purple">({selectedIds.length} محدد)</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {selectedIds.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (confirm('هل أنت متأكد من حذف العملاء المحددين؟')) {
                    selectedIds.forEach(id => deleteClient(id));
                    setSelectedIds([]);
                  }
                }}
                className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-4 py-2 rounded-lg text-sm font-black hover:bg-accent-red hover:text-white transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> حذف المحددين
              </button>
            </div>
          )}
          <button
            onClick={() => (window as any).openModal('massOffer')}
            className="bg-accent-amber/10 text-accent-amber border border-accent-amber/20 px-6 py-2 rounded-lg text-sm font-black hover:bg-accent-amber hover:text-bg-deep transition-all"
          >
            📢 إرسال عرض مجمع
          </button>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="بحث في البيانات..." 
              className="bg-bg-card border border-white/5 rounded-lg py-2 pr-10 pl-4 w-64 text-sm focus:outline-none focus:border-accent-purple/50 transition-all font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => (window as any).openModal('client')}
            className="bg-accent-purple text-bg-deep font-black px-6 py-2 rounded-lg text-sm hover:scale-105 transition-all shadow-lg shadow-accent-purple/10"
          >
            + إضافة عميل
          </button>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-white/5 overflow-hidden overflow-x-auto">
        <table className="w-full text-right min-w-[1000px]">
          <thead>
            <tr className="bg-bg-main text-text-secondary text-[10px] uppercase tracking-widest font-black border-b border-white/5">
              <th className="px-6 py-4">
                <button 
                  onClick={toggleAll}
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                    selectedIds.length === filtered.length && filtered.length > 0 ? "bg-accent-purple border-accent-purple" : "border-white/20"
                  )}
                >
                  {selectedIds.length === filtered.length && filtered.length > 0 && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                </button>
              </th>
              <th className="px-6 py-4">العميل</th>
              <th className="px-6 py-4">الخدمة</th>
              <th className="px-6 py-4">السعر الشهري</th>
              <th className="px-6 py-4">حالة الدفع</th>
              <th className="px-6 py-4">التصنيف</th>
              <th className="px-6 py-4">تاريخ البدء</th>
              <th className="px-6 py-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filtered.map(client => (
              <tr key={client.id} className={cn(
                "hover:bg-white/[0.02] transition-colors group",
                selectedIds.includes(client.id) && "bg-accent-purple/5"
              )}>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => toggleId(client.id)}
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                      selectedIds.includes(client.id) ? "bg-accent-purple border-accent-purple" : "border-white/20"
                    )}
                  >
                    {selectedIds.includes(client.id) && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                  </button>
                </td>
                <td className="px-6 py-4 font-bold text-text-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple text-xs shrink-0">
                      {client.name[0]}
                    </div>
                    <div>
                      <div className="font-black">{client.name}</div>
                      <div className="text-[10px] text-text-tertiary flex items-center gap-2">
                        <span className="flex items-center gap-1">📧 {client.email}</span>
                        {client.country && <span className="flex items-center gap-1">📍 {client.country} {client.region ? `- ${client.region}` : ''}</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-text-secondary">{client.service}</td>
                <td className="px-6 py-4 font-mono">{formatCurrency(client.monthlyPrice, settings?.currency)}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                    client.paymentStatus === 'مدفوع' ? 'bg-accent-green/10 text-accent-green' : 
                    client.paymentStatus === 'معلق' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-accent-red/10 text-accent-red'
                  )}>
                    {client.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                    client.classification === 'VIP' ? 'bg-accent-purple/10 text-accent-purple' : 'bg-white/5 text-text-secondary'
                  )}>
                    {client.classification}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-secondary">{client.startDate}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => (window as any).openModal('client')} className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-accent-purple" title="تعديل">
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                    <button className="p-2 hover:bg-accent-purple/10 rounded-lg text-text-secondary hover:text-accent-purple" title="إرسال عرض سعر">
                       <span>📧</span>
                    </button>
                    <button onClick={() => deleteClient(client.id)} className="p-2 hover:bg-accent-red/10 rounded-lg text-text-secondary hover:text-accent-red" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Finance Section ---
const FinanceSection = () => {
  const { invoices, deleteInvoice, updateInvoice, settings } = useCRM();
  const [filter, setFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const filtered = invoices.filter(i => {
    if (i.isDeleted) return false;
    if (filter === 'all') return true;
    return i.paymentStatus === (filter === 'paid' ? 'مدفوع' : filter === 'pending' ? 'معلق' : 'متأخر');
  });

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(i => i.id));
    }
  };

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary">المالية / الفواتير</h2>
          <div className="flex gap-4 mt-1">
             <div className="text-[10px] font-bold text-accent-green uppercase tracking-wider">المقبوضة: {formatCurrency(invoices.filter(idx => idx.paymentStatus === 'مدفوع').reduce((a, b) => a + b.amount, 0), settings?.currency)}</div>
             <div className="text-[10px] font-bold text-accent-amber uppercase tracking-wider">المعلقة: {formatCurrency(invoices.filter(idx => idx.paymentStatus === 'معلق').reduce((a, b) => a + b.amount, 0), settings?.currency)}</div>
             {selectedIds.length > 0 && <div className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">محدد: {selectedIds.length}</div>}
          </div>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
            <button
              onClick={() => {
                if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} فاتورة؟`)) {
                  selectedIds.forEach(id => deleteInvoice(id));
                  setSelectedIds([]);
                }
              }}
              className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-4 py-2 rounded-lg text-sm font-black hover:bg-accent-red hover:text-white transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> حذف المحددين
            </button>
          )}
          <select 
            className="bg-bg-card border border-white/5 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent-purple/50"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="paid">مدفوعة</option>
            <option value="pending">معلقة</option>
            <option value="overdue">متأخرة</option>
          </select>
          <button 
            onClick={() => (window as any).openModal('invoice')}
            className="bg-accent-purple text-bg-deep font-black px-6 py-2 rounded-lg text-sm hover:scale-105 transition-all"
          >
            + فاتورة جديدة
          </button>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-white/5 overflow-hidden overflow-x-auto">
        <table className="w-full text-right min-w-[900px]">
          <thead>
            <tr className="bg-bg-main text-text-secondary text-[10px] uppercase tracking-widest font-black border-b border-white/5">
              <th className="px-6 py-4 w-10">
                <button 
                  onClick={toggleAll}
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                    selectedIds.length === filtered.length && filtered.length > 0 ? "bg-accent-purple border-accent-purple" : "border-white/20"
                  )}
                >
                  {selectedIds.length === filtered.length && filtered.length > 0 && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                </button>
              </th>
              <th className="px-6 py-4">رقم الفاتورة</th>
              <th className="px-6 py-4">العميل</th>
              <th className="px-6 py-4">المبلغ</th>
              <th className="px-6 py-4">تاريخ الاستحقاق</th>
              <th className="px-6 py-4">الحالة</th>
              <th className="px-6 py-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filtered.map(invoice => (
              <tr key={invoice.id} className={cn(
                "hover:bg-white/[0.02] transition-colors group",
                selectedIds.includes(invoice.id) && "bg-accent-purple/5"
              )}>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => toggleId(invoice.id)}
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                      selectedIds.includes(invoice.id) ? "bg-accent-purple border-accent-purple" : "border-white/20"
                    )}
                  >
                    {selectedIds.includes(invoice.id) && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                  </button>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-accent-purple">#{invoice.invoiceCode}</td>
                <td className="px-6 py-4">
                  <div className="font-bold text-text-primary">{invoice.clientName}</div>
                  <div className="text-[10px] text-text-tertiary">{invoice.clientEmail}</div>
                </td>
                <td className="px-6 py-4 font-mono">{formatCurrency(invoice.amount, settings?.currency)}</td>
                <td className="px-6 py-4 text-text-secondary">{invoice.dueDate}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => {
                      const nextStatus: any = invoice.paymentStatus === 'مدفوع' ? 'معلق' : invoice.paymentStatus === 'معلق' ? 'متأخر' : 'مدفوع';
                      updateInvoice(invoice.id, { paymentStatus: nextStatus });
                    }}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all hover:scale-110 active:scale-95",
                      invoice.paymentStatus === 'مدفوع' ? 'bg-accent-green/10 text-accent-green' : 
                      invoice.paymentStatus === 'معلق' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-accent-red/10 text-accent-red'
                    )}
                  >
                    {invoice.paymentStatus}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-accent-purple" title="معاينة PDF">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-accent-purple/10 rounded-lg text-text-secondary hover:text-accent-purple" title="إرسال عبر البريد">
                      <span>📧</span>
                    </button>
                    <button onClick={() => deleteInvoice(invoice.id)} className="p-2 hover:bg-accent-red/10 rounded-lg text-text-secondary hover:text-accent-red" title="حذف">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

// --- Accounting Section ---
const AccountingSection = () => {
  const { invoices, expenses, clients, settings } = useCRM();
  
  const paidInvoices = invoices.filter(i => !i.isDeleted && i.paymentStatus === 'مدفوع');
  const revenue = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.filter(e => !e.isDeleted).reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = revenue - totalExpenses;
  const profitMargin = revenue > 0 ? (netProfit / revenue * 100).toFixed(1) : '0';

  const chartData = [
    { month: 'Sep', rev: 12400, exp: 8200 },
    { month: 'Oct', rev: 15600, exp: 9100 },
    { month: 'Nov', rev: 13800, exp: 10500 },
    { month: 'Dec', rev: 19400, exp: 11200 },
    { month: 'Jan', rev: revenue, exp: totalExpenses },
  ];

  const financialHealth = [
    { label: 'نسبة السيولة', value: '1.4', status: 'جيد', color: 'text-accent-green' },
    { label: 'معدل حرق الكاش', value: formatCurrency(totalExpenses / 4), status: 'منخفض', color: 'text-accent-purple' },
    { label: 'نقطة التعادل', value: '١٢ عميل', status: 'مكتمل', color: 'text-accent-amber' },
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end">
         <div>
            <h2 className="text-4xl font-black italic tracking-tighter">Financial Intelligence</h2>
            <p className="text-[10px] text-text-tertiary font-black uppercase tracking-[0.3em] mt-2">تقرير الأداء المالي والنمو</p>
         </div>
         <div className="flex gap-2">
            <button className="bg-bg-card border border-white/5 px-4 py-2 rounded-xl text-xs font-black hover:bg-white/5 transition-all">تحميل PDF</button>
            <button className="bg-accent-purple text-bg-deep px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-accent-purple/20">تصدير إكسل</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: revenue, icon: DollarSign, color: 'text-accent-green', trend: '+18.2%' },
          { label: 'Total Expenses', value: totalExpenses, icon: ArrowRightLeft, color: 'text-accent-red', trend: '-2.4%' },
          { label: 'Net Profit', value: netProfit, icon: Briefcase, color: 'text-accent-purple', trend: '+22.1%' },
          { label: 'Profit Margin', value: `${profitMargin}%`, icon: PieChartIcon, color: 'text-accent-amber', trend: '+5.4%' },
        ].map((item, i) => (
          <div key={i} className="bg-bg-card border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-accent-purple/20 transition-all shadow-2xl shadow-black/20">
             <div className="absolute top-0 right-0 w-20 h-20 bg-white/[0.02] -mr-10 -mt-10 rounded-full group-hover:scale-150 transition-transform"></div>
             <div className="flex justify-between items-center mb-6">
                <div className={cn("p-3 rounded-2xl bg-white/5", item.color)}>
                   <item.icon className="w-5 h-5" />
                </div>
                <div className={cn("text-[9px] font-black px-2 py-1 rounded-lg", 
                  item.trend.startsWith('+') ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'
                )}>
                  {item.trend}
                </div>
             </div>
             <div className="text-2xl lg:text-3xl font-black font-mono tracking-tighter mb-2 italic truncate">
               {typeof item.value === 'number' ? formatCurrency(item.value, settings?.currency) : item.value}
             </div>
             <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-bg-card border border-white/5 rounded-3xl p-10 shadow-2xl shadow-black/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-purple to-transparent opacity-30"></div>
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-black italic tracking-tighter">Growth Trajectory</h3>
               <div className="flex gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-text-tertiary">
                     <div className="w-2 h-2 rounded-full bg-accent-green"></div> Revenue
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-text-tertiary">
                     <div className="w-2 h-2 rounded-full bg-accent-red/50"></div> Expenses
                  </div>
               </div>
            </div>
            <div className="h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#4eeaaa" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#4eeaaa" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                     <XAxis dataKey="month" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                     <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#13131a', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                        itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}
                     />
                     <Area type="monotone" dataKey="rev" stroke="#4eeaaa" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                     <Area type="monotone" dataKey="exp" stroke="#ff6b8a" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="bg-bg-card border border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/20">
               <h3 className="text-xl font-black mb-8 italic tracking-tighter">Financial Health</h3>
               <div className="space-y-6">
                  {financialHealth.map((h, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl group hover:border-white/10 transition-all">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">{h.label}</span>
                          <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-md", h.color, "bg-current/10")}>{h.status}</span>
                       </div>
                       <div className="text-xl font-black font-mono tracking-tighter">{h.value}</div>
                       <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '70%' }}
                            className={cn("h-full", h.color.replace('text-', 'bg-'))} 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-bg-card border border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/20 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-accent-amber"></div>
               <h3 className="text-lg font-black mb-6 italic tracking-tighter">Tax Projection</h3>
               <p className="text-xs text-text-secondary leading-relaxed mb-6 font-bold">تقدير الضرائب المستحقة للربع الحالي بناءً على الأرباح المحققة حتى الآن.</p>
               <div className="flex items-end gap-2">
                  <div className="text-3xl font-black font-mono italic">{formatCurrency(netProfit * 0.15)}</div>
                  <div className="text-[10px] text-text-tertiary font-black mb-1">ESTIMATED</div>
               </div>
               <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-accent-amber/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Tasks Section ---
const TasksSection = () => {
  const { tasks, updateTask, deleteTask } = useCRM();
  const [activeTab, setActiveTab] = useState<'معلقة' | 'قيد التنفيذ' | 'مكتملة' | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const filtered = tasks.filter(t => {
    if (t.isDeleted) return false;
    if (activeTab === 'all') return true;
    return t.status === activeTab;
  });

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(t => t.id));
    }
  };

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مكتملة': return 'bg-accent-green/10 text-accent-green';
      case 'قيد التنفيذ': return 'bg-accent-purple/10 text-accent-purple';
      case 'معلقة': return 'bg-accent-red/10 text-accent-red';
      default: return 'bg-white/5 text-text-tertiary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary">إدارة المهام</h2>
          <p className="text-text-secondary text-sm">
            لديك {tasks.filter(t => t.priority === 'عاجل' && !t.isDeleted).length} مهمة عاجلة
            {selectedIds.length > 0 && <span className="mr-2 text-accent-purple font-black">({selectedIds.length} محدد)</span>}
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {selectedIds.length > 0 && (
             <button
               onClick={() => {
                 if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} مهمة؟`)) {
                   selectedIds.forEach(id => deleteTask(id));
                   setSelectedIds([]);
                 }
               }}
               className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-6 py-2 rounded-lg text-sm font-black hover:bg-accent-red hover:text-white transition-all flex-1 md:flex-none"
             >
                حذف المحددين
             </button>
          )}
          <button 
            onClick={() => (window as any).openModal('task')}
            className="bg-accent-purple text-bg-deep font-black px-6 py-2 rounded-lg text-sm hover:scale-105 transition-all flex-1 md:flex-none shadow-xl shadow-accent-purple/10"
          >
            + مهمة جديدة
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 p-1 bg-bg-card border border-white/5 rounded-xl">
         <button 
           onClick={toggleAll}
           className={cn(
             "px-4 py-3 rounded-lg text-[10px] font-black uppercase transition-all tracking-tighter flex items-center gap-2",
             selectedIds.length === filtered.length && filtered.length > 0 ? "bg-white/10 text-white" : "text-text-tertiary hover:bg-white/5"
           )}
         >
            {selectedIds.length === filtered.length && filtered.length > 0 ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
         </button>
         <div className="w-px h-6 bg-white/10 mx-1"></div>
         <div className="flex flex-1 gap-1">
            {(['all', 'معلقة', 'قيد التنفيذ', 'مكتملة'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all tracking-tighter",
                  activeTab === tab ? "bg-accent-purple text-bg-deep shadow-lg font-black" : "text-text-tertiary hover:text-text-primary hover:bg-white/5"
                )}
              >
                 {tab === 'all' ? 'الكل' : tab}
                 <span className="mr-2 opacity-50">
                    ({tab === 'all' ? tasks.filter(t => !t.isDeleted).length : tasks.filter(t => !t.isDeleted && t.status === tab).length})
                 </span>
              </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length > 0 ? filtered.map(task => (
          <div key={task.id} className={cn(
            "bg-bg-card p-5 rounded-xl border flex items-center justify-between group transition-all",
            selectedIds.includes(task.id) ? "border-accent-purple bg-accent-purple/[0.02]" : "border-white/5 hover:border-accent-purple/20"
          )}>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => toggleId(task.id)}
                   className={cn(
                     "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                     selectedIds.includes(task.id) ? "bg-accent-purple border-accent-purple" : "border-white/20"
                   )}
                 >
                   {selectedIds.includes(task.id) && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                 </button>
                 <button 
                   onClick={() => {
                     const statuses: any[] = ['معلقة', 'قيد التنفيذ', 'مكتملة'];
                     const currentIndex = statuses.indexOf(task.status);
                     const nextIndex = (currentIndex + 1) % statuses.length;
                     updateTask(task.id, { status: statuses[nextIndex] });
                   }}
                   className={cn(
                     "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all",
                     task.status === 'مكتملة' ? "bg-accent-green border-accent-green" : 
                     task.status === 'قيد التنفيذ' ? "bg-accent-purple border-accent-purple" : "border-white/20 hover:border-accent-purple"
                   )}
                 >
                   {task.status === 'مكتملة' ? <CheckSquare className="w-4 h-4 text-bg-deep" /> : <div className="w-2 h-2 rounded-full bg-current opacity-50" />}
                 </button>
              </div>
              <div>
                <div className="flex items-center gap-2">
                   <h3 className={cn("font-bold text-lg", task.status === 'مكتملة' && "line-through text-text-tertiary")}>{task.title}</h3>
                   <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-text-tertiary font-black uppercase">{task.type}</span>
                   <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-black uppercase", getStatusColor(task.status))}>
                      {task.status}
                   </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="text-[10px] text-text-secondary font-black uppercase flex items-center gap-1">👤 المسؤل: {task.assigneeName}</span>
                  <span className="text-[10px] text-text-secondary font-black uppercase flex items-center gap-1">🎯 العميل: {task.clientName}</span>
                  <span className="text-[10px] text-accent-red font-black uppercase flex items-center gap-1">📅 {task.dueDate}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <span className={cn(
                 "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                 task.priority === 'عاجل' ? 'bg-accent-red/10 text-accent-red shadow-[0_0_10px_rgba(255,107,138,0.1)]' : 'bg-white/5 text-text-secondary'
               )}>
                 {task.priority}
               </span>
               <div className="flex gap-2">
                  <button onClick={() => (window as any).openModal('task')} className="p-2 text-text-tertiary hover:text-accent-purple opacity-0 group-hover:opacity-100 transition-all">
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="p-2 text-text-tertiary hover:text-accent-red opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </div>
        )) : (
          <div className="bg-bg-card border border-dashed border-white/10 rounded-2xl py-20 flex flex-col items-center justify-center text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl opacity-20">📂</div>
             <p className="text-text-tertiary text-sm font-bold uppercase tracking-widest">لا يوجد مهام في هذا القسم</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Expenses Section ---
const ExpensesSection = () => {
  const { expenses, deleteExpense, settings } = useCRM();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const filtered = expenses.filter(e => !e.isDeleted);

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(e => e.id));
    }
  };

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-text-primary">المصاريف</h2>
          <p className="text-text-tertiary text-[10px] font-black uppercase mt-1">
            إجمالي التكاليف التشغيلية
            {selectedIds.length > 0 && <span className="mr-2 text-accent-red">({selectedIds.length} محدد)</span>}
          </p>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && (
             <button
               onClick={() => {
                 if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} مصروف؟`)) {
                   selectedIds.forEach(id => deleteExpense(id));
                   setSelectedIds([]);
                 }
               }}
               className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-6 py-2 rounded-lg text-sm font-black hover:bg-accent-red hover:text-white transition-all flex items-center gap-2"
             >
                <Trash2 className="w-4 h-4" /> حذف المحددين
             </button>
          )}
          <button 
            onClick={() => (window as any).openModal('expense')}
            className="bg-accent-purple text-bg-deep font-black px-6 py-2 rounded-lg text-sm hover:scale-105 transition-all shadow-xl shadow-accent-purple/10"
          >
            + مصروف جديد
          </button>
        </div>
      </div>

      <div className="bg-bg-card rounded-xl border border-white/5 overflow-hidden overflow-x-auto">
        <table className="w-full text-right min-w-[900px]">
          <thead>
            <tr className="bg-bg-main text-text-secondary text-[10px] uppercase tracking-widest font-black border-b border-white/5">
              <th className="px-6 py-4 w-10">
                <button 
                  onClick={toggleAll}
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                    selectedIds.length === filtered.length && filtered.length > 0 ? "bg-accent-purple border-accent-purple" : "border-white/20"
                  )}
                >
                  {selectedIds.length === filtered.length && filtered.length > 0 && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                </button>
              </th>
              <th className="px-6 py-4">الوصف</th>
              <th className="px-6 py-4">النوع</th>
              <th className="px-6 py-4">المبلغ</th>
              <th className="px-6 py-4">التاريخ</th>
              <th className="px-6 py-4">طريقة الدفع</th>
              <th className="px-6 py-4">الربط</th>
              <th className="px-6 py-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(expense => (
              <tr key={expense.id} className={cn(
                "hover:bg-white/[0.02] transition-colors",
                selectedIds.includes(expense.id) && "bg-accent-red/5"
              )}>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => toggleId(expense.id)}
                    className={cn(
                      "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                      selectedIds.includes(expense.id) ? "bg-accent-red border-accent-red" : "border-white/20"
                    )}
                  >
                    {selectedIds.includes(expense.id) && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                  </button>
                </td>
                <td className="px-6 py-4 font-bold text-text-primary">{expense.description}</td>
                <td className="px-6 py-4">
                   <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold text-text-secondary">{expense.category}</span>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-accent-red">{formatCurrency(expense.amount, settings?.currency)}</td>
                <td className="px-6 py-4 text-text-secondary text-sm">{expense.date}</td>
                <td className="px-6 py-4 text-xs font-bold">{expense.paymentMethod}</td>
                <td className="px-6 py-4">
                   {expense.linkedInvoiceId ? (
                     <span className="text-[10px] bg-accent-purple/10 text-accent-purple px-2 py-1 rounded font-black">🔗 #{expense.linkedInvoiceId.slice(-4)}</span>
                   ) : (
                     <span className="text-[10px] text-text-tertiary">عام</span>
                   )}
                </td>
                <td className="px-6 py-4">
                   <div className="flex gap-2">
                     <button onClick={() => (window as any).openModal('expense')} className="text-text-tertiary hover:text-accent-purple" title="تعديل">
                       <Plus className="w-4 h-4 rotate-45" />
                     </button>
                     <button onClick={() => deleteExpense(expense.id)} className="text-text-tertiary hover:text-accent-red" title="حذف">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Strategy Section ---
const StrategySection = () => {
  const { strategy, deleteGoal, updateGoal } = useCRM();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-text-primary uppercase tracking-tighter">رؤية المستقبل / الاستراتيجية</h2>
        <button 
          onClick={() => (window as any).openModal('goal')}
          className="bg-accent-purple text-bg-deep font-black px-6 py-2 rounded-lg text-sm hover:scale-105 transition-all"
        >
          + تحديد هدف
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {strategy.filter(g => !g.isDeleted).map(goal => (
          <div key={goal.id} className="bg-bg-card p-8 rounded-3xl border border-white/10 relative group overflow-hidden flex flex-col h-full">
             <div className="absolute top-0 left-0 w-1 h-full bg-accent-purple opacity-30 group-hover:opacity-100 transition-all"></div>
             
             <div className="flex justify-between items-start mb-6">
                <span className="text-[8px] font-black bg-accent-purple/10 text-accent-purple px-2 py-1 rounded tracking-widest uppercase">{goal.phase}</span>
                <button onClick={() => deleteGoal(goal.id)} className="p-2 opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-accent-red transition-all">
                   <Trash2 className="w-4 h-4" />
                </button>
             </div>

             <h3 className="text-xl font-black mb-2 text-text-primary">{goal.title}</h3>
             <p className="text-xs text-text-tertiary mb-6 line-clamp-2">{goal.description || 'لا يوجد وصف مفصل لهذا الهدف حتى الآن.'}</p>
             
             <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[10px] font-black text-text-secondary uppercase">
                   <span>مراحل الإنجاز</span>
                   <span className="text-accent-purple">%{goal.progress}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${goal.progress}%` }}
                     className="h-full bg-accent-purple shadow-[0_0_10px_rgba(200,184,255,0.3)]" 
                   />
                </div>
             </div>

             <div className="space-y-2 flex-1">
                {goal.stages?.map((stage, sIdx) => (
                   <div 
                     key={stage.id} 
                     onClick={() => {
                       const newStages = [...goal.stages];
                       newStages[sIdx].isCompleted = !newStages[sIdx].isCompleted;
                       const completedCount = newStages.filter(s => s.isCompleted).length;
                       const newProgress = Math.round((completedCount / newStages.length) * 100);
                       updateGoal(goal.id, { stages: newStages, progress: newProgress });
                     }}
                     className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all group/stage"
                   >
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                        stage.isCompleted ? "bg-accent-green border-accent-green shadow-[0_0_10px_rgba(78,234,170,0.3)]" : "border-white/20 group-hover/stage:border-accent-purple"
                      )}>
                         {stage.isCompleted && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                      </div>
                      <span className={cn("text-[11px] font-bold", stage.isCompleted ? "line-through text-text-tertiary" : "text-text-secondary")}>{stage.title}</span>
                   </div>
                ))}
             </div>

             <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-xl bg-accent-purple/20 flex items-center justify-center text-[10px] font-black text-accent-purple">
                      {goal.owner[0]}
                   </div>
                   <div>
                      <div className="text-[10px] font-bold text-text-primary">{goal.owner}</div>
                      <div className="text-[8px] text-text-tertiary uppercase">المسؤول</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-[10px] font-bold text-accent-red uppercase tracking-widest">{goal.targetDate}</div>
                   <div className="text-[8px] text-text-tertiary uppercase">الموعد النهائي</div>
                </div>
             </div>
          </div>
        ))}
        <button 
          onClick={() => (window as any).openModal('goal')}
          className="bg-bg-card p-8 rounded-3xl border-2 border-white/5 border-dashed flex flex-col items-center justify-center space-y-4 group hover:border-accent-purple/20 transition-all min-h-[300px]"
        >
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-text-tertiary group-hover:bg-accent-purple group-hover:text-bg-deep transition-all shadow-xl">+</div>
           <div className="text-center">
              <span className="block text-sm font-black text-text-secondary group-hover:text-white transition-colors">أضف هدفاً استراتيجياً</span>
              <span className="text-[10px] text-text-tertiary">خطة العمل تحتاج دائماً لأهداف واضحة</span>
           </div>
        </button>
      </div>
    </div>
  );
};

// --- Contracts Section ---
const ContractsSection = () => {
  const { contracts, deleteContract, settings } = useCRM();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const activeContracts = contracts.filter(c => !c.isDeleted);

  const toggleAll = () => {
    if (selectedIds.length === activeContracts.length && activeContracts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(activeContracts.map(c => c.id));
    }
  };

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary">نظام العقود الذكي</h2>
          <p className="text-xs text-text-tertiary font-bold">إدارة وتتبع الاتفاقيات القانونية مع عملائك</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={toggleAll}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-black transition-all border flex-1 md:flex-none",
              selectedIds.length === activeContracts.length && activeContracts.length > 0 ? "bg-white/10 border-white/20" : "bg-bg-card border-white/5 hover:bg-white/5"
            )}
          >
            {selectedIds.length === activeContracts.length && activeContracts.length > 0 ? 'إلغاء التحديد' : 'تحديد الكل'}
          </button>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => {
                if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} عقد؟`)) {
                  selectedIds.forEach(id => deleteContract(id));
                  setSelectedIds([]);
                }
              }}
              className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-6 py-2 rounded-lg text-sm font-black hover:bg-accent-red hover:text-white transition-all flex-1 md:flex-none"
            >
               حذف المحددين
            </button>
          )}
          <button 
            onClick={() => (window as any).openModal('contract')}
            className="bg-accent-purple text-bg-deep font-black px-6 py-2 rounded-lg text-sm hover:scale-105 transition-all flex-1 md:flex-none"
          >
            + إصدار عقد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {activeContracts.map(contract => (
           <div key={contract.id} className={cn(
             "bg-bg-card p-6 rounded-2xl border transition-all space-y-6 relative group overflow-hidden",
             selectedIds.includes(contract.id) ? "border-accent-purple ring-1 ring-accent-purple/50 bg-accent-purple/[0.02]" : "border-white/5"
           )}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-purple/5 -mr-12 -mt-12 rounded-full"></div>
              
              <div className="flex justify-between items-start relative">
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => toggleId(contract.id)}
                         className={cn(
                           "w-4 h-4 rounded border flex items-center justify-center transition-all",
                           selectedIds.includes(contract.id) ? "bg-accent-purple border-accent-purple" : "border-white/20 hover:border-white/40"
                         )}
                       >
                         {selectedIds.includes(contract.id) && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                       </button>
                       <div className="text-[10px] font-mono text-text-tertiary">رقم العقد: #{contract.contractNumber}</div>
                    </div>
                    <div className="text-xl font-black text-text-primary">{contract.clientName}</div>
                    <div className="text-[10px] text-accent-purple font-black uppercase tracking-widest">{contract.service}</div>
                 </div>
                 <span className={cn(
                   "text-[9px] font-black uppercase px-3 py-1 rounded-full",
                   contract.status === 'نشط' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20'
                 )}>{contract.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                 <div className="space-y-1">
                    <div className="text-[9px] text-text-tertiary uppercase">قيمة العقد</div>
                    <div className="text-sm font-black text-accent-green">{formatCurrency(contract.totalValue, settings?.currency)}</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[9px] text-text-tertiary uppercase">طريقة الدفع</div>
                    <div className="text-sm font-bold">{contract.paymentMethod || 'تحويل بنكي'}</div>
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between text-[10px]">
                    <span className="text-text-tertiary">تاريخ البدء:</span>
                    <span className="text-text-secondary">{contract.startDate}</span>
                 </div>
                 <div className="flex justify-between text-[10px]">
                    <span className="text-text-tertiary">تاريخ الانتهاء:</span>
                    <span className="text-text-secondary">{contract.endDate}</span>
                 </div>
              </div>

              <div className="pt-2 flex gap-2">
                 <button className="flex-1 bg-white/5 hover:bg-accent-purple hover:text-bg-deep p-3 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2">
                    <FileText className="w-3 h-3" /> معاينة PDF
                 </button>
                 <button className="p-3 bg-white/5 hover:bg-accent-purple hover:text-bg-deep rounded-xl text-text-secondary transition-all" title="إرسال للتوقيع">
                    <span>📧</span>
                 </button>
                 <button onClick={() => deleteContract(contract.id)} className="p-3 bg-white/5 hover:bg-accent-red hover:text-white rounded-xl text-text-tertiary transition-all">
                    <Trash2 className="w-3 h-3" />
                 </button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

// --- Team Section ---
const TeamSection = () => {
  const team = [
    { id: 1, name: 'Ali AlAli', email: 'alialali123123@gmail.com', role: 'موظف', isAdmin: false, avatar: 'ع' },
    { id: 2, name: 'AASOCIALMEDIA', email: 'aasocialmediia@gmail.com', role: 'مدير (أنت)', isAdmin: true, avatar: 'A' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-text-primary">الفريق</h2>
      </div>

      <div className="bg-bg-card p-6 rounded-2xl border border-white/5 space-y-4">
         <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
            <Rocket className="w-4 h-4" /> <span>رابط الدعوة</span>
         </div>
         <p className="text-[10px] text-text-tertiary">ادعوا أعضاء الفريق لبدء العمل</p>
         <div className="flex gap-2">
            <div className="flex-1 bg-bg-main border border-white/5 p-3 rounded-xl font-mono text-[10px] text-text-secondary flex items-center overflow-hidden">
               https://easygrowcrm.com/?invite=30dee151-4c6d-42ed-b03a-7c9d84f35a91
            </div>
            <button className="px-6 bg-white/5 border border-white/10 rounded-xl text-xs font-black hover:bg-white/10">نسخ</button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map(member => (
          <div key={member.id} className="bg-bg-card p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center space-y-6 relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-purple/20 to-transparent"></div>
             
             <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-3xl font-black text-text-primary relative group-hover:scale-110 transition-transform">
                {member.avatar}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-bg-deep rounded-full flex items-center justify-center">
                   <div className={cn("w-3 h-3 rounded-full", member.isAdmin ? "bg-accent-green" : "bg-accent-purple")}></div>
                </div>
             </div>

             <div>
                <div className="text-xl font-black text-text-primary">{member.name}</div>
                <div className="text-xs text-text-tertiary font-mono mt-1">{member.email}</div>
             </div>

             <div className="flex gap-2">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2",
                  member.isAdmin ? "bg-accent-amber/10 text-accent-amber border border-accent-amber/20" : "bg-white/5 text-text-secondary border border-white/10"
                )}>
                   {member.isAdmin ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                   {member.role}
                </span>
             </div>

             <div className="w-full space-y-3 pt-4 border-t border-white/5">
                {!member.isAdmin && (
                  <button className="w-full py-3 bg-white/10 hover:bg-accent-purple hover:text-bg-deep rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
                     <Target className="w-4 h-4" /> ترقية مدير
                  </button>
                )}
                <button className="w-full py-3 bg-accent-green/10 text-accent-green hover:bg-accent-green hover:text-bg-deep rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
                   <ShieldCheck className="w-4 h-4" /> إدارة الصلاحيات
                </button>
                <button className="w-full py-3 bg-accent-red/5 text-accent-red hover:bg-accent-red hover:text-bg-deep rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
                   <Trash2 className="w-4 h-4" /> إزالة من الشركة
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Settings Section ---
const SettingsSection = () => {
  const { settings, updateSettings, user, updateUser } = useCRM();

  return (
    <div className="space-y-10 pb-20">
      <header className="flex justify-between items-end">
         <div>
            <div className="text-[10px] font-black text-accent-purple uppercase mb-1 tracking-[0.3em]">SYSTEM PREFERENCES</div>
            <h2 className="text-3xl font-black text-text-primary tracking-tighter uppercase italic">Control Panel</h2>
            <p className="text-text-tertiary text-xs font-bold mt-1">تخصيص مساحة العمل والملف الشخصي</p>
         </div>
         <button className="px-8 py-4 bg-accent-purple text-bg-deep font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent-purple/20">
            💾 حفظ التغييرات الذكي
         </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2 space-y-8">
            <div className="bg-bg-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-accent-purple/10 transition-all"></div>
               <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Settings className="w-5 h-5 text-accent-purple" /> بيانات المؤسسة</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">اسم المؤسسة (رسمي)</label>
                     <input 
                       className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all" 
                       value={settings?.name || ''} 
                       onChange={(e) => updateSettings({ name: e.target.value })}
                       placeholder="أدخل الاسم الرسمي للمؤسسة..."
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">قطاع العمل</label>
                     <div className="flex flex-col gap-3">
                        <select 
                          className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none"
                          value={['سوشيال ميديا 📱', 'تجارة إلكترونية 🛒', 'تكنولوجيا 💻', 'عقارات 🏠', 'تعليم 🎓'].includes(settings?.sector) ? settings?.sector : 'مخصص'}
                          onChange={(e) => {
                             if (e.target.value === 'مخصص') {
                                updateSettings({ sector: '' });
                             } else {
                                updateSettings({ sector: e.target.value });
                             }
                          }}
                        >
                           <option value="سوشيال ميديا 📱">سوشيال ميديا 📱</option>
                           <option value="تجارة إلكترونية 🛒">تجارة إلكترونية 🛒</option>
                           <option value="تكنولوجيا 💻">تكنولوجيا 💻</option>
                           <option value="عقارات 🏠">عقارات 🏠</option>
                           <option value="تعليم 🎓">تعليم 🎓</option>
                           <option value="مخصص">مخصص ✏️</option>
                        </select>
                        {(!['سوشيال ميديا 📱', 'تجارة إلكترونية 🛒', 'تكنولوجيا 💻', 'عقارات 🏠', 'تعليم 🎓'].includes(settings?.sector)) && (
                           <input 
                             placeholder="اكتب قطاع العمل هنا..."
                             className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-accent-purple focus:border-accent-purple outline-none animate-in fade-in slide-in-from-top-2 duration-300"
                             value={settings?.sector || ''}
                             onChange={(e) => updateSettings({ sector: e.target.value })}
                           />
                        )}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">خطة الاشتراك الحالية</label>
                     <div className="flex gap-3">
                        <select 
                          className="flex-1 bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-accent-purple outline-none"
                          value={settings?.plan || ''}
                          onChange={(e) => updateSettings({ plan: e.target.value as any })}
                        >
                           <option value="Standard">Standard (المجانية) ✦</option>
                           <option value="Pro">Pro (الاحترافية) 🚀</option>
                           <option value="Enterprise">Enterprise (المؤسسات) 💎</option>
                        </select>
                        <button className="bg-accent-purple text-bg-deep font-black px-6 py-4 rounded-2xl text-xs hover:bg-white transition-all">ترقية</button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">العملة الافتراضية</label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select 
                          className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all"
                          value={CURRENCIES.find(c => c.code === settings?.currency) ? settings?.currency : 'custom'}
                          onChange={(e) => {
                             if (e.target.value !== 'custom') {
                                updateSettings({ currency: e.target.value });
                             }
                          }}
                        >
                           {CURRENCIES.map(c => (
                             <option key={c.code} value={c.code}>{c.name} ({c.code}) - {c.symbol}</option>
                           ))}
                           <option value="custom">-- عملة مخصصة --</option>
                        </select>
                        {(settings?.currency && !CURRENCIES.find(c => c.code === settings?.currency)) || !CURRENCIES.find(c => c.code === settings?.currency) ? (
                           <input 
                             placeholder="اكتب رمز العملة (مثل: KWD)"
                             className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-accent-purple focus:border-accent-purple outline-none"
                             value={CURRENCIES.find(c => c.code === settings?.currency) ? '' : settings?.currency || ''}
                             onChange={(e) => updateSettings({ currency: e.target.value })}
                           />
                        ) : (
                          <div className="w-full bg-bg-main/50 border border-white/5 p-4 rounded-2xl font-black text-text-tertiary text-center flex items-center justify-center italic text-xs">
                             تم اختيار عملة النظام
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-bg-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3"><FileText className="w-5 h-5 text-accent-purple" /> بيانات الفاتورة والعقد</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">اسم الشركة على الفاتورة</label>
                     <input 
                       className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all" 
                       placeholder="مثال: شركة النجاح للتسويق"
                       value={settings?.invFrom || ''} 
                       onChange={(e) => updateSettings({ invFrom: e.target.value })}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">الرقم الضريبي / التجاري</label>
                     <input 
                       className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all" 
                       placeholder="اختياري"
                       value={settings?.taxNumber || ''} 
                       onChange={(e) => updateSettings({ taxNumber: e.target.value })}
                     />
                  </div>
               </div>

               <div className="space-y-2 mb-8">
                  <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">العنوان (يظهر على الفاتورة)</label>
                  <textarea 
                    className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-bold text-text-primary focus:border-accent-purple outline-none transition-all min-h-[100px]" 
                    placeholder="المدينة، البلد"
                    value={settings?.invAddress || ''} 
                    onChange={(e) => updateSettings({ invAddress: e.target.value })}
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">الهاتف</label>
                     <input 
                       className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all" 
                       placeholder="+966 5X XXX XXXX"
                       value={settings?.invPhone || ''} 
                       onChange={(e) => updateSettings({ invPhone: e.target.value })}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">البريد الإلكتروني للفواتير</label>
                     <input 
                       className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all" 
                       placeholder="billing@company.com"
                       value={settings?.invEmail || ''} 
                       onChange={(e) => updateSettings({ invEmail: e.target.value })}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">وصف النشاط (عربي)</label>
                     <input 
                       className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all" 
                       placeholder="مثال: وكالة تسويق رقمي"
                       value={settings?.descriptionAr || ''} 
                       onChange={(e) => updateSettings({ descriptionAr: e.target.value })}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">وصف النشاط (إنجليزي)</label>
                     <input 
                       className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all" 
                       placeholder="e.g. Digital Marketing Agency"
                       value={settings?.descriptionEn || ''} 
                       onChange={(e) => updateSettings({ descriptionEn: e.target.value })}
                     />
                  </div>
               </div>

               <div className="space-y-2 mb-8 text-right">
                  <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">وصف الخدمة (للعقود)</label>
                  <input 
                    className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all text-right" 
                    placeholder="خدمات تسويق رقمي شاملة"
                    value={settings?.serviceDescription || ''} 
                    onChange={(e) => updateSettings({ serviceDescription: e.target.value })}
                  />
               </div>

               <div className="space-y-2 mb-10 text-right">
                  <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">اسم الممثل القانوني (يظهر في توقيع العقد)</label>
                  <input 
                    className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl font-black text-text-primary focus:border-accent-purple outline-none transition-all text-right" 
                    placeholder="اسم المدير أو صاحب الشركة"
                    value={settings?.legalRepresentative || ''} 
                    onChange={(e) => updateSettings({ legalRepresentative: e.target.value })}
                  />
               </div>

               <div className="pt-8 border-t border-white/5">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="order-2 md:order-1 text-center md:text-right">
                        <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest block mb-4">شعار الشركة (يظهر على الفاتورة والعقد والقائمة الجانبية)</label>
                        <div className="flex gap-3">
                           <button className="bg-bg-main border border-white/10 px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-white/5 transition-all">
                              📂 اختر شعار
                           </button>
                           <button 
                             onClick={() => updateSettings({ logo: '' })}
                             className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-6 py-3 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-accent-red hover:text-white transition-all"
                           >
                              🗑️ حذف الشعار
                           </button>
                        </div>
                        <p className="text-[9px] text-text-tertiary mt-4 font-bold">PNG أو JPG - يُفضل مربعة - يظهر على الفاتورة والعقد والقائمة الجانبية</p>
                     </div>
                     <div className="order-1 md:order-2">
                        <div className="w-24 h-24 rounded-2xl bg-bg-main border border-white/10 flex items-center justify-center overflow-hidden">
                           {settings?.logo ? (
                              <img src={settings.logo} className="w-full h-full object-contain" />
                           ) : (
                              <div className="text-3xl opacity-20 font-black">LG</div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-10 p-4 bg-bg-main/50 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent-amber animate-pulse"></div>
                  <p className="text-[10px] font-bold text-text-tertiary italic">هذه البيانات تظهر على كل الفواتير والعقود الصادرة من نظامك - لا تظهر بيانات easygrowcrm للعميل النهائي</p>
               </div>
            </div>

            <div className="bg-bg-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
               <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Bell className="w-5 h-5 text-accent-purple" /> إعدادات الإشعارات</h3>
               <div className="space-y-4">
                  {[
                    { label: 'تنبيهات الفواتير المتأخرة', desc: 'إرسال بريد إلكتروني عند تأخر العميل في الدفع' },
                    { label: 'إشعارات المهام اليومية', desc: 'ملخص يومي بالمهام المطلوب إنجازها' },
                    { label: 'تقارير الأداء الأسبوعية', desc: 'تقرير مفصل عن نمو الشركة بنهاية كل أسبوع' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-bg-main/30 rounded-2xl border border-white/5 hover:border-accent-purple/20 transition-all group">
                       <div>
                          <div className="text-sm font-black text-text-primary group-hover:text-accent-purple transition-colors">{item.label}</div>
                          <div className="text-[10px] text-text-tertiary">{item.desc}</div>
                       </div>
                       <div className="w-12 h-6 bg-accent-purple/20 rounded-full relative p-1 cursor-pointer">
                          <div className="absolute right-1 top-1 bottom-1 w-4 h-4 bg-accent-purple rounded-full"></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-bg-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center">
               <div className="relative group mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-accent-purple to-bg-main border-2 border-white/10 flex items-center justify-center text-5xl font-black shadow-2xl relative overflow-hidden">
                     {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0] || 'A'}
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <PenTool className="w-8 h-8 text-white" />
                     </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent-green rounded-2xl flex items-center justify-center shadow-lg border-4 border-bg-card">
                     <ShieldCheck className="w-5 h-5 text-bg-deep" />
                  </div>
               </div>
               
               <div className="space-y-2 mb-8">
                  <h4 className="text-2xl font-black text-text-primary tracking-tighter italic uppercase">{user?.name || 'مستخدم جديد'}</h4>
                  <div className="text-[10px] font-black text-accent-purple bg-accent-purple/10 px-4 py-1 rounded-full uppercase tracking-widest">Administrator</div>
               </div>

               <div className="w-full space-y-4">
                  <div className="text-right space-y-2">
                     <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mr-2">تعديل الاسم المستعار</label>
                     <input 
                       className="w-full bg-bg-main border border-white/5 p-4 rounded-2xl text-xs font-bold text-center" 
                       value={user?.name || ''} 
                       onChange={(e) => updateUser({ name: e.target.value })}
                     />
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-bg-card to-accent-purple/5 p-8 rounded-[2.5rem] border border-accent-purple/10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent-purple text-bg-deep rounded-2xl shadow-lg shadow-accent-purple/20"><Rocket className="w-6 h-6" /></div>
                  <div>
                     <div className="text-lg font-black text-text-primary">ترقية الحساب</div>
                     <div className="text-[10px] text-text-tertiary">احصل على ضعف المساحة والخصائص</div>
                  </div>
               </div>
               <p className="text-[11px] leading-relaxed text-text-secondary">
                  افتح ميزات التقارير الذكية، والربط البرمجي، والدعم الفني المخصص عبر الترقية لخطة 
                  <span className="text-accent-purple font-black"> Pro المتميزة</span>.
               </p>
               <button className="w-full py-4 bg-white text-bg-deep font-black rounded-2xl hover:bg-accent-purple transition-all shadow-xl">تحسين الخطة الآن</button>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Trash Section ---
const TrashSection = () => {
  const { clients, invoices, tasks, restoreItem, permanentDelete } = useCRM();
  const [tab, setTab] = useState('clients');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const items = {
    clients: clients.filter(c => c.isDeleted),
    invoices: invoices.filter(i => i.isDeleted),
    tasks: tasks.filter(t => t.isDeleted),
  };

  const currentItems = (items as any)[tab] || [];

  useEffect(() => {
    setSelectedIds([]);
  }, [tab]);

  const toggleAll = () => {
    if (selectedIds.length === currentItems.length && currentItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentItems.map((i: any) => i.id));
    }
  };

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="bg-bg-card p-1 rounded-xl border border-white/5 inline-flex">
             <button onClick={() => setTab('clients')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", tab === 'clients' ? "bg-accent-purple text-bg-deep" : "text-text-secondary")}>العملاء</button>
             <button onClick={() => setTab('invoices')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", tab === 'invoices' ? "bg-accent-purple text-bg-deep" : "text-text-secondary")}>الفواتير</button>
             <button onClick={() => setTab('tasks')} className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", tab === 'tasks' ? "bg-accent-purple text-bg-deep" : "text-text-secondary")}>المهام</button>
          </div>

          <div className="flex gap-2">
             <button 
               onClick={toggleAll}
               className={cn(
                 "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                 selectedIds.length === currentItems.length && currentItems.length > 0 ? "bg-white/10 border-white/20 text-white" : "border-white/5 hover:bg-white/5 text-text-secondary"
               )}
             >
                {selectedIds.length === currentItems.length && currentItems.length > 0 ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
             </button>
             {selectedIds.length > 0 && (
               <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                  <button 
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من استعادة ${selectedIds.length} عنصر؟`)) {
                        selectedIds.forEach(id => restoreItem(id, tab));
                        setSelectedIds([]);
                      }
                    }}
                    className="bg-accent-green/10 text-accent-green border border-accent-green/20 px-4 py-2 rounded-lg text-xs font-black hover:bg-accent-green hover:text-bg-deep transition-all"
                  >
                     استعادة الكل المحددة
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} عنصر نهائياً؟ لا يمكن التراجع عن هذه الخطوة.`)) {
                        selectedIds.forEach(id => permanentDelete(id, tab));
                        setSelectedIds([]);
                      }
                    }}
                    className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-4 py-2 rounded-lg text-xs font-black hover:bg-accent-red hover:text-white transition-all shadow-xl shadow-accent-red/10"
                  >
                     حذف الكل نهائي
                  </button>
               </div>
             )}
          </div>
       </div>

       <div className="bg-bg-card rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-right">
             <tbody className="divide-y divide-white/5">
                {currentItems.map((item: any) => (
                  <tr key={item.id} className={cn(
                    "hover:bg-white/[0.02] transition-colors",
                    selectedIds.includes(item.id) && "bg-accent-purple/5"
                  )}>
                    <td className="px-6 py-4 w-10">
                       <button 
                         onClick={() => toggleId(item.id)}
                         className={cn(
                           "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                           selectedIds.includes(item.id) ? "bg-accent-purple border-accent-purple" : "border-white/20"
                         )}
                       >
                         {selectedIds.includes(item.id) && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                       </button>
                    </td>
                    <td className="px-6 py-4 font-bold">{item.name || item.title || item.invoiceCode || item.fullName}</td>
                    <td className="px-6 py-4">
                       <div className="flex justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => restoreItem(item.id, tab)} className="text-accent-green text-[10px] font-black uppercase hover:underline">استعادة</button>
                          <button onClick={() => permanentDelete(item.id, tab)} className="text-accent-red text-[10px] font-black uppercase hover:underline">حذف نهائي</button>
                       </div>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td className="px-6 py-12 text-center text-text-tertiary font-bold italic">سلة المهملات فارغة في هذا القسم</td>
                  </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
};

// --- Executive Report Section ---
const ExecutiveReportSection = () => {
  const { clients, invoices, expenses, leads, settings } = useCRM();
  
  const revenue = invoices.filter(i => !i.isDeleted && i.paymentStatus === 'مدفوع').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.filter(e => !e.isDeleted).reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = revenue - totalExpenses;
  const margin = revenue > 0 ? ((netProfit / revenue) * 100).toFixed(1) : 0;
  
  const pendingInvoices = invoices.filter(i => !i.isDeleted && i.paymentStatus !== 'مدفوع');
  const pipelineValue = leads.filter(l => !l.isDeleted && !l.converted).reduce((acc, curr) => acc + curr.budget, 0);

  const kpis = [
    { label: 'الإيرادات الإجمالية', value: formatCurrency(revenue, settings?.currency), sub: `${invoices.filter(i => !i.isDeleted).length} فاتورة`, icon: Wallet, color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { label: 'المصاريف الإجمالية', value: formatCurrency(totalExpenses, settings?.currency), sub: `${expenses.filter(e => !e.isDeleted).length} معاملة`, icon: Rocket, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { label: 'صافي الربح', value: formatCurrency(netProfit, settings?.currency), sub: `هامش الربح: ${margin}%`, icon: BarChart3, color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { label: 'فواتير معلقة', value: formatCurrency(pendingInvoices.reduce((a, b) => a + b.amount, 0), settings?.currency), sub: `${pendingInvoices.length} فاتورة`, icon: CreditCard, color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
    { label: 'إجمالي العملاء', value: clients.filter(c => !c.isDeleted).length, sub: `VIP: ${clients.filter(c => c.classification === 'VIP' && !c.isDeleted).length}`, icon: Users, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { label: 'قيمة الـ Pipeline', value: formatCurrency(pipelineValue, settings?.currency), sub: `${leads.filter(l => !l.isDeleted && !l.converted).length} فرصة نشطة`, icon: Rocket, color: 'text-accent-green', bg: 'bg-accent-green/10' },
  ];

  const barData = [
    { name: 'يناير', revenue: 14000, expenses: 8000 },
    { name: 'فبراير', revenue: 16000, expenses: 11000 },
    { name: 'مارس', revenue: 32000, expenses: 13000 },
    { name: 'أبريل', revenue: 25000, expenses: 12000 },
    { name: 'مايو', revenue: revenue, expenses: totalExpenses },
  ];

  const pieData = [
    { name: 'رواتب موظفين', value: 35.5, color: '#a78bfa' },
    { name: 'تسويق', value: 22.3, color: '#4eeaaa' },
    { name: 'إعلانات', value: 11.4, color: '#ff6b8a' },
    { name: 'اشتراكات', value: 9.6, color: '#f59e0b' },
    { name: 'أخرى', value: 8.8, color: '#6366f1' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-text-primary flex items-center gap-2">
            <span className="text-accent-purple">👑</span> التقرير التنفيذي
          </h2>
          <p className="text-text-secondary text-sm">نظرة شاملة على أداء الشركة</p>
        </div>
        <div className="flex bg-bg-card p-1 rounded-xl border border-white/5">
           {['الشهر السابق', 'هذا الشهر', 'الكل'].map(t => (
             <button key={t} className="px-4 py-1.5 text-[10px] font-black rounded-lg hover:bg-white/5 transition-all">{t}</button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-bg-card p-4 rounded-2xl border border-white/5 space-y-3">
             <div className="flex justify-between items-center">
                <div className={cn("p-2 rounded-lg", kpi.bg)}><kpi.icon className={cn("w-4 h-4", kpi.color)} /></div>
             </div>
             <div>
                <div className="text-[10px] font-bold text-text-tertiary uppercase mb-1">{kpi.label}</div>
                <div className="text-xl font-black text-text-primary">{kpi.value}</div>
                <div className="text-[9px] text-text-secondary">{kpi.sub}</div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-bg-card p-6 rounded-2xl border border-white/5">
           <div className="flex justify-between items-center mb-8">
              <h3 className="font-black">الإيرادات vs المصاريف</h3>
              <div className="flex gap-4 text-[10px] font-black">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 bg-accent-green rounded-full"></div> الإيرادات</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 bg-accent-red rounded-full"></div> المصاريف</div>
              </div>
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                 <XAxis dataKey="name" stroke="#8888aa" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="#8888aa" fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip contentStyle={{ backgroundColor: '#1a1a24', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                 <Bar dataKey="revenue" fill="#4eeaaa" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="expenses" fill="#ff6b8a" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="lg:col-span-2 bg-bg-card p-6 rounded-2xl border border-white/5">
           <h3 className="font-black mb-8">توزيع المصاريف</h3>
           <div className="flex items-center justify-center h-48 mb-8">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="space-y-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex justify-between items-center text-[10px]">
                   <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full" style={{ background: d.color }}></div> {d.name}</div>
                   <div className="font-black text-text-primary">{d.value}%</div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Pipeline Section ---
const PipelineSection = () => {
  const { leads, updateLead, convertLeadToClient, deleteLead, settings } = useCRM();
  const stages = ['استفسار', 'اجتماع', 'عرض', 'تفاوض', 'مغلق', 'خسارة'];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const moveLead = (id: string, currentStage: string, direction: 'next' | 'prev') => {
    const currentIndex = stages.indexOf(currentStage);
    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < stages.length) {
      updateLead(id, { stage: stages[nextIndex] as any });
    }
  };

  const activeLeads = leads.filter(l => !l.isDeleted && !l.converted);
  const totalBudget = activeLeads.reduce((acc, curr) => acc + curr.budget, 0);

  const toggleAll = () => {
    if (selectedIds.length === activeLeads.length && activeLeads.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(activeLeads.map(l => l.id));
    }
  };

  const toggleId = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-text-primary tracking-tighter uppercase italic">Sales Pipeline</h2>
          <p className="text-xs text-text-tertiary font-bold uppercase tracking-widest mt-1">تتبع رحلة العميل من الاستفسار إلى الإغلاق</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={toggleAll}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-black transition-all border flex-1 md:flex-none",
              selectedIds.length === activeLeads.length && activeLeads.length > 0 ? "bg-white/10 border-white/20" : "bg-bg-card border-white/5 hover:bg-white/5"
            )}
          >
            {selectedIds.length === activeLeads.length && activeLeads.length > 0 ? 'إلغاء التحديد' : 'تحديد الكل'}
          </button>
          {selectedIds.length > 0 && (
            <button 
              onClick={() => {
                if (confirm(`هل أنت متأكد من حذف ${selectedIds.length} فرصة؟`)) {
                  selectedIds.forEach(id => deleteLead(id));
                  setSelectedIds([]);
                }
              }}
              className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-6 py-2 rounded-lg text-sm font-black hover:bg-accent-red hover:text-white transition-all flex-1 md:flex-none"
            >
               حذف المحددين
            </button>
          )}
          <button 
            onClick={() => (window as any).openModal('lead')}
            className="bg-accent-purple text-bg-deep font-black px-6 py-2 rounded-lg text-sm hover:scale-105 transition-all shadow-lg shadow-accent-purple/10 flex-1 md:flex-none"
          >
            + إضافة فرصة
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
         <div className="bg-bg-card p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-accent-purple/10 rounded-xl text-accent-purple"><Users2 className="w-5 h-5" /></div>
            <div>
               <div className="text-[10px] font-black text-text-tertiary uppercase">الفرص النشطة</div>
               <div className="text-lg font-black">{activeLeads.length} عروض</div>
            </div>
         </div>
         <div className="bg-bg-card p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-accent-green/10 rounded-xl text-accent-green text-xl">💰</div>
            <div>
               <div className="text-[10px] font-black text-text-tertiary uppercase">القيمة المتوقعة</div>
               <div className="text-lg font-black">{formatCurrency(totalBudget)}</div>
            </div>
         </div>
         <div className="bg-bg-card p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-accent-amber/10 rounded-xl text-accent-amber text-xl">🤝</div>
            <div>
               <div className="text-[10px] font-black text-text-tertiary uppercase">في مرحلة التفاوض</div>
               <div className="text-lg font-black">{activeLeads.filter(l => l.stage === 'تفاوض' || l.stage === 'عرض').length} صفقة</div>
            </div>
         </div>
         <div className="bg-bg-card p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-accent-red/10 rounded-xl text-accent-red text-xl">📉</div>
            <div>
               <div className="text-[10px] font-black text-text-tertiary uppercase">الصفقات الخاسرة</div>
               <div className="text-lg font-black">{leads.filter(l => l.stage === 'خسارة').length} عميل</div>
            </div>
         </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar">
        {stages.map(stage => (
          <div key={stage} className="min-w-[280px] flex-1">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-black text-xs uppercase tracking-widest text-text-secondary">{stage}</h3>
              <span className="bg-white/5 text-text-tertiary text-[10px] font-black px-2 py-0.5 rounded-full">
                {leads.filter(l => !l.isDeleted && !l.converted && l.stage === stage).length}
              </span>
            </div>
            <div className="space-y-3 p-3 bg-bg-card/30 rounded-xl border border-white/5 min-h-[500px]">
              {leads.filter(l => !l.isDeleted && !l.converted && l.stage === stage).map(lead => (
                <motion.div 
                  layoutId={lead.id}
                  key={lead.id} 
                  className={cn(
                    "bg-bg-card p-4 rounded-xl border transition-all cursor-move group shadow-xl shadow-black/20 relative",
                    selectedIds.includes(lead.id) ? "border-accent-purple ring-1 ring-accent-purple/50 bg-accent-purple/[0.02]" : "border-white/5 hover:border-accent-purple/30"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                     <div className="font-bold text-sm">{lead.fullName}</div>
                     <button 
                       onClick={() => toggleId(lead.id)}
                       className={cn(
                         "w-4 h-4 rounded border flex items-center justify-center transition-all",
                         selectedIds.includes(lead.id) ? "bg-accent-purple border-accent-purple" : "border-white/20 hover:border-white/40"
                       )}
                     >
                       {selectedIds.includes(lead.id) && <CheckSquare className="w-3 h-3 text-bg-deep" />}
                     </button>
                  </div>
                  <div className="text-[10px] text-text-secondary uppercase mb-3 text-right">{lead.service}</div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="text-accent-green font-mono font-bold text-xs">{formatCurrency(lead.budget, settings?.currency)}</div>
                    <div className="flex gap-1 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => (window as any).openModal('massOffer')}
                        className="p-1.5 hover:bg-accent-purple/20 rounded-md text-text-tertiary hover:text-accent-purple transition-all"
                        title="إرسال عرض"
                      >
                         <Mail className="w-3.5 h-3.5" />
                      </button>
                      {stage !== stages[0] && (
                        <button onClick={() => moveLead(lead.id, stage, 'prev')} className="p-1.5 hover:bg-white/10 rounded-md text-text-tertiary">←</button>
                      )}
                      {stage === 'مغلق' ? (
                        <button onClick={() => convertLeadToClient(lead)} className="p-1.5 px-3 bg-accent-green text-bg-deep rounded-lg text-[9px] font-black uppercase hover:scale-105 transition-all">🚀 تحويل</button>
                      ) : stage !== 'خسارة' && (
                        <button onClick={() => moveLead(lead.id, stage, 'next')} className="p-1.5 hover:bg-white/10 rounded-md text-text-tertiary">→</button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <button 
                onClick={() => (window as any).openModal('lead')}
                className="w-full py-3 border border-white/5 border-dashed rounded-xl text-text-tertiary text-xs font-black hover:bg-white/5 transition-all"
              >
                + إضافة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Side Bot Component ---
const SideBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { clients, invoices, expenses, strategy, tasks } = useCRM();

  const totalInvoices = invoices.filter(i => !i.isDeleted).length;
  const paidInvoices = invoices.filter(i => !i.isDeleted && i.paymentStatus === 'مدفوع').length;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="w-80 sm:w-96 h-[500px] bg-bg-card/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            <div className="p-6 bg-accent-purple text-bg-deep flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl animate-bounce-slow">🤖</div>
                 <div>
                    <div className="font-black text-sm">مساعد EasyGrow</div>
                    <div className="text-[10px] font-bold opacity-70">متصل بالبيانات الآن</div>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-xl bg-accent-purple/20 flex items-center justify-center shrink-0 text-sm">🤖</div>
                 <div className="bg-bg-main border border-white/5 p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed space-y-3">
                    <p>أهلاً بك! لقد قمت بتحليل بياناتك للتو. إليك ملخص سريع:</p>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <div className="text-[8px] text-text-tertiary uppercase">العملاء</div>
                          <div className="text-sm font-black">{clients.filter(c => !c.isDeleted).length}</div>
                       </div>
                       <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                          <div className="text-[8px] text-text-tertiary uppercase">الفواتير المدفوعة</div>
                          <div className="text-sm font-black">{paidInvoices}/{totalInvoices}</div>
                       </div>
                    </div>
                    <p>هناك {tasks.filter(t => t.priority === 'عاجل' && !t.isDeleted).length} مهام عاجلة تتطلب انتباهك. هل أساعدك في تنظيمها؟</p>
                 </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border-t border-white/5 flex gap-3">
               <input 
                 className="flex-1 bg-bg-main border border-white/5 rounded-2xl px-4 py-3 text-xs outline-none focus:border-accent-purple transition-all" 
                 placeholder="اسأل الروبوت عن بياناتك..." 
               />
               <button className="w-12 h-12 bg-accent-purple text-bg-deep rounded-2xl flex items-center justify-center shadow-lg shadow-accent-purple/20 hover:scale-105 active:scale-95 transition-all">
                  <Rocket className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full shadow-[0_15px_40px_-5px_rgba(200,184,255,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all relative z-50",
          isOpen ? "bg-bg-card text-accent-purple border border-white/10" : "bg-accent-purple text-bg-deep"
        )}
      >
        {isOpen ? <X className="w-8 h-8" /> : <span className="text-3xl animate-pulse">🤖</span>}
      </button>
    </div>
  );
};
// --- Mobile Bottom Navigation ---
const MobileBottomNav = ({ activeSection, setActiveSection }: any) => {
  const items = [
    { id: 'dashboard', icon: BarChart3, label: 'الرئيسية' },
    { id: 'clients', icon: Users, label: 'العملاء' },
    { id: 'finance', icon: FileText, label: 'المالية' },
    { id: 'tasks', icon: CheckSquare, label: 'المهام' },
    { id: 'settings', icon: Settings, label: 'الإعدادات' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-[60] bg-bg-card/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 flex justify-around items-center shadow-2xl shadow-black/50">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          className={cn(
            "flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all relative overflow-hidden",
            activeSection === item.id ? "text-accent-purple" : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          {activeSection === item.id && (
            <motion.div 
              layoutId="bottom-nav-indicator"
              className="absolute inset-0 bg-accent-purple/10 rounded-2xl" 
            />
          )}
          <item.icon className="w-5 h-5 relative z-10" />
          <span className="text-[10px] font-black relative z-10">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
// --- Sidebar Component ---
const Sidebar = ({ activeSection, setActiveSection, isCollapsed, setIsCollapsed }: any) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: BarChart3, group: 'الإدارة' },
    { id: 'clients', label: 'العملاء', icon: Users, group: 'العملاء' },
    { id: 'pipeline', label: 'المبيعات (Pipeline)', icon: Rocket, group: 'العملاء' },
    { id: 'finance', label: 'الفواتير', icon: FileText, group: 'المالية' },
    { id: 'expenses', label: 'المصاريف', icon: Wallet, group: 'المالية' },
    { id: 'accounting', label: 'المحاسبة', icon: PieChartIcon, group: 'المالية' },
    { id: 'tasks', label: 'المهام', icon: CheckSquare, group: 'الفريق' },
    { id: 'team', label: 'أعضاء الفريق', icon: Users2, group: 'الفريق', admin: true },
    { id: 'contracts', label: 'العقود', icon: ShieldCheck, group: 'النظام' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, group: 'النظام', admin: true },
    { id: 'executive', label: 'التقرير التنفيذي', icon: Briefcase, group: 'النظام', admin: true },
    { id: 'strategy', label: 'الأهداف', icon: Target, group: 'النظام' },
    { id: 'trash', label: 'سلة المحذوفات', icon: Trash2, group: 'النظام', admin: true },
  ];

  const groupedItems = navItems.reduce((acc: any, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <>
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-[60] w-14 h-14 bg-accent-purple text-bg-deep rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90"
      >
        <Menu className="w-6 h-6" />
      </button>

      <aside className={cn(
        "h-full bg-bg-main border-l border-white/5 flex flex-col fixed right-0 z-50 transition-all duration-300 ease-[0.16,1,0.3,1]",
        isCollapsed ? "w-20" : "w-72",
        isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-500", isCollapsed ? "opacity-0 w-0 -translate-x-4" : "opacity-100 w-auto translate-x-0")}>
            <div className="w-10 h-10 bg-accent-purple rounded-2xl flex items-center justify-center font-black text-bg-deep text-xl shadow-lg shadow-accent-purple/20 shrink-0">E</div>
            <div className="font-black text-xl tracking-tighter text-text-primary whitespace-nowrap">EASYGROW <span className="text-accent-purple">CRM</span></div>
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/5 rounded-xl text-text-tertiary hover:text-accent-purple transition-all hidden lg:block"
          >
            {isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <div className="px-4 mb-6">
           <button 
             onClick={() => { (window as any).openModal('client'); setIsMobileOpen(false); }}
             className={cn(
               "w-full bg-accent-purple text-bg-deep font-black rounded-2xl transition-all shadow-lg shadow-accent-purple/5 flex items-center justify-center gap-2 group",
               isCollapsed ? "h-12" : "py-4 h-14"
             )}
           >
             <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
             {!isCollapsed && <span className="text-sm">إضافة جديد</span>}
           </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-8 pb-8 custom-scrollbar">
          {Object.entries(groupedItems).map(([group, items]: [string, any]) => (
            <div key={group} className="space-y-2">
              {!isCollapsed && <div className="px-4 text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">{group}</div>}
              <div className="space-y-1">
                {items.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveSection(item.id); setIsMobileOpen(false); }}
                    title={isCollapsed ? item.label : ''}
                    className={cn(
                      "w-full flex items-center rounded-xl text-sm font-bold transition-all relative group",
                      isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3",
                      activeSection === item.id 
                        ? "bg-accent-purple text-bg-deep shadow-[0_10px_25px_-5px_rgba(200,184,255,0.4)]" 
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 shrink-0 transition-transform", activeSection === item.id ? "scale-110" : "group-hover:scale-110")} />
                    {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                    {activeSection === item.id && !isCollapsed && (
                      <div className="mr-auto w-1.5 h-1.5 rounded-full bg-bg-deep opacity-30"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-bg-deep/50 mt-auto border-t border-white/5">
          <button className={cn(
            "w-full flex items-center transition-all bg-white/[0.02] border border-white/5 hover:bg-accent-red/10 group rounded-xl",
            isCollapsed ? "justify-center p-3" : "px-4 py-3 gap-3"
          )}>
            <LogOut className={cn("w-5 h-5 text-accent-red transition-transform group-hover:-translate-x-1", isCollapsed ? "" : "")} />
            {!isCollapsed && <span className="text-sm font-bold text-accent-red">تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {(isMobileOpen || (!isCollapsed && window.innerWidth < 1024)) && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity" 
        />
      )}
    </>
  );
};

// --- Utility Components ---
const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-bg-deep/80 backdrop-blur-xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-bg-card border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-bg-main/50 sticky top-0 z-10">
            <h3 className="text-xl font-black italic tracking-tighter ml-4">{title}</h3>
            <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const CrmBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { clients, invoices, tasks, settings } = useCRM();

  const getSystemStatus = () => {
    const activeClients = clients.filter(c => !c.isDeleted).length;
    const pendingTasks = tasks.filter(t => !t.isDeleted && t.status !== 'مكتملة').length;
    return `لديك حالياً ${activeClients} عملاء نشطين و ${pendingTasks} مهمة قيد الإنجاز. أداؤك المالي ممتاز هذا الشهر! 🚀`;
  };

  return (
    <div className="fixed bottom-[100px] left-6 lg:bottom-10 lg:right-10 lg:left-auto z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: 'bottom' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[350px] bg-bg-card border border-white/10 rounded-[32px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.8)] overflow-hidden shadow-accent-purple/20"
          >
            <div className="p-6 bg-accent-purple text-bg-deep font-black flex justify-between items-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
               <div className="relative z-10 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-bg-deep flex items-center justify-center animate-pulse">
                    <Zap className="w-4 h-4 text-accent-purple" />
                 </div>
                 <span className="text-xs uppercase tracking-[0.2em] font-black">AI MUSHIR (المستشار)</span>
               </div>
               <button onClick={() => setIsOpen(false)} className="relative z-10 p-1 hover:bg-bg-deep/10 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-6 bg-gradient-to-b from-bg-card to-bg-main">
               <div className="bg-white/5 p-5 rounded-2xl rounded-tr-none text-[13px] font-bold leading-relaxed border border-white/5 relative">
                  {getSystemStatus()}
                  <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-white/5 border-r border-b border-white/5 rotate-45"></div>
               </div>
               
               <div className="space-y-2">
                  <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest px-2 mb-2">أفعال مقترحة</div>
                  {[
                    { q: 'تحليل أداء الوكالة 📊', action: () => {} },
                    { q: 'أريد إصدار فاتورة لعميل 📝', action: () => (window as any).openModal('invoice') },
                    { q: 'تسجيل مصروف مفاجئ 💸', action: () => (window as any).openModal('expense') },
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => { item.action(); setIsOpen(false); }}
                      className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-2xl text-right text-xs font-bold hover:border-accent-purple/50 hover:bg-accent-purple/5 transition-all flex items-center justify-between group"
                    >
                      <span>{item.q}</span>
                      <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-accent-purple" />
                    </button>
                  ))}
               </div>

               <div className="flex gap-2 p-2 bg-bg-main rounded-2xl border border-white/5">
                  <input className="flex-1 bg-transparent px-3 py-2 text-xs font-bold outline-none placeholder:text-text-muted" placeholder="اسأل أي شيء عن نظامك..." />
                  <button className="p-3 bg-accent-purple rounded-xl text-bg-deep hover:scale-105 active:scale-95 transition-all">
                    <ArrowRightLeft className="w-4 h-4 rotate-180" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all group overflow-hidden relative",
          isOpen ? "bg-bg-card border border-white/10 text-accent-purple rotate-90" : "bg-accent-purple text-bg-deep hover:rotate-12"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Zap className={cn("w-7 h-7 relative z-10 transition-transform", isOpen ? "scale-90" : "group-hover:scale-110")} />
      </button>
    </div>
  );
};

const CountrySelector = ({ selectedCountry, onSelect }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c => 
    c.name.includes(search) || c.code.includes(search)
  );

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-bg-main border border-white/5 p-3 rounded-xl flex items-center justify-between hover:border-white/20 transition-all font-bold text-sm"
      >
        <div className="flex items-center gap-2">
          <span>{selectedCountry?.flag}</span>
          <span>{selectedCountry?.name} (+{selectedCountry?.code})</span>
        </div>
        <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-90" : "")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-3 border-b border-white/5">
              <input 
                autoFocus
                placeholder="ابحث عن دولة..."
                className="w-full bg-bg-main border border-white/5 p-2 rounded-lg text-xs outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {filtered.map((c: any) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onSelect(c); setIsOpen(false); }}
                  className="w-full p-3 text-right text-xs hover:bg-white/5 flex items-center justify-between border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{c.flag}</span>
                    <span className="font-bold">{c.name}</span>
                  </div>
                  <span className="text-text-tertiary font-mono">+{c.code}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InvoiceSelector = ({ invoices, selectedId, onSelect }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = invoices.find((i: any) => i.id === selectedId);

  return (
    <div className="relative">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-bg-main border border-white/5 p-3 rounded-xl flex items-center justify-between hover:border-white/20 transition-all font-bold text-xs"
      >
        <span className={selected ? 'text-text-primary' : 'text-text-tertiary'}>
          {selected ? `فاتورة #${selected.invoiceNumber} - ${selected.clientName}` : 'اختر فاتورة لربط المصروف (اختياري)'}
        </span>
        <ChevronRight className={cn("w-4 h-4 transition-transform", isOpen ? "rotate-90" : "")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
          >
            <button
              type="button"
              onClick={() => { onSelect(''); setIsOpen(false); }}
              className="w-full p-3 text-right text-xs hover:bg-white/5 border-b border-white/5 italic text-text-tertiary"
            >
              بدون ربط
            </button>
            {invoices.filter((i: any) => !i.isDeleted).map((inv: any) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => { onSelect(inv.id); setIsOpen(false); }}
                className="w-full p-3 text-right text-xs hover:bg-white/5 border-b border-white/5 last:border-0"
              >
                <div className="font-black">#{inv.invoiceNumber}</div>
                <div className="text-[10px] text-text-tertiary">{inv.clientName} - {formatCurrency(inv.amount)}</div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Top Bar Component ---
const TopBar = ({ activeSection }: any) => {
  const { invoices, tasks, settings } = useCRM();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    ...invoices.filter(i => !i.isDeleted && i.paymentStatus === 'متأخر').map(i => ({ id: i.id, text: `فاتورة متأخرة: ${i.clientName}`, type: 'invoice' })),
    ...tasks.filter(t => !t.isDeleted && t.status === 'قيد التنفيذ').map(t => ({ id: t.id, text: `مهمة مستحقة: ${t.title}`, type: 'task' })),
  ];

  const paidInvoices = invoices.filter(i => !i.isDeleted && i.paymentStatus === 'مدفوع');
  const totalRevenue = paidInvoices.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="hidden lg:flex items-center justify-between px-10 py-4 bg-bg-deep/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-[40]">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-6">
          <div className="space-y-0.5">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">الإيرادات</div>
            <div className="text-sm font-black text-accent-green font-mono">{formatCurrency(totalRevenue, settings?.currency)}</div>
          </div>
          <div className="w-px h-6 bg-white/5"></div>
          <div className="space-y-0.5">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">المباع اليوم</div>
            <div className="text-sm font-black text-text-primary font-mono">{formatCurrency(totalRevenue / 30, settings?.currency)}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 bg-white/5 border border-white/5 rounded-2xl text-text-secondary hover:text-accent-purple hover:border-accent-purple/30 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full ring-4 ring-bg-card"></span>
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 mt-4 w-80 bg-bg-card border border-white/10 rounded-3xl shadow-2xl overflow-hidden shadow-black/60"
              >
                <div className="p-4 border-b border-white/5 bg-bg-main/50 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">تنبيهات النظام</span>
                  <span className="px-2 py-0.5 bg-accent-red/10 text-accent-red rounded text-[9px] font-black">{notifications.length} جديد</span>
                </div>
                <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                  {notifications.map((n, i) => (
                    <div key={i} className="p-4 hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/5 transition-all group mb-1">
                      <div className="flex gap-4">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.type === 'invoice' ? 'bg-accent-red' : 'bg-accent-amber')}></div>
                        <div>
                          <div className="text-xs font-bold text-text-primary group-hover:text-accent-purple transition-colors">{n.text}</div>
                          <div className="text-[10px] text-text-tertiary mt-1 uppercase font-black tracking-wider">الآن</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-10 text-center text-text-tertiary font-bold italic text-xs">لا توجد إشعارات جديدة</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => (window as any).toggleCommandPalette()}
          className="px-6 py-2.5 bg-accent-purple/10 border border-accent-purple/20 text-accent-purple rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-accent-purple hover:text-bg-deep transition-all shadow-lg shadow-accent-purple/5"
        >
          Quick Search <span className="mr-2 opacity-50">CTRL+K</span>
        </button>
      </div>
    </div>
  );
};
function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [modalType, setModalType] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(COUNTRIES[0]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<any[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const { addClient, clients, invoices, addExpense, addInvoice, settings } = useCRM();

  useEffect(() => {
    (window as any).toggleCommandPalette = () => setIsCommandPaletteOpen(prev => !prev);
  }, []);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    addClient({
      name: formData.get('name') as string,
      service: formData.get('service') as string,
      monthlyPrice: Number(formData.get('price')),
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      country: selectedCountry?.name,
      countryCode: selectedCountry?.code,
      region: formData.get('region') as string,
      classification: formData.get('type') as any || 'عادي',
      paymentStatus: 'معلق',
      startDate: new Date().toISOString().split('T')[0],
    });
    setModalType(null);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard setActiveSection={setActiveSection} />;
      case 'clients': return <ClientsSection />;
      case 'tasks': return <TasksSection />;
      case 'finance': return <FinanceSection />;
      case 'expenses': return <ExpensesSection />;
      case 'accounting': return <AccountingSection />;
      case 'strategy': return <StrategySection />;
      case 'pipeline': return <PipelineSection />;
      case 'executive': return <ExecutiveReportSection />;
      case 'contracts': return <ContractsSection />;
      case 'team': return <TeamSection />;
      case 'settings': return <SettingsSection />;
      case 'trash': return <TrashSection />;
      default: return <Dashboard setActiveSection={setActiveSection} />;
    }
  };

  (window as any).openModal = (type: string) => {
    if (type === 'invoice') {
      setInvoiceItems([{ description: '', quantity: 1, unitPrice: 0 }]);
    }
    setModalType(type);
  };

  return (
    <div className="min-h-screen flex bg-bg-deep font-sans overflow-x-hidden" dir="rtl">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
        setActiveSection={setActiveSection} 
      />

      <main className={cn(
        "flex-1 flex flex-col relative min-h-screen transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1)",
        isCollapsed ? "mr-20" : "mr-72"
      )}>
        <TopBar activeSection={activeSection} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <Modal 
          isOpen={!!modalType} 
          onClose={() => setModalType(null)} 
          title={
            modalType === 'client' ? 'إضافة عميل جديد' : 
            modalType === 'task' ? 'إدارة المهمة' :
            modalType === 'expense' ? 'تسجيل مصروف' :
            modalType === 'goal' ? 'إضافة هدف استراتيجى' :
            modalType === 'contract' ? 'إصدار عقد جديد' :
            modalType === 'lead' ? 'إضافة فرصة بيع' :
            modalType === 'employee' ? 'إضافة عضو فريق' :
            modalType === 'invoice' ? 'إصدار فاتورة جديدة' :
            'نموذج إدخال بيانات'
          }
        >
          {modalType === 'client' && (
            <form onSubmit={handleAddClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">اسم العميل</label>
                  <input name="name" required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="مثال: نور الشمري" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">البريد الإلكتروني</label>
                  <input name="email" type="email" required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="example@mail.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">الدولة (نداء الدولة)</label>
                  <CountrySelector selectedCountry={selectedCountry} onSelect={setSelectedCountry} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">رقم الهاتف</label>
                  <div className="flex gap-2">
                    <div className="bg-bg-main border border-white/5 p-3 rounded-xl min-w-[70px] text-center text-xs font-bold text-accent-purple">
                      +{selectedCountry?.code || '---'}
                    </div>
                    <input name="phone" required className="flex-1 bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="50xxxxxxx" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">منطقة العميل</label>
                  <input name="region" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="مثال: الرياض، حي النخيل" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">الخدمة</label>
                  <input name="service" required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="مثال: إدارة السوشيال ميديا" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">السعر الشهري</label>
                  <input name="price" type="number" required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="1500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">التصنيف</label>
                  <select name="type" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none">
                    <option value="عادي">عادي</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-accent-purple text-bg-deep font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent-purple/10">
                  إضافة العميل للنظام
                </button>
              </div>
            </form>
          )}

          {modalType === 'task' && (
            <form onSubmit={(e) => { e.preventDefault(); setModalType(null); }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-tertiary">عنوان المهمة</label>
                <input required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="مثال: تصميم شعار العميل" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">نوع المهمة</label>
                  <select className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none">
                    <option>يومية</option>
                    <option>أسبوعية</option>
                    <option>شهرية</option>
                    <option>سنوية</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">المسؤول</label>
                  <select className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none">
                    <option>محمد أحمد (مدير)</option>
                    <option>سارة علي (مصمم)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-text-tertiary">الأولوية</label>
                   <select className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none">
                      <option>عادي</option>
                      <option>عاجل</option>
                   </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">تاريخ الاستحقاق</label>
                  <input type="date" required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none" />
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-accent-purple text-bg-deep font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
                  حفظ المهمة
                </button>
              </div>
            </form>
          )}

          {modalType === 'invoice' && (() => {
            const grandTotal = invoiceItems.reduce((sum, item) => sum + (Number(item.unitPrice || 0) * Number(item.quantity || 1)), 0);
            return (
              <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  const formData = new FormData(e.target as HTMLFormElement);
                  const isExternal = formData.get('isExternal') === 'on';
                  const clientName = isExternal ? formData.get('manualClientName') : formData.get('clientName');
                  const client = clients.find(c => c.name === clientName);
                  
                  addInvoice({
                    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                    invoiceCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
                    clientId: client?.id,
                    clientName: clientName as string,
                    clientEmail: client?.email || '',
                    isExternalClient: isExternal,
                    amount: grandTotal,
                    paymentStatus: formData.get('paymentStatus') as any,
                    issueDate: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    items: invoiceItems.map((item, idx) => ({ 
                      ...item, 
                      id: Math.random().toString(36).substr(2, 9),
                      total: Number(item.unitPrice) * Number(item.quantity)
                    })),
                    notes: formData.get('notes') as string,
                  });
                  setModalType(null); 
                }} className="space-y-4">
                 <div className="flex items-center gap-2 mb-4 p-3 bg-accent-purple/5 rounded-xl border border-accent-purple/10">
                    <input type="checkbox" id="isExternal" name="isExternal" className="w-4 h-4 accent-accent-purple" />
                    <label htmlFor="isExternal" className="text-xs font-black text-accent-purple tracking-widest uppercase">عميل خارج القائمة (مخصص)</label>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-text-tertiary">رقم الفاتورة (تلقائي)</label>
                      <input disabled value={`INV-${new Date().getFullYear()}-XXXX`} className="w-full bg-bg-main/50 border border-white/5 p-3 rounded-xl font-mono text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-text-tertiary">العميل</label>
                      <select name="clientName" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none text-xs font-bold">
                         <option value="">اختر عميل...</option>
                         {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-text-tertiary">اسم العميل (للمخصص فقط)</label>
                   <input name="manualClientName" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none text-xs" placeholder="اكتب اسم العميل يدوياً..." />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-text-tertiary">الحالة عند الإنشاء</label>
                   <div className="flex gap-2">
                      {['مدفوع', 'معلق', 'متأخر'].map(s => (
                        <label key={s} className="flex-1 flex items-center justify-center p-3 bg-bg-main border border-white/5 rounded-xl cursor-pointer hover:border-accent-purple transition-all has-[:checked]:bg-accent-purple has-[:checked]:text-bg-deep group">
                          <input type="radio" name="paymentStatus" value={s} defaultChecked={s === 'معلق'} className="hidden" />
                          <span className="text-[10px] font-black uppercase">{s}</span>
                        </label>
                      ))}
                   </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-white/5">
                   <div className="flex items-center justify-between">
                     <label className="text-[10px] font-black uppercase text-text-tertiary tracking-[0.2em]">بنود الفاتورة</label>
                     <button 
                       type="button"
                       onClick={() => setInvoiceItems([...invoiceItems, { description: '', quantity: 1, unitPrice: 0 }])}
                       className="flex items-center gap-2 px-3 py-1.5 bg-accent-purple/10 border border-accent-purple/20 rounded-lg text-accent-purple text-[10px] font-black hover:bg-accent-purple transition-all hover:text-bg-deep group"
                     >
                       <Plus className="w-3 h-3 transition-transform group-hover:rotate-90" />
                       إضافة بند جديد
                     </button>
                   </div>
                   
                   <div className="space-y-3">
                     {invoiceItems.map((item, index) => (
                       <div key={index} className="p-4 bg-bg-main/30 border border-white/5 rounded-2xl space-y-4 relative group">
                         <div className="flex gap-4">
                            <div className="flex-1 space-y-1">
                              <label className="text-[8px] font-black uppercase text-text-tertiary">اسم الخدمة / المنتج</label>
                              <input 
                                required
                                value={item.description}
                                onChange={(e) => {
                                  const newItems = [...invoiceItems];
                                  newItems[index].description = e.target.value;
                                  setInvoiceItems(newItems);
                                }}
                                className="w-full bg-bg-main border border-white/5 p-2.5 rounded-lg outline-none text-xs" 
                                placeholder="مثال: إدارة حملة إعلانية" 
                              />
                            </div>
                            {invoiceItems.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => setInvoiceItems(invoiceItems.filter((_, i) => i !== index))}
                                className="mt-4 p-2 text-text-tertiary hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                         </div>
                         <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-text-tertiary">سعر الوحدة</label>
                              <input 
                                type="number" 
                                value={item.unitPrice}
                                onChange={(e) => {
                                  const newItems = [...invoiceItems];
                                  newItems[index].unitPrice = e.target.value;
                                  setInvoiceItems(newItems);
                                }}
                                className="w-full bg-bg-main border border-white/5 p-2.5 rounded-lg outline-none text-xs font-mono" 
                                placeholder="0.00" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-text-tertiary">الكمية</label>
                              <input 
                                type="number" 
                                value={item.quantity}
                                onChange={(e) => {
                                  const newItems = [...invoiceItems];
                                  newItems[index].quantity = e.target.value;
                                  setInvoiceItems(newItems);
                                }}
                                className="w-full bg-bg-main border border-white/5 p-2.5 rounded-lg outline-none text-xs font-mono" 
                                placeholder="1" 
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-text-tertiary">الإجمالي</label>
                              <div className="w-full bg-bg-main/50 border border-white/5 p-2.5 rounded-lg font-mono text-xs text-accent-green flex items-center justify-center">
                                {formatCurrency(Number(item.unitPrice || 0) * Number(item.quantity || 1), settings?.currency)}
                              </div>
                            </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="p-6 bg-accent-purple/5 border border-accent-purple/10 rounded-2xl flex justify-between items-center">
                    <div className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">إجمالي الفاتورة النهائي</div>
                    <div className="text-2xl font-black text-accent-purple font-mono underline decoration-accent-purple/30 underline-offset-8 italic">
                      {formatCurrency(grandTotal, settings?.currency)}
                    </div>
                 </div>

                 <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-text-tertiary">ملاحظات الفاتورة</label>
                   <textarea name="notes" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none text-xs" rows={2} placeholder="تظهر أسفل الفاتورة..."></textarea>
                 </div>
                 <div className="pt-4">
                   <button type="submit" className="w-full py-4 bg-accent-purple text-bg-deep font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent-purple/20">
                     إصدار الفاتورة 📋
                   </button>
                 </div>
              </form>
            );
          })()}


          {modalType === 'expense' && (
            <form 
              onSubmit={(e) => { 
                e.preventDefault(); 
                const formData = new FormData(e.currentTarget);
                addExpense({
                  description: formData.get('description') as string,
                  category: formData.get('category') as any,
                  amount: Number(formData.get('amount')),
                  date: formData.get('date') as string,
                  paymentMethod: formData.get('paymentMethod') as any,
                  linkedInvoiceId: selectedInvoiceId || undefined
                });
                setModalType(null);
                setSelectedInvoiceId('');
              }} 
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-tertiary">وصف المصروف</label>
                <input name="description" required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none" placeholder="مثال: تجديد اشتراك سيرفر" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">نوع المصروف</label>
                  <select name="category" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none">
                    <option>رواتب</option>
                    <option>تسويق</option>
                    <option>تطوير</option>
                    <option>تقنية</option>
                    <option>اشتراكات</option>
                    <option>رواتب موظفين</option>
                    <option>ضرائب</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">طريقة الدفع</label>
                  <select name="paymentMethod" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none">
                    <option>كاش</option>
                    <option>تحويل بنكي</option>
                    <option>PayPal</option>
                    <option>أخرى</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">المبلغ</label>
                  <input name="amount" type="number" required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">تاريخ الدفع</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary tracking-widest">ربط ذكي بفاتورة عميل (بحث برقم الفاتورة أو الاسم)</label>
                  <InvoiceSelector 
                    selectedId={selectedInvoiceId} 
                    onSelect={setSelectedInvoiceId} 
                    invoices={invoices} 
                  />
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-accent-purple text-bg-deep font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent-purple/10">
                  تأكيد وتسجيل المصروف
                </button>
              </div>
            </form>
          )}

          {modalType === 'lead' && (
            <form onSubmit={(e) => { e.preventDefault(); setModalType(null); }} className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-text-tertiary">الاسم بالكامل</label>
                 <input className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-text-tertiary">رقم الهاتف</label>
                    <input className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-text-tertiary">الميزانية المتوقعة</label>
                    <input type="number" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-text-tertiary">المصدر</label>
                    <select className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none">
                       <option>سوشيال ميديا</option>
                       <option>إعلان ممول</option>
                       <option>توصية</option>
                       <option>موقع إلكتروني</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-text-tertiary">المسؤول</label>
                    <select className="w-full bg-bg-main border border-white/5 p-3 rounded-xl outline-none">
                       <option>فريق المبيعات</option>
                       <option>أدمن</option>
                    </select>
                  </div>
               </div>
               <div className="pt-6">
                 <button type="submit" className="w-full py-4 bg-accent-purple text-bg-deep font-black rounded-xl">
                   حفظ الفرصة
                 </button>
               </div>
            </form>
          )}

          {modalType === 'contract' && (
            <form onSubmit={(e) => { e.preventDefault(); setModalType(null); }} className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-text-tertiary">رقم العقد</label>
                    <input disabled value="CONT-2024-XXX" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl text-xs font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-text-tertiary">العميل</label>
                    <select className="w-full bg-bg-main border border-white/5 p-3 rounded-xl">
                        {clients.map(c => <option key={c.id}>{c.name}</option>)}
                    </select>
                  </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-text-tertiary">الخدمات المتفق عليها</label>
                 <textarea className="w-full bg-bg-main border border-white/5 p-3 rounded-xl text-sm" rows={3}></textarea>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-text-tertiary">تاريخ البدء</label>
                    <input type="date" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-text-tertiary">تاريخ الانتهاء</label>
                    <input type="date" className="w-full bg-bg-main border border-white/5 p-3 rounded-xl" />
                  </div>
               </div>
               <div className="pt-6">
                 <button type="submit" className="w-full py-4 bg-accent-purple text-bg-deep font-black rounded-xl">
                    إنشاء العقد وإرسال للتوقيع 🖊️
                 </button>
               </div>
            </form>
          )}

          {(modalType === 'goal' || modalType === 'employee') && (
            <form onSubmit={(e) => { e.preventDefault(); setModalType(null); }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-text-tertiary">العنوان / الوصف</label>
                <input required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="أدخل التفاصيل هنا..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">التاريخ</label>
                  <input type="date" required className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-text-tertiary">القيمة / الأولوية</label>
                  <input className="w-full bg-bg-main border border-white/5 p-3 rounded-xl focus:border-accent-purple outline-none" placeholder="اختياري" />
                </div>
              </div>
              <div className="pt-6">
                <button type="submit" className="w-full py-4 bg-accent-purple text-bg-deep font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
                  تأكيد الإضافة
                </button>
              </div>
            </form>
          )}
        </Modal>

        <MobileBottomNav activeSection={activeSection} setActiveSection={setActiveSection} />
        <CrmBot />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
}

