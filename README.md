# 🚀 AİA - Akıllı İletişim Asistanı (Smart Communication Assistant)

**Llama-3.1 & Dağıtık Kuyruk Mimarisi Destekli Otonom E-Posta Yönetim Sistemi**

AİA, geleneksel e-posta istemcilerinin (client) ötesine geçerek bilgi yığınını otonom olarak düzenleyen, yapay zeka destekli modern bir iletişim asistanıdır. Gelen e-postaları bağlamına (context) göre anında sınıflandırır, içerikteki tarih/saat bilgilerinden otomatik takvim etkinlikleri oluşturur ve çift katmanlı filtreleme ile modern oltalama (phishing) saldırılarını engeller.

Sistem; sunucu yükünü optimize eden asenkron kuyruk yönetimi ve yüksek hata toleransına sahip (fault-tolerant) dağıtık bir mimari üzerine inşa edilmiştir.

### ✨ Temel Özellikler ve Mimari Güç

* **🧠 Üstün NLP Performansı:** Groq üzerinde çalışan **Llama-3.1** entegrasyonu ile 120ms gecikme süresi ve **%96.2 Doğruluk (Accuracy)** oranıyla bağlam farkındalıklı analiz.
* **📡 Gerçek Zamanlı Radar (IMAP Idle):** E-posta sağlayıcılarını (Gmail/Yandex) sunucuyu yormadan (polling olmadan) canlı dinleyen asenkron soket mimarisi.
* **⚙️ Deep Sync & Dağıtık Kuyruk:** İşlemciyi bloke etmemek için **Redis** ve **BullMQ** kullanılarak kurulan, otomatik onarım (retry) yetenekli asenkron iş kuyruğu.
* **🔒 Güvenli Token Kası (Vault):** OAuth 2.0 protokolü ile şifresiz, sürekli yenilenen ve izole edilmiş (Row-Level Security) PostgreSQL veri yönetimi.
* **🛡️ Çift Katmanlı Spam Koruması:** Kural tabanlı (Heuristic) ön filtre ve derin öğrenme destekli ikincil analiz.

### 🛠️ Kullanılan Teknolojiler

* **Frontend:** React, TailwindCSS, Chart.js (Glassmorphism UI)
* **Backend:** Node.js (Express), Python (Flask - AI Microservice)
* **Veritabanı & Önbellek:** PostgreSQL, Redis
* **Kuyruk Yönetimi:** BullMQ
* **Yapay Zeka:** Groq API, Llama-3.1 (LLM), HuggingFace (Text Classification)
