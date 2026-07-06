import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, Globe, Link as LinkIcon, Chrome, AtSign, 
  LogOut, ArrowLeft, Camera, Trash2, Check, X, Edit2, Share2, Mail, Briefcase
} from 'lucide-react';

// --- YARDIMCI GİRDİ BİLEŞENLERİ (Düzenleme Modu İçin) ---
const Input = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />}
      <input className={`w-full bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b9dee]/20 focus:border-[#2b9dee] transition-all ${Icon ? 'pl-10' : 'px-4'} py-2.5`} {...props} />
    </div>
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>}
    <textarea className="w-full bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2b9dee]/20 focus:border-[#2b9dee] transition-all px-4 py-3 resize-none" {...props} />
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);

  // Profil Verisi 
  const [profile, setProfile] = useState({
    firstName: "Yükleniyor...",
    lastName: "",
    title: "",
    bio: "",
    phone: "",
    website: "",
    avatar: null,
    email: ""
  });

  const [emails, setEmails] = useState([]);
  
  const [tempProfile, setTempProfile] = useState(profile);
  const [tempEmails, setTempEmails] = useState(emails);

  // --- GERÇEK KULLANICI VERİLERİNİ ÇEKME ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // 1. Backend'den güncel profil bilgilerini çek
      fetch('http://localhost:5000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          const nameParts = data.full_name ? data.full_name.split(' ') : ['Kullanıcı', ''];
          const fName = nameParts[0];
          const lName = nameParts.slice(1).join(' ');

          const cleanPhone = data.phone === "Belirtilmedi" ? "" : (data.phone || "");
          const cleanTitle = data.title === "AİA Kullanıcısı" ? "" : (data.title || "");
          const cleanBio = data.bio === "AİA Mail platformunu aktif olarak kullanıyorum." ? "" : (data.bio || "");
          const cleanWebsite = data.website === "-" ? "" : (data.website || "");

          const realProfile = {
            firstName: fName,
            lastName: lName,
            title: cleanTitle,
            bio: cleanBio,
            phone: cleanPhone,
            website: cleanWebsite,
            avatar: data.profile_image_url || null,
            email: data.email || ""
          };

          setProfile(realProfile);
          setTempProfile(realProfile);

          // Ana mail adresini de bağlı hesaplar listesine görsel olarak ekle
          const mainEmail = {
            id: 'main', 
            address: data.email, 
            provider_type: data.email?.includes('gmail') ? 'google' : data.email?.includes('yandex') ? 'yandex' : 'other', 
            primary: true, 
            verified: true 
          };
          setEmails(prev => [...prev.filter(e => !e.primary), mainEmail]);
          setTempEmails(prev => [...prev.filter(e => !e.primary), mainEmail]);
        }
      })
      .catch(err => console.error("Profil çekilemedi", err));

      // 2. BACKEND'DEN BAĞLI HESAPLARI ÇEK
      fetch('http://localhost:5000/api/connected-accounts', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setEmails(prev => [...prev.filter(e => e.primary), ...data]);
          setTempEmails(prev => [...prev.filter(e => e.primary), ...data]);
        }
      })
      .catch(err => console.error("Bağlı hesaplar çekilemedi:", err));
    }
  }, []);

  // --- GOOGLE OAUTH DÖNÜŞ MESAJLARINI YAKALAMA ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

    if (success === 'google_connected') {
      alert("Google hesabınız başarıyla bağlandı! 🎉");
      window.history.replaceState(null, '', '/profile');
      window.location.reload(); 
    } else if (error) {
      alert("Hesap bağlama işlemi başarısız oldu veya reddedildi.");
      window.history.replaceState(null, '', '/profile');
    }
  }, []);

  // --- YANDEX / OAUTH ARKA PLAN İŞLEMLERİ ---
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
      const token = new URLSearchParams(hash.substring(1)).get('access_token');
      const userToken = localStorage.getItem('token'); 
      
      if (token && userToken) {
        fetch('http://localhost:5000/api/auth/yandex/connect-profile', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}` 
          },
          body: JSON.stringify({ access_token: token })
        })
        .then(res => res.json())
        .then(data => {
          if(data.success) {
            window.history.replaceState(null, '', '/profile');
            window.location.reload();
          }
        })
        .catch(err => console.error("Bağlama hatası", err));
      }
    }
  }, []);

  const handleYandexConnect = () => {
    const redirectUri = 'http://localhost:5173/profile'; 
    const YANDEX_CLIENT_ID = "de52adf1963248a2b0a4b34a2e6e0b74"; 
    window.location.href = `https://oauth.yandex.com/authorize?response_type=token&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${redirectUri}`;
  };

  const connectOAuth = (provider) => {
    const userToken = localStorage.getItem('token');
    
    if (!userToken) {
      alert("İşlem için giriş yapmış olmanız gerekiyor.");
      return;
    }

    if (provider === 'google') {
      window.location.href = `http://localhost:5000/api/auth/${provider}/connect?token=${userToken}`;
    }
  };

  const startEditing = () => {
    setTempProfile({ ...profile });
    setTempEmails([ ...emails ]);
    setIsEditing(true);
  };

  const cancelEditing = () => setIsEditing(false);

  const saveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const fullName = `${tempProfile.firstName} ${tempProfile.lastName}`.trim();

      const response = await fetch('http://localhost:5000/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          title: tempProfile.title,
          bio: tempProfile.bio,
          phone: tempProfile.phone,
          website: tempProfile.website,
          avatar: tempProfile.avatar 
        })
      });

      if (response.ok) {
        setProfile({ ...tempProfile });
        setEmails([ ...tempEmails ]);
        setIsEditing(false);

        const storedUserStr = localStorage.getItem('user');
        if (storedUserStr) {
          const storedUser = JSON.parse(storedUserStr);
          storedUser.full_name = fullName;
          storedUser.profile_image_url = tempProfile.avatar;
          
  
          storedUser.title = tempProfile.title; 
          
          localStorage.setItem('user', JSON.stringify(storedUser));
        }

        alert("Profil başarıyla kaydedildi! 🎉");
      } else {
        alert("Profil kaydedilirken bir hata oluştu.");
      }
    } catch (err) {
      console.error("Kaydetme hatası:", err);
      alert("Sunucuya ulaşılamadı.");
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempProfile({ ...tempProfile, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const removeEmail = async (id) => {
    const email = tempEmails.find(e => e.id === id || e.account_id === id);
    if (!email) return;
    
    if (email.primary || email.is_primary) {
        alert("Birincil e-postayı silemezsiniz!");
        return;
    }

    if (!window.confirm(`${email.address || email.email_address} hesabını kaldırmak istediğinize emin misiniz?`)) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/connected-accounts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            setTempEmails(tempEmails.filter(e => (e.id !== id && e.account_id !== id)));
            alert("Hesap başarıyla kaldırıldı!");
        } else {
            const error = await response.json();
            alert(error.error || "Hesap kaldırılırken bir hata oluştu.");
        }
    } catch (err) {
        console.error("Silme hatası:", err);
        alert("Sunucuya ulaşılamadı.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const displayData = isEditing ? tempProfile : profile;
  const displayEmails = isEditing ? tempEmails : emails;

  return (
    <>
      <style>{`
        .bg-mesh-gradient {
            background-color: #f8fbfe;
            background-image: 
                radial-gradient(at 0% 0%, rgba(43, 157, 238, 0.05) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(43, 157, 238, 0.05) 0px, transparent 50%);
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(43, 157, 238, 0.1);
        }
        .dark .bg-mesh-gradient {
            background-color: #0a192f;
            background-image: 
                radial-gradient(at 0% 0%, rgba(43, 157, 238, 0.1) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(43, 157, 238, 0.1) 0px, transparent 50%);
        }
        .dark .glass-card {
            background: rgba(15, 23, 42, 0.7);
            border: 1px solid rgba(43, 157, 238, 0.2);
        }
      `}</style>

      <div className="bg-mesh-gradient min-h-screen text-slate-900 dark:text-slate-100 font-sans">
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          
          {/* Top Navigation & Logo & Master Edit Button */}
          <div className="flex items-center justify-between mb-10">
            {/* Geri Butonu */}
            <button 
              onClick={() => navigate('/mail')}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-[#2b9dee] border border-[#2b9dee]/20 rounded-xl font-semibold text-sm transition-all hover:bg-[#2b9dee]/5"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Geri Dön</span>
            </button>
            
            {/* AİA LOGOSU */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/mail')}>
              <div className="p-1.5 rounded-lg shrink-0 bg-[#0078D4] shadow-lg shadow-blue-500/20 dark:bg-transparent">
                <Mail className="text-white dark:text-[#06b6d4] w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">AİA</h1>
              </div>
            </div>

            {/* 🔥 YENİ: SAĞ ÜST MASTER DÜZENLEME BUTONLARI */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button 
                  onClick={startEditing} 
                  className="bg-[#2b9dee] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-[#2b9dee]/20 hover:bg-[#2b9dee]/90 transition-all flex items-center gap-2"
                >
                  <Edit2 size={16} /> <span className="hidden sm:inline">Profili Düzenle</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={cancelEditing} 
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
                  >
                    <X size={16} /> <span className="hidden sm:inline">İptal</span>
                  </button>
                  <button 
                    onClick={saveChanges} 
                    className="bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-green-600 transition-all flex items-center gap-2 animate-in zoom-in-95"
                  >
                    <Check size={16} /> <span className="hidden sm:inline">Kaydet</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Header (Resim ve İsim) */}
          <div className="glass-card rounded-2xl p-8 mb-8 flex flex-col items-center md:flex-row md:items-center gap-8 shadow-sm">
            <div className="relative shrink-0">
              <div 
                className={`w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center ${isEditing ? 'cursor-pointer ring-4 ring-[#2b9dee]/30 transition-all' : ''}`}
                onClick={() => isEditing && fileInputRef.current?.click()}
              >
                {displayData.avatar ? (
                  <img src={displayData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={56} className="text-slate-400 dark:text-slate-500" />
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="text-white mb-1" size={24} />
                    <span className="text-[10px] text-white font-bold">Değiştir</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoSelect} />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              {isEditing ? (
                <div className="space-y-3 max-w-sm mx-auto md:mx-0 animate-in fade-in duration-300">
                  <div className="flex gap-3">
                    <Input value={displayData.firstName} onChange={(e) => setTempProfile({...tempProfile, firstName: e.target.value})} placeholder="Ad" />
                    <Input value={displayData.lastName} onChange={(e) => setTempProfile({...tempProfile, lastName: e.target.value})} placeholder="Soyad" />
                  </div>
                  <Input value={displayData.title} onChange={(e) => setTempProfile({...tempProfile, title: e.target.value})} placeholder="Unvan (Örn: Yazılım Mühendisi)" icon={Briefcase} />
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {displayData.firstName} {displayData.lastName}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">
                    {displayData.title || "AİA Kullanıcısı"}
                  </p>
                  
                  {/* Share Butonu (Sadece İzleme Modunda) */}
                  <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center md:justify-start gap-2 mx-auto md:mx-0">
                    <Share2 size={14} /> Profili Paylaş
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Info Grid (Hakkımda & İletişim) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Hakkımda Section */}
            <div className={`glass-card rounded-2xl p-6 shadow-sm transition-all ${isEditing ? 'ring-1 ring-[#2b9dee]/50' : ''}`}>
              <div className="flex items-center gap-2 mb-4">
                <User className="text-[#2b9dee]" size={20} />
                <h2 className="text-lg font-bold">Hakkımda</h2>
              </div>
              {isEditing ? (
                <div className="animate-in fade-in duration-300">
                  <TextArea value={displayData.bio} onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})} rows={4} placeholder="Kendinizden bahsedin..." />
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm animate-in fade-in duration-300">
                  {displayData.bio || "AİA Mail platformunu aktif olarak kullanıyorum."}
                </p>
              )}
            </div>

            {/* İletişim Section */}
            <div className={`glass-card rounded-2xl p-6 shadow-sm transition-all ${isEditing ? 'ring-1 ring-[#2b9dee]/50' : ''}`}>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="text-[#2b9dee]" size={20} />
                <h2 className="text-lg font-bold">İletişim</h2>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Telefon</span>
                  {isEditing ? (
                    <div className="animate-in fade-in duration-300">
                      <Input value={displayData.phone} onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})} placeholder="Telefon Numarası (Opsiyonel)" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 text-sm animate-in fade-in duration-300">
                      <Phone size={16} />
                      <span className={!displayData.phone ? "text-slate-400 italic" : ""}>
                        {displayData.phone || "Belirtilmedi"}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">E-Posta (Kayıtlı)</span>
                  <div className="flex items-center gap-2 text-[#2b9dee] text-sm bg-[#2b9dee]/5 p-2 rounded-lg border border-[#2b9dee]/10">
                    <Mail size={16} />
                    <span className="font-medium">{displayData.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className={`glass-card rounded-2xl p-6 shadow-sm mb-8 transition-all ${isEditing ? 'ring-1 ring-[#2b9dee]/50' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LinkIcon className="text-[#2b9dee]" size={20} />
                <h2 className="text-lg font-bold">Bağlı Hesaplar</h2>
              </div>
              {/* ESKİ DÜZENLE YAZISI BURADAN SİLİNDİ */}
            </div>
            
            <div className="space-y-3">
              {displayEmails.map((email, idx) => {
                const isGoogle = email.provider_type === 'google' || email.address?.includes('gmail');
                const isYandex = email.provider_type === 'yandex' || email.address?.includes('yandex');
                
                let providerTitle = "Microsoft Outlook / Diğer";
                if (isGoogle) providerTitle = "Google Workspace";
                if (isYandex) providerTitle = "Yandex Mail";

                return (
                  <div key={idx} className={`flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border transition-colors ${isEditing ? 'border-[#2b9dee]/30 bg-white dark:bg-slate-800' : 'border-slate-100 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm shrink-0">
                        {isGoogle ? (
                           <Chrome size={20} className="text-red-500" />
                        ) : isYandex ? (
                           <span className="text-[#ff0000] font-black text-lg">Y</span>
                        ) : (
                           <Mail size={20} className="text-[#0078d4]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{email.address || email.email_address}</p>
                        <p className="text-xs text-slate-500">{providerTitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {email.primary || email.is_primary ? (
                        <span className="px-3 py-1 bg-[#2b9dee]/10 text-[#2b9dee] text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Ana Hesap
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Bağlı
                        </span>
                      )}

                      {/* Silme Butonu Sadece Düzenleme Modunda Çıkar */}
                      {isEditing && !email.primary && !email.is_primary && (
                        <button onClick={() => removeEmail(email.id)} className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors ml-2 animate-in zoom-in-95" title="Hesabı Kaldır">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Yeni Ekleme Butonları (Sadece Düzenleme Modunda) */}
            {isEditing && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-4 duration-300">
                <button 
                  onClick={() => connectOAuth('google')} 
                  className="flex items-center justify-center gap-2 p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-all text-sm shadow-sm"
                >
                  <Chrome size={18} className="text-red-500"/> Google İle Bağlan
                </button>
                <button 
                  onClick={handleYandexConnect} 
                  className="flex items-center justify-center gap-2 p-3.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/30 rounded-xl font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-300 transition-all text-sm shadow-sm"
                >
                  <AtSign size={18} /> Yandex İle Bağlan
                </button>
              </div>
            )}
          </div>

          {/* Bottom Logout Button */}
          {!isEditing && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in">
              <button 
                onClick={handleLogout}
                className="w-full max-w-xs flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 rounded-2xl font-bold transition-all hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <LogOut size={20} /> Çıkış Yap
              </button>
              <p className="text-xs text-slate-400 text-center font-medium">
                AİA Platform v2.4.0 • Tüm hakları saklıdır.
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}