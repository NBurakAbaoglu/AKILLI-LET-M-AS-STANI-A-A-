import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, ShieldCheck, BrainCircuit, Calendar, Menu, X, ArrowRight, 
  CheckCircle2, Globe, BarChart3, Zap, Lock, Search, Trash2, Bell, 
  ChevronLeft, ChevronRight, Star, LayoutGrid, Settings, Sparkles, 
  Check, Server, Code2, Fingerprint, RefreshCw, Plug, Headphones, 
  Mic, WifiOff, Users 
} from 'lucide-react';
import './Home.css';
import { useNavigate } from 'react-router-dom'; 
const Home = () => {
    const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mail'); 
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPlan, setSelectedPlan] = useState('pro');
  
  const scrollRef = useRef(null);

 useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        const element = document.getElementById(window.location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Sayfanın render olmasını beklemek için 100ms gecikme
    }
  }, []);
  const scrollManual = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320; 
      const container = scrollRef.current;
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  // Navbar Linkleri ve Hedef ID'leri
  const navLinks = [
    { name: 'Ürün', id: 'urun' },
    { name: 'Çözümler', id: 'cozumler' },
    { name: 'Güvenlik', id: 'guvenlik' },
    { name: 'Fiyatlandırma', id: 'fiyatlandirma' }
  ];

  const plans = [
    {
      id: 'free',
      title: 'Başlangıç',
      price: '₺0',
      period: '/ay',
      desc: 'Bireysel kullanım ve temel özellikler.',
      features: ['Günlük 10 AI Özeti', 'Temel Spam Filtresi', '1 E-posta Hesabı', 'Web Erişimi'],
      buttonText: 'Ücretsiz Dene',
      isPopular: false
    },
    {
      id: 'pro',
      title: 'AİA Pro',
      price: '₺49',
      period: '/ay',
      desc: 'Profesyoneller ve yoğun kullanıcılar için.',
      features: ['Sınırsız AI Özeti', 'Gelişmiş Phishing Kalkanı', '5 E-posta Hesabı', 'Akıllı Takvim Entegrasyonu', 'Öncelikli Destek'],
      buttonText: 'Hemen Başla',
      isPopular: true
    },
    {
      id: 'corp',
      title: 'Kurumsal',
      price: 'Özel',
      period: '',
      desc: 'Büyük ekipler ve şirketler için.',
      features: ['Tüm Pro Özellikleri', 'Merkezi Yönetim Paneli', 'API Erişimi', 'Özel Veri Güvenliği (SLA)', 'Dedike Müşteri Temsilcisi'],
      buttonText: 'Satışla Görüşün',
      isPopular: false
    }
  ];

  const detailCards = [
    { icon: <Lock size={32} />, title: "Uçtan Uca Şifreleme", desc: "Verileriniz AES-256 ile şifrelenir. Güvenliğiniz önceliğimizdir." },
    { icon: <BrainCircuit size={32} />, title: "Transformer AI", desc: "GPT tabanlı modellerimiz Türkçe dil yapısını %98 doğrulukla analiz eder." },
    { icon: <Server size={32} />, title: "KVKK & GDPR", desc: "Veri merkezlerimiz yerel regülasyonlara tam uyumlu ve Türkiye'dedir." },
    { icon: <Calendar size={32} />, title: "Akıllı Zamanlama", desc: "E-posta içeriğinden toplantı tarihlerini algılar ve takvime işler." },
    { icon: <Mic size={32} />, title: "Sesli Asistan", desc: "Hareket halindeyken e-postaları dinleyin veya sesli komutla yanıtlayın." },
    { icon: <WifiOff size={32} />, title: "Çevrimdışı Mod", desc: "İnternet bağlantınız olmasa bile eski iletilerinize erişin ve çalışın." },
    { icon: <Users size={32} />, title: "Takım İşbirliği", desc: "Gelen kutusunu ekibinizle paylaşın, notlar alın ve görev atayın." },
    { icon: <Code2 size={32} />, title: "Geliştirici API", desc: "AİA özelliklerini kendi CRM sistemlerinize RESTful API ile entegre edin." },
    { icon: <Fingerprint size={32} />, title: "Biyometrik Giriş", desc: "FaceID ve parmak izi ile güvenli ve hızlı mobil oturum açma." },
    { icon: <RefreshCw size={32} />, title: "Anlık Senkron", desc: "Outlook, Gmail ve diğer hesaplarınızla saniyeler içinde senkronize olur." },
    { icon: <Plug size={32} />, title: "Eklenti Desteği", desc: "Chrome ve Edge tarayıcı eklentileri ile webde gezinirken asistan yanınızda." },
    { icon: <Headphones size={32} />, title: "7/24 Canlı Destek", desc: "Pro ve Kurumsal planlarda teknik ekibimiz her an sorularınızı yanıtlar." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-[#E6F2FF] selection:text-[#0078D4]">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-50 transition-all">
        <div className="max-w-[1600px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="bg-[#0078D4] p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
                <Mail className="text-white w-6 h-6" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-800">AİA</span>
            </div>
            
            <div className="hidden lg:flex gap-8 text-[15px] font-medium text-slate-600">
              {navLinks.map((item) => (
                <a key={item.name} href={`#${item.id}`} className="hover:text-[#0078D4] transition-colors relative group">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0078D4] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
  <button 
    onClick={() => navigate('/login')} 
    className="hidden md:block text-slate-600 hover:text-[#0078D4] font-medium text-[15px] transition"
  >
    Giriş Yap
  </button>
  
  <button onClick={() => navigate('/register')} className="bg-[#0078D4] text-white text-[15px] font-semibold px-6 py-2.5 hover:bg-[#0060aa] transition-all rounded-lg shadow-md hover:shadow-xl hover:-translate-y-0.5">
    Ücretsiz Dene
  </button>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 px-6 bg-[#F8FAFC] overflow-hidden">
        {/* Arka Plan Dekorasyonları */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
          
          {/* Sol: Açıklayıcı Metin */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-blue-200 rounded-full shadow-sm text-xs font-bold text-[#0078D4] uppercase tracking-wider">
              <Zap size={14} className="fill-current" />
              Yapay Zeka Destekli İletişim
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-[4rem] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Gelen kutunuzdaki <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0078D4] to-[#00c6e0]">
                gürültüyü susturun.
              </span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Akıllı İletişim Asistanı (AİA), yoğun e-posta trafiğini <strong>Doğal Dil İşleme (NLP)</strong> ile analiz eder. Önemliyi ayırır, spam'i engeller ve içeriği sizin için özetler.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button onClick={() => navigate('/register')}className="w-full sm:w-auto px-8 py-4 bg-[#0078D4] text-white font-bold text-lg hover:bg-[#0060aa] transition-all rounded-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 group">
                Hemen Başlayın <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold text-lg hover:bg-slate-50 hover:border-blue-200 transition-all rounded-lg">
                Nasıl Çalışır?
              </button>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="pt-4 flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> %99 Spam Engelleme</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> Otomatik Özetleme</span>
            </motion.div>
          </motion.div>

          {/* Sağ: MAC PENCERESİ */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-4xl perspective-1000 relative"
          >
            {/* DÜZELTME: hover:scale ve backdrop-blur azaltıldı, opaklık artırıldı */}
            <div className="relative mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/50 overflow-hidden h-[500px] flex flex-col">
              
              {/* --- MAC TRAFFIC LIGHTS HEADER --- */}
              <div className="h-10 bg-gradient-to-b from-white/50 to-transparent flex items-center px-4 justify-between shrink-0 border-b border-black/5">
                 <div className="flex items-center gap-2 group">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]"></div>
                 </div>
                 <div className="text-slate-600 font-semibold text-xs flex items-center gap-2 opacity-70">
                    <Mail size={12} />
                    {activeTab === 'mail' ? 'Gelen Kutusu' : activeTab === 'calendar' ? 'Takvim' : 'Spam Kalkanı'}
                 </div>
                 <div className="w-10"></div>
              </div>

              {/* --- MAC WINDOW CONTENT --- */}
              <div className="flex-1 overflow-hidden flex">
                
                {/* Sol Sidebar */}
                <div className="w-16 md:w-56 bg-white/40 border-r border-black/5 p-3 flex flex-col backdrop-blur-sm">
                    <div className="mb-4 relative hidden md:block">
                        <Search className="absolute left-2 top-1.5 text-slate-400" size={14} />
                        <input type="text" placeholder="Ara" className="w-full bg-black/5 border border-transparent focus:bg-white rounded-md py-1 pl-7 pr-2 text-sm outline-none transition placeholder:text-slate-400" />
                    </div>
                    
                    <div className="space-y-1">
                        <button onClick={() => setActiveTab('mail')} className={`w-full text-left px-2 py-1.5 rounded-md flex items-center gap-3 text-sm font-medium transition ${activeTab === 'mail' ? 'bg-[#007AFF] text-white shadow-sm' : 'text-slate-600 hover:bg-black/5'}`}>
                            <Mail size={16} /> <span className="hidden md:inline">Gelen Kutusu</span>
                        </button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md flex items-center gap-3 text-sm font-medium text-slate-600 hover:bg-black/5 transition">
                            <Star size={16} /> <span className="hidden md:inline">Önemli</span>
                        </button>
                        <button className="w-full text-left px-2 py-1.5 rounded-md flex items-center gap-3 text-sm font-medium text-slate-600 hover:bg-black/5 transition">
                            <LayoutGrid size={16} /> <span className="hidden md:inline">Taslaklar</span>
                        </button>

                        <div className="mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase hidden md:block">Akıllı Klasörler</div>
                        <button onClick={() => setActiveTab('spam')} className={`w-full text-left px-2 py-1.5 rounded-md flex items-center gap-3 text-sm font-medium transition ${activeTab === 'spam' ? 'bg-black/10 text-red-600' : 'text-red-600 hover:bg-black/5'}`}>
                            <ShieldCheck size={16} /> <span className="hidden md:inline">Spam Kalkanı</span>
                        </button>
                        <button onClick={() => setActiveTab('calendar')} className={`w-full text-left px-2 py-1.5 rounded-md flex items-center gap-3 text-sm font-medium transition ${activeTab === 'calendar' ? 'bg-black/10 text-emerald-600' : 'text-emerald-600 hover:bg-black/5'}`}>
                            <Calendar size={16} /> <span className="hidden md:inline">Takvim</span>
                        </button>
                    </div>
                </div>

                {/* Ana İçerik */}
                <div className="flex-1 bg-white/60 flex flex-col relative">
                    <div className="h-10 border-b border-black/5 flex items-center justify-between px-4 bg-white/40 backdrop-blur z-10">
                        <div className="flex gap-3 text-slate-400">
                            <Trash2 size={16} className="hover:text-red-500 cursor-pointer" />
                            <Bell size={16} className="hover:text-blue-500 cursor-pointer" />
                        </div>
                        <div className="flex gap-2 text-slate-300">
                            <ChevronLeft size={18} /> <ChevronRight size={18} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                       <AnimatePresence mode='wait'>
                         {activeTab === 'mail' && (
                           <motion.div 
                             key="mail"
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0 }}
                             className="max-w-2xl mx-auto"
                           >
                             <div className="flex justify-between items-end mb-6 border-b border-slate-100 pb-2">
                                 <h1 className="text-lg font-bold text-slate-900">Proje Değerlendirme Raporu</h1>
                                 <span className="text-xs text-slate-400 mb-1">{currentTime.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             
                             <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-blue-100 p-5 relative overflow-hidden group hover:shadow-lg transition duration-300">
                                 <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10 opacity-60"></div>
                                 
                                 <div className="flex items-center gap-2 mb-4 relative z-10">
                                    <div className="bg-[#0078D4] p-1.5 rounded-lg text-white shadow-sm">
                                      <Sparkles size={16} fill="currentColor" />
                                    </div>
                                    <span className="text-sm font-bold text-[#0078D4] uppercase tracking-wide">Yönetici Özeti</span>
                                 </div>
                                 
                                 <p className="text-[15px] text-slate-700 leading-relaxed font-medium mb-6 relative z-10">
                                   "E-posta, Q4 NLP modellerinin tamamlandığını bildiriyor. Spam filtreleme başarısı <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">%99.2</span> olarak ölçüldü. Yönetim toplantısı için <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Perşembe 14:00</span> öneriliyor."
                                 </p>

                                 <div className="flex flex-wrap gap-3 relative z-10">
                                    <button className="flex items-center gap-2 bg-[#0078D4] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#0060aa] transition shadow-md shadow-blue-200">
                                       <Calendar size={14} /> Takvime Ekle
                                    </button>
                                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition shadow-sm">
                                       <ArrowRight size={14} /> Hızlı Yanıtla
                                    </button>
                                 </div>
                             </div>

                             <div className="mt-8 text-center">
                                 <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                    <BrainCircuit size={12} />
                                    <span>Orijinal ileti içeriği AİA tarafından işlendi ve özetlendi.</span>
                                 </div>
                             </div>
                           </motion.div>
                         )}

                         {activeTab === 'spam' && (
                            <motion.div key="spam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center">
                               <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                  <ShieldCheck size={32} className="text-red-500" />
                               </div>
                               <h2 className="text-lg font-bold text-slate-800 mb-2">Güvenlik Raporu</h2>
                               <p className="text-sm text-slate-500 max-w-xs">Son 24 saatte <strong>3 adet</strong> phishing (oltalama) girişimi engellendi ve karantinaya alındı.</p>
                            </motion.div>
                         )}

                         {activeTab === 'calendar' && (
                            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center">
                               <Calendar size={48} className="text-emerald-500 mb-4 opacity-80" />
                               <h2 className="text-lg font-bold text-slate-800">Planlı Etkinlikler</h2>
                               <div className="mt-4 bg-white border border-slate-100 p-3 rounded-lg shadow-sm text-left w-full max-w-xs">
                                  <div className="text-xs font-bold text-emerald-600 mb-1">OTOMATİK EKLENDİ</div>
                                  <div className="font-bold text-slate-800">Strateji Toplantısı</div>
                                  <div className="text-xs text-slate-500">Yarın, 14:00 - 15:30</div>
                               </div>
                            </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 -left-10 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          </motion.div>
        </div>
      </section>

      {/* --- EXPLAINER SECTION (ID: urun) --- */}
      <section id="urun" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">İletişim Kaosuna Son Verin</h2>
                <p className="text-lg text-slate-500 leading-relaxed">
                    Günümüzde e-posta trafiği yönetilemez boyutlara ulaştı. Önemli mesajlar gözden kaçıyor, spamler zaman çalıyor. 
                    <strong>AİA</strong>, bu süreci otomatize etmek için geliştirildi.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                        <BrainCircuit size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">İçeriği Anlar</h3>
                    <p className="text-slate-600">
                        Sıradan filtreler sadece kelimelere bakar. AİA, <strong>Makine Öğrenimi</strong> ile cümlenin anlamını ve duygusunu analiz eder.
                    </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                        <Search size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Sizin İçin Özetler</h3>
                    <p className="text-slate-600">
                        Uzun e-postaları okumakla vakit kaybetmeyin. GPT tabanlı modellerimiz, sayfalarca metni <strong>tek bir paragrafa</strong> indirger.
                    </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition duration-300">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                        <ShieldCheck size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Adaptif Koruma</h3>
                    <p className="text-slate-600">
                        Statik listeler yerine, davranışlarınızı öğrenen <strong>dinamik spam filtresi</strong> ile gereksiz iletileri %99 oranında engeller.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- TRUST BAR (ID: guvenlik) --- */}
      <section id="guvenlik" className="border-y border-slate-100 bg-[#FAFAFA] py-16">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">
                Geleceğin Teknolojileri İle Güçlendirildi
            </p>
            <div className="flex flex-wrap justify-center gap-12 lg:gap-20 opacity-50 grayscale hover:grayscale-0 transition duration-500">
                 <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><Globe className="text-blue-600" /> GlobalTech</div>
                 <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><Lock className="text-indigo-600" /> SecureNet</div>
                 <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><BrainCircuit className="text-emerald-600" /> AI Labs</div>
                 <div className="text-xl font-bold text-slate-800 flex items-center gap-2">DataCorp</div>
            </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative py-32 px-6 text-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white pointer-events-none"></div>

        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#003366]/40 rounded-full mix-blend-multiply filter blur-[90px] animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-sky-400/40 rounded-full mix-blend-multiply filter blur-[110px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100/60 rounded-full mix-blend-multiply filter blur-[70px] animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <h2 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
                İletişimde <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#004e8a] to-[#00bfff]">
                    kontrolü ele alın.
                </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
                Gelen kutunuzu yapay zekanın gücüyle dönüştürün. Daha az gürültü, daha fazla odaklanma.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate('/register')}className="w-full sm:w-auto px-10 py-4 bg-[#0078D4] text-white rounded-full font-bold text-lg hover:bg-[#0060aa] transition duration-300 shadow-xl shadow-blue-500/20">
                    Ücretsiz Hesap Oluşturun
                </button>
                <button className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-bold text-lg hover:bg-slate-50 transition duration-300">
                    Demoyu İncele
                </button>
            </div>
        </div>
      </section>

      {/* --- PRICING SECTION (ID: fiyatlandirma) --- */}
      <section id="fiyatlandirma" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Sizin İçin Doğru Planı Seçin</h2>
                <p className="text-lg text-slate-500">
                    İster bireysel ister kurumsal, her ölçek için uygun bir çözümümüz var.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan) => (
                    <div 
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`
                            relative p-8 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col h-full
                            ${selectedPlan === plan.id 
                                ? 'bg-white border-2 border-[#0078D4] shadow-xl ring-4 ring-blue-50 scale-105 z-10' 
                                : 'bg-white border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md scale-100'
                            }
                        `}
                    >
                        {selectedPlan === plan.id && (
                            <div className="absolute top-4 right-4 text-[#0078D4]">
                                <CheckCircle2 className="w-6 h-6 fill-blue-50" />
                            </div>
                        )}

                        {plan.isPopular && selectedPlan !== plan.id && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0078D4] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                                En Popüler
                            </div>
                        )}

                        <h3 className={`text-xl font-bold mb-2 ${selectedPlan === plan.id ? 'text-[#0078D4]' : 'text-slate-900'}`}>{plan.title}</h3>
                        <div className="text-4xl font-bold text-slate-900 mb-4">
                            {plan.price}<span className="text-lg font-medium text-slate-400">{plan.period}</span>
                        </div>
                        <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-100">{plan.desc}</p>
                        
                        <ul className="space-y-4 text-sm text-slate-600 mb-8 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex gap-3">
                                    <Check className={`shrink-0 ${selectedPlan === plan.id ? 'text-[#0078D4]' : 'text-emerald-500'}`} size={18} /> 
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        
                        <button onClick={() => navigate('/register')}className={`
                            w-full py-3 rounded-lg font-bold transition-all
                            ${selectedPlan === plan.id 
                                ? 'bg-[#0078D4] text-white shadow-lg shadow-blue-500/30' 
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }
                        `}>
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- CAROUSEL (ID: cozumler) --- */}
      <section id="cozumler" className="py-24 bg-gradient-to-b from-[#F0F6FF] to-white overflow-hidden border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 mb-12 flex items-end justify-between">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Özelliklere Derinlemesine Bakış</h2>
                <p className="text-slate-500 text-lg max-w-xl">Teknolojik altyapımızı keşfedin. İhtiyacınız olan her şey elinizin altında.</p>
            </div>
            
            <div className="flex gap-3">
                <button 
                    onClick={() => scrollManual('left')} 
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#0078D4] hover:text-white hover:border-[#0078D4] transition-all shadow-sm active:scale-95"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={() => scrollManual('right')} 
                    className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#0078D4] hover:text-white hover:border-[#0078D4] transition-all shadow-sm active:scale-95"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
        
        <div 
            className="w-full overflow-x-auto scrollbar-hide pb-8" 
            ref={scrollRef}
            style={{ scrollbarWidth: 'none' }}
        >
            <div className="flex gap-8 w-max px-6">
                {detailCards.map((card, index) => (
                    <div 
                        key={index}
                        className="w-72 h-72 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group cursor-grab active:cursor-grabbing"
                    >
                        <div>
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-[#0078D4] group-hover:bg-[#0078D4] group-hover:text-white transition-colors duration-300">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-200 text-sm">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
            <div className="col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-2xl">
                    <div className="bg-[#0078D4] p-1 rounded">
                      <Mail className="text-white w-5 h-5" />
                    </div>
                    AİA
                </div>
                <p className="text-slate-500 mb-6 leading-relaxed">
                    Kurumsal ve bireysel iletişim için yapay zeka destekli, güvenli e-posta yönetim platformu.
                </p>
            </div>
            
            {[
              {title: "Ürün", links: ["Özellikler", "Entegrasyonlar", "Güvenlik", "Yol Haritası"]},
              {title: "Kaynaklar", links: ["Blog", "Yardım Merkezi", "API Dokümanı", "Topluluk"]},
              {title: "Şirket", links: ["Hakkımızda", "Kariyer", "İletişim", "Basın"]},
              {title: "Yasal", links: ["Gizlilik Politikası", "Kullanım Şartları", "Çerezler"]}
            ].map((section, idx) => (
               <div key={idx}>
                  <h4 className="font-bold text-slate-900 mb-6">{section.title}</h4>
                  <ul className="space-y-4 text-slate-500">
                      {section.links.map(link => (
                          <li key={link}><a href="#" className="hover:text-[#0078D4] transition-colors">{link}</a></li>
                      ))}
                  </ul>
               </div>
            ))}
        </div>

        <div className="max-w-[1400px] mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs">
            <p>© 2025 AİA Inc. Tüm hakları saklıdır. Çorum/Türkiye.</p>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Sistemler Operasyonel</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;