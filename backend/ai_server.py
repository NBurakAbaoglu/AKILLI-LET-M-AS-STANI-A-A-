from flask import Flask, request, jsonify
from transformers import pipeline
import re

app = Flask(__name__)

# Modeli ve Tokenizer'ı klasörden yükle
model_path = "./ai_model"  # Klasör adını doğru yazdığından emin ol

print("🧠 Yapay Zeka Modeli Yükleniyor... Lütfen bekleyin ⏳")
# Hugging Face pipeline ile modeli canlandırıyoruz
classifier = pipeline("text-classification", model=model_path, tokenizer=model_path)
print("✅ AI Sunucusu Hazır! 5001 portunda dinleniyor...")

def clean_text(text):
    text = re.sub('<.*?>', ' ', str(text)) # HTML'leri temizle
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text[:512] # Model patlamasın diye ilk 512 karakteri al

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({'category': 'other'})
        
    cleaned_text = clean_text(text)
    
    try:
       # Yapay zekaya tahminde bulunmasını söylüyoruz
        result = classifier(cleaned_text)
        predicted_label = result[0]['label'] 
        score = result[0]['score']
        
        # 🚀 GÜNCELLENMİŞ EŞLEŞTİRME SÖZLÜĞÜ
        label_mapping = {
            'LABEL_0': 'seyahat',    'seyahat': 'seyahat',
            'LABEL_1': 'resmi',      'resmi': 'resmi',
            'LABEL_2': 'eğitim',     'eğitim': 'eğitim',
            'LABEL_3': 'sağlık',     'sağlık': 'sağlık',
            'LABEL_4': 'alışveriş',  'alışveriş': 'alışveriş',
            'LABEL_5': 'iş',         'iş': 'iş',
            'LABEL_6': 'teknik',     'teknik': 'teknik',
            'LABEL_7': 'other',      'spam': 'other', # 🚀 İŞTE BURASI: AI inatla spam derse, 'other' (Diğer) yap!
            'LABEL_8': 'bankacılık', 'bankacılık': 'bankacılık',
            'LABEL_9': 'sosyal',     'sosyal': 'sosyal'
        }
        
        # Eşleşmeyi bul, bulamazsan ham halini kullan
        final_category = label_mapping.get(predicted_label, predicted_label)
        
        # Ekstra Güvenlik: Her ihtimale karşı final_category hala 'spam' ise ez ve 'other' yap
        if final_category == 'spam':
            final_category = 'other'
        
        print(f"🤖 {final_category.upper()} (Eminlik: %{score*100:.1f}) | Ham: {predicted_label}")
        
        return jsonify({'category': final_category})
    except Exception as e:
        print("Tahmin Hatası:", e)
        return jsonify({'category': 'other'})
if __name__ == '__main__':
    # Node.js 5000'de çalıştığı için bunu 5001'de çalıştırıyoruz
    app.run(port=5001, debug=False)