import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellRing, BrainCircuit, AlertTriangle, Download, Trash2 } from 'lucide-react';

export default function SettingsPage({ isDarkMode, showToast }) {
  const navigate = useNavigate();

  // 1. AYARLARI LOCAL STORAGE'DAN ÇEK (Sayfa yenilense de ayarlar bozulmaz)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('aia_settings');
    return saved ? JSON.parse(saved) : {
      desktopNotifications: false,
      soundAlerts: false,
      aiAutoSort: true,
      aiSmartReply: true,
      compactMode: false
    };
  });

  // 2. AYARLAR DEĞİŞTİKÇE LOCAL STORAGE'A KAYDET
  useEffect(() => {
    localStorage.setItem('aia_settings', JSON.stringify(settings));
  }, [settings]);

  const handleToggle = (key) => {
    setSettings(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      
      // Masaüstü bildirimleri açıldıysa tarayıcıdan izin iste
      if (key === 'desktopNotifications' && newState[key]) {
        if (Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
      return newState;
    });
    showToast("Ayar başarıyla kaydedildi", "success");
  };

  // 3. GERÇEK VERİ İNDİRME FONKSİYONU
  const handleDownloadData = async () => {
    showToast("Verileriniz hazırlanıyor. Lütfen bekleyin...", "info");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/user/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Veriyi JSON dosyasına çevir ve tarayıcıya indirt
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AIA_Kisisel_Verilerim_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast("Verileriniz başarıyla indirildi!", "success");
      } else {
        showToast("Veriler dışa aktarılamadı.", "error");
      }
    } catch (error) {
      showToast("Sunucuya ulaşılamadı.", "error");
    }
  };

  // 4. GERÇEK HESAP SİLME FONKSİYONU
  const handleDeleteAccount = async () => {
    if (window.confirm("DİKKAT: Hesabınızı kalıcı olarak silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz. Sistemdeki tüm e-postalarınız, yapay zeka analizleriniz ve takvim etkinlikleriniz KALICI OLARAK YOK EDİLECEKTİR!")) {
      
      showToast("Hesabınız ve tüm verileriniz siliniyor...", "error");
      
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/user/delete', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          // Tarayıcıdaki tüm izleri temizle ve Login ekranına şutla
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('aia_settings');
          localStorage.removeItem('customCategories');
          
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        } else {
          showToast("Hesap silinirken bir hata oluştu.", "error");
        }
      } catch (error) {
        showToast("Sunucu ile iletişim kurulamadı.", "error");
      }
    }
  };

  // Switch Toggle Bileşeni
  const SettingToggle = ({ label, desc, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
      <div className="pr-4">
        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</div>
      </div>
      <button 
        onClick={onToggle} 
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none ${enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  const SettingsCard = ({ children, className = '' }) => (
    <div className={`rounded-2xl border transition-all duration-300 p-6 text-left shadow-sm ${
      isDarkMode 
        ? 'bg-slate-800 border-slate-700/50 glass-card' 
        : 'bg-white border-slate-200/60'
    } ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-900/50 custom-scrollbar animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 mt-4 text-left">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Ayarlar & Tercihler</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Uygulama deneyiminizi, yapay zeka asistanını ve veri gizliliğinizi yönetin.</p>
        </div>

        <div className="space-y-6">
          
          {/* Bildirimler ve Görünüm */}
          <SettingsCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><BellRing size={20} /></div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Bildirimler ve Görünüm</h2>
            </div>
            <div className="pl-2">
              <SettingToggle 
                label="Masaüstü Bildirimleri" 
                desc="Yeni bir e-posta veya takvim hatırlatması geldiğinde sistem bildirimi gönderir." 
                enabled={settings.desktopNotifications} 
                onToggle={() => handleToggle('desktopNotifications')} 
              />
              <SettingToggle 
                label="Uygulama İçi Sesler" 
                desc="Mesaj gönderildiğinde veya silindiğinde kısa bildirim sesleri çalar." 
                enabled={settings.soundAlerts} 
                onToggle={() => handleToggle('soundAlerts')} 
              />
            </div>
          </SettingsCard>

          {/* Yapay Zeka Tercihleri */}
          <SettingsCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><BrainCircuit size={20} /></div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">AİA - Yapay Zeka Motoru</h2>
            </div>
            <div className="pl-2">
              <SettingToggle 
                label="Otomatik Kategori Sınıflandırma" 
                desc="Gelen e-postalarınız (İş, Fatura, Eğitim vb.) yapay zeka motoru tarafından otomatik ayrıştırılır." 
                enabled={settings.aiAutoSort} 
                onToggle={() => handleToggle('aiAutoSort')} 
              />
              <SettingToggle 
                label="Bağlamsal Akıllı Yanıt (Smart Reply)" 
                desc="Bir maile cevap verirken yapay zeka önceki yazışmalara bakarak tonlama belirler." 
                enabled={settings.aiSmartReply} 
                onToggle={() => handleToggle('aiSmartReply')} 
              />
            </div>
          </SettingsCard>

          {/* Veri ve Gizlilik (TEHLİKELİ BÖLGE) */}
          <SettingsCard className="border-rose-200 dark:border-rose-900/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg"><AlertTriangle size={20} /></div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Veri Kontrolü ve Tehlikeli Bölge</h2>
            </div>
            
            <div className="space-y-4 pl-2">
              {/* GERÇEK İNDİRME BUTONU */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Verilerimi Dışa Aktar</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Profil bilgilerinizin ve istatistiklerinizin bir kopyasını JSON formatında indirin (KVKK).</p>
                </div>
                <button onClick={handleDownloadData} className="mt-3 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                  <Download size={16} /> Verileri İndir
                </button>
              </div>

              {/* GERÇEK SİLME BUTONU */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/50">
                <div>
                  <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400">Hesabı Kalıcı Olarak Sil</h3>
                  <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Sisteme bağlı tüm hesapların erişimi kesilir ve veritabanı kayıtları tamamen temizlenir.</p>
                </div>
                <button onClick={handleDeleteAccount} className="mt-3 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all active:scale-95">
                  <Trash2 size={16} /> Hesabı Sil
                </button>
              </div>
            </div>
          </SettingsCard>

        </div>
      </div>
    </div>
  );
}