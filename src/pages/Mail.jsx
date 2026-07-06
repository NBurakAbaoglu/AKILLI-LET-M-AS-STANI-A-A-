import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Inbox, Send, Trash2, Archive, Search, Menu, LogOut, Plus,
  User, Sparkles, Paperclip, SendHorizontal, MessageSquare, X, 
  Minus, Bot, Cloud, Settings, ArrowLeft, Loader2, Calendar as CalendarIcon, 
  Wand2, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertCircle, 
  Filter, SortDesc, SortAsc, CalendarPlus, Users, MailOpen, Mail as MailIcon, 
  CheckSquare, Square, Reply, Star, MoreVertical, Bell, Moon, Sun,
  Tag, FileText, Image as ImageIcon, Mic, Smile, AtSign,
  Hash, Briefcase, GraduationCap, Wallet, Heart, InboxIcon, Clock3,
  Zap, Shield, Crown, ChevronDown, Pin, Forward, Printer, Download,
  Eye, EyeOff, RefreshCw, Trash, Edit3, Copy, Check, XCircle, MoreHorizontal,
  PenSquare, Clock4, CalendarDays, MailPlus, FileSearch, BellRing,
  BarChart3, PieChart, TrendingUp, Flag, Bookmark, PenTool, Save,
  Command, Keyboard, MoonStar, SunDim, Palette, LayoutGrid, List,
  Maximize2, Minimize2, Volume2, VolumeX, HelpCircle, Info, Sparkle,
  BrainCircuit, ShieldCheck, AlertTriangle, ThumbsUp, ThumbsDown,
  FileUp, ImagePlus, MicOff, Video, Link2, SmilePlus, Sticker,
  AlignLeft, AlignCenter, AlignRight, Type, Heading1, Heading2,
  ListOrdered, ListTodo, Quote, Code, Underline, Bold, Italic,
  Strikethrough, Superscript, Subscript, Highlighter, Eraser,
  Undo2, Redo2, Scissors, ClipboardCopy, ClipboardPaste, ExternalLink,
  Share2, Github, Twitter, Linkedin, Facebook, Instagram, Youtube,
  Chrome, Slack, Trello, Figma, Framer, Dribbble, Twitch, Gamepad2,
  Coffee, Pizza, Beer, Music, Film, BookOpen, ShoppingBag, Plane,
  Car, Home, MapPin, Phone, MailQuestion, MailWarning, MailCheck,
  MailX, Mails, MailSearch, MailMinus, Cog, Server, Lock, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Mail.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import SettingsPage from './SettingsPage';
import DatasetPage from './DatasetPage';
// Chart.js modüllerini kaydet
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, ChartTitle, ChartTooltip, ChartLegend, Filler
);

// Global Chart Ayarları
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.font.family = 'Inter, sans-serif';

// --- TEMA VE SABİTLER ---
// --- TEMA VE SABİTLER ---
const CATEGORIES = [
  { id: 'iş', label: 'İş', icon: Briefcase, color: 'indigo', gradient: 'from-indigo-500 to-blue-600' },
  { id: 'eğitim', label: 'Eğitim', icon: GraduationCap, color: 'violet', gradient: 'from-violet-500 to-purple-600' },
  { id: 'bankacılık', label: 'Bankacılık', icon: Wallet, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'sağlık', label: 'Sağlık', icon: Heart, color: 'rose', gradient: 'from-rose-500 to-pink-600' },
  { id: 'alışveriş', label: 'Alışveriş', icon: ShoppingBag, color: 'amber', gradient: 'from-amber-400 to-orange-500' },
  { id: 'seyahat', label: 'Seyahat', icon: Plane, color: 'sky', gradient: 'from-sky-400 to-blue-500' },
  { id: 'resmi', label: 'Resmi', icon: FileText, color: 'stone', gradient: 'from-slate-500 to-stone-600' },
  { id: 'teknik', label: 'Teknik', icon: Code, color: 'cyan', gradient: 'from-cyan-500 to-blue-600' },
  { id: 'sosyal', label: 'Sosyal', icon: Users, color: 'fuchsia', gradient: 'from-fuchsia-500 to-purple-600' }
];

const EVENT_TYPES = {
  work: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', gradient: 'from-indigo-500 to-blue-600' },
  personal: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', gradient: 'from-emerald-500 to-teal-600' },
  urgent: { color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500', gradient: 'from-rose-500 to-pink-600' }
};

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const TAGS = [
  { id: 'important', label: 'Önemli', color: 'rose', icon: Flag },
  { id: 'todo', label: 'Yapılacak', color: 'amber', icon: ListTodo },
  { id: 'waiting', label: 'Beklemede', color: 'orange', icon: Clock3 },
  { id: 'idea', label: 'Fikir', color: 'cyan', icon: Sparkles },
  { id: 'contract', label: 'Sözleşme', color: 'blue', icon: FileText },
  { id: 'invoice', label: 'Fatura', color: 'emerald', icon: Wallet }
];

// --- YARDIMCI BİLEŞENLER ---

const Avatar = ({ text, color, size = 'md', status, image }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  return (
    <div className="relative group">
      <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-white dark:ring-slate-800 shrink-0 overflow-hidden`}>
        {image ? (
          <img src={image} alt={text} className="w-full h-full object-cover" />
        ) : (
          text
        )}
      </div>
      {status && (
        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${status} border-2 border-white dark:border-slate-800 rounded-full`} />
      )}
      {text === 'AI' && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};

const Badge = ({ children, color = 'indigo', size = 'sm', pulse, className = '', variant = 'default' }) => {
  const variants = {
    default: `bg-${color}-100 text-${color}-700 border-${color}-200 dark:bg-${color}-900/30 dark:text-${color}-300 dark:border-${color}-800`,
    solid: `bg-${color}-500 text-white border-transparent`,
    ghost: `bg-transparent text-${color}-600 border-${color}-200 dark:text-${color}-400`
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${pulse ? 'animate-pulse' : ''} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const IconButton = ({ icon: Icon, onClick, onMouseDown, variant = 'ghost', size = 'md', className = '', tooltip, badge }) => {
  const variants = {
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30',
    danger: 'hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400',
    success: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20'
  };
  
  const sizes = { sm: 'p-1.5', md: 'p-2', lg: 'p-3', xl: 'p-4' };

  return (
    <div className="relative group">
      <button 
        onClick={onClick} 
        onMouseDown={onMouseDown} 
        className={`rounded-xl transition-all duration-200 active:scale-95 ${variants[variant]} ${sizes[size]} ${className}`}
      >
        <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 28} />
        {badge && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700" />
        </div>
      )}
    </div>
  );
};

const Card = ({ children, className = '', hover = false, glass = false, gradient = false }) => (
  <div className={`rounded-2xl border transition-all duration-300 ${
    glass ? 'glass-card border-white/20 dark:border-slate-700/50' : 
    gradient ? 'bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-indigo-200/50 dark:border-indigo-800/30' :
    'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700'
  } shadow-sm ${hover ? 'hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ value, color = 'indigo', size = 'sm' }) => (
  <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2'}`}>
    <div 
      className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full transition-all duration-500`}
      style={{ width: `${value}%` }}
    />
  </div>
);

// --- TOAST ---

const Toast = ({ message, type, onClose, action }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-500 text-white shadow-emerald-500/30',
    error: 'bg-rose-500 text-white shadow-rose-500/30',
    info: 'bg-blue-500 text-white shadow-blue-500/30',
    warning: 'bg-amber-500 text-white shadow-amber-500/30',
    ai: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/30'
  };

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
    ai: Sparkles
  };

  const Icon = icons[type];

  return (
    <div className={`fixed bottom-8 right-8 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] animate-in slide-in-from-right-5 fade-in duration-300 min-w-[300px] ${styles[type]}`}>
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <span className="font-semibold text-sm block">{message}</span>
        {action && (
          <button onClick={action.onClick} className="text-xs underline opacity-90 hover:opacity-100 mt-1">
            {action.label}
          </button>
        )}
      </div>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">
        <X size={18} />
      </button>
    </div>
  );
};

// --- TOOLTIP COMPONENT ---

const Tooltip = ({ children, content, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`absolute ${positions[position]} px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-200`}>
          {content}
          <div className={`absolute w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
            'right-full top-1/2 -translate-y-1/2 -mr-1'
          }`} />
        </div>
      )}
    </div>
  );
};

// --- SIDEBAR ---
const Sidebar = ({ isOpen, currentView, activeFolder, activeCategory, mails, onNavigate, onToggle, onCompose, unreadCount, isDarkMode, toggleTheme, tags, currentUser, categories }) => {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const navigate = useNavigate();

  const getCount = useCallback((folder, category = 'all') => {
    let countList = mails.filter(m => m.folder === folder);
    if (category !== 'all') countList = countList.filter(m => m.category === category);
    return countList.length;
  }, [mails]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const splitName = name.split(" ");
    if (splitName.length > 1) return (splitName[0][0] + splitName[1][0]).toUpperCase();
    return name[0].toUpperCase();
  };

  const isDashboard = currentView === 'dashboard';
  const isDarkTheme = isDashboard || isDarkMode;
  
  const sidebarBg = isDashboard 
    ? "bg-[#0f172a] border-slate-700/50" 
    : (isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white/80 border-slate-200 backdrop-blur-xl");
    
  const bottomProfileBg = isDashboard
    ? "border-slate-700/50 bg-[#0f172a]"
    : (isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-200 bg-slate-50");

  const textColor = isDarkTheme ? "text-white" : "text-slate-800";

  return (
    <div className={`h-screen flex flex-col transition-colors duration-500 ease-out border-r ${isOpen ? 'w-64 lg:w-80' : 'w-20'} relative z-20 ${sidebarBg}`}>
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className={`p-1.5 rounded-lg shrink-0 ${isDarkTheme ? 'bg-transparent' : 'bg-[#0078D4] shadow-lg shadow-blue-500/20'}`}>
          <MailIcon className={isDarkTheme ? "text-[#06b6d4] w-6 h-6" : "text-white w-6 h-6"} strokeWidth={2.5} />
        </div>
        {isOpen && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <h1 className={`text-2xl font-bold tracking-tight ${textColor}`}>AİA</h1>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar mt-2">
        <div className="mb-4 px-1">
          <button onClick={onCompose} className={`w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group ${isOpen ? 'py-3.5 px-6' : 'py-3.5 px-3'}`}>
            <Plus size={22} className={`transition-transform group-hover:rotate-90 ${isOpen ? '' : 'shrink-0'}`} />
            {isOpen && <span>Yeni Mesaj</span>}
          </button>
        </div>
        
        <NavItem icon={InboxIcon} label="Gelen Kutusu" count={getCount('inbox')} badge={unreadCount} isActive={activeFolder === 'inbox' && currentView === 'inbox'} isOpen={isOpen} onClick={() => onNavigate('inbox', 'inbox')} isDarkTheme={isDarkTheme} shortcut="⌘1" />
        
       {activeFolder === 'inbox' && isOpen && currentView === 'inbox' && (
          <div className="ml-4 pl-4 border-l-2 border-slate-100 dark:border-slate-700 space-y-1 my-2 animate-in slide-in-from-left-2">
            <button onClick={() => onNavigate('inbox', 'inbox', 'all')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === 'all' ? (isDarkTheme ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800') : (isDarkTheme ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')}`}>
              <InboxIcon size={16} className="text-slate-500" />
              <span className="flex-1 text-left">Tümü</span>
              <span className="text-xs text-slate-400">{getCount('inbox', 'all')}</span>
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => onNavigate('inbox', 'inbox', cat.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id ? (isDarkTheme ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800') : (isDarkTheme ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50')}`}>
                <cat.icon size={16} className={`text-${cat.color}-500`} />
                <span className="flex-1 text-left">{cat.label}</span>
                <span className="text-xs text-slate-400">{getCount('inbox', cat.id)}</span>
              </button>
            ))}
          </div>
        )}
        <NavItem icon={Star} label="Yıldızlı" count={mails.filter(m => m.isStarred).length} isActive={activeFolder === 'starred'} isOpen={isOpen} onClick={() => onNavigate('inbox', 'starred')} isDarkTheme={isDarkTheme} shortcut="⌘2" />
        <NavItem icon={Send} label="Gönderilenler" count={getCount('sent')} isActive={activeFolder === 'sent'} isOpen={isOpen} onClick={() => onNavigate('inbox', 'sent')} isDarkTheme={isDarkTheme} shortcut="⌘3" />
        <NavItem icon={FileText} label="Taslaklar" count={getCount('drafts')} isActive={activeFolder === 'drafts'} isOpen={isOpen} onClick={() => onNavigate('inbox', 'drafts')} isDarkTheme={isDarkTheme} shortcut="⌘4" />
        <NavItem icon={Archive} label="Arşiv" count={getCount('archive')} isActive={activeFolder === 'archive'} isOpen={isOpen} onClick={() => onNavigate('inbox', 'archive')} isDarkTheme={isDarkTheme} />
        
        {/* Spam Klasörü */}
        <NavItem icon={MailWarning} label="Spam" count={getCount('spam')} isActive={activeFolder === 'spam'} isOpen={isOpen} onClick={() => onNavigate('inbox', 'spam')} isDarkTheme={isDarkTheme} />
        
        <NavItem icon={Trash2} label="Çöp Kutusu" count={getCount('trash')} isActive={activeFolder === 'trash'} isOpen={isOpen} onClick={() => onNavigate('inbox', 'trash')} isDarkTheme={isDarkTheme} />

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50">
          <NavItem icon={CalendarIcon} label="Takvim" isActive={currentView === 'calendar'} isOpen={isOpen} onClick={() => onNavigate('calendar')} isDarkTheme={isDarkTheme} shortcut="⌘T" />
          <NavItem icon={BarChart3} label="İstatistikler" isActive={currentView === 'dashboard'} isOpen={isOpen} onClick={() => onNavigate('dashboard')} isDarkTheme={isDarkTheme} />
          <NavItem icon={Tag} label="Etiketler" isActive={currentView === 'tags'} isOpen={isOpen} onClick={() => onNavigate('tags')} isDarkTheme={isDarkTheme} />
          <NavItem icon={ShieldCheck} label="Güvenlik" isActive={currentView === 'security'} isOpen={isOpen} onClick={() => onNavigate('security')} isDarkTheme={isDarkTheme} />
          <NavItem icon={Database} label="Veri Seti & Model" isActive={currentView === 'dataset'} isOpen={isOpen} onClick={() => onNavigate('dataset')} isDarkTheme={isDarkTheme} />    
        </div>
      </nav>

      <div className={`p-4 border-t ${bottomProfileBg} relative transition-colors duration-500`}>
        <UserMenu 
          isOpen={isUserMenuOpen} 
          onClose={() => setUserMenuOpen(false)} 
          onLogout={handleLogout} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onNavigate={onNavigate} 
        />
        <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="w-full flex items-center gap-3 px-2 rounded-xl transition-all hover:opacity-80">
          {currentUser?.profile_image_url ? (
            <img 
              src={currentUser.profile_image_url} 
              alt={currentUser.full_name} 
              className="h-10 w-10 rounded-full object-cover shrink-0 shadow-lg ring-2 ring-transparent group-hover:ring-[#06b6d4] transition-all"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#06b6d4] to-blue-500 text-white flex items-center justify-center font-bold shrink-0 shadow-lg ring-2 ring-transparent group-hover:ring-[#06b6d4] transition-all">
               {getInitials(currentUser?.full_name)}
            </div>
          )}
          {isOpen && (
            <div className="flex-1 text-left animate-in fade-in overflow-hidden">
              <p className={`text-sm font-bold ${textColor} truncate`}>{currentUser?.full_name}</p>
              {/* Yönetici yerine profil unvanını, yoksa standart bir metin gösteriyoruz */}
              <p className="text-xs text-[#06b6d4] truncate">{currentUser?.title || 'Kullanıcı'}</p>
            </div>
          )}
        </button>
      </div>

      <button onClick={onToggle} className={`absolute -right-3 top-1/2 w-6 h-6 border rounded-full shadow-md flex items-center justify-center transition-colors ${isDarkTheme ? 'bg-slate-800 border-slate-600 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600'}`}>
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
      
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, count, badge, isActive, isOpen, onClick, isDarkTheme, shortcut }) => {
  const activeClass = isDarkTheme 
    ? 'bg-[#06b6d4]/10 text-[#06b6d4] ring-1 ring-[#06b6d4]/20' 
    : 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-700 shadow-sm ring-1 ring-indigo-500/20';
    
  const inactiveClass = isDarkTheme 
    ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' 
    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900';

  return (
    <Tooltip content={!isOpen ? label : ''} position="right">
      <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${isActive ? activeClass : inactiveClass}`}
      >
        <div className={`relative ${isActive ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
          <Icon size={22} />
          {badge > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce shadow-md">
              {badge}
            </span>
          )}
        </div>
        {isOpen && (
          <div className="flex-1 flex items-center justify-between animate-in fade-in duration-200">
            <span className="font-semibold text-sm">{label}</span>
            <div className="flex items-center gap-2">
              {count > 0 && !badge && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDarkTheme ? 'text-slate-400 bg-slate-800/50' : 'text-slate-500 bg-slate-100'}`}>{count}</span>
              )}
              {shortcut && (
                <span className={`text-[10px] font-mono ${isDarkTheme ? 'text-slate-600' : 'text-slate-400'}`}>{shortcut}</span>
              )}
            </div>
          </div>
        )}
      </button>
    </Tooltip>
  );
};

const UserMenu = ({ isOpen, onClose, onLogout, isDarkMode, toggleTheme, onNavigate }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200 z-50">
      <div className="p-2 space-y-1">
        <button onClick={() => { navigate('/profile'); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <User size={16} /> Profilim
        </button>
        {/* AYARLAR BUTONU GÜNCELLENDİ */}
        <button onClick={() => { onNavigate('settings'); onClose(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Settings size={16} /> Ayarlar
        </button>
        <button 
          onClick={() => { toggleTheme(); onClose(); }} 
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          {isDarkMode ? 'Aydınlık Mod' : 'Karanlık Mod'}
        </button>
        <div className="h-px bg-slate-100 dark:bg-slate-700 mx-2" />
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors">
          <LogOut size={16} /> Çıkış Yap
        </button>
      </div>
    </div>
  );
};

const ShortcutsModal = ({ onClose }) => {
  const shortcuts = [
    { key: '⌘ + N', action: 'Yeni Mesaj' },
    { key: '⌘ + Enter', action: 'Gönder' },
    { key: '⌘ + Shift + A', action: 'Tümünü Seç' },
    { key: '⌘ + Shift + I', action: 'Okunmadı Olarak İşaretle' },
    { key: '⌘ + Shift + E', action: 'Arşivle' },
    { key: '⌘ + Shift + #', action: 'Sil' },
    { key: '⌘ + K', action: 'Arama' },
    { key: 'Esc', action: 'Kapat' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Keyboard size={24} className="text-indigo-600" />
            Klavye Kısayolları
          </h3>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <span className="text-slate-600 dark:text-slate-300 text-sm">{s.action}</span>
              <kbd className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{s.key}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAİL LİST ---

const MailList = ({ 
  mails, selectedMail, selectedIds, activeFolder, activeCategory, filterStatus, sortOrder, searchQuery,
  selectedAccount, onAccountChange,
  onSelectMail, onToggleSelect, onSelectAll, onFilterChange, onSortChange, onBulkDelete, onBulkRead, onBulkArchive,
  onDragStart, isDarkMode, onLoadMore, isFetchingMore, hasMore, isLoadingMails ,onToggleStar, onRestore, categories 
}) => {
  const processedMails = useMemo(() => {
    let result = mails.filter(mail => {
      if (activeFolder === 'starred') return mail.isStarred;
      if (activeFolder === 'drafts') return mail.folder === 'drafts';
      return mail.folder === activeFolder;
    });
    
    if (activeFolder === 'inbox' && activeCategory !== 'all') {
      result = result.filter(mail => mail.category === activeCategory);
    }
    
    if (filterStatus === 'unread') result = result.filter(mail => !mail.read);
    else if (filterStatus === 'read') result = result.filter(mail => mail.read);
    else if (filterStatus === 'starred') result = result.filter(mail => mail.isStarred);
    
    if (selectedAccount !== 'all') {
      result = result.filter(mail => mail.receiver === selectedAccount);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(mail => 
        mail.subject.toLowerCase().includes(query) ||
        mail.sender.toLowerCase().includes(query) ||
        mail.content.toLowerCase().includes(query) ||
        mail.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return result.sort((a, b) => sortOrder === 'newest' ? b.fullDate - a.fullDate : a.fullDate - b.fullDate);
  }, [mails, activeFolder, activeCategory, filterStatus, sortOrder, searchQuery, selectedAccount]);

  const allSelected = processedMails.length > 0 && processedMails.every(m => selectedIds.includes(m.id));
  const unreadCount = processedMails.filter(m => !m.read).length;
  
  const handleSelectAllClick = () => {
    if (allSelected) {
      onSelectAll([]); 
    } else {
      onSelectAll(processedMails.map(m => m.id)); 
    }
  };

  const getCategoryStyle = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? `bg-${cat.color}-50 text-${cat.color}-700 border-${cat.color}-200 dark:bg-${cat.color}-900/30 dark:text-${cat.color}-300 dark:border-${cat.color}-800` : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (Math.ceil(scrollTop + clientHeight) >= scrollHeight - 400) {
      if (hasMore && !isFetchingMore) {
        onLoadMore();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50">
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSelectAllClick}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {allSelected ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} />}
            <span>Tümünü Seç</span>
          </button>
          
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                {selectedIds.length} seçildi
              </span>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
              
              <IconButton icon={MailOpen} variant="success" size="sm" onClick={() => onBulkRead(selectedIds, true)} tooltip="Okundu İşaretle" />
              <IconButton icon={MailIcon} variant="ghost" size="sm" onClick={() => onBulkRead(selectedIds, false)} tooltip="Okunmadı İşaretle" />
              
              {/* KLASÖRE GÖRE AKILLI BUTONLAR */}
              {activeFolder !== 'archive' && activeFolder !== 'trash' && activeFolder !== 'spam' && (
   <>
      <IconButton icon={Archive} variant="ghost" size="sm" onClick={() => onBulkArchive(selectedIds)} tooltip="Arşivle" />
      {/* ŞU SATIRI ALTINA YAPIŞTIR: */}
      <IconButton icon={MailWarning} variant="ghost" size="sm" onClick={() => onBulkSpam(selectedIds)} tooltip="Spam'a Taşı" />
   </>
)}
              {/* Arşivde veya Spamda isek Gelen Kutusuna Taşı (Geri Yükle) butonu çıkar */}
              {(activeFolder === 'archive' || activeFolder === 'spam') && (
                <IconButton icon={InboxIcon} variant="ghost" size="sm" onClick={() => onRestore(selectedIds)} tooltip="Gelen Kutusuna Taşı" />
              )}
              {activeFolder === 'trash' && (
                <IconButton icon={RefreshCw} variant="ghost" size="sm" onClick={() => onRestore(selectedIds)} tooltip="Geri Yükle" />
              )}
              
              <IconButton icon={Trash2} variant="danger" size="sm" onClick={() => onBulkDelete(selectedIds)} tooltip={activeFolder === 'trash' ? 'Kalıcı Sil' : 'Sil'} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AccountDropdown mails={mails} value={selectedAccount} onChange={onAccountChange} isDarkMode={isDarkMode} />
              
              <FilterDropdown value={filterStatus} onChange={onFilterChange} isDarkMode={isDarkMode} />
              <SortDropdown value={sortOrder} onChange={onSortChange} isDarkMode={isDarkMode} />
            </div>
          )}
        </div>
        
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {unreadCount > 0 && <span className="font-medium text-indigo-600 dark:text-indigo-400">{unreadCount} okunmamış</span>}
          <span className="mx-2">•</span>
          <span>{processedMails.length} toplam</span>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar"
        onScroll={handleScroll}
      >
        {isLoadingMails ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <MailSkeleton key={`initial-skeleton-${idx}`} isDarkMode={isDarkMode} />
          ))
        ) : processedMails.length === 0 ? (
          <EmptyState icon={Inbox} title="Posta kutusu boş" description={searchQuery ? "Arama kriterlerine uygun e-posta bulunamadı" : "Henüz hiç e-posta yok"} isDarkMode={isDarkMode} />
        ) : (
          processedMails.map((mail, index) => (
            <MailListItem 
              key={mail.id}
              mail={mail}
              isSelected={selectedIds.includes(mail.id)}
              isActive={selectedMail?.id === mail.id}
              categoryStyle={getCategoryStyle(mail.category)}
              onClick={() => onSelectMail(mail)}
              onToggleSelect={(e) => onToggleSelect(e, mail.id)}
              onDragStart={() => onDragStart(mail)}
              index={index}
              isDarkMode={isDarkMode}
              onToggleStar={onToggleStar}
              categories={categories} 
            />
          ))
        )}

        {isFetchingMore && (
          <div className="py-8 flex flex-col items-center justify-center animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="w-12 h-12 bg-white dark:bg-slate-800 shadow-xl rounded-full flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-700/50">
              <Loader2 size={24} className="text-indigo-600 animate-spin" />
            </div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              Eski mailler getiriliyor...
            </p>
          </div>
        )}
        
        {!isFetchingMore && hasMore && processedMails.length > 0 && (
          <div className="flex justify-center py-4">
            <button 
              onClick={onLoadMore}
              className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm"
            >
              Daha Eski Mailleri Getir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SKELETON (İSKELET) BİLEŞENİ ---
const MailSkeleton = ({ isDarkMode }) => (
  <div className={`flex items-start gap-4 p-4 rounded-2xl border backdrop-blur-sm animate-pulse ${
    isDarkMode ? 'border-slate-700/50 bg-slate-800/40' : 'border-slate-200/50 bg-white/40'
  }`}>
    <div className={`mt-1 w-5 h-5 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
    <div className={`w-10 h-10 rounded-2xl shrink-0 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
    <div className="flex-1 min-w-0 space-y-3 py-1">
      <div className="flex items-center justify-between">
        <div className={`h-4 rounded w-1/3 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <div className={`h-3 rounded w-12 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
      </div>
      <div className={`h-4 rounded w-3/4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <div className={`h-3 rounded w-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
      <div className="flex gap-2 mt-3">
        <div className={`h-5 w-16 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
        <div className={`h-5 w-12 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
      </div>
    </div>
  </div>
);

const MailListItem = ({ mail, isSelected, isActive, categoryStyle, onClick, onToggleSelect, onDragStart, index, isDarkMode, categories }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(mail);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      onClick={onClick}
      className={`group relative flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
        isActive ? 'bg-white dark:bg-slate-800 shadow-lg ring-2 ring-indigo-500/20 scale-[1.02]' : 
        isDragging ? 'opacity-50' :
        'bg-white/80 dark:bg-slate-800/80 hover:shadow-md hover:scale-[1.01]'
      } ${!mail.read ? 'border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'} ${
        isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'
      } border backdrop-blur-sm`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div onClick={onToggleSelect} className="mt-1">
        {isSelected ? (
          <CheckSquare size={20} className="text-indigo-600" />
        ) : (
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${mail.read ? 'border-slate-300 dark:border-slate-600' : 'border-indigo-500 bg-indigo-500'}`}>
            {!mail.read && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
        )}
      </div>

      <Avatar text={mail.avatar} color={mail.color.replace('bg-', 'from-').replace('text-', 'to-')} size="sm" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-semibold truncate ${!mail.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
            {mail.sender}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={(e) => onToggleStar(e, mail.id, mail.isStarred)} className="focus:outline-none hover:scale-110 transition-transform">
  <Star size={14} className={mail.isStarred ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600 hover:text-amber-400"} />
</button>
            {mail.priority === 'high' && <AlertTriangle size={14} className="text-rose-500" />}
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{mail.time}</span>
          </div>
        </div>
        
        <h4 className={`font-medium mb-1 truncate ${!mail.read ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
          {mail.subject}
        </h4>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 break-all mb-2">{mail.preview}</p>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge color={categories?.find(c => c.id === mail.category)?.color || 'slate'}>
            {categories?.find(c => c.id === mail.category)?.label || mail.category}
          </Badge>
          
          {mail.tags?.map(tagId => {
            const tag = TAGS.find(t => t.id === tagId);
            if (!tag) return null;
            return (
              <span key={tagId} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-${tag.color}-100 text-${tag.color}-700 dark:bg-${tag.color}-900/30 dark:text-${tag.color}-300`}>
                <tag.icon size={10} />
                {tag.label}
              </span>
            );
          })}
          
          {mail.aiSummary && (
            <Badge color="cyan" pulse>
              <Zap size={10} className="mr-1" /> AI
            </Badge>
          )}
          
          {mail.attachments?.length > 0 && (
            <Badge color="slate" variant="ghost">
              <Paperclip size={10} className="mr-1" /> {mail.attachments.length}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ value, onChange, isDarkMode }) => (
  <div className="relative group">
    <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
      <Filter size={16} />
      <span>{value === 'all' ? 'Tümü' : value === 'unread' ? 'Okunmamış' : value === 'read' ? 'Okunmuş' : 'Yıldızlı'}</span>
    </button>
    <div className={`absolute top-full left-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}>
      {['all', 'unread', 'read', 'starred'].map((status) => (
        <button 
          key={status}
          onClick={() => onChange(status)} 
          className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-xl last:rounded-b-xl text-slate-700 dark:text-slate-300 capitalize"
        >
          {status === 'all' ? 'Tümü' : status === 'unread' ? 'Okunmamış' : status === 'read' ? 'Okunmuş' : 'Yıldızlı'}
        </button>
      ))}
    </div>
  </div>
);

// YENİ: HESAP FİLTRESİ
const AccountDropdown = ({ mails, value, onChange, isDarkMode }) => {
  const uniqueReceivers = useMemo(() => {
    const receivers = new Set();
    mails.forEach(m => {
      if (m.receiver && m.receiver !== 'Bilinmiyor') {
        receivers.add(m.receiver);
      }
    });
    return Array.from(receivers);
  }, [mails]);

  const selectedName = value === 'all' ? 'Tüm Hesaplar' : value;

  return (
    <div className="relative group z-50">
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
        <Cloud size={16} />
        <span className="truncate max-w-[150px]">{selectedName}</span>
        <ChevronDown size={14} className="opacity-50" />
      </button>
      <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
        <button
          onClick={() => onChange('all')}
          className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
        >
          Tüm Hesaplar
        </button>
        {uniqueReceivers.map((emailAddr, idx) => (
          <button
            key={idx}
            onClick={() => onChange(emailAddr)}
            className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors truncate"
            title={emailAddr}
          >
            {emailAddr}
          </button>
        ))}
      </div>
    </div>
  );
};

const SortDropdown = ({ value, onChange, isDarkMode }) => (
  <button 
    onClick={() => onChange(value === 'newest' ? 'oldest' : 'newest')}
    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
  >
    {value === 'newest' ? <SortDesc size={16} /> : <SortAsc size={16} />}
    <span>{value === 'newest' ? 'En Yeni' : 'En Eski'}</span>
  </button>
);

const EmptyState = ({ icon: Icon, title, description, isDarkMode }) => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
    <div className={`w-20 h-20 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} flex items-center justify-center mb-4`}>
      <Icon size={32} className="opacity-50" />
    </div>
    <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-1">{title}</h3>
    <p className="text-sm text-slate-400 dark:text-slate-500">{description}</p>
  </div>
);

// --- MAİL DETAY ---

// 🚀 DİKKAT: Prop'ların sonuna 'onSpam' eklendi!
const MailDetail = ({ mail, onClose, onArchive, onDelete, onToggleStar, onReply, onAIReply, onForward, onEditDraft, onSendDraft, summaryStatus, onSummarize, isDarkMode, onAddTag, onRestore, categories, onChangeCategory, onCreateCategory, onSpam }) => {
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false); // 🚀 YENİ: Spam Menüsü için state
  
  // 1. ÖNCE MAİL KONTROLÜ (Hayat kurtarır - mail null ise burada durur)
  if (!mail) return <EmptyDetail isDarkMode={isDarkMode} />;

  // 🖨️ YENİ: Yazdırma Fonksiyonu
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${mail.subject}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
            .subject { font-size: 24px; font-weight: bold; margin-bottom: 15px; }
            .meta { color: #666; font-size: 14px; margin-bottom: 5px; }
            .content { font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="subject">${mail.subject}</div>
            <div class="meta"><strong>Kimden:</strong> ${mail.sender} &lt;${mail.email}&gt;</div>
            <div class="meta"><strong>Tarih:</strong> ${new Date(mail.fullDate).toLocaleString('tr-TR')}</div>
          </div>
          <div class="content">${mail.content}</div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // 2. SONRA KATEGORİ BULMA
  const currentCat = categories?.find(c => c.id === mail.category) || categories[0];

  // 3. MEDYA ETİKETLERİNİ TEMİZLEME (Gizli sesleri/videoları siler)
  const cleanContent = (mail.content || '')
    .replace(/<audio\b[^>]*>(.*?)<\/audio>/gi, '')
    .replace(/<video\b[^>]*>(.*?)<\/video>/gi, '');

  return (
    <div className="flex flex-col h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      {/* Toolbar */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <IconButton icon={ArrowLeft} onClick={onClose} className="lg:hidden" />
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 lg:hidden" />
          
          {/* KLASÖRE GÖRE AKILLI BUTONLAR */}
          {mail.folder !== 'archive' && mail.folder !== 'trash' && mail.folder !== 'spam' && (
            <IconButton icon={Archive} onClick={onArchive} tooltip="Arşivle" />
          )}
          {(mail.folder === 'archive' || mail.folder === 'spam') && (
            <IconButton icon={InboxIcon} onClick={onRestore} tooltip="Gelen Kutusuna Taşı" />
          )}
          {mail.folder === 'trash' && (
            <IconButton icon={RefreshCw} onClick={onRestore} tooltip="Geri Yükle" />
          )}

          <IconButton icon={Trash2} variant="danger" onClick={onDelete} tooltip={mail.folder === 'trash' ? 'Kalıcı Sil' : 'Sil'} />
          
          {/* 🖨️ YAZDIRMA BUTONU */}
          <IconButton icon={Printer} onClick={handlePrint} tooltip="Yazdır" />
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
          
          <div className="relative">
            <IconButton icon={Tag} onClick={() => setShowTagMenu(!showTagMenu)} tooltip="Etiket Ekle" />
            {showTagMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 animate-in zoom-in-95">
                <div className="p-2">
                  {TAGS.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => { onAddTag(mail.id, tag.id); setShowTagMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                    >
                      <tag.icon size={16} className={`text-${tag.color}-500`} />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{tag.label}</span>
                      {mail.tags?.includes(tag.id) && <Check size={14} className="ml-auto text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 🚨 SPAM / DAHA FAZLA MENÜSÜ */}
          <div className="relative">
            <IconButton icon={MoreVertical} onClick={() => setShowMoreMenu(!showMoreMenu)} tooltip="Daha Fazla" />
            {showMoreMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 animate-in zoom-in-95">
                <div className="p-2">
                  <button
                    onClick={() => { onSpam(); setShowMoreMenu(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 transition-colors text-left"
                  >
                    <MailWarning size={16} />
                    <span className="text-sm font-medium">Spam'a Bildir</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* SAĞ PANEL YILDIZ BUTONU DÜZELTİLDİ */}
          <button 
            onClick={(e) => onToggleStar(e, mail.id, mail.isStarred)}
            className="group relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95"
          >
            <Star 
              size={20} 
              className={`transition-transform ${mail.isStarred ? "text-amber-400 fill-amber-400 scale-110" : "text-slate-500 dark:text-slate-400 group-hover:text-amber-400 group-hover:scale-110"}`} 
            />
            {/* Tooltip (Fareyle üzerine gelince çıkan yazı) */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              Yıldız Ekle/Kaldır
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 dark:border-t-slate-700" />
            </div>
          </button>
          
          <IconButton icon={Flag} tooltip="İşaretle" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto p-8">
          {/* AI Summary Card */}
          <AISummaryCard status={summaryStatus} mail={mail} onSummarize={onSummarize} isDarkMode={isDarkMode} />

          {/* Mail Header */}
          <div className="mt-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight flex-1 mr-4">{mail.subject}</h1>
              {mail.priority === 'high' && (
                <Badge color="rose" variant="solid" className="shrink-0">
                  <AlertTriangle size={12} className="mr-1" /> Yüksek Öncelik
                </Badge>
              )}
            </div>
            
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <Avatar text={mail.avatar} color={mail.color.replace('bg-', 'from-').replace('text-', 'to-')} size="lg" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{mail.sender}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{mail.email}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{mail.time}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(mail.fullDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Kategoriler ve Tags */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              
              {/* YENİ TIKLANABİLİR KATEGORİ MENÜSÜ */}
              <div className="relative z-20">
                <button 
                  onClick={() => setShowCatMenu(!showCatMenu)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border hover:shadow-md transition-all bg-${currentCat?.color}-100 text-${currentCat?.color}-700 border-${currentCat?.color}-200 dark:bg-${currentCat?.color}-900/30 dark:text-${currentCat?.color}-300`}
                >
                  {currentCat?.label || mail.category}
                  <ChevronDown size={14} className="opacity-70" />
                </button>

                {showCatMenu && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 overflow-hidden">
                    <div className="p-2 max-h-48 overflow-y-auto custom-scrollbar">
                      <div className="text-xs font-bold text-slate-400 mb-2 px-2 uppercase tracking-wider">Kategori Değiştir</div>
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { onChangeCategory(mail.id, cat.id); setShowCatMenu(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left group"
                        >
                          <cat.icon size={16} className={`text-${cat.color}-500`} />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">{cat.label}</span>
                          {mail.category === cat.id && <Check size={14} className="text-indigo-600" />}
                        </button>
                      ))}
                    </div>
                    
                    {/* YENİ KATEGORİ EKLEME ALANI */}
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                      {isAddingCat ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            autoFocus
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newCatName.trim()) {
                                const newId = onCreateCategory(newCatName.trim());
                                onChangeCategory(mail.id, newId);
                                setIsAddingCat(false);
                                setShowCatMenu(false);
                                setNewCatName('');
                              }
                            }}
                            placeholder="Kategori Adı..." 
                            className="flex-1 text-sm px-2 py-1 rounded border border-slate-200 dark:border-slate-600 outline-none bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                          />
                          <button onClick={() => setIsAddingCat(false)} className="text-slate-400 hover:text-rose-500"><X size={16}/></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsAddingCat(true)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                          <Plus size={16} /> Yeni Kategori
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Badge color={mail.category === 'business' ? 'indigo' : mail.category === 'finance' ? 'emerald' : 'rose'}>
                {CATEGORIES.find(c => c.id === mail.category)?.label}
              </Badge>
              <Badge color="slate">{mail.aiSentiment}</Badge>
              
              {mail.tags?.map(tagId => {
                const tag = TAGS.find(t => t.id === tagId);
                if (!tag) return null;
                return (
                  <span key={tagId} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-${tag.color}-100 text-${tag.color}-700 dark:bg-${tag.color}-900/30 dark:text-${tag.color}-300`}>
                    <tag.icon size={12} />
                    {tag.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Mail Body */}
          <div className="bg-white text-black p-6 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto mb-8 shadow-inner min-h-[300px]">
            {/* BURAYI DÜZELTTİK: cleanContent KULLANILIYOR */}
            <div 
              dangerouslySetInnerHTML={{ __html: cleanContent }} 
              className="mail-html-content"
            />
          </div>
          {/* Attachments */}
          {mail.attachments && mail.attachments.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-700 pt-6 mb-8">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Ekler ({mail.attachments.length})</p>
              <div className="flex gap-3 flex-wrap">
                {mail.attachments.map((att, idx) => (
                  <AttachmentCard key={idx} {...att} isDarkMode={isDarkMode} />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sticky bottom-6">
            {mail.folder === 'drafts' ? (
              <>
                <button onClick={onEditDraft} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 flex-1 justify-center">
                  <Edit3 size={18} /> Taslağı Düzenle
                </button>
                <button onClick={onSendDraft} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95 flex-1 justify-center">
                  <Send size={18} /> Direkt Gönder
                </button>
              </>
            ) : (
              <>
                <button onClick={onReply} className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-lg shadow-slate-900/20 active:scale-95"><Reply size={18} /> Yanıtla</button>
                <button onClick={onAIReply} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"><Sparkles size={18} /> AI ile Yanıtla</button>
                <button onClick={onForward} className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"><Forward size={18} /> İlet</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const AISummaryCard = ({ status, mail, onSummarize, isDarkMode }) => {
  // Eğer mailin önceden çıkarılmış bir özeti varsa ve şu an yüklenmiyorsa direkt göster!
  if (mail.aiSummary && status !== 'loading') {
    return (
      <div className="w-full bg-gradient-to-br from-indigo-50/50 to-cyan-50/30 dark:from-indigo-900/20 dark:to-cyan-900/10 border border-indigo-200/50 dark:border-indigo-800/50 p-6 rounded-2xl shadow-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white">
            <Zap size={16} />
          </div>
          <span className="font-bold text-indigo-900 dark:text-indigo-300">AI Özeti</span>
          <Badge color="indigo">{mail.aiSentiment || 'Bilgi'}</Badge>
        </div>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{mail.aiSummary}</p>
        
        {mail.actionItems && mail.actionItems.length > 0 && (
          <div className="mb-4 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Aksiyon Maddeleri</p>
            <ul className="space-y-1">
              {mail.actionItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="w-full bg-white dark:bg-slate-800 border border-indigo-200/50 dark:border-indigo-800/50 p-8 rounded-2xl flex flex-col items-center justify-center gap-4 shadow-sm">
        <Loader2 size={32} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
        <p className="font-semibold text-slate-800 dark:text-slate-200">AI Analiz Ediyor...</p>
      </div>
    );
  }

  // Henüz özet yoksa oluşturma butonu göster
  return (
    <button onClick={onSummarize} className="w-full group relative overflow-hidden bg-gradient-to-r from-indigo-50 via-white to-cyan-50 dark:from-indigo-900/20 dark:via-slate-800 dark:to-cyan-900/20 border border-indigo-200/50 dark:border-indigo-800/50 p-6 rounded-2xl hover:shadow-lg transition-all duration-300">
      <div className="relative flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
          <Sparkles size={20} />
        </div>
        <div className="text-left">
          <p className="font-bold text-indigo-900 dark:text-indigo-300">AI Özet Oluştur</p>
          <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70">Yapay zeka ile maili hızlıca analiz edin</p>
        </div>
      </div>
    </button>
  );
};

const AttachmentCard = ({ isDarkMode, ...props }) => { 
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // --- BACKEND VE FRONTEND UYUMU (VERİ EŞLEŞTİRME) ---
  // Backend "filename" gönderir, Frontend "name" gönderir. İkisini de yakalıyoruz:
  const name = props.name || props.filename || 'Bilinmeyen Dosya';
  const content = props.content;
  const contentType = props.contentType || props.mimeType || '';
  
  // Boyut hesaplaması: Backend sayı(byte) gönderirse MB'a çevir, Frontend metin gönderirse direkt al
  let sizeStr = props.size;
  if (typeof props.size === 'number') {
    sizeStr = (props.size / 1024 / 1024).toFixed(2) + ' MB';
  }

  // Dosya tipini belirleme (PDF, Image, Doc)
  let type = props.type;
  if (!type) {
    if (contentType.includes('image/')) type = 'image';
    else if (contentType.includes('pdf') || name.toLowerCase().endsWith('.pdf')) type = 'pdf';
    else if (contentType.includes('zip') || contentType.includes('rar')) type = 'zip';
    else type = 'doc';
  }
  // ----------------------------------------------------

  const icons = { pdf: FileText, image: ImageIcon, doc: FileText, zip: FileUp };
  const Icon = icons[type] || FileText;
  const colors = { pdf: 'text-rose-500', image: 'text-purple-500', doc: 'text-blue-500', zip: 'text-amber-500' };
  
  // RESİM GÖSTERME MANTIĞI
  const imgSrc = content ? `data:${contentType || 'image/png'};base64,${content}` : null;
  
  // PDF GÖSTERME MANTIĞI
  const pdfSrc = content ? `data:application/pdf;base64,${content}` : null;

  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    if (!content) {
      alert("Bu dosyanın içeriği bulunamadı.");
      return;
    }
    
    const link = document.createElement('a');
    link.href = `data:${contentType || 'application/octet-stream'};base64,${content}`;
    link.download = name;
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link);
  };
  
  // Önizleme sadece Resimler ve PDF'ler için aktif
  const isPreviewable = (type === 'image' || type === 'pdf') && content;
  
  return (
    <>
      <div className={`flex items-center gap-3 p-3 w-64 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} rounded-xl border hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all group relative overflow-hidden`}>
        
        {/* Dosya İkonu veya Resim Önizlemesi */}
        <div 
          onClick={() => isPreviewable ? setIsLightboxOpen(true) : null}
          className={`w-12 h-12 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center shrink-0 overflow-hidden ${colors[type]} ${isPreviewable ? 'cursor-pointer hover:opacity-80 group-hover:scale-105 transition-all' : ''}`}
          title={isPreviewable ? "Görüntülemek için tıkla" : ""}
        >
          {type === 'image' && imgSrc ? (
            <img src={imgSrc} alt={name} className="w-full h-full object-cover" />
          ) : (
            <Icon size={24} />
          )}
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} title={name}>{name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{sizeStr}</p>
        </div>

        {/* Sağdaki İndir Butonu */}
        <button onClick={handleDownload} className="absolute right-3 p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors z-10 cursor-pointer group/btn">
          <Download size={16} className="text-slate-400 group-hover/btn:text-indigo-600 dark:group-hover/btn:text-indigo-400" />
        </button>
      </div>

      {/* BÜYÜK RESİM / PDF GÖSTERİCİ (LIGHTBOX / MODAL) */}
      {isLightboxOpen && isPreviewable && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" 
            onClick={() => setIsLightboxOpen(false)} // Boşluğa tıklayınca kapat
        >
          <div className="relative w-full max-w-5xl h-[90vh] flex flex-col items-center animate-in zoom-in-95 duration-300">
            {/* Üst Kısım: Başlık ve Butonlar */}
            <div className="w-full flex justify-between items-center mb-4">
                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg truncate max-w-[70%]">
                  {name}
                </span>
                <div className="flex gap-3">
                    <button onClick={handleDownload} className="p-2.5 bg-white/10 hover:bg-indigo-600 text-white rounded-xl transition-colors backdrop-blur-md shadow-lg" title="Dosyayı İndir">
                        <Download size={20} />
                    </button>
                    <button onClick={() => setIsLightboxOpen(false)} className="p-2.5 bg-white/10 hover:bg-rose-600 text-white rounded-xl transition-colors backdrop-blur-md shadow-lg" title="Kapat">
                        <X size={20} />
                    </button>
                </div>
            </div>
            
            {/* Önizleme Alanı: Resim veya İframe (PDF) */}
            <div 
              className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20 bg-white/5"
              onClick={(e) => e.stopPropagation()} // İçeriğe tıklayınca kapanmasın
            >
              {type === 'image' ? (
                <img 
                  src={imgSrc} 
                  alt={name} 
                  className="max-w-full max-h-full object-contain rounded-2xl" 
                />
              ) : type === 'pdf' ? (
                <iframe 
                  src={pdfSrc} 
                  title={name}
                  className="w-full h-full rounded-2xl bg-white"
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const EmptyDetail = ({ isDarkMode }) => (
  <div className={`hidden lg:flex flex-col items-center justify-center h-full ${isDarkMode ? 'bg-slate-900/30' : 'bg-slate-50/30'}`}>
    <div className={`w-40 h-40 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-gradient-to-br from-slate-100 to-slate-200'} flex items-center justify-center mb-6 relative`}>
      <div className={`w-24 h-24 rounded-2xl ${isDarkMode ? 'bg-slate-700' : 'bg-white'} shadow-xl flex items-center justify-center`}>
        <MailIcon size={40} className="text-slate-300 dark:text-slate-500" />
      </div>
      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg animate-bounce">
        <Sparkles size={20} />
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">E-posta seçin</h3>
    <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">Sol panelden bir e-posta seçerek içeriğini görüntüleyebilirsiniz</p>
  </div>
);

// --- COMPOSE (YENİ MESAJ) BİLEŞENİ ---
const Compose = ({ from, to, subject, body, attachments, isGenerating, onBack, onChange, onSend, onGenerate, onSaveDraft, isDarkMode, signatures, selectedSignature, availableAccounts, showToast }) => {
  const [showAIOptions, setShowAIOptions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [toInput, setToInput] = useState(""); 
  const fileInputRef = useRef(null);
  const editorRef = useRef(null); 

  useEffect(() => {
    if (editorRef.current && body !== editorRef.current.innerHTML) {
      const formattedBody = body.includes('<') ? body : body.replace(/\n/g, '<br/>');
      editorRef.current.innerHTML = formattedBody;
    }
  }, [body]);

  const handleFormat = (e, command, value = null) => {
    e.preventDefault(); 
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange('body', editorRef.current.innerHTML); 
    }
  };

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => {
      const isImage = file.type.startsWith('image/');
      return {
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: isImage ? 'image' : file.type.includes('pdf') ? 'pdf' : 'doc',
        preview: isImage ? URL.createObjectURL(file) : null
      };
    });
    
    onChange('attachments', [...(attachments || []), ...newAttachments]);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index) => {
    const currentAtts = attachments || [];
    const newAtt = [...currentAtts];
    if (newAtt[index].preview) {
       URL.revokeObjectURL(newAtt[index].preview);
    }
    newAtt.splice(index, 1);
    onChange('attachments', newAtt);
  };

  const simulateRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceText = '[Sesli mesaj metne dönüştürüldü: "Toplantı saat 3\'te ofiste olacak, hazırlıklı gelin."]<br/>';
      onChange('body', body + voiceText);
    }, 3000);
  };

  const addEmailPill = () => {
    const val = toInput.trim().replace(',', '');
    
    if (!val) {
      setToInput(''); 
      return;
    }

    if (!val.includes('@') || !val.includes('.')) {
      if (showToast) {
        showToast("Lütfen geçerli bir e-posta adresi girin (@ ve . içermeli)", "warning");
      }
      return; 
    }

    if (Array.isArray(to) && !to.includes(val)) {
      onChange('to', [...to, val]);
    } else if (!Array.isArray(to)) {
      onChange('to', [val]);
    }
    setToInput('');
  };

  const handleToKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault();
      addEmailPill();
    }
  };

  const removeRecipient = (emailToRemove) => {
    if (Array.isArray(to)) onChange('to', to.filter(email => email !== emailToRemove));
  };

  const safeTo = Array.isArray(to) ? to : [];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-4">
          <IconButton icon={ArrowLeft} onClick={onBack} />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Yeni Mesaj</h1>
        </div>
        <div className="flex items-center gap-2">
          <IconButton icon={Save} onClick={onSaveDraft} tooltip="Taslak Kaydet" />
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            onChange={handleFileChange} 
          />
          <IconButton icon={Paperclip} onClick={() => fileInputRef.current?.click()} tooltip="Dosya Ekle" />
          <IconButton icon={ImageIcon} onClick={() => fileInputRef.current?.click()} tooltip="Resim Ekle" />
          <button onClick={onSend} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
            <Send size={18} /> Gönder
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden flex flex-col h-full min-h-[600px]" glass={isDarkMode}>
            
            <div className="p-4 border-b border-slate-100 dark:border-slate-700">
              {availableAccounts && availableAccounts.length > 0 && (
                <div className="flex items-center gap-3 mb-4 border-b border-slate-50 dark:border-slate-700/50 pb-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-16">Kimden</span>
                  <select value={from} onChange={(e) => onChange('from', e.target.value)} className="flex-1 outline-none text-sm font-semibold bg-transparent text-slate-800 dark:text-slate-200 cursor-pointer">
                    {availableAccounts.map((acc, idx) => (<option key={idx} value={acc} className="text-slate-800 dark:text-slate-800">{acc}</option>))}
                  </select>
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-16 mt-2.5">Kime</span>
                <div className="flex-1 flex items-center gap-2 flex-wrap border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-white/50 dark:bg-slate-800/50 focus-within:ring-2 ring-indigo-500/20 transition-all min-h-[46px]">
                  {safeTo.map((email, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium animate-in zoom-in-95 duration-200">
                      {email}
                      <button onClick={() => removeRecipient(email)} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 p-0.5 rounded-md transition-colors text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200"><X size={14} /></button>
                    </span>
                  ))}
                  <input type="text" value={toInput} onChange={e => setToInput(e.target.value)} onKeyDown={handleToKeyDown} onBlur={addEmailPill} placeholder={safeTo.length === 0 ? "Alıcı e-posta adresi yazıp Enter'a basın..." : "Yeni alıcı ekle..."} className="flex-1 min-w-[200px] outline-none text-sm bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 py-1" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-16">Konu</span>
                <input type="text" value={subject} onChange={e => onChange('subject', e.target.value)} placeholder="Mesaj konusu..." className="flex-1 outline-none font-semibold text-slate-800 dark:text-slate-200 bg-transparent placeholder:text-slate-400 py-2" />
              </div>
              
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-16">İmza</span>
                <select value={selectedSignature} onChange={(e) => onChange('signature', e.target.value)} className="flex-1 outline-none text-sm bg-transparent text-slate-600 dark:text-slate-400 cursor-pointer">
                  {signatures.map((sig, idx) => (<option key={idx} value={idx}>{sig.name}</option>))}
                </select>
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center gap-1 flex-wrap sticky top-0 z-10">
              <IconButton icon={Bold} size="sm" tooltip="Kalın" onMouseDown={(e) => handleFormat(e, 'bold')} />
              <IconButton icon={Italic} size="sm" tooltip="İtalik" onMouseDown={(e) => handleFormat(e, 'italic')} />
              <IconButton icon={Underline} size="sm" tooltip="Altı Çizili" onMouseDown={(e) => handleFormat(e, 'underline')} />
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
              <IconButton icon={AlignLeft} size="sm" tooltip="Sola Yasla" onMouseDown={(e) => handleFormat(e, 'justifyLeft')} />
              <IconButton icon={AlignCenter} size="sm" tooltip="Ortala" onMouseDown={(e) => handleFormat(e, 'justifyCenter')} />
              <IconButton icon={AlignRight} size="sm" tooltip="Sağa Yasla" onMouseDown={(e) => handleFormat(e, 'justifyRight')} />
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
              <IconButton icon={ListOrdered} size="sm" tooltip="Numaralı Liste" onMouseDown={(e) => handleFormat(e, 'insertOrderedList')} />
              <IconButton icon={ListTodo} size="sm" tooltip="Madde İşaretli Liste" onMouseDown={(e) => handleFormat(e, 'insertUnorderedList')} />
              <IconButton icon={Quote} size="sm" tooltip="Alıntı" onMouseDown={(e) => handleFormat(e, 'formatBlock', 'BLOCKQUOTE')} />
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1" />
              <IconButton icon={Link2} size="sm" tooltip="Link Ekle" onMouseDown={(e) => {
                e.preventDefault();
                const url = prompt("Bağlantı adresi (URL) girin:");
                if (url) handleFormat(e, 'createLink', url);
              }} />
            </div>

            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50/50 to-cyan-50/30 dark:from-indigo-900/20 dark:to-cyan-900/20 border-b border-indigo-100 dark:border-indigo-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowAIOptions(!showAIOptions)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 rounded-lg text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors shadow-sm">
                  <Sparkles size={16} /> AI Asistan <ChevronDown size={14} className={`transition-transform ${showAIOptions ? 'rotate-180' : ''}`} />
                </button>
                {showAIOptions && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <button onClick={onGenerate} disabled={isGenerating} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm">
                      <Wand2 size={14} /> {isGenerating ? 'Yazıyor...' : 'Taslak Oluştur'}
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <button onClick={simulateRecording} className={`p-2 rounded-lg transition-colors ${isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'hover:text-slate-600 dark:hover:text-slate-300'}`}>
                  {isRecording ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
              </div>
            </div>

            {/* YENİ: ŞIK EKLENTİ (RESİM/DOSYA) KUTULARI */}
           {attachments && attachments.length > 0 && (
              <div className="px-4 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip size={14} className="text-slate-500" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{attachments.length} Eklenen Dosya</span>
                </div>
                <div className="flex gap-4 flex-wrap">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="relative group w-32 rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden bg-white dark:bg-slate-700 shadow-sm hover:shadow-md transition-all">
                      
                      {/* Sağ Üst Silme Butonu */}
                      <button 
                        onClick={() => removeAttachment(idx)} 
                        className="absolute top-1 right-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-rose-500 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 dark:hover:bg-rose-500/20 z-10"
                      >
                        <X size={14} />
                      </button>

                      {/* Önizleme veya İkon */}
                      <div className="h-20 w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-b border-slate-100 dark:border-slate-600 overflow-hidden">
                        {att.type === 'image' && (att.preview || att.content) ? (
  <img src={att.preview || `data:${att.contentType || 'image/png'};base64,${att.content}`} alt={att.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
) : (
                          <div className={`${att.type === 'pdf' ? 'text-rose-500' : 'text-blue-500'}`}>
                            <FileText size={32} />
                          </div>
                        )}
                      </div>
                      
                      {/* Dosya Bilgileri */}
                      <div className="p-2">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate" title={att.name}>{att.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{att.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GERÇEK DİNAMİK EDİTÖR */}
            <div 
              ref={editorRef}
              contentEditable
              data-placeholder="Mesajınızı yazın..."
              onInput={e => onChange('body', e.currentTarget.innerHTML)}
              className="flex-1 w-full min-h-[300px] p-6 outline-none text-slate-800 dark:text-slate-200 leading-relaxed bg-transparent overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none focus:before:hidden mail-html-content"
            />
            
            <div className="px-6 pb-6">
              <div className="border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
                <div className="text-sm text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: signatures[selectedSignature]?.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- CALENDAR ---

const Calendar = ({ 
  currentDate, 
  events, 
  showModal, 
  newEvent,
  emailInput,
  onPrevMonth,
  onNextMonth,
  onOpenModal,
  onCloseModal,
  onEventChange,
  onEmailInputChange,
  onAddEmail,
  onRemoveEmail,
  onSaveEvent,
  isDarkMode,
  availableAccounts 
}) => {
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 animate-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <IconButton icon={ChevronLeft} onClick={onPrevMonth} />
            <IconButton icon={ChevronRight} onClick={onNextMonth} />
          </div>
        </div>
        <button 
          onClick={onOpenModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
        >
          <CalendarPlus size={18} /> Yeni Etkinlik
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 p-6 overflow-auto">
        <Card className="h-full flex flex-col" glass={isDarkMode}>
          {/* Week Days */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
              <div key={day} className="py-4 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="flex-1 grid grid-cols-7 grid-rows-6">
            {Array.from({ length: 42 }, (_, idx) => {
              const dayNum = idx - adjustedFirstDay + 1;
              const day = dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
              
              // 🚀 YENİ: Etkinlikleri sadece gününe göre değil, ayına ve yılına göre de eşleştir!
              const dayEvents = events.filter(e => 
                e.day === day && 
                e.month === currentDate.getMonth() && 
                e.year === currentDate.getFullYear()
              );

              // 👇 İŞTE SİLİNEN VE GERİ EKLENEN KISIM BURASI 👇
              const isToday = day === new Date().getDate() && 
                             currentDate.getMonth() === new Date().getMonth() &&
                             currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={idx}
                  className={`border-b border-r border-slate-100 dark:border-slate-700/50 p-2 relative hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${!day ? 'bg-slate-50/30 dark:bg-slate-800/10' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mb-1 ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-700 dark:text-slate-300'}`}>
                        {day}
                      </div>
                      <div className="space-y-2">
                        {dayEvents.map(event => {
                          return (
                            <div 
                              key={event.id}
                              className={`px-2 py-1.5 rounded-lg text-xs border flex flex-col gap-0.5 transition-all shadow-sm ${event.color}`}
                            >
                              <div className="flex items-center gap-1.5 truncate font-semibold">
                                <Clock3 size={12} className="shrink-0" /> 
                                <span className="truncate">{event.time} - {event.title}</span>
                              </div>
                              <div className="text-[10px] pl-4 font-bold text-slate-500 dark:text-slate-400 opacity-80">
                                 {event.isSent ? "✅ Gönderildi" : "⏳ Bekliyor..."}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Event Modal */}
      {showModal && (
        <EventModal 
          event={newEvent}
          emailInput={emailInput}
          onClose={onCloseModal}
          onChange={onEventChange}
          onEmailChange={onEmailInputChange}
          onAddEmail={onAddEmail}
          onRemoveEmail={onRemoveEmail}
          onSave={onSaveEvent}
          isDarkMode={isDarkMode}
          availableAccounts={availableAccounts}
        />
      )}
    </div>
  );
};

const EventModal = ({ event, emailInput, onClose, onChange, onEmailChange, onAddEmail, onRemoveEmail, onSave, isDarkMode, availableAccounts }) => {
  const fileInputRef = useRef(null);
  return(
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-2xl w-full max-w-2xl m-4 animate-in zoom-in-95 duration-200`}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-t-3xl">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Yeni Etkinlik</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Takvime etkinlik ekleyin ve davetiye gönderin</p>
        </div>
        <IconButton icon={X} onClick={onClose} />
      </div>

      {/* Form */}
      <div className="p-8 space-y-6">
      {availableAccounts && availableAccounts.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Gönderici Hesap</label>
            <div className="relative">
              <Cloud className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                value={event.fromAccount || ''}
                onChange={e => onChange('fromAccount', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-600 transition-all text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
              >
                {availableAccounts.map((acc, idx) => (
                  <option key={idx} value={acc}>{acc}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Etkinlik Başlığı</label>
          <input 
            type="text"
            value={event.title}
            onChange={e => onChange('title', e.target.value)}
            placeholder="Örn: Q4 Strateji Toplantısı"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-600 transition-all text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tarih</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="date"
                value={event.day}
                onChange={e => onChange('day', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-600 transition-all text-slate-800 dark:text-slate-200 [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Saat</label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="time"
                value={event.time}
                onChange={e => onChange('time', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-600 transition-all text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tür</label>
            <div className="relative">
              <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${EVENT_TYPES[event.type].dot}`} />
              <select 
                value={event.type}
                onChange={e => onChange('type', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-600 transition-all appearance-none text-slate-800 dark:text-slate-200"
              >
                <option value="work">İş</option>
                <option value="personal">Kişisel</option>
                <option value="urgent">Acil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invitees */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Katılımcılar</label>
            <Badge color="indigo">{event.invitees.length} kişi</Badge>
          </div>
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email"
                value={emailInput}
                onChange={e => onEmailChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onAddEmail(e)}
                placeholder="E-posta adresi ve Enter..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-600 transition-all text-slate-800 dark:text-slate-200"
              />
            </div>
            <button 
              onClick={onAddEmail}
              className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
            {event.invitees.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {event.invitees.map((email, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg text-sm"
                  >
                    <Avatar text={email.substring(0, 2).toUpperCase()} color="from-indigo-500 to-violet-500" size="sm" />
                    <span className="text-slate-700 dark:text-slate-200">{email}</span>
                    <button 
                      onClick={() => onRemoveEmail(email)}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500">
                <Users size={24} className="mb-2 opacity-50" />
                <span className="text-sm">Henüz katılımcı eklenmedi</span>
              </div>
            )}
          </div>
        </div>
        {/* YENİ: OTOMATİK MAİL İÇERİĞİ VE EKLER */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Otomatik Gönderilecek E-posta İçeriği (İsteğe Bağlı)</label>
            <div>
              <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                const files = Array.from(e.target.files);
                const newAttachments = files.map(file => ({
                  file: file, name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                  type: file.type.startsWith('image/') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'doc'
                }));
                onChange('attachments', [...(event.attachments || []), ...newAttachments]);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }} />
              <button onClick={() => fileInputRef.current?.click()} className="text-xs flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                <Paperclip size={14} /> Dosya Ekle
              </button>
            </div>
          </div>
          
          <textarea
            value={event.body}
            onChange={e => onChange('body', e.target.value)}
            placeholder="Davetlilere etkinlik saati geldiğinde gidecek mesajı buraya yazın..."
            className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-800 dark:text-slate-200 resize-none"
          />

          {event.attachments?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {event.attachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="truncate max-w-[150px] text-slate-700 dark:text-slate-300">{att.name}</span>
                  <button onClick={() => {
                    const newAtt = [...event.attachments];
                    newAtt.splice(idx, 1);
                    onChange('attachments', newAtt);
                  }} className="text-rose-500 hover:text-rose-700"><X size={14}/></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-3xl">
        <button 
          onClick={onClose}
          className="px-6 py-3 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          İptal
        </button>
        <button 
          onClick={onSave}
          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95"
        >
          Etkinliği Kaydet
        </button>
      </div>
    </div>
  </div>
);
};

// --- REACT-CHARTJS-2 ENTEGRELİ, GELİŞMİŞ AI İSTATİSTİK MERKEZİ ---

const Dashboard = ({ mails, onBack, currentUser, availableAccounts }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0, unread: 0, starred: 0, withAI: 0,
    deleted: 0, spam: 0,
    categoryData: []
  });
const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/user/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        // JSON verisini tarayıcıda dosyaya dönüştür
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AIA_Rapor_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Rapor indirilemedi.");
      }
    } catch (error) {
      console.error("İndirme hatası:", error);
    }
  };
const weeklyAttachmentSize = useMemo(() => {
    const birHaftaOnce = new Date();
    birHaftaOnce.setDate(birHaftaOnce.getDate() - 7);

    const totalBytes = mails
      .filter(mail => new Date(mail.date) >= birHaftaOnce)
      .reduce((acc, mail) => {
        const mailAttachmentsSize = mail.attachments?.reduce((sum, att) => sum + (att.size || 0), 0) || 0;
        return acc + mailAttachmentsSize;
      }, 0);

    return (totalBytes / (1024 * 1024)).toFixed(1);
  }, [mails]);
  // Veritabanından İstatistikleri Çek
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();

          // --- EKLENEN YENİ DİNAMİK KATEGORİ MANTIĞI ---
          const catColors = {
            'iş': '#6366f1', 'business': '#6366f1', 'eğitim': '#8b5cf6', 'bankacılık': '#10b981', 
            'sağlık': '#f43f5e', 'alışveriş': '#fbbf24', 'seyahat': '#38bdf8', 
            'resmi': '#78716c', 'teknik': '#06b6d4', 'sosyal': '#d946ef', 'spam': '#f97316'
          };
          
          const catLabels = {
            'iş': 'İş', 'business': 'İş (Gönderilen)', 'eğitim': 'Eğitim', 'bankacılık': 'Bankacılık', 
            'sağlık': 'Sağlık', 'alışveriş': 'Alışveriş', 'seyahat': 'Seyahat', 
            'resmi': 'Resmi', 'teknik': 'Teknik', 'sosyal': 'Sosyal', 'spam': 'Spam'
          };

          // 0 olan (boş) kategorileri gizle, sadece dolu olanları grafikte göster
          let dynamicCategories = Object.keys(data.categories || {}).map(catKey => ({
            id: catKey,
            label: catLabels[catKey] || catKey.charAt(0).toUpperCase() + catKey.slice(1),
            color: catColors[catKey] || '#94a3b8', // Rengi yoksa varsayılan gri
            count: data.categories[catKey]
          })).filter(cat => cat.count > 0);

          // Eğer hiç e-posta yoksa grafik çökmesin diye boş bir halka göster
          if (dynamicCategories.length === 0) {
            dynamicCategories = [{ id: 'none', label: 'Veri Yok', color: '#334155', count: 1 }];
          }
          // ----------------------------------------------

          setStats({
            total: data.total || 0,
            unread: data.unread || 0,
            starred: data.starred || 0,
            withAI: data.withAI || 0,
            deleted: mails.filter(m => m.folder === 'trash').length,
            spam: mails.filter(m => m.spamScore > 0.7 || m.folder === 'spam').length,
            categoryData: dynamicCategories // <-- ARTIK STATİK 3 KATEGORİ YERİNE BURASI ÇALIŞIYOR
          });
        }
      } catch (error) {
        console.error("İstatistikler çekilemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [mails]);

  // --- GRAFİK VERİLERİ VE AYARLARI ---

  const lineChartData = {
    labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
    datasets: [{
      label: 'Gelen',
      data: [12, 28, 15, 35, 22, 5, 8],
      borderColor: '#06b6d4',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
        return gradient;
      },
      borderWidth: 2,
      pointBackgroundColor: '#1e293b',
      pointBorderColor: '#06b6d4',
      fill: true,
      tension: 0.4
    }]
  };

  const lineChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(51, 65, 85, 0.3)', drawBorder: false } },
      x: { grid: { display: false, drawBorder: false } }
    }
  };

  const doughnutData = {
    // 1. İsimleri dinamik olarak stats verisinden alıyoruz
    labels: stats.categoryData.map(c => c.label), 
    datasets: [{
      data: stats.categoryData.map(c => c.count === 0 ? 0.1 : c.count),
      // 2. Renkleri dinamik olarak atadığımız hex kodlarından alıyoruz
      backgroundColor: stats.categoryData.map(c => c.color), 
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const doughnutOptions = {
    responsive: true, 
    maintainAspectRatio: false, 
    cutout: '65%', // Halkanın kalınlığını biraz artırdık (70'den 65'e düşürdük)
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const barData = {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    datasets: [{
      label: 'Mail Hacmi',
      data: [5, 12, 8, 15, 20, 7],
      backgroundColor: '#6366f1',
      borderRadius: 4,
    }]
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false, grid: { display: false } },
      x: { grid: { display: false, drawBorder: false } }
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#0f172a]">
        <Loader2 className="animate-spin text-[#06b6d4] mb-4" size={48} />
        <p className="text-slate-400 font-medium animate-pulse">Analizler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 bg-[#0f172a] text-slate-300 font-sans custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-start">
            <div>
              <h2 className="text-3xl font-bold text-white">Performans & Analiz</h2>
              <p className="text-sm text-slate-400 mt-1">AI destekli e-posta metrikleriniz.</p>
            </div>
          </div>
          
          <button 
            onClick={handleDownloadReport} 
            className="bg-[#06b6d4] hover:bg-cyan-400 text-[#0f172a] font-bold px-4 py-2 rounded-lg transition-colors flex items-center text-sm shadow-lg shadow-cyan-500/20 shrink-0"
          >
            <Download size={16} className="mr-2" /> Raporu İndir
          </button>
        </header>

        {/* 1. DÖRTLÜ ÖZET KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
          <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm font-medium mb-1">Toplam Mail</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <InboxIcon size={24} />
            </div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm font-medium mb-1">AI Tarafından İşlenen</div>
              <div className="text-3xl font-bold text-[#06b6d4]">{stats.withAI} <span className="text-sm font-normal text-slate-500">mail</span></div>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Bot size={24} />
            </div>
          </div>

          <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/50 shadow-lg flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm font-medium mb-1">Ort. Yanıt Süresi</div>
              <div className="text-3xl font-bold text-white">1.2 <span className="text-sm font-normal text-slate-500">Saat</span></div>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
              <Clock size={24} />
            </div>
          </div>

          {/* İstatistik Kartı: Ek Boyutu */}
<div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-3xl backdrop-blur-xl hover:bg-slate-800/60 transition-all group">
  <div className="flex items-center justify-between mb-4">
    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
      <Paperclip size={24} />
    </div>
    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
      <TrendingUp size={12} />
      <span>Gerçek Zamanlı</span>
    </div>
  </div>
  <div>
    <p className="text-slate-400 text-sm font-medium">Ek Boyutu (Haftalık)</p>
    <div className="flex items-baseline gap-2 mt-1">
      {/* 🚀 ARTIK BURASI DİNAMİK */}
      <h3 className="text-3xl font-bold text-white tracking-tight">
        {weeklyAttachmentSize}
      </h3>
      <span className="text-slate-500 font-semibold text-lg">MB</span>
    </div>
  </div>
  
  {/* Küçük bir ilerleme çubuğu ekleyerek doluluk oranını hissettirelim (Opsiyonel) */}
  <div className="mt-4 h-1.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
    <div 
      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
      style={{ width: `${Math.min((weeklyAttachmentSize / 500) * 100, 100)}%` }} // 500MB'a göre oranlar
    />
  </div>
</div>
        </div>

        {/* 2. GRAFİKLER (TRAFİK VE KATEGORİ) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 w-full">
          
          <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700/50 shadow-lg lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <TrendingUp size={18} className="mr-2 text-slate-400" /> Haftalık Trafik
            </h3>
            <div className="relative h-64 w-full">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700/50 shadow-lg lg:col-span-1">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <PieChart size={18} className="mr-2 text-slate-400" /> Kategoriler
            </h3>
            
            <div className="flex flex-col items-center">
              {/* Grafik Alanı (Biraz daha büyük) */}
              <div className="relative h-56 w-full flex justify-center mb-6">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              
              {/* Şık ve Düzenli Kategori Listesi (Grid) */}
              <div className="w-full grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {stats.categoryData
                  .sort((a, b) => b.count - a.count) // En çok mail olan en üstte çıksın
                  .map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                        style={{ backgroundColor: cat.color }} 
                      />
                      <span className="text-xs text-slate-300 truncate" title={cat.label}>
                        {cat.label === 'Other' ? 'Diğer' : cat.label}
                      </span>
                    </div>
                    <span className="text-sm font-bold ml-2" style={{ color: cat.color }}>
                      {cat.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 3. ÇUBUK GRAFİK VE DURUM ÖZETİ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8 w-full">
            
            <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Clock3 size={18} className="mr-2 text-slate-400" /> Gün İçi Yoğunluk
              </h3>
              <div className="relative h-52 w-full">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700/50 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Filter size={18} className="mr-2 text-slate-400" /> Durum Özeti
              </h3>
              
              <div className="space-y-4">
                <StatusRow icon={MailOpen} title="Okunmayan" value={stats.unread} colorClass="text-[#06b6d4]" bgClass="bg-[#06b6d4]/10" />
                <StatusRow icon={Star} title="Önemli" value={stats.starred} colorClass="text-yellow-500" bgClass="bg-yellow-500/10" />
                <StatusRow icon={Bot} title="AI Analizi" value={stats.withAI} colorClass="text-purple-400" bgClass="bg-purple-500/10" />
                <StatusRow icon={Trash2} title="Silinen" value={stats.deleted} colorClass="text-red-400" bgClass="bg-red-500/10" />
                <StatusRow icon={ShieldCheck} title="Spam / Engel" value={stats.spam} colorClass="text-orange-400" bgClass="bg-orange-500/10" />
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};
// --- GÜVENLİK VE GİZLİLİK SAYFASI (STATİK KURUMSAL SÜRÜM) ---
const SecurityPage = ({ isDarkMode }) => {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      color: 'emerald',
      title: 'OAuth 2.0 Doğrulama Altyapısı',
      desc: 'Sistemimiz, kullanıcıların e-posta şifrelerini KESİNLİKLE veritabanında saklamaz veya işlemez. Google ve Yandex servis sağlayıcılarının resmi endüstri standardı olan OAuth 2.0 güvenli protokolü kullanılarak, sadece geçici ve sınırlandırılmış bir erişim anahtarı (Access Token) vasıtasıyla bağlantı kurulur.'
    },
    {
      icon: EyeOff,
      color: 'indigo',
      title: 'Yapay Zeka Gizlilik Politikası',
      desc: 'E-postalarınız yapay zeka (Groq / Gemini) tarafından işlenirken, metinler sadece anlık özetleme ve sınıflandırma analizi için tampon bellek üzerinde tutulur. Bu veriler üçüncü taraf büyük dil modellerinin (LLM) eğitimi veya kayıt havuzları için KESİNLİKLE depolanmaz (Zero-Data Retention).'
    },
    {
      icon: Lock,
      color: 'violet',
      title: 'Asimetrik & Kriptografik Şifreleme',
      desc: 'Sistem altyapısındaki tüm kullanıcı parolaları, en güvenli hashing standartlarından biri olan tek yönlü Bcrypt algoritması ile şifrelenerek PostgreSQL üzerinde saklanır. Ayrıca, istemci tarayıcı ile backend sunucusu arasındaki tüm veri trafiği uçtan uca TLS 1.3 / SSL tünelleme katmanıyla koruma altındadır.'
    },
    {
      icon: Server,
      color: 'cyan',
      title: 'İzole Veri ve PostgreSQL Mimarisi',
      desc: 'Her kullanıcının e-posta içeriği, ek dosyaları ve takvim etkinlikleri ilişkisel veritabanımızda birbirini görmeyecek şekilde katı Row-Level (Satır Bazlı) izolasyon kurallarına tabi tutulmuştur. Yetkisiz hiçbir session veya sorgu, bir başka kullanıcının veri sınırlarına erişemez.'
    }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-5xl mx-auto">
        
        {/* Üst Kısım / Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12 mt-8">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
            <ShieldCheck size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">
            Güvenlik & Gizlilik Standartları
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
            AİA Akıllı İletişim Asistanı, e-posta trafiğinizi ve kurumsal takviminizi yönetirken en üst düzey güvenlik protokollerini benimser. Veri gizliliğinizi nasıl koruduğumuzu aşağıdan inceleyebilirsiniz.
          </p>
        </div>

        {/* Güvenlik Maddeleri Grid Düzeni */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {securityFeatures.map((feature, idx) => (
            <Card key={idx} className="p-6 text-left" hover glass={isDarkMode}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 flex items-center justify-center shrink-0`}>
                  <feature.icon size={24} className={`text-${feature.color}-500`} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* KVKK / GDPR Kurumsal Uyum Alt Başlığı */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8 md:p-10 overflow-hidden shadow-xl relative border border-slate-700/40 text-left">
          <div className="absolute -bottom-10 -right-10 p-16 opacity-5 pointer-events-none">
            <Shield size={240} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">KVKK ve GDPR Mevzuat Uyumluluğu</h2>
              <p className="text-slate-400 max-w-2xl text-xs leading-relaxed">
                Uygulamamız, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) gereksinimlerine tam uyumlu olarak kodlanmıştır. Kullanıcı, dilediği an veritabanımızda bağlı olan hesaplarını kalıcı olarak sistemden kaldırma, e-posta eşitleme geçmişini tamamen silme ve kendi verileri üzerinde mutlak kontrol hakkına sahiptir.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
// Durum Özeti için Alt Bileşen (Lucide İkonları ile Uyumlulaştırıldı)
function StatusRow({ icon: Icon, title, value, colorClass, bgClass }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:bg-slate-700/40 transition-colors">
      <div className="flex items-center">
        <div className={`h-10 w-10 rounded-lg ${bgClass} flex items-center justify-center ${colorClass} mr-4`}>
          <Icon size={18} />
        </div>
        <span className="text-slate-200 font-medium">{title}</span>
      </div>
      <span className="text-white font-bold text-xl">{value}</span>
    </div>
  );
}
// --- CHATBOT ---

const Chatbot = ({ isOpen, messages, input, onToggle, onSend, onInputChange, isDarkMode }) => {
  const chatEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Mesaj geldiğinde daktilo efektini kapat ve aşağı kaydır
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0 && messages[messages.length - 1].sender === 'bot') {
      setIsTyping(false);
    }
  }, [messages, isTyping]);

  const handleSend = (e, optionText = null) => {
    if (e) e.preventDefault();
    const textToSend = optionText || input.trim();
    if (!textToSend) return;
    
    onSend(textToSend);
    setIsTyping(true); // Bekleme animasyonunu başlat
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className={`mb-4 w-96 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300`}>
          {/* Header */}
          <div className="h-16 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
                <Bot size={22} />
              </div>
              <div>
                <p className="font-bold text-white">AİA Asistan</p>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Çevrimiçi Rehber
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconButton icon={X} onClick={() => onToggle(false)} variant="ghost" className="text-white/80 hover:text-white hover:bg-white/20" />
            </div>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={msg.id} className="flex flex-col">
                <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                      : `${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-white text-slate-700'} border border-slate-200 dark:border-slate-600 rounded-tl-none shadow-sm`
                  }`}>
                    {msg.text}
                  </div>
                </div>
                
                {/* 🚀 DİNAMİK SEÇENEK BUTONLARI (Sadece en son bot mesajında görünür) */}
                {msg.options && msg.options.length > 0 && msg.sender === 'bot' && idx === messages.length - 1 && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-start pl-2">
                    {msg.options.map((opt, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSend(null, opt)}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all hover:scale-105 active:scale-95 shadow-sm ${
                          isDarkMode 
                            ? 'bg-slate-800 text-indigo-400 border-indigo-500/30 hover:bg-slate-700 hover:border-indigo-400' 
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Yazıyor Animasyonu */}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`p-4 rounded-2xl rounded-tl-none ${isDarkMode ? 'bg-slate-700' : 'bg-white'} border border-slate-200 dark:border-slate-600 shadow-sm`}>
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" />
                    <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={(e) => handleSend(e)} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={input}
                onChange={e => onInputChange(e.target.value)}
                placeholder="Asistana yaz veya üstten seç..."
                className="w-full pl-4 pr-12 py-3.5 bg-slate-100 dark:bg-slate-700 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-600 transition-all outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <SendHorizontal size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => onToggle(!isOpen)}
        className={`w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 dark:bg-slate-700 rotate-90' : 'bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
        )}
      </button>
    </div>
  );
};

// --- ANA BİLEŞEN ---

const Mail = () => {
  const [toast, setToast] = useState(null);



  // TOAST YARDIMCISINI BURAYA TAŞIDIK!

  const showToast = useCallback((message, type = 'success', action = null) => {

    setToast({ message, type, action });

    setTimeout(() => setToast(null), 4000);

  }, []);
  
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState({
    full_name: 'Kullanıcı Yükleniyor...',
    email: '...',
    profile_image_url: null
  });

  // YENİ EKLENEN KISIM: Sayfa açıldığında LocalStorage'dan bilgileri al
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Eğer token yoksa (giriş yapılmamışsa) login sayfasına at
    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [navigate]);
  // ==========================================================
  // GERÇEK ZAMANLI (REAL-TIME) YENİ MAİL KONTROLÜ
  // ==========================================================
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const checkForNewMails = async () => {
      try {
        // Arka planda sessizce 1. sayfayı (en yeni 10 maili) kontrol et
        const response = await fetch(`http://localhost:5000/api/get-emails?page=1&limit=10&folder=${activeFolder}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) return;
        
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          setMails(prevMails => {
            // Gelen 10 mailden, şu an bizim ekranımızda OLMAYANLARI (yeni gelenleri) bul
            const existingIds = new Set(prevMails.map(m => m.id));
            const newMails = result.data.filter(m => !existingIds.has(m.id));
            
            // Eğer yeni mail varsa
            if (newMails.length > 0) {
              console.log(`🚀 ${newMails.length} adet yeni e-posta anında yakalandı!`);
              
              // Yeni mailleri listenin EN ÜSTÜNE yerleştir, eskileri aşağı kaydır
              return [...newMails, ...prevMails];
            }
            
            // Yeni mail yoksa listeyi hiç elleme (Ekran titremesin)
            return prevMails;
          });
        }
      } catch (error) {
        // Arka planda anlık internet kopması vs. olursa kullanıcıya çaktırma, sessizce yut
      }
    };

    // Bu kontrolü her 30 saniyede bir otomatik yap!
    const intervalId = setInterval(checkForNewMails, 10000); // 10 saniye (10000 milisaniye)
    
    // Kullanıcı başka sayfaya geçerse zamanlayıcıyı durdur (Performans için)
    return () => clearInterval(intervalId);
  }, []);
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // View State
  const [currentView, setCurrentView] = useState('inbox');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  // Data State
  const [mails, setMails] = useState([]);
  const [isLoadingMails, setIsLoadingMails] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const fetchEmails = useCallback(async (pageNum = 1, currentFolder = 'all') => {
    if (pageNum === 1) setIsLoadingMails(true);
    else setIsFetchingMore(true);

    try {
      const token = localStorage.getItem('token');
      // YENİ: URL'e klasör (folder) bilgisini ekledik
      const response = await fetch(`http://localhost:5000/api/get-emails?page=${pageNum}&limit=30&folder=${currentFolder}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const formattedData = result.data.map(mail => ({
          ...mail,
          fullDate: new Date(mail.fullDate)
        }));

        setMails(prev => {
          if (pageNum === 1) return formattedData; // YENİ: Klasör değişince listeyi temizle ve yenilerini koy
          
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewData = formattedData.filter(mail => !existingIds.has(mail.id));
          return [...prev, ...uniqueNewData];
        });
        setHasMore(result.hasMore);
      }
    } catch (error) {
      console.error("API'ye bağlanırken hata oluştu:", error);
    } finally {
      setIsLoadingMails(false);
      setIsFetchingMore(false);
    }
  }, []);
  // Sayfa değiştiğinde mailleri tekrar çek
  useEffect(() => {
    fetchEmails(page, activeFolder);
  }, [page, activeFolder, fetchEmails]);
  
const fetchEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Backend'den gelen formatı frontend'in anlayacağı şekle çeviriyoruz
        const formattedEvents = data.map(ev => {
          const dateObj = new Date(ev.event_date);
          return {
            id: ev.event_id,
            day: dateObj.getDate(),
            month: dateObj.getMonth(),
            year: dateObj.getFullYear(),
            title: ev.title,
            time: dateObj.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'}),
            type: ev.event_type,
            color: EVENT_TYPES[ev.event_type]?.color || EVENT_TYPES.work.color,
            isSent: ev.is_sent,
            status: ev.status // 🚀 İŞTE EKLENMESİ GEREKEN SATIR BURASI!
          };
        });
        setEvents(formattedEvents);
      }
    } catch(e) {}
  }, []);

  // Sayfa yüklendiğinde etkinlikleri çek VE her 15 saniyede bir güncelle (Gerçek zamanlı "Gönderildi" yeşil olması için)
  useEffect(() => {
    fetchEvents();
    
    // Arka planda sessizce takvimi yenileyen zamanlayıcı
    const intervalId = setInterval(() => {
      fetchEvents();
    }, 15000); 
    
    return () => clearInterval(intervalId);
  }, [fetchEvents]);
  
  const [selectedMail, setSelectedMail] = useState(null);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const [summaryStatus, setSummaryStatus] = useState('idle');
  
// --- DİNAMİK KATEGORİ STATE'İ ---
 const [customCategories, setCustomCategories] = useState(() => {
  const saved = localStorage.getItem('customCategories');
  // LocalStorage'dan çekerken ikonları (Bookmark) geri ekliyoruz
  return saved ? JSON.parse(saved).map(c => ({...c, icon: Bookmark})) : [];
 });

 const allCategories = useMemo(() => [...CATEGORIES, ...customCategories], [customCategories]);

 // Yeni Kategori Oluşturma
 const handleCreateCategory = useCallback((name) => {
  const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const newCat = {
   id: newId,
   label: name,
   icon: Bookmark, // Yeni kategorilerin varsayılan ikonu
   color: 'blue',
   gradient: 'from-blue-500 to-cyan-600'
  };
  const updated = [...customCategories, newCat];
  setCustomCategories(updated);
  // İkon fonksiyonunu çıkarıp string olarak kaydediyoruz
  localStorage.setItem('customCategories', JSON.stringify(updated.map(c => ({...c, icon: null}))));
  showToast(`"${name}" kategorisi oluşturuldu`, "success");
  return newId;
 }, [customCategories, showToast]);

 // Mailin Kategorisini Değiştirme
 const handleChangeCategory = useCallback(async (mailId, newCategoryId) => {
  // 1. Ekranı anında güncelle
  setMails(prev => prev.map(m => m.id === mailId ? { ...m, category: newCategoryId } : m));
  if (selectedMail?.id === mailId) {
   setSelectedMail(prev => ({ ...prev, category: newCategoryId }));
  }
  showToast("Kategori güncellendi.");

  // 2. Backend'e kaydet
  try {
   await fetch('http://localhost:5000/api/update-email-category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify({
    sender_name: selectedMail.sender,
    subject: selectedMail.subject,
    email_text: cleanText
})
   });
  } catch(e) {}
 }, [selectedMail, showToast]);
  // Compose state
  const [composeState, setComposeState] = useState({ from: '', to: [], subject: '', body: '', signature: 0, attachments: [], draftId: null, draftUid: null });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [signatures, setSignatures] = useState([
    { name: 'Varsayılan', content: 'Saygılarımla,\nKullanıcı\nAİA Mail Kullanıcısı' },
    { name: 'İş', content: 'Saygılarımla,\nKullanıcı\nPozisyon | Şirket\nTel: +90 555 123 4567' },
    { name: 'Kişisel', content: 'Sevgiler,\nKullanıcı' }
  ]);
  const myAvailableAccounts = useMemo(() => {
    const receivers = new Set();
    mails.forEach(m => {
      if (m.receiver && m.receiver !== 'Bilinmiyor') {
        receivers.add(m.receiver);
      }
    });
    return Array.from(receivers);
  }, [mails]);
const handleEditDraft = useCallback(() => {
    if (!selectedMail) return;
    
    // Bilinmiyor hatasını engeller
    let fromAccount = selectedMail.receiver;
    if (!fromAccount || fromAccount === 'Bilinmiyor') {
      fromAccount = myAvailableAccounts.length > 0 ? myAvailableAccounts[0] : '';
    }

    // Geçersiz veya boş e-posta atamasını engeller
    let parsedTo = [];
    if (selectedMail.email && selectedMail.email !== 'bilinmiyor@mail.com') {
      parsedTo = selectedMail.email.split(',').map(e => e.trim()).filter(e => e !== '');
    }

    setComposeState({
      from: fromAccount,
      to: parsedTo,
      subject: selectedMail.subject !== '(Konu Yok)' ? selectedMail.subject : '',
      body: selectedMail.content,
      signature: 0,
      attachments: selectedMail.attachments || [], // EKLERİ GETİRİR
      draftId: selectedMail.id, // SİLMEK İÇİN LAZIM
      draftUid: selectedMail.imap_uid // SİLMEK İÇİN LAZIM
    });
    setCurrentView('compose');
  }, [selectedMail, myAvailableAccounts]);

// --- TASLAĞI DİREKT GÖNDER FONKSİYONU ---
  const handleSendDraftDirectly = useCallback(async () => {
    if (!selectedMail) return;
    
    const parsedTo = selectedMail.email && selectedMail.email !== 'bilinmiyor@mail.com' 
      ? selectedMail.email 
      : '';

    // Eğer taslakta kime gideceği yazmıyorsa uyar:
    if (!parsedTo) {
      showToast("Lütfen taslağı düzenleyip bir 'Kime' (alıcı) adresi ekleyin!", "error");
      return;
    }

    showToast("Taslak gönderiliyor...", "info");

    try {
      const response = await fetch('http://localhost:5000/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          from: selectedMail.receiver || myAvailableAccounts[0] || '',
          to: parsedTo,
          subject: selectedMail.subject !== '(Konu Yok)' ? selectedMail.subject : '',
          body: selectedMail.content,
          attachments: selectedMail.attachments || [], // Ekleri de gönderir
          draftId: selectedMail.id,       // GÖNDERİLİNCE SİLİNMESİ İÇİN
          draftUid: selectedMail.imap_uid // GMAIL'DEN SİLİNMESİ İÇİN
        })
      });

      if (response.ok) {
        showToast("Taslak başarıyla gönderildi! 🚀", 'success');
        setSelectedMail(null); // Okuma ekranını kapat
        fetchEmails(1); // Listeyi yenile, taslak kaybolsun
      } else {
        showToast("Gönderim başarısız oldu", "error");
      }
    } catch (err) {
      showToast("Sunucu bağlantı hatası", "error");
    }
  }, [selectedMail, myAvailableAccounts, showToast, fetchEmails]);


  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [newEvent, setNewEvent] = useState({ 
    title: '', day: '', time: '', type: 'work', invitees: [], 
    body: '', attachments: [], fromAccount: '' 
  });
  const [events, setEvents] = useState([
    { id: 1, day: 5, title: "Q4 Planlama", time: "14:00", type: "work", color: EVENT_TYPES.work.color },
    { id: 2, day: 12, title: "Doktor", time: "09:30", type: "personal", color: EVENT_TYPES.personal.color },
    { id: 3, day: 23, title: "Proje Teslim", time: "23:59", type: "urgent", color: EVENT_TYPES.urgent.color }
  ]);
  const alertedEvents = useRef(new Set());

  useEffect(() => {
    // 1. Tarayıcıdan İşletim Sistemi Bildirimi izni iste
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

   const checkAlarms = () => {
      const now = new Date();
      
      events.forEach(ev => {
        if (!ev.time) return;
        const [hours, minutes] = ev.time.split(':');
        const eventDate = new Date(ev.year, ev.month, ev.day, hours, minutes);
        
        const diffMs = eventDate.getTime() - now.getTime();
        
        // DÜZELTME: 1 dakika yerine 15 dakikalık (-900000 ms) bir telafi penceresi verdik.
        // Böylece tarayıcı sekmeyi uyutsa bile, uyandığında saati geçmiş etkinlikleri yakalar.
        if (diffMs <= 0 && diffMs > -900000 && !alertedEvents.current.has(ev.id)) {
          alertedEvents.current.add(ev.id);
          
          showToast(`⏰ "${ev.title}" saati geldi!`, 'info');
          
          if (Notification.permission === 'granted') {
             new Notification('AİA Asistan Hatırlatması', { 
               body: `${ev.title} saati geldi!`,
               icon: 'https://cdn-icons-png.flaticon.com/512/3652/3652191.png'
             });
          }
        }
      });
    };

    // Her 10 saniyede bir saat kontrolü yap
    const alarmInterval = setInterval(checkAlarms, 10000);
    return () => clearInterval(alarmInterval);
  }, [events, showToast]);

  // Chatbot state
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
 const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'Merhaba! Ben AİA Asistan. Size bu sistemi nasıl kullanacağınız konusunda veya e-postalarınızla ilgili yardımcı olabilirim. Ne yapmak istersiniz?',
      options: ['Sistem nasıl kullanılır?', 'Nasıl mail atarım?', 'Takvim nasıl çalışıyor?']
    }
  ]);

  // Drag and drop state
  const [draggedMail, setDraggedMail] = useState(null);

  // Toast helper


  // Theme toggle
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark');
  }, []);

  

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey) {
        switch(e.key.toLowerCase()) {
          case 'n':
            e.preventDefault();
            handleCompose();
            break;
          case 'k':
            e.preventDefault();
            document.querySelector('input[type="text"]')?.focus();
            break;
          case 'enter':
            if (currentView === 'compose') {
              e.preventDefault();
              handleSendMail();
            }
            break;
        }
      }
      if (e.key === 'Escape') {
        if (currentView === 'compose') setCurrentView('inbox');
        if (selectedMail) setSelectedMail(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, selectedMail]);

  // Navigation
  const handleNavigate = useCallback((view, folder = null, category = 'all') => {
    setCurrentView(view);
    if (folder) {
      setActiveFolder(folder);
      setPage(1); 
    }
    setActiveCategory(category); // ARTıK KATEGORİ SEÇİLMEZSE OTOMATİK "TÜMÜ" OLACAK
    setSelectedMail(null);
    setSelectedMailIds([]);
    setSearchQuery('');
  }, []);

 const handleCompose = useCallback(() => {
    setCurrentView('compose');
    setComposeState({ from: myAvailableAccounts[0] || '', to: [], subject: '', body: '', signature: 0, attachments: [], draftId: null, draftUid: null }); 
    setSelectedMailIds([]);
  }, [myAvailableAccounts]);

 const handleSelectMail = useCallback((mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      // 1. Ekranı anında okundu yap
      setMails(prev => prev.map(m => m.id === mail.id ? { ...m, read: true } : m));
      
      // 2. BACKEND'E HABER VER (Gmail ve DB'de kalıcı yap)
      fetch('http://localhost:5000/api/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ emailIds: [mail.id], isRead: true })
      }).catch(err => console.error("Kalıcı okundu işlemi başarısız:", err));
    }
  }, []);

  const toggleSelectMail = useCallback((e, mailId) => {
    e.stopPropagation();
    setSelectedMailIds(prev => 
      prev.includes(mailId) ? prev.filter(id => id !== mailId) : [...prev, mailId]
    );
  }, []);

  const handleSelectAll = useCallback((ids) => {
    setSelectedMailIds(ids);
  }, []);

  // --- GERÇEK SİLME, ÇÖPE TAŞIMA VE GERİ YÜKLEME ---
  const handleBulkDelete = useCallback(async (ids) => {
    if (ids.length === 0) return;

    const action = activeFolder === 'trash' ? 'delete' : 'trash';

    setMails(prev => 
      action === 'delete' 
        ? prev.filter(m => !ids.includes(m.id)) 
        : prev.map(m => ids.includes(m.id) ? { ...m, folder: 'trash' } : m)
    );
    
    setSelectedMailIds([]);
    if (selectedMail && ids.includes(selectedMail.id)) setSelectedMail(null);
    showToast(action === 'delete' ? "Mailler kalıcı olarak silindi" : `${ids.length} mail çöp kutusuna taşındı`, 'success');

    try {
      await fetch('http://localhost:5000/api/delete-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ emailIds: ids, action: action, sourceFolder: activeFolder }) // YENİ
      });
    } catch (err) {}
  }, [activeFolder, selectedMail, showToast]);

  

  const handleBulkRead = useCallback((ids, status) => {
    if (ids.length === 0) return;
    
    // 1. Ekranı güncelle
    setMails(prev => prev.map(m => ids.includes(m.id) ? { ...m, read: status } : m));
    setSelectedMailIds([]);
    showToast(`${ids.length} mail ${status ? 'okundu' : 'okunmadı'} olarak işaretlendi`, 'success');
    
    // 2. BACKEND'E HABER VER (Toplu işlem)
    fetch('http://localhost:5000/api/mark-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ emailIds: ids, isRead: status })
    }).catch(err => console.error("Toplu okundu işlemi başarısız:", err));
  }, [showToast]);

  const handleBulkArchive = useCallback(async (ids) => {
    if (ids.length === 0) return;
    
    // 1. Ekranı anında güncelle (Kullanıcı beklemesin)
    setMails(prev => prev.map(m => ids.includes(m.id) ? { ...m, folder: 'archive' } : m));
    setSelectedMailIds([]);
    showToast(`${ids.length} mail arşivlendi`, 'success');

    // 2. EKSİK OLAN KISIM: Backend'e Haber Ver!
    try {
      await fetch('http://localhost:5000/api/delete-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ emailIds: ids, action: 'archive', sourceFolder: activeFolder })
      });
    } catch (err) {
      console.error("Toplu arşivleme hatası:", err);
    }
  }, [activeFolder, showToast]);

const handleArchive = useCallback(async (idsToArchive) => {
    // Array gelmezse Array'e çevir (Tekil tıklamalar için)
    const ids = Array.isArray(idsToArchive) ? idsToArchive : [idsToArchive];
    if (ids.length === 0) return;

    // 1. Ekrandan anında Arşiv klasörüne taşı (Süper Hızlı UX)
    setMails(prev => prev.map(m => ids.includes(m.id) ? { ...m, folder: 'archive' } : m));
    
    setSelectedMailIds([]);
    if (selectedMail && ids.includes(selectedMail.id)) setSelectedMail(null);
    showToast(`${ids.length} mail arşivlendi`, 'success');

    // 2. Backend'e emri gönder (Yandex'te Arşiv klasörü oluşturup oraya taşıyacak)
    try {
      await fetch('http://localhost:5000/api/delete-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        // Action olarak 'archive' gönderiyoruz!
        body: JSON.stringify({ emailIds: ids, action: 'archive', sourceFolder: activeFolder })
      });
    } catch (err) {
      console.error("Arşivleme hatası:", err);
    }
  }, [activeFolder, selectedMail, showToast]);

  const handleSpam = useCallback(async (idsToSpam) => {
    const ids = Array.isArray(idsToSpam) ? idsToSpam : [idsToSpam];
    if (ids.length === 0) return;

    // 1. Ekrandan anında kaybet ve Spam'a yolla
    setMails(prev => prev.map(m => ids.includes(m.id) ? { ...m, folder: 'spam' } : m));
    setSelectedMailIds([]);
    if (selectedMail && ids.includes(selectedMail.id)) setSelectedMail(null);
    showToast(`${ids.length} mail Spam kutusuna taşındı`, 'success');

    // 2. Backend'e gönder (Gerçek Yandex/Gmail hesabında taşıyacak)
    try {
      await fetch('http://localhost:5000/api/mark-as-spam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ emailIds: ids })
      });
    } catch (err) {
      console.error("Spam taşıma hatası:", err);
    }
  }, [selectedMail, showToast]);

  const handleDelete = useCallback(async () => {
    if (!selectedMail) return;
    
    const targetId = selectedMail.id;
    const action = activeFolder === 'trash' ? 'delete' : 'trash';

    setMails(prev => 
      action === 'delete' 
        ? prev.filter(m => m.id !== targetId) 
        : prev.map(m => m.id === targetId ? { ...m, folder: 'trash' } : m)
    );
    
    setSelectedMail(null);
    showToast(action === 'delete' ? "Mail kalıcı olarak silindi" : "Mail çöp kutusuna taşındı", 'success');

    try {
      await fetch('http://localhost:5000/api/delete-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ emailIds: [targetId], action: action, sourceFolder: activeFolder }) // YENİ
      });
    } catch (err) {}
  }, [selectedMail, activeFolder, showToast]);

  // YENİ EKLENEN FONKSİYON: GERİ YÜKLE
  const handleRestore = useCallback(async (idsToRestore) => {
    const ids = Array.isArray(idsToRestore) ? idsToRestore : [idsToRestore];
    if (ids.length === 0) return;

    setMails(prev => prev.map(m => ids.includes(m.id) ? { ...m, folder: 'inbox' } : m));
    setSelectedMailIds([]);
    if (selectedMail && ids.includes(selectedMail.id)) setSelectedMail(null);
    showToast("Mail(ler) Gelen Kutusuna geri taşındı", 'success');

    try {
      await fetch('http://localhost:5000/api/delete-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ emailIds: ids, action: 'restore', sourceFolder: activeFolder })
      });
    } catch (err) {}
  }, [activeFolder, selectedMail, showToast]);

  const handleToggleStar = useCallback((e, mailId, currentStatus) => {
    if (e && e.stopPropagation) e.stopPropagation(); // Satıra tıklamayı engeller
    
    const targetId = mailId || selectedMail?.id;
    if (!targetId) return;

    const status = currentStatus !== undefined ? currentStatus : selectedMail?.isStarred;
    const newStatus = !status;

    // 1. Ekranı anında güncelle
    setMails(prev => prev.map(m => m.id === targetId ? { ...m, isStarred: newStatus } : m));
    
    if (selectedMail && selectedMail.id === targetId) {
      setSelectedMail(prev => ({ ...prev, isStarred: newStatus }));
    }

    // 2. Backend'e haber ver (Kalıcı kaydet)
    fetch('http://localhost:5000/api/toggle-star', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ emailId: targetId, isStarred: newStatus })
    }).catch(err => console.error("Yıldız durumu güncellenemedi:", err));

    showToast(newStatus ? "Yıldızlılara eklendi" : "Yıldız kaldırıldı", 'success');
  }, [selectedMail, showToast]);

  const handleAddTag = useCallback((mailId, tagId) => {
    setMails(prev => prev.map(m => {
      if (m.id !== mailId) return m;
      const tags = m.tags || [];
      if (tags.includes(tagId)) {
        return { ...m, tags: tags.filter(t => t !== tagId) };
      }
      return { ...m, tags: [...tags, tagId] };
    }));
    showToast("Etiket güncellendi", 'success');
  }, [showToast]);


 // Drag and drop
  const handleDragStart = useCallback((mail) => {
    setDraggedMail(mail);
  }, []);

  const handleDrop = useCallback(async (targetFolder) => {
    if (!draggedMail) return;
    
    const mailId = draggedMail.id;
    
    // 1. Ekrandan anında taşı
    setMails(prev => prev.map(m => m.id === mailId ? { ...m, folder: targetFolder } : m));
    setDraggedMail(null);
    showToast(`Mail ${targetFolder === 'trash' ? 'çöp kutusuna' : 'arşive'} taşındı`, 'success');

    // 2. EKSİK OLAN KISIM: Backend'e Haber Ver!
    try {
      await fetch('http://localhost:5000/api/delete-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ 
          emailIds: [mailId], 
          action: targetFolder === 'trash' ? 'trash' : 'archive', 
          sourceFolder: activeFolder 
        })
      });
    } catch (err) {
      console.error("Sürükle bırak taşıma hatası:", err);
    }
  }, [draggedMail, activeFolder, showToast]);
  // AI Summary
  useEffect(() => { setSummaryStatus('idle'); }, [selectedMail]);
  
  const handleSummarize = useCallback(async () => {
    if (!selectedMail) return;
    
    setSummaryStatus('loading');
    
    try {
      const response = await fetch('http://localhost:5000/api/summarize-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ emailId: selectedMail.id, text: selectedMail.content })
      });

      if (response.ok) {
        const data = await response.json();
        // Ekranda açık olan maili ve listeyi yeni özet bilgisiyle güncelle
        setMails(prev => prev.map(m => m.id === selectedMail.id ? { ...m, aiSummary: data.summary, aiSentiment: data.sentiment, actionItems: data.actionItems } : m));
        setSelectedMail(prev => ({ ...prev, aiSummary: data.summary, aiSentiment: data.sentiment, actionItems: data.actionItems }));
        setSummaryStatus('done');
        showToast('AI Özeti başarıyla oluşturuldu!', 'success');
      } else {
        throw new Error('Yanıt alınamadı');
      }
    } catch (error) {
      setSummaryStatus('idle');
      showToast('Özet oluşturulurken bir hata oluştu.', 'error');
    }
  }, [selectedMail, showToast]);

  // Compose operations
  const handleComposeChange = useCallback((field, value) => {
    setComposeState(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAIGenerate = useCallback(async () => {
    // 1. Konu girilmemişse uyar
    if (!composeState.subject) return showToast("Lütfen önce bir konu girin, AI ne yazacağını bilsin!", "error");
    
    setIsGeneratingAI(true);
    setComposeState(prev => ({ ...prev, body: "<i>✨ AI harika bir taslak hazırlıyor... Lütfen bekleyin...</i>" }));

    try {
      // 2. Python'a (Groq'a) konuyu gönder
      const response = await fetch('http://127.0.0.1:5001/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: composeState.subject })
      });

      if (response.ok) {
        const data = await response.json();
        // 3. Gelen mükemmel taslağı editöre bas
        setComposeState(prev => ({ 
          ...prev, 
          body: data.draft 
        }));
        showToast("AI konuya uygun taslağı oluşturdu! 🚀", 'success');
      } else {
        throw new Error("Sunucu yanıt vermedi");
      }
    } catch (error) {
      console.error("Taslak Oluşturma Hatası:", error);
      showToast("AI taslak oluşturamadı.", "error");
      setComposeState(prev => ({ ...prev, body: "" }));
    } finally {
      setIsGeneratingAI(false);
    }
  }, [composeState.subject, showToast]);

 const handleSendMail = useCallback(async () => {
    if (composeState.to.length === 0 || !composeState.subject) {
      return showToast("Lütfen en az bir alıcı ve konu girin", "error");
    }
    
    showToast("E-posta gönderiliyor...", "info"); 

    // Eklentileri Base64'e Çevir
    const parsedAttachments = await Promise.all((composeState.attachments || []).map(async (att) => {
      if (!att.file) return null;
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(att.file);
      });
      return { filename: att.name, content: base64, encoding: 'base64', contentType: att.file.type, size: att.size };
    }));
    const validAttachments = parsedAttachments.filter(a => a !== null);

    const signatureHtml = `<br><br><div style="color: #666; font-size: 14px;">${signatures[composeState.signature].content.replace(/\n/g, '<br/>')}</div>`;
    const fullContent = composeState.body + signatureHtml;

    try {
      const response = await fetch('http://localhost:5000/api/send-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          from: composeState.from,
          to: composeState.to.join(', '),
          subject: composeState.subject,
          body: fullContent,
          attachments: validAttachments, // DOSYALAR GİDİYOR!
          draftId: composeState.draftId,   // <-- YENİ
          draftUid: composeState.draftUid
        })
      });

      if (response.ok) {
        showToast("E-posta başarıyla gönderildi! 🚀", 'success');
        setCurrentView('inbox');
        setComposeState({ from: '', to: [], subject: '', body: '', signature: 0, attachments: [] });
        fetchEmails(1); 
      } else {
        showToast("Gönderim başarısız oldu", "error");
      }
    } catch (err) {
      showToast("Sunucu bağlantı hatası", "error");
    }
  }, [composeState, signatures, showToast, fetchEmails]);

  // --- TASLAK KAYDETME VE GÜNCELLEME FONKSİYONU ---
  const handleSaveDraft = useCallback(async () => {
    if (!composeState.subject && !composeState.body && composeState.to.length === 0 && (!composeState.attachments || composeState.attachments.length === 0)) return;
    
    showToast("Taslak kaydediliyor...", "info");

    const parsedAttachments = await Promise.all((composeState.attachments || []).map(async (att) => {
      if (att.content && !att.file) return { filename: att.name, content: att.content, encoding: 'base64', contentType: att.contentType, size: att.size };
      if (!att.file) return null;
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(att.file);
      });
      return { filename: att.name, content: base64, encoding: 'base64', contentType: att.file.type, size: att.size };
    }));
    const validAttachments = parsedAttachments.filter(a => a !== null);

    try {
      const response = await fetch('http://localhost:5000/api/save-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          from: composeState.from, 
          to: composeState.to.join(', '),
          subject: composeState.subject,
          body: composeState.body,
          attachments: validAttachments,
          draftId: composeState.draftId,   
          draftUid: composeState.draftUid  
        })
      });

      if (response.ok) {
        showToast("Taslak kaydedildi 📝", 'success');
        fetchEmails(1); 
      }
    } catch (err) {}
  }, [composeState, showToast, fetchEmails]);
  // Yanıtla ve İlet HTML Formatına Güncellendi
const handleReply = useCallback(() => {
    if (!selectedMail) return;
    setComposeState({
      from: selectedMail.receiver || myAvailableAccounts[0] || '', 
      to: [selectedMail.email], 
      subject: `Re: ${selectedMail.subject}`,
      body: `<br><br><hr/><b>Orijinal Mesaj:</b><br/>Kimden: ${selectedMail.sender}<br/>Konu: ${selectedMail.subject}<br/>Tarih: ${new Date(selectedMail.fullDate).toLocaleString('tr-TR')}<br/><br/>${selectedMail.content}`,
      signature: 0,
      attachments: [], // SAĞLAMA ALINDI
      draftId: null,
      draftUid: null
    });
    setCurrentView('compose');
  }, [selectedMail, myAvailableAccounts]);

  const handleAIReply = useCallback(async () => {
    if (!selectedMail) return;
    
    // 1. Önce ekranı aç ve "Yükleniyor" durumunu göster
    setComposeState({
      from: selectedMail.receiver || myAvailableAccounts[0] || '',
      to: [selectedMail.email], 
      subject: `Re: ${selectedMail.subject}`,
      body: "<i>✨ AI e-postayı analiz edip size özel bir yanıt hazırlıyor... Lütfen bekleyin...</i>",
      signature: 0,
      attachments: [],
      draftId: null,
      draftUid: null
    });
    setIsGeneratingAI(true);
    setCurrentView('compose');

    try {
      // Gelen mailin içindeki HTML'leri temizleyip sadece metni alıyoruz
      const cleanText = selectedMail.content.replace(/<[^>]*>?/gm, ' ').trim();

      // 2. Python sunucumuza (Gemini'ye) istek atıyoruz
      const response = await fetch('http://127.0.0.1:5001/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: selectedMail.sender,
          subject: selectedMail.subject,
          email_text: cleanText
        })
      });

      if (response.ok) {
        const data = await response.json();
        // 3. Gelen mükemmel yanıtı ekrana basıyoruz
        setComposeState(prev => ({
          ...prev,
          body: data.reply
        }));
        showToast("AI yanıt taslağı başarıyla oluşturuldu!", 'success');
      } else {
        throw new Error("Sunucu yanıt vermedi");
      }
    } catch (error) {
      console.error("AI Yanıt Üretme Hatası:", error);
      // Hata olursa varsayılan metni koy
      const senderFirstName = selectedMail.sender.split(' ')[0];
      setComposeState(prev => ({
        ...prev,
        body: `Sayın ${senderFirstName},<br/><br/>E-postanız için teşekkür ederim. En kısa sürede detaylı dönüş yapacağım.<br/><br/>Saygılarımla,`
      }));
      showToast("AI yanıtı üretilemedi, standart taslak eklendi.", 'warning');
    } finally {
      setIsGeneratingAI(false);
    }
  }, [selectedMail, showToast, myAvailableAccounts]);

 const handleForward = useCallback(() => {
    if (!selectedMail) return;
    setComposeState({
      from: selectedMail.receiver || myAvailableAccounts[0] || '',
      to: [],
      subject: `Fwd: ${selectedMail.subject}`,
      body: `<br><br><hr/><b>İletilen Mesaj:</b><br/>Kimden: ${selectedMail.sender}<br/>Konu: ${selectedMail.subject}<br/>Tarih: ${new Date(selectedMail.fullDate).toLocaleString('tr-TR')}<br/><br/>${selectedMail.content}`,
      signature: 0,
      attachments: selectedMail.attachments || [], // İLETİRKEN EKLERİ DE KOY
      draftId: null,
      draftUid: null
    });
    setCurrentView('compose');
    showToast("İleti hazırlandı", 'success');
  }, [selectedMail, showToast, myAvailableAccounts]);

  // Calendar operations
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleEventChange = useCallback((field, value) => {
    setNewEvent(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddEmail = useCallback((e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    // 🚀 YENİ: E-Posta format kontrolü (En az bir '@' ve bir '.' içermeli)
    if (!emailInput.includes('@') || !emailInput.includes('.')) {
      return showToast("Lütfen geçerli bir e-posta adresi girin (örn: ornek@gmail.com)", "warning");
    }

    // Aynı e-posta zaten eklenmişse uyarı ver
    if (newEvent.invitees.includes(emailInput)) {
      return showToast("Bu e-posta adresi zaten eklendi", "warning");
    }

    setNewEvent(prev => ({ ...prev, invitees: [...prev.invitees, emailInput] }));
    setEmailInput("");
  }, [emailInput, newEvent.invitees, showToast]);

  const handleRemoveEmail = useCallback((email) => {
    setNewEvent(prev => ({ ...prev, invitees: prev.invitees.filter(e => e !== email) }));
  }, []);

 const handleSaveEvent = useCallback(async () => {
    if (!newEvent.title || !newEvent.day || !newEvent.time) {
      return showToast("Lütfen başlık, tarih ve saat girin", "error");
    }
    
    // 🚀 YENİ: E-posta (katılımcı) eklenmemişse kaydetmeyi reddet
    if (newEvent.invitees.length === 0) {
      return showToast("Lütfen en az bir katılımcı e-posta adresi ekleyin", "error");
    }
    
    showToast("Etkinlik zamanlanıyor...", "info");

    // Takvimden gelen "2026-03-15" formatını parçalayıp kaydediyoruz
    const [year, month, day] = newEvent.day.split('-');
    const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const [hours, minutes] = newEvent.time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes), 0);

    // Eklentileri Base64'e çevir (Gönderime hazırla)
    const parsedAttachments = await Promise.all((newEvent.attachments || []).map(async (att) => {
      if (!att.file) return null;
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(att.file);
      });
      return { filename: att.name, content: base64, encoding: 'base64', contentType: att.file.type, size: att.size };
    }));
    const validAttachments = parsedAttachments.filter(a => a !== null);

    // 🚀 YENİ: SEÇİLEN TÜRE GÖRE OTOMATİK İMZA OLUŞTURUCU BURADA OLMALI
    let signature = "";
    const userName = currentUser?.full_name || "Kullanıcı";
    
    if (newEvent.type === 'work') {
      const position = currentUser?.position || "Pozisyon";
      const company = currentUser?.company || "Şirket";
      signature = `\n\nSaygılarımla,\n${userName}\n${position} | ${company}`;
    } else {
      signature = `\n\nSevgiler,\n${userName}`;
    }

    const finalContent = newEvent.body ? (newEvent.body + signature) : signature.trimStart();

    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: newEvent.title,
          event_date: eventDate.toISOString(),
          type: newEvent.type,
          invitees: newEvent.invitees,
          content: finalContent, // 👈 Artık finalContent güvenle çalışacak
          attachments: validAttachments,
          from: newEvent.fromAccount
        })
      });

      if (response.ok) {
        if (newEvent.invitees.length > 0) {
          showToast(`Etkinlik kuruldu! ${eventDate.toLocaleString('tr-TR')} tarihinde mail otomatik atılacak 🚀`, 'success');
        } else {
          showToast("Etkinlik takvime eklendi", 'success');
        }
        
        // Takvime Görsel Olarak da Ekle
        const eventToAdd = {
          id: Date.now(),
          day: parseInt(newEvent.day.split('-')[2]),
          month: parseInt(newEvent.day.split('-')[1]) - 1,
          year: parseInt(newEvent.day.split('-')[0]),
          title: newEvent.title,
          time: newEvent.time,
          type: newEvent.type,
          color: EVENT_TYPES[newEvent.type]?.color || EVENT_TYPES.work.color,
          isSent: false
        };
        setEvents(prev => [...prev, eventToAdd]);
        
        setShowEventModal(false);
        setNewEvent({ title: '', day: '', time: '', type: 'work', invitees: [], body: '', attachments: [], fromAccount: myAvailableAccounts[0] || '' });
        setEmailInput("");
        fetchEvents(); 
      }
    } catch(e) {
      showToast("Etkinlik kaydedilemedi", "error");
    }
  }, [newEvent, currentDate, showToast, fetchEvents, currentUser]);

  // Chatbot operations
  const handleSendMessage = useCallback(async (textOverride) => {
    // Eğer butona tıklandıysa buton metnini al, yoksa input alanını al
    const userText = typeof textOverride === 'string' ? textOverride : chatInput.trim();
    if (!userText) return;
    
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    setChatMessages(prev => [...prev, newUserMsg]);
    setChatInput("");
    
    try {
      const response = await fetch('http://127.0.0.1:5001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          history: chatMessages.map(m => ({ sender: m.sender, text: m.text })) 
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          sender: 'bot', 
          text: data.reply,
          options: data.options || [] // Gelen buton seçenekleri
        }]);
      } else {
        throw new Error("Sunucu yanıt vermedi");
      }
    } catch (error) {
      console.error("Chat Hatası:", error);
      setChatMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: 'Üzgünüm, şu an sunucuya bağlanamıyorum.',
        options: ['Tekrar Dene']
      }]);
    }
  }, [chatInput, chatMessages]);

  // Calculate unread count
  const unreadCount = useMemo(() => mails.filter(m => m.folder === 'inbox' && !m.read).length, [mails]);

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <Sidebar 
        isOpen={isSidebarOpen}
        currentView={currentView}
        activeFolder={activeFolder}
        activeCategory={activeCategory}
        mails={mails}
        categories={allCategories}
        onNavigate={handleNavigate}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
        onCompose={handleCompose}
        unreadCount={unreadCount}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        tags={TAGS}
        currentUser={currentUser}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Drop Zones for Drag & Drop */}
        {draggedMail && (
          <div className="absolute inset-0 z-40 flex">
            <div 
              className="flex-1 flex items-center justify-center bg-indigo-500/10 border-2 border-dashed border-indigo-500 m-4 rounded-3xl"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('archive')}
            >
              <div className="text-center">
                <Archive size={48} className="text-indigo-500 mx-auto mb-2" />
                <p className="text-indigo-700 dark:text-indigo-300 font-bold">Arşive Taşı</p>
              </div>
            </div>
            <div 
              className="flex-1 flex items-center justify-center bg-rose-500/10 border-2 border-dashed border-rose-500 m-4 rounded-3xl"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('trash')}
            >
              <div className="text-center">
                <Trash2 size={48} className="text-rose-500 mx-auto mb-2" />
                <p className="text-rose-700 dark:text-rose-300 font-bold">Sil</p>
              </div>
            </div>
          </div>
        )}

       {currentView === 'inbox' && (
          <>
            <div className={`${selectedMail ? 'hidden lg:flex w-2/5 max-w-[40%]' : 'flex-1'} border-r border-slate-200 dark:border-slate-700 min-w-0 flex flex-col`}>
              <MailList 
                mails={mails}
                isLoadingMails={isLoadingMails} // <-- Skeleton için burayı ekledik
                selectedMail={selectedMail}
                selectedIds={selectedMailIds}
                activeFolder={activeFolder}
                activeCategory={activeCategory}
                filterStatus={filterStatus}
                categories={allCategories}
                sortOrder={sortOrder}
                searchQuery={searchQuery}
                selectedAccount={selectedAccount}
                onRestore={handleRestore}
                onToggleStar={handleToggleStar}
                onAccountChange={setSelectedAccount}
                onSelectMail={handleSelectMail}
                onToggleSelect={toggleSelectMail}
                onSendDraft={handleSendDraftDirectly}
                onSelectAll={handleSelectAll}
                onFilterChange={setFilterStatus}
                onSortChange={setSortOrder}
                onBulkDelete={handleBulkDelete}
                onBulkRead={handleBulkRead}
                onBulkArchive={handleBulkArchive}
                onBulkSpam={handleSpam}
                onDragStart={handleDragStart}
                isDarkMode={isDarkMode}
                onLoadMore={() => {
                  if (!isFetchingMore && hasMore) setPage(p => p + 1);
                }}
                isFetchingMore={isFetchingMore}
                hasMore={hasMore}
              />
            </div>
            
            {/* SAĞ PANEL */}
            <div className={`${selectedMail ? 'flex flex-1 min-w-0 flex-col' : 'hidden lg:flex flex-1 min-w-0 flex-col'}`}>
              <MailDetail 
                mail={selectedMail}
                categories={allCategories} 
        onChangeCategory={handleChangeCategory} 
        onCreateCategory={handleCreateCategory} 
                onClose={() => setSelectedMail(null)}
                onRestore={() => handleRestore(selectedMail.id)}
                onArchive={handleArchive}
                onSpam={() => handleSpam(selectedMail.id)}
                onDelete={handleDelete}
                onToggleStar={handleToggleStar}
                onReply={handleReply}
                onAIReply={handleAIReply}
                onEditDraft={handleEditDraft}
                onForward={handleForward}
                summaryStatus={summaryStatus}
                onSummarize={handleSummarize}
                isDarkMode={isDarkMode}
                onAddTag={handleAddTag}
              />
            </div>
          </>
        )}

        {currentView === 'compose' && (
          <div className="flex-1">
            <Compose 
              {...composeState}
              isGenerating={isGeneratingAI}
              onBack={() => setCurrentView('inbox')}
              onChange={handleComposeChange}
              onSend={handleSendMail}
              onGenerate={handleAIGenerate}
              onSaveDraft={handleSaveDraft}
              isDarkMode={isDarkMode}
              signatures={signatures}
              selectedSignature={composeState.signature}
              availableAccounts={myAvailableAccounts}
              showToast={showToast}
            />
          </div>
        )}
        {currentView === 'calendar' && (
          <div className="flex-1">
            <Calendar 
              currentDate={currentDate}
              events={events}
              showModal={showEventModal}
              newEvent={newEvent}
              emailInput={emailInput}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onOpenModal={() => {
                setNewEvent(prev => ({ ...prev, fromAccount: myAvailableAccounts[0] || '' }));
                setShowEventModal(true);
              }}
              onCloseModal={() => setShowEventModal(false)}
              onEventChange={handleEventChange}
              onEmailInputChange={setEmailInput}
              onAddEmail={handleAddEmail}
              onRemoveEmail={handleRemoveEmail}
              onSaveEvent={handleSaveEvent}
              isDarkMode={isDarkMode}
              availableAccounts={myAvailableAccounts}
            />
          </div>
        )}

        {currentView === 'dashboard' && (
  <Dashboard 
    mails={mails} 
    isDarkMode={isDarkMode} 
    currentUser={currentUser} 
    onBack={() => setCurrentView('inbox')}
    availableAccounts={myAvailableAccounts}
  />
)}
        {currentView === 'tags' && (
          <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto">
              
              {/* Üst Başlık Alanı */}
              <div className="mb-8 mt-4 text-left">
                <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Etiket Adetleri</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  E-postalarınıza iliştirdiğiniz etiketlerin dağılımı ve doluluk oranları.
                </p>
              </div>

              {/* Dinamik Kart Yapısı */}
              <TagStatsGrid mails={mails} categories={allCategories} isDarkMode={isDarkMode} />

            </div>
          </div>
        )}
        {currentView === 'security' && (
          <SecurityPage isDarkMode={isDarkMode} />
        )}
        {currentView === 'settings' && (
          <SettingsPage isDarkMode={isDarkMode} showToast={showToast} />
        )}
        {currentView === 'dataset' && (
  <DatasetPage isDarkMode={isDarkMode} />
)}
      </div>

      {/* Search Bar Overlay */}
      {searchQuery !== '' && currentView === 'inbox' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-96">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Search size={20} className="text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="E-posta ara..."
                className="flex-1 outline-none text-slate-800 dark:text-slate-200 bg-transparent"
                autoFocus
              />
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {mails.filter(m => 
                m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.sender.toLowerCase().includes(searchQuery.toLowerCase())
              ).length} sonuç bulundu
            </div>
          </div>
        </div>
      )}

      <Chatbot 
        isOpen={isChatOpen}
        messages={chatMessages}
        input={chatInput}
        onToggle={setChatOpen}
        onSend={handleSendMessage}
        onInputChange={setChatInput}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
// --- YEREL VERİLERLE ÇALIŞAN GARANTİLİ KATEGORİ/ETİKET BİLEŞENİ ---
function TagStatsGrid({ mails, categories, isDarkMode }) {
  
  // Mail listesindeki 'category' değerlerini sayıyoruz
  const getCategoryCount = (categoryId) => {
    return mails.filter(mail => mail.category === categoryId).length;
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      {/* Eski TAGS yerine artık senin gerçek 'categories' dizin dönüyor */}
      {categories.map(cat => {
        const count = getCategoryCount(cat.id);

        return (
          <Card key={cat.id} className="p-4" hover glass={isDarkMode}>
            <div className="flex items-center justify-between w-full">
              {/* Sol Taraf: İkon ve Kategori/Etiket Adı */}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-${cat.color}-100 dark:bg-${cat.color}-900/30 flex items-center justify-center shrink-0`}>
                  <cat.icon size={20} className={`text-${cat.color}-500`} />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white capitalize">
                  {cat.label}
                </h3>
              </div>

              {/* Sağ Taraf: E-posta Adedi */}
              <div className="text-right shrink-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700`}>
                  {count} e-posta
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
export default Mail;