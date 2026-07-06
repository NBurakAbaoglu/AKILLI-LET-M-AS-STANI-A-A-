from flask import Flask, request, jsonify
from transformers import pipeline
import re
import os
from flask_cors import CORS
from groq import Groq # YENİ: Google yerine Groq kullanıyoruz
import json
import google.generativeai as genai

# Google Gemini API Anahtarını buraya yapıştır
genai.configure(api_key="")
# LÜTFEN ALDIĞIN GROQ API ANAHTARINI BURAYA YAZ 
groq_client = Groq(api_key="")

app = Flask(__name__)
CORS(app)

# Modeli ve Tokenizer'ı klasörden yükle
model_path = "./ai_model"  

print("🧠 Kendi Eğittiğimiz Yapay Zeka Modeli Yükleniyor... Lütfen bekleyin ⏳")
classifier = pipeline("text-classification", model=model_path, tokenizer=model_path)
print("✅ AI Sunucusu Hazır! 5001 portunda dinleniyor...")

def clean_text(text):
    text = re.sub('<.*?>', ' ', str(text)) # HTML'leri temizle
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text[:512] # Model patlamasın diye ilk 512 karakteri al

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    subject = data.get('subject', '')
    text = data.get('text', '')

    # 🚀 YENİ: Süper Zeki Spam ve Kategori Asistanı (Groq - Llama 3)
    prompt = f"""
    Sen dünyanın en zeki e-posta sınıflandırma ve spam tespit asistanısın.
    Aşağıdaki e-postayı analiz et ve içeriğine göre SADECE ŞU KATEGORİLERDEN BİRİNİ SEÇ:
    'İş', 'Eğitim', 'Bankacılık', 'Sağlık', 'Alışveriş', 'Seyahat', 'Resmi', 'Teknik', 'Sosyal', 'Eğlence', 'Spam'

    🔴 ÇOK ÖNEMLİ SPAM KURALI: 
    Eğer e-posta İngilizce veya Türkçe olarak "indirim, 40% off, fırsat, hemen tıkla, claim, discount, offer ends soon, hurry, win" gibi reklam, pazarlama, dolandırıcılık veya istenmeyen bülten özellikleri taşıyorsa KESİNLİKLE "Spam" kategorisini seçmelisin. Hiç acıma!

    SADECE AŞAĞIDAKİ JSON FORMATINDA YANIT VER. Başka hiçbir kelime veya markdown kullanma:
    {{
      "label": "SEÇTİĞİN_KATEGORİ",
      "score": 0.99
    }}

    E-posta Konusu: {subject}
    E-posta İçeriği: {text[:800]}
    """

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            # 🚀 AĞIR 70B MODELİ YERİNE HAFİF VE HIZLI MODEL
            model="llama-3.1-8b-instant",
            temperature=0.1, 
        )
        
        result_text = chat_completion.choices[0].message.content.replace('```json', '').replace('```', '').strip()
        result_json = json.loads(result_text)
        
        label = result_json.get("label", "SOSYAL").upper()
        score = result_json.get("score", 0.90)
        
        return jsonify([{"label": label, "score": score}])
        
    except Exception as e:
        print("🤖 AI Sınıflandırma Hatası:", e)
        # Hata olursa zararsız bir kategoriye atalım ki sistem çökmesin
        return jsonify([{"label": "SOSYAL", "score": 0.50}])
@app.route('/generate-reply', methods=['POST'])
def generate_reply():
    data = request.json
    sender_name = data.get('sender_name', '')
    subject = data.get('subject', '')
    email_text = data.get('email_text', '')

    prompt = f"""
    Sen son derece profesyonel, zeki ve çözüm odaklı bir şirket asistanısın. 
    Aşağıda sana gelen bir e-posta var. Bu e-postanın içeriğini dikkatlice analiz et ve gönderen kişiye konunun içeriğiyle doğrudan bağlantılı, mantıklı, gerçekçi ve doyurucu bir yanıt hazırla.

    Kurallar:
    1. Asla sadece "mesajınızı aldık, döneceğiz" gibi basmakalıp laflar etme. Eğer e-postada bir soru varsa varsayımsal ama mantıklı bir cevap üret. Eğer bir talep varsa, talebin işleme alındığını detaylarıyla belirt.
    2. Son derece kibar ve kurumsal bir Türkçe kullan.
    3. Yanıt HTML formatında olmalı. Sadece alt satıra geçmek için <br><br> etiketleri kullan. Markdown, ```html veya <body> gibi etiketleri KESİNLİKLE KULLANMA.
    4. Cümleye "Sayın {sender_name}" şeklinde başla.

    Gönderen Kişi: {sender_name}
    Konu: {subject}
    Gelen Mesaj İçeriği: {email_text}
    
    Profesyonel ve Gerçekçi Yanıtın:
    """
    
    try:
        # KESİN ÇÖZÜM: Meta'nın Llama 3 modelini Groq çipleriyle kullanıyoruz
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile", # 🚀 YENİ VE ÇOK DAHA ZEKİ MODEL
            temperature=0.5,
        )
        
        reply_text = chat_completion.choices[0].message.content.replace('```html', '').replace('```', '').strip()
        print(f"✨ Llama-3 Yanıt Üretti: {sender_name} için")
        return jsonify({'reply': reply_text})
        
    except Exception as e:
        print("AI Üretim Hatası:", e)
        
        fallback_reply = (
            f"Sayın {sender_name},<br><br>"
            f"E-postanız tarafıma ulaşmıştır. Konuyu inceliyor, "
            f"en kısa sürede detaylı dönüş yapacağımı bildirmek isterim.<br><br>"
            f"Saygılarımla,"
        )
        return jsonify({'reply': fallback_reply})
@app.route('/generate-draft', methods=['POST'])
def generate_draft():
    data = request.json
    subject = data.get('subject', '')

    prompt = f"""
    Sen son derece profesyonel, zeki ve yaratıcı bir kurumsal e-posta asistanısın.
    Kullanıcı sana yeni bir e-posta göndermek için sadece bir "Konu" (Subject) başlığı verdi. 
    Bu konuya bakarak, mantıklı, profesyonel, akıcı ve direkt gönderilmeye hazır bir e-posta metni (gövdesi) oluştur.

    Kurallar:
    1. İçerik tamamen HTML formatında olmalı. Alt satıra geçmek için <br><br> etiketleri kullan.
    2. Markdown, ```html veya <body> gibi etiketleri KESİNLİKLE KULLANMA. Direkt düz metin ver.
    3. Hitap (Sayın İlgili vb.) ve kapanış (Saygılarımla) kısımları içersin.
    4. Sadece Konu'ya uygun, hayal gücünü kullanarak mantıklı bir senaryo üret.

    Kullanıcının Girdiği Konu: {subject}
    
    Mükemmel E-posta Taslağı:
    """
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7, # Yaratıcılığı biraz artırdık
        )
        
        draft_text = chat_completion.choices[0].message.content.replace('```html', '').replace('```', '').strip()
        print(f"✨ Llama-3 Taslak Üretti: Konu -> {subject}")
        return jsonify({'draft': draft_text})
        
    except Exception as e:
        print("AI Taslak Üretim Hatası:", e)
        return jsonify({'draft': f'Sayın İlgili,<br><br>{subject} konusu hakkında detaylı bilgileri aşağıda bulabilirsiniz.<br><br>Saygılarımla,'})
@app.route('/extract-event', methods=['POST'])
def extract_event():
    data = request.json
    subject = data.get('subject', '')
    text = data.get('text', '')
    received_date = data.get('received_date', '') # Node.js'den gelen mailin atıldığı tarih

    # Yapay zekaya günün tarihini veriyoruz ve gün kelimesi yoksa ne yapacağını öğretiyoruz
    prompt = f"""
    Sen bir etkinlik çıkarıcı asistansın.
    Aşağıdaki e-postayı analiz et. İçinde yapılacak bir toplantı, ders, mülakat, etkinlik veya randevu geçiyorsa bunu tespit et.
    
    ÖNEMLİ BİLGİ: Bu e-posta {received_date} tarihinde gönderilmiştir. 
    Eğer metinde "bugün" diyorsa {received_date} tarihini baz al. 
    "Yarın" diyorsa takvimde bir sonraki günü hesapla. 
    "Pazartesi" diyorsa o haftanın pazartesi gününü bul.
    EĞER METİNDE HİÇBİR GÜN BELİRTİLMEDEN SADECE SAAT VERİLMİŞSE (Örn: 'saat 13:28 de toplantı var'), GÜN OLARAK VARSAYILAN OLARAK E-POSTANIN GÖNDERİLDİĞİ GÜNÜ YANİ {received_date} TARİHİNİ SEÇ.
    
    SADECE VE SADECE AŞAĞIDAKİ JSON FORMATINDA YANIT VER. BAŞKA HİÇBİR KELİME KULLANMA. Markdown kullanma.
    {{
      "has_event": true veya false,
      "title": "Etkinliğin Adı (Örn: İş Görüşmesi, Staj Toplantısı, Okul Toplantısı)",
      "date": "YYYY-MM-DD",
      "time": "HH:MM"
    }}
    
    E-posta Konusu: {subject}
    E-posta İçeriği: {text[:1000]}
    """
    
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
        )
        
        result_text = chat_completion.choices[0].message.content.replace('```json', '').replace('```', '').strip()
        result_json = json.loads(result_text)
        return jsonify(result_json)
    except Exception as e:
        print("Etkinlik Çıkarma Hatası:", e)
        return jsonify({"has_event": False})

# 🚀 YENİ: EKSİK OLAN CHATBOT ROTASINI EKLEDIK
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    history = data.get('history', [])

    system_prompt = """
    Sen AİA (Akıllı İletişim Asistanı) adında çok yetenekli, genel amaçlı ve Türkçe konuşan zeki bir yapay zekasın. 
    Bu e-posta ve takvim uygulamasına entegre edilmiş olsan da, DÜNYADAKİ HER KONUDA (bilim, tarih, günlük yaşam, yazılım, genel kültür vb.) kullanıcıya yardımcı olabilir, sohbet edebilir ve tüm sorularını yanıtlayabilirsin. Kendini asla sadece e-posta veya takvimle kısıtlama!

    Eğer kullanıcı sana uygulamanın nasıl çalıştığını sorarsa (mail atma, takvim vb.), sistemin özelliklerini anlat. 
    Ancak kullanıcı hava durumunu, kuantum fiziğini, yemek tarifini veya herhangi bir genel konuyu sorarsa, sanki ChatGPT gibi kapsamlı, doğal ve zekice cevaplar ver.

    SADECE VE SADECE AŞAĞIDAKİ JSON FORMATINDA YANIT VER. Başka hiçbir metin veya markdown (```json vb) ekleme.
    Üreteceğin buton önerilerini ("options"), kullanıcının sorduğu konuya uygun olarak dinamik belirle.
    {
      "reply": "Kullanıcıya vereceğin kapsamlı, doğal ve açıklayıcı cevap metni.",
      "options": ["Konuyla ilgili 1. soru/öneri", "Konuyla ilgili 2. soru/öneri"]
    }
    """


    messages = [{"role": "system", "content": system_prompt}]
    for msg in history[-6:]:
        role = "user" if msg.get('sender') == 'user' else "assistant"
        messages.append({"role": role, "content": msg.get('text', '')})
        
    messages.append({"role": "user", "content": user_message})

    try:
        chat_completion = groq_client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.4, 
        )
        
        raw_text = chat_completion.choices[0].message.content.strip()
        
        # 🚀 KRİTİK DÜZELTME: JSON bloğunu bulup temizlemek
        # AI bazen başında "Sure!" veya "Here is the response:" diyebilir, bunları temizliyoruz
        if "{" in raw_text and "}" in raw_text:
            json_str = raw_text[raw_text.find("{"):raw_text.rfind("}")+1]
            return jsonify(json.loads(json_str))
        else:
            # Eğer JSON bulamazsa, metni JSON'a sarıp gönderiyoruz
            return jsonify({"reply": raw_text, "options": []})
        
    except Exception as e:
        print("Chatbot Hatası:", e)
        return jsonify({
            'reply': 'Üzgünüm, şu an bağlantı kuramadım ama sorunuza genel olarak bakarsak...', 
            'options': ['Tekrar Dene']
        })
@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text', '')

    prompt = f"""
    Sen profesyonel bir e-posta analiz ve özetleme asistansın.
    Aşağıdaki e-postayı okuyup, en önemli mesajını 2-3 cümleyle kısaca özetle.
    Ayrıca e-postanın genel duygu durumunu (Olumlu, Olumsuz, Nötr veya Bilgilendirme) belirt.
    Varsa, e-postadaki aksiyon maddelerini (yapılması gerekenleri) çıkar.

    SADECE AŞAĞIDAKİ JSON FORMATINDA YANIT VER:
    {{
      "summary": "Özet metni buraya gelecek...",
      "sentiment": "Olumlu",
      "confidence": 0.95,
      "actionItems": ["Madde 1", "Madde 2"]
    }}

    E-posta İçeriği:
    {text[:2000]} 
    """

    try:
        # 🚀 KESİN ÇÖZÜM: API anahtarına tanımlı AKTİF modelleri Google'dan çekiyoruz
        available_models = [
            m.name for m in genai.list_models() 
            if 'generateContent' in m.supported_generation_methods
        ]
        
        if not available_models:
            raise Exception("API anahtarına tanımlı geçerli bir model bulunamadı.")
            
        # Hızlı olduğu için öncelikle isminde 'flash' geçen modeli arıyoruz
        selected_model = available_models[0] 
        for model_name in available_models:
            if 'flash' in model_name.lower():
                selected_model = model_name
                break
                
        print(f"✨ Gemini Otomatik Model Seçildi: {selected_model}")
        
        # Seçilen kusursuz modelle işlemi yapıyoruz
        model = genai.GenerativeModel(selected_model)
        response = model.generate_content(prompt)
        
        result_text = response.text.replace('```json', '').replace('```', '').strip()
        
        return jsonify(json.loads(result_text))
        
    except Exception as e:
        print("Gemini Özetleme Hatası:", e)
        error_msg = str(e)
        
        if "429" in error_msg or "quota" in error_msg.lower():
            summary_text = "Google Gemini şu an çok yoğun. Lütfen kısa bir süre sonra tekrar deneyin."
        else:
            summary_text = "Yapay zeka özeti oluşturulurken bir bağlantı sorunu yaşandı."
            
        return jsonify({
            "summary": summary_text, 
            "sentiment": "Uyarı", 
            "confidence": 0.0, 
            "actionItems": []
        })
if __name__ == '__main__':
    app.run(debug=True, port=5001)