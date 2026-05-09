export type PaymentStatus = 'مدفوع' | 'معلق' | 'متأخر';
export type ClientClassification = 'VIP' | 'عادي';
export type TaskPriority = 'عاجل' | 'عادي' | 'منخفض';
export type TaskStatus = 'معلقة' | 'قيد التنفيذ' | 'مكتملة';
export type ContractStatus = 'مسودة' | 'مرسل' | 'موقّع' | 'نشط' | 'منتهي' | 'ملغي';
export type LeadStage = 'استفسار' | 'اجتماع' | 'عرض' | 'تفاوض' | 'مغلق' | 'خسارة';
export type ExpenseCategory = 'رواتب' | 'تسويق' | 'تطوير' | 'تقنية' | 'اشتراكات' | 'رواتب موظفين' | 'ضريبة' | 'ضرائب' | 'متفرقات' | 'أخرى';

export type CompanySector = 'علاقات عامة' | 'تسويق' | 'مقاولات' | 'تطبيقات' | 'مكياج' | 'عطور' | 'أخرى' | 'مخصص';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  country?: string;
  countryCode?: string;
  region?: string;
  monthlyPrice: number;
  paymentStatus: PaymentStatus;
  classification: ClientClassification;
  startDate: string;
  notes?: string;
  avatar?: string;
  isDeleted?: boolean;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceCode: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  isExternalClient?: boolean;
  amount: number;
  paymentStatus: PaymentStatus;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  additionalDescription?: string;
  notes?: string;
  isDeleted?: boolean;
  createdAt: string;
}

export interface Expense {
  id: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: 'نقد' | 'كاش' | 'تحويل بنكي' | 'بايبال' | 'PayPal' | 'أخرى';
  linkedInvoiceId?: string;
  isDeleted?: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  type: 'يومية' | 'شهرية' | 'سنوية' | 'أخرى';
  clientId?: string;
  clientName?: string;
  assigneeId: string;
  assigneeName: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  notes?: string;
  isDeleted?: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  service: string;
  budget: number;
  stage: LeadStage;
  source: string;
  responsible: string;
  notes?: string;
  converted: boolean;
  isDeleted?: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  phase: string;
  progress: number;
  status: string;
  targetDate: string;
  owner: string;
  stages: { id: string, title: string, isCompleted: boolean }[];
  isDeleted?: boolean;
  createdAt: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  idNumber?: string;
  service: string;
  monthlyPrice: number;
  duration: number;
  totalValue: number;
  paymentMethod: string;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  additionalTerms?: string;
  internalNotes?: string;
  companySignedAt?: string;
  clientSignedAt?: string;
  language: 'Arabic' | 'English' | 'Both';
  isDeleted?: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  entityName: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'Employee';
  avatar?: string;
  closedDeals?: number;
  totalSales?: number;
  permissions: {
    [key: string]: {
      canAccess: boolean;
      canViewAll: boolean;
    };
  };
}

export interface OrganizationSettings {
  name: string;
  logo?: string;
  tagline?: string;
  sector: CompanySector | string;
  plan: 'Alpha' | 'Beta' | 'Ultimate' | 'Standard' | 'Pro' | 'Enterprise';
  currency?: string;
  invFrom: string;
  taxNumber?: string;
  invEmail: string;
  invPhone: string;
  invAddress: string;
  descriptionAr?: string;
  descriptionEn?: string;
  serviceDescription?: string;
  legalRepresentative?: string;
  invFooterText: string;
  invDefaultLang: 'Arabic' | 'English';
  emailJsServiceId?: string;
  emailJsTemplateId?: string;
  emailJsPublicKey?: string;
  autoSendInvoice: boolean;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  companyName: string;
}
