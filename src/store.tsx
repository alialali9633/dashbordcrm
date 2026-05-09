import { useState, useEffect, createContext, useContext } from 'react';
import { 
  Client, Invoice, Expense, Task, Lead, Goal, Contract, 
  ActivityLog, TeamMember, OrganizationSettings, UserProfile 
} from './types';

interface CRMData {
  clients: Client[];
  invoices: Invoice[];
  expenses: Expense[];
  tasks: Task[];
  leads: Lead[];
  strategy: Goal[];
  contracts: Contract[];
  logs: ActivityLog[];
  team: TeamMember[];
  settings: OrganizationSettings;
  user: UserProfile;
}

interface CRMContextType {
  clients: Client[];
  invoices: Invoice[];
  expenses: Expense[];
  tasks: Task[];
  leads: Lead[];
  strategy: Goal[];
  contracts: Contract[];
  logs: ActivityLog[];
  team: TeamMember[];
  settings: OrganizationSettings;
  user: UserProfile;
  
  // State Updaters
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  convertLeadToClient: (lead: Lead) => void;

  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  deleteContract: (id: string) => void;
  
  updateSettings: (updates: Partial<OrganizationSettings>) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  
  restoreItem: (id: string, type: string) => void;
  permanentDelete: (id: string, type: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const COUNTRIES = [
  { name: 'السعودية', code: '966', flag: '🇸🇦' },
  { name: 'لبنان', code: '961', flag: '🇱🇧' },
  { name: 'سوريا', code: '963', flag: '🇸🇾' },
  { name: 'الأردن', code: '962', flag: '🇯🇴' },
  { name: 'الإمارات', code: '971', flag: '🇦🇪' },
  { name: 'الكويت', code: '965', flag: '🇰🇼' },
  { name: 'قطر', code: '974', flag: '🇶🇦' },
  { name: 'البحرين', code: '973', flag: '🇧🇭' },
  { name: 'عمان', code: '968', flag: '🇴🇲' },
  { name: 'مصر', code: '20', flag: '🇪🇬' },
  { name: 'العراق', code: '964', flag: '🇮🇶' },
  { name: 'المغرب', code: '212', flag: '🇲🇦' },
  { name: 'تونس', code: '216', flag: '🇹🇳' },
  { name: 'الجزائر', code: '213', flag: '🇩🇿' },
  { name: 'اليمن', code: '967', flag: '🇾🇪' },
  { name: 'فلسطين', code: '970', flag: '🇵🇸' },
  { name: 'السودان', code: '249', flag: '🇸🇩' },
  { name: 'ليبيا', code: '218', flag: '🇱🇾' },
  { name: 'موريتانيا', code: '222', flag: '🇲🇷' },
  { name: 'الصومال', code: '252', flag: '🇸🇴' },
  { name: 'تركيا', code: '90', flag: '🇹🇷' },
  { name: 'فرنسا', code: '33', flag: '🇫🇷' },
  { name: 'بريطانيا', code: '44', flag: '🇬🇧' },
  { name: 'ألمانيا', code: '49', flag: '🇩🇪' },
  { name: 'أمريكا', code: '1', flag: '🇺🇸' },
  { name: 'كندا', code: '1', flag: '🇨🇦' },
];

export const CURRENCIES = [
  { code: 'USD', name: 'دولار أمريكي', symbol: '$' },
  { code: 'SAR', name: 'ريال سعودي', symbol: 'ر.س' },
  { code: 'AED', name: 'درهم إماراتي', symbol: 'د.إ' },
  { code: 'EUR', name: 'يورو', symbol: '€' },
  { code: 'TRY', name: 'ليرة تركية', symbol: '₺' },
  { code: 'IQD', name: 'دينار عراقي', symbol: 'ع.د' },
  { code: 'EGP', name: 'جنيه مصري', symbol: 'ج.م' },
  { code: 'LBP', name: 'ليرة لبنانية', symbol: 'ل.ل' },
  { code: 'SYP', name: 'ليرة سورية', symbol: 'ل.س' },
  { code: 'JOD', name: 'دينار أردني', symbol: 'د.أ' },
  { code: 'KWD', name: 'دينار كويتي', symbol: 'د.ك' },
  { code: 'QAR', name: 'ريال قطري', symbol: 'ر.ق' },
  { code: 'BHD', name: 'دينار بحريني', symbol: 'د.ب' },
  { code: 'OMR', name: 'ريال عماني', symbol: 'ر.ع' },
  { code: 'LYD', name: 'دينار ليبي', symbol: 'د.ل' },
  { code: 'TND', name: 'دينار تونسي', symbol: 'د.ت' },
  { code: 'DZD', name: 'دينار جزائري', symbol: 'د.ج' },
  { code: 'MAD', name: 'درهم مغربي', symbol: 'د.م' },
  { code: 'YER', name: 'ريال يمني', symbol: 'ر.ي' },
  { code: 'SDG', name: 'جنيه سوداني', symbol: 'ج.س' },
];

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CRMData>(() => {
    const defaultData: CRMData = {
      clients: [
        { id: '1', name: 'نور الشمري', phone: '0501234567', email: 'noor@example.com', country: 'السعودية', countryCode: '966', service: 'إدارة السوشيال ميديا', monthlyPrice: 1500, paymentStatus: 'مدفوع', classification: 'VIP', startDate: '2026-04-01', createdAt: new Date().toISOString() },
        { id: '2', name: 'محمد العتيبي', phone: '0507654321', email: 'mohammed@example.com', country: 'السعودية', countryCode: '966', service: 'تصميم جرافيك', monthlyPrice: 800, paymentStatus: 'معلق', classification: 'عادي', startDate: '2026-05-15', createdAt: new Date().toISOString() },
        { id: '3', name: 'سارة الدوسري', phone: '0509998887', email: 'sara@example.com', country: 'الإمارات', countryCode: '971', service: 'إنتاج المحتوى', monthlyPrice: 2000, paymentStatus: 'مدفوع', classification: 'VIP', startDate: '2026-04-20', createdAt: new Date().toISOString() },
        { id: '4', name: 'أحمد الزهراني', phone: '0500001112', email: 'ahmed@example.com', country: 'السعودية', countryCode: '966', service: 'إعلانات Meta', monthlyPrice: 1200, paymentStatus: 'متأخر', classification: 'عادي', startDate: '2026-03-10', createdAt: new Date().toISOString() },
        { id: '5', name: 'فاطمة السالم', phone: '0505554443', email: 'fatima@example.com', country: 'الكويت', countryCode: '965', service: 'SEO & Analytics', monthlyPrice: 950, paymentStatus: 'معلق', classification: 'عادي', startDate: '2026-05-30', createdAt: new Date().toISOString() },
      ],
      invoices: [
        { id: 'inv1', invoiceNumber: 'AEF1FE', invoiceCode: '1', clientId: '1', clientName: 'نور الشمري', clientEmail: 'noor@example.com', amount: 1500, paymentStatus: 'مدفوع', issueDate: '2026-04-01', dueDate: '2026-04-01', items: [{ id: '1', description: 'إدارة السوشيال ميديا - شهر أبريل', unitPrice: 1500, quantity: 1, total: 1500 }], createdAt: new Date().toISOString() },
        { id: 'inv2', invoiceNumber: 'AEF2FE', invoiceCode: '2', clientId: '2', clientName: 'محمد العتيبي', clientEmail: 'mohammed@example.com', amount: 800, paymentStatus: 'معلق', issueDate: '2026-05-01', dueDate: '2026-05-15', items: [{ id: '1', description: 'تصميم جرافيك', unitPrice: 800, quantity: 1, total: 800 }], createdAt: new Date().toISOString() },
        { id: 'inv3', invoiceNumber: 'AEF3FE', invoiceCode: '3', clientId: '3', clientName: 'سارة الدوسري', clientEmail: 'sara@example.com', amount: 2000, paymentStatus: 'مدفوع', issueDate: '2026-04-20', dueDate: '2026-04-20', items: [{ id: '1', description: 'إنتاج المحتوى', unitPrice: 2000, quantity: 1, total: 2000 }], createdAt: new Date().toISOString() },
        { id: 'inv4', invoiceNumber: 'AEF4FE', invoiceCode: '4', clientId: '4', clientName: 'أحمد الزهراني', clientEmail: 'ahmed@example.com', amount: 1200, paymentStatus: 'متأخر', issueDate: '2026-03-01', dueDate: '2026-03-10', items: [{ id: '1', description: 'إعلانات Meta', unitPrice: 1200, quantity: 1, total: 1200 }], createdAt: new Date().toISOString() },
        { id: 'inv5', invoiceNumber: 'AEF5FE', invoiceCode: '5', clientId: '5', clientName: 'فاطمة السالم', clientEmail: 'fatima@example.com', amount: 950, paymentStatus: 'معلق', issueDate: '2026-05-01', dueDate: '2026-05-30', items: [{ id: '1', description: 'SEO & Analytics', unitPrice: 950, quantity: 1, total: 950 }], createdAt: new Date().toISOString() },
      ],
      expenses: [
        { id: 'exp1', description: 'رواتب الفريق', category: 'رواتب', amount: 4500, date: '2026-05-01', paymentMethod: 'تحويل بنكي', createdAt: new Date().toISOString() },
        { id: 'exp2', description: 'استضافة سيرفر', category: 'تقنية', amount: 120, date: '2026-05-03', paymentMethod: 'أخرى', createdAt: new Date().toISOString() },
        { id: 'exp3', description: 'Adobe Creative', category: 'تقنية', amount: 85, date: '2026-05-03', paymentMethod: 'أخرى', createdAt: new Date().toISOString() },
        { id: 'exp4', description: 'إعلانات Meta — نور', category: 'تسويق', amount: 300, date: '2026-05-07', paymentMethod: 'تحويل بنكي', linkedInvoiceId: 'inv1', createdAt: new Date().toISOString() },
      ],
      tasks: [
        { id: 't1', title: 'تسليم تقرير مايو', type: 'شهرية', clientId: '1', clientName: 'نور الشمري', assigneeId: '1', assigneeName: 'مشرف', priority: 'عاجل', status: 'معلقة', dueDate: '2026-05-10', createdAt: new Date().toISOString() },
        { id: 't2', title: 'إعداد كابشنات يونيو', type: 'شهرية', clientId: '3', clientName: 'سارة الدوسري', assigneeId: '1', assigneeName: 'مشرف', priority: 'عادي', status: 'قيد التنفيذ', dueDate: '2026-05-20', createdAt: new Date().toISOString() },
        { id: 't3', title: 'تصميم ريلز × 4', type: 'أخرى', clientId: '2', clientName: 'محمد العتيبي', assigneeId: '1', assigneeName: 'مشرف', priority: 'عاجل', status: 'معلقة', dueDate: '2026-05-08', createdAt: new Date().toISOString() },
        { id: 't4', title: 'مراجعة حملة Meta', type: 'أخرى', clientId: '4', clientName: 'أحمد الزهراني', assigneeId: '1', assigneeName: 'مشرف', priority: 'عادي', status: 'مكتملة', dueDate: '2026-05-01', createdAt: new Date().toISOString() },
      ],
      leads: [
        { id: 'l1', fullName: 'خالد المطيري', phone: '0511111111', service: 'Social Media', budget: 1800, stage: 'استفسار', source: 'Instagram', responsible: 'مشرف', converted: false, createdAt: new Date().toISOString() },
        { id: 'l2', fullName: 'ريم العنزي', phone: '0522222222', service: 'تصميم هوية', budget: 3500, stage: 'اجتماع', source: 'WhatsApp', responsible: 'مشرف', converted: false, createdAt: new Date().toISOString() },
        { id: 'l3', fullName: 'عبدالله الرشيد', phone: '0533333333', service: 'إعلانات Google', budget: 2500, stage: 'عرض', source: 'Google', responsible: 'مشرف', converted: false, createdAt: new Date().toISOString() },
        { id: 'l4', fullName: 'منى الحربي', phone: '0544444444', service: 'إنتاج فيديو', budget: 5000, stage: 'تفاوض', source: 'Twitter', responsible: 'مشرف', converted: false, createdAt: new Date().toISOString() },
        { id: 'l5', fullName: 'يوسف الغامدي', phone: '0555555555', service: 'SEO', budget: 1500, stage: 'مغلق', source: 'Direct', responsible: 'مشرف', converted: false, createdAt: new Date().toISOString() },
        { id: 'l6', fullName: 'هند الزيد', phone: '0566666666', service: 'كتابة محتوى', budget: 800, stage: 'خسارة', source: 'Tiktok', responsible: 'مشرف', converted: false, createdAt: new Date().toISOString() },
      ],
      strategy: [
        { id: 'g1', title: 'تحقيق نمو 25% فصلي', phase: 'تخطيط', progress: 45, status: 'نشط', targetDate: '2026-06-30', owner: 'مشرف', stages: [{ id: 's1', title: 'تحليل الربع الأول', isCompleted: true }, { id: 's2', title: 'خطة التسويق الجديدة', isCompleted: false }], createdAt: new Date().toISOString() }
      ],
      contracts: [],
      logs: [],
      team: [
        { id: '1', fullName: 'علي محمد', email: 'ali@easygrow.com', role: 'Admin', closedDeals: 12, totalSales: 45000, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', permissions: {} },
        { id: '2', fullName: 'نورة السعد', email: 'noora@easygrow.com', role: 'Employee', closedDeals: 8, totalSales: 28000, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', permissions: {} },
        { id: '3', fullName: 'سعد القحطاني', email: 'saad@easygrow.com', role: 'Employee', closedDeals: 15, totalSales: 52000, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', permissions: {} },
      ],
      settings: {
        name: 'EasyGrow Agency',
        sector: 'تسويق',
        plan: 'Alpha',
        currency: 'USD',
        invFrom: 'EasyGrow Agency',
        invEmail: 'billing@easygrow.com',
        invPhone: '+966 50 000 0000',
        invAddress: 'الرياض، المملكة العربية السعودية',
        taxNumber: '',
        descriptionAr: '',
        descriptionEn: '',
        serviceDescription: '',
        legalRepresentative: '',
        invFooterText: 'شكراً لتعاملكم معنا',
        invDefaultLang: 'Arabic',
        autoSendInvoice: false
      },
      user: {
        name: 'محمد العبدالله',
        companyName: 'ايزي غرو'
      }
    };

    const saved = localStorage.getItem('easygrow_crm_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultData,
          ...parsed,
          settings: { ...defaultData.settings, ...(parsed.settings || {}) },
          user: parsed.user || defaultData.user
        };
      } catch (e) {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('easygrow_crm_data', JSON.stringify(data));
  }, [data]);

  const logAction = (action: string, entityType: string, entityName: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      entityType,
      entityName,
      userId: '1',
      userName: 'مشرف',
      createdAt: new Date().toISOString()
    };
    setData((prev: any) => ({ ...prev, logs: [newLog, ...prev.logs].slice(0, 50) }));
  };

  const addItem = (key: string, item: any, entityName: string) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setData((prev: any) => ({ ...prev, [key]: [newItem, ...prev[key]] }));
    logAction('إضافة', key, entityName);
  };

  const updateItem = (key: string, id: string, updates: any, entityName: string) => {
    setData((prev: any) => ({
      ...prev,
      [key]: prev[key].map((i: any) => i.id === id ? { ...i, ...updates } : i)
    }));
    logAction('تعديل', key, entityName);
  };

  const deleteItem = (key: string, id: string, entityName: string) => {
    setData((prev: any) => ({
      ...prev,
      [key]: prev[key].map((i: any) => i.id === id ? { ...i, isDeleted: true } : i)
    }));
    logAction('حذف', key, entityName);
  };

  const restoreItem = (id: string, type: string) => {
    setData((prev: any) => ({
      ...prev,
      [type]: prev[keyMap[type]].map((i: any) => i.id === id ? { ...i, isDeleted: false } : i)
    }));
  };

  const permanentDelete = (id: string, type: string) => {
    setData((prev: any) => ({
      ...prev,
      [type]: prev[keyMap[type]].filter((i: any) => i.id !== id)
    }));
  };

  const keyMap: any = {
    'clients': 'clients',
    'invoices': 'invoices',
    'expenses': 'expenses',
    'tasks': 'tasks',
    'leads': 'leads',
    'strategy': 'strategy',
    'contracts': 'contracts'
  };

  const value: CRMContextType = {
    ...data,
    addClient: (c) => addItem('clients', c, c.name),
    updateClient: (id, u) => updateItem('clients', id, u, u.name || 'عميل'),
    deleteClient: (id) => deleteItem('clients', id, 'عميل'),
    
    addInvoice: (i) => addItem('invoices', i, i.invoiceNumber),
    updateInvoice: (id, u) => updateItem('invoices', id, u, u.invoiceNumber || 'فاتورة'),
    deleteInvoice: (id) => deleteItem('invoices', id, 'فاتورة'),
    
    addExpense: (e) => addItem('expenses', e, e.description),
    updateExpense: (id, u) => updateItem('expenses', id, u, u.description || 'مصروف'),
    deleteExpense: (id) => deleteItem('expenses', id, 'مصروف'),
    
    addTask: (t) => addItem('tasks', t, t.title),
    updateTask: (id, u) => updateItem('tasks', id, u, u.title || 'مهمة'),
    deleteTask: (id) => deleteItem('tasks', id, 'مهمة'),
    
    addLead: (l) => addItem('leads', l, l.fullName),
    updateLead: (id, u) => updateItem('leads', id, u, u.fullName || 'صفقة'),
    deleteLead: (id) => deleteItem('leads', id, 'صفقة'),
    convertLeadToClient: (l) => {
      addItem('clients', {
        name: l.fullName,
        phone: l.phone,
        email: '',
        service: l.service,
        monthlyPrice: l.budget,
        paymentStatus: 'معلق',
        classification: 'عادي',
        startDate: new Date().toISOString().split('T')[0]
      }, l.fullName);
      updateItem('leads', l.id, { converted: true }, l.fullName);
    },

    addGoal: (g) => addItem('strategy', g, g.title),
    updateGoal: (id, u) => updateItem('strategy', id, u, u.title || 'هدف'),
    deleteGoal: (id) => deleteItem('strategy', id, 'هدف'),

    addContract: (c) => addItem('contracts', c, c.contractNumber),
    updateContract: (id, u) => updateItem('contracts', id, u, u.contractNumber || 'عقد'),
    deleteContract: (id) => deleteItem('contracts', id, 'عقد'),
    
    updateSettings: (u) => setData((prev: any) => ({ ...prev, settings: { ...prev.settings, ...u } })),
    updateUser: (u) => setData((prev: any) => ({ ...prev, user: { ...prev.user, ...u } })),
    
    restoreItem: (id, type) => {
      const key = keyMap[type];
      setData((prev: any) => ({
        ...prev,
        [key]: prev[key].map((i: any) => i.id === id ? { ...i, isDeleted: false } : i)
      }));
    },
    permanentDelete: (id, type) => {
      const key = keyMap[type];
      setData((prev: any) => ({
        ...prev,
        [key]: prev[key].filter((i: any) => i.id !== id)
      }));
    }
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within a CRMProvider');
  return context;
}
