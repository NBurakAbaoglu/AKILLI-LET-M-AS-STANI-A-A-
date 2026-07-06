import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ChevronDown } from 'lucide-react'; 

// SAĞLAYICI SEÇENEKLERİ
const PROVIDERS = [
  { 
    id: 'google', 
    name: 'Google', 
    domain: '@gmail.com', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
  },
  { 
    id: 'yandex', 
    name: 'Yandex', 
    domain: '@yandex.com', 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.428 21.643h-4.04V13.8l-4.59-11.44h4.316l2.36 6.84 2.26-6.84h4.08l-4.386 11.13v8.153z" fill="#FC3F1D"/></svg>
  }
];


const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // DİKKAT: Artık email için sadece "kullanıcı adını" tutuyoruz
  const [emailUsername, setEmailUsername] = useState('');
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const [provider, setProvider] = useState('google'); 
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); 
  
  const selectedProviderObj = PROVIDERS.find(p => p.id === provider);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // API'YE GÖNDERMEDEN ÖNCE TAM MAİL ADRESİNİ BİRLEŞTİRİYORUZ
    const finalEmail = provider === 'other' 
      ? emailUsername // Kullanıcı diğer'i seçip kendi tam yazdıysa
      : `${emailUsername.replace(/@.*$/, '')}${selectedProviderObj.domain}`; // Eğer el alışkanlığıyla @ yazdıysa, onu silip kendi domainimizi ekliyoruz.

    if (!firstName || !lastName || !emailUsername || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    if (!termsAccepted) {
      setError("Kullanım koşullarını ve gizlilik politikasını kabul etmelisiniz.");
      return;
    }
    if (password.length < 6) {
      setError('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: `${firstName} ${lastName}`.trim(),
          email: finalEmail, 
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Kayıt olurken bir hata oluştu.');
      }

      // Arka planda giriş yap
      const loginResponse = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: finalEmail, password }),
      });
      
      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        localStorage.setItem('token', loginData.access_token);
        localStorage.setItem('user', JSON.stringify(loginData.user_info));
        
        if (provider === 'google' || provider === 'yandex') {
          setSuccessMsg(`Kayıt başarılı! ${provider === 'google' ? 'Google' : 'Yandex'} yetki ekranına yönlendiriliyorsunuz...`);
          setTimeout(() => {
            window.location.href = `http://localhost:5000/api/auth/${provider}/connect?token=${loginData.access_token}&platform=web`;
          }, 1500);
        } else {
          setSuccessMsg('Kayıt başarılı! Yönlendiriliyorsunuz...');
          setTimeout(() => navigate('/mail'), 1500);
        }
      } else {
        setSuccessMsg('Kayıt oluşturuldu! Lütfen giriş yapın.');
        setTimeout(() => navigate('/login'), 1500);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-display bg-[#f6f7f8] min-h-screen text-slate-900 relative overflow-x-hidden selection:bg-[#2b9dee]/30">
      
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#2b9dee]/15 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] rounded-full bg-blue-300/15 blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="relative flex min-h-screen w-full flex-col">
        
        {/* Navbar */}
        <header className="flex items-center justify-between whitespace-nowrap px-6 py-6 w-full max-w-[1300px] mx-auto z-10 shrink-0">
          <div className="flex items-center gap-2.5 text-[#2b9dee]">
            <div className="w-8 h-8 bg-[#2b9dee] rounded-lg flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
            </div>
            <h2 className="text-slate-900 text-xl font-black leading-tight tracking-tight">AİA</h2>
          </div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-7">
              <a className="text-slate-600 hover:text-[#2b9dee] text-sm font-medium transition-colors" href="/#urun">Özellikler</a>
              <a className="text-slate-600 hover:text-[#2b9dee] text-sm font-medium transition-colors" href="/#fiyatlandirma">Fiyatlandırma</a>
              <a className="text-slate-600 hover:text-[#2b9dee] text-sm font-medium transition-colors" href="/#guvenlik">Destek</a>
            </nav>
            <button 
              onClick={() => navigate('/login')} 
              className="flex min-w-[100px] items-center justify-center rounded-full h-10 px-5 border border-[#2b9dee]/20 bg-white/50 text-[#2b9dee] text-sm font-bold hover:bg-white transition-all shadow-sm"
            >
              Giriş Yap
            </button>
          </div>
        </header>

        {/* Ana İçerik */}
        <main className="flex-1 flex items-center justify-center p-4 lg:p-10 z-10 w-full">
          <div className="w-full max-w-[1200px] flex flex-row flex-nowrap items-center justify-between gap-12">
            
            {/* Sol Taraf */}
            <div className="flex-1 flex flex-col gap-8 min-w-[500px]">
              <div className="flex flex-col gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#2b9dee]/10 text-[#2b9dee] text-xs font-bold uppercase tracking-wider w-fit">
                  Yapay Zeka Devrimi
                </span>
                <h1 className="text-slate-900 text-4xl lg:text-5xl xl:text-[54px] font-black leading-[1.05] tracking-tight">
                  AİA - Geleceğin<br/>E-posta Yönetimi
                </h1>
                <p className="text-slate-600 text-base lg:text-[17px] max-w-[500px] leading-relaxed font-medium mt-1">
                  Gelen kutunuzu yapay zeka ile yönetin. Akıllı asistanınız sayesinde iş akışınızı hızlandırın ve zaman kazanın.
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-[500px]">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/60 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f2ff] flex items-center justify-center text-[#4a90e2] shrink-0">
                    <span className="material-symbols-outlined">category</span>
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-slate-900 font-bold text-[17px] mb-0.5">Akıllı Kategorizasyon</h3>
                    <p className="text-slate-500 text-[14px] font-medium leading-relaxed">E-postalarınız içeriklerine göre otomatik olarak klasörlenir ve önceliklendirilir.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-md shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white/60 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[#f4e8ff] flex items-center justify-center text-[#9013fe] shrink-0">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <div className="pt-0.5">
                    <h3 className="text-slate-900 font-bold text-[17px] mb-0.5">Yapay Zeka Yanıtları</h3>
                    <p className="text-slate-500 text-[14px] font-medium leading-relaxed">Gelen mesajlara bağlamı anlayarak tek tıkla profesyonel yanıt taslakları oluşturun.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Taraf - Kayıt Formu */}
            <div className="w-[450px] shrink-0">
              <div className="w-full rounded-[2rem] bg-white/70 backdrop-blur-xl p-8 lg:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-white/80">
                <div className="mb-8">
                  <h2 className="text-[28px] font-extrabold text-slate-900 mb-1">Hesap Oluştur</h2>
                  <p className="text-slate-500 font-medium text-[15px]">Hemen kaydolun ve e-postalarınızı bağlayın.</p>
                </div>

                {error && <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-semibold">{error}</div>}
                {successMsg && <div className="mb-5 p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm font-semibold">{successMsg}</div>}

                <form className="space-y-4" onSubmit={handleRegister}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-slate-800 ml-1">Ad</label>
                      <input 
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-[14px] border border-slate-200/80 bg-white/60 px-4 py-3 text-[14px] focus:border-[#2b9dee] focus:ring-2 focus:ring-[#2b9dee]/20 transition-all outline-none placeholder:text-slate-400" 
                        placeholder="Can" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-bold text-slate-800 ml-1">Soyad</label>
                      <input 
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full rounded-[14px] border border-slate-200/80 bg-white/60 px-4 py-3 text-[14px] focus:border-[#2b9dee] focus:ring-2 focus:ring-[#2b9dee]/20 transition-all outline-none placeholder:text-slate-400" 
                        placeholder="Yılmaz" 
                      />
                    </div>
                  </div>
                  
                  {/* --- ŞIK E-POSTA VE DROPDOWN ALANI --- */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-800 ml-1">E-posta ve Sağlayıcı</label>
                    <div className="flex gap-2">
                      
                      {/* E-posta Inputu ve Domain Gösterimi */}
                      <div className="relative flex-1 flex items-center w-full rounded-[14px] border border-slate-200/80 bg-white/60 focus-within:border-[#2b9dee] focus-within:ring-2 focus-within:ring-[#2b9dee]/20 transition-all overflow-hidden">
                        <input 
                          type="text" 
                          value={emailUsername}
                          onChange={(e) => setEmailUsername(e.target.value)}
                          className="w-full bg-transparent px-4 py-3 text-[14px] outline-none placeholder:text-slate-400" 
                          placeholder={provider === 'other' ? "ornek@mail.com" : "ornek"} 
                        />
                        {/* Seçili sağlayıcının domaini kullanıcının gözüne sokuluyor */}
                        {provider !== 'other' && (
                          <span className="pr-4 text-slate-500 font-semibold text-[14px] select-none">
                            {selectedProviderObj.domain}
                          </span>
                        )}
                      </div>
                      
                      {/* Özel Seçici Buton */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsProviderMenuOpen(!isProviderMenuOpen)}
                          className={`flex items-center justify-between gap-2 w-[115px] h-[46px] rounded-[14px] border border-slate-200/80 px-3 py-3 text-[13px] font-bold text-slate-700 transition-all outline-none ${isProviderMenuOpen ? 'bg-white ring-2 ring-[#2b9dee]/20 border-[#2b9dee]' : 'bg-white/60 hover:bg-white'}`}
                        >
                          <div className="flex items-center gap-2">
                            {selectedProviderObj?.icon}
                            <span>{selectedProviderObj?.name}</span>
                          </div>
                          <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProviderMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Açılır Liste */}
                        {isProviderMenuOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-20" 
                              onClick={() => setIsProviderMenuOpen(false)}
                            ></div>
                            
                            <div className="absolute right-0 top-[calc(100%+8px)] w-[140px] bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-[14px] shadow-xl z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1.5">
                              {PROVIDERS.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => {
                                    setProvider(p.id);
                                    setIsProviderMenuOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${provider === p.id ? 'bg-[#2b9dee]/10 text-[#2b9dee]' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                  {p.icon}
                                  {p.name}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-slate-800 ml-1">Şifre</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-[14px] border border-slate-200/80 bg-white/60 px-4 py-3 pr-10 text-[14px] focus:border-[#2b9dee] focus:ring-2 focus:ring-[#2b9dee]/20 transition-all outline-none placeholder:text-slate-400" 
                        placeholder="••••••••" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 py-2 ml-1">
                    <input 
                      type="checkbox" 
                      id="terms" 
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="rounded border-slate-300 text-[#2b9dee] focus:ring-[#2b9dee]/20 w-[16px] h-[16px] cursor-pointer" 
                    />
                    <label className="text-[13px] text-slate-500 cursor-pointer font-medium" htmlFor="terms">
                      <a className="text-[#2b9dee] hover:underline" href="#">Kullanım Koşulları</a>'nı ve <a className="text-[#2b9dee] hover:underline" href="#">Gizlilik Politikası</a>'nı kabul ediyorum.
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`w-full rounded-2xl bg-[#2b9dee] py-4 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-[#208ad6] hover:-translate-y-0.5 transition-all active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur ve Bağla'}
                  </button>
                </form>

                <p className="mt-7 text-center text-[14px] text-slate-500 font-medium">
                  Zaten hesabınız var mı? 
                  <Link className="font-bold text-[#2b9dee] hover:underline ml-1" to="/login">Giriş Yap</Link>
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Register;