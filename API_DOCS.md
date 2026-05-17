# Fitty REST API Dokümantasyonu

Bu dosya, Fitty backend uygulamasındaki tüm API endpoint'lerini ve kullanımlarını detaylı olarak içermektedir.

Tüm API istekleri `/api` prefix'i ile başlar. Tüm JSON payload'ları `application/json` formatında gönderilmelidir. Authenticated (yetki gerektiren) endpoint'lerde `Authorization: Bearer <token>` header'ı gönderilmelidir.

---

## 1. Authentication (Kimlik Doğrulama)
**Base Path:** `/api/auth`
Rate limiting: Genel auth işlemleri ve OTP işlemleri için limitler vardır.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `POST` | `/register` | Yeni kullanıcı kaydı oluşturur. | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/login` | Kullanıcı girişi yapar. Token döner. | `{ "email": "...", "password": "..." }` |
| `POST` | `/forgot-password` | Şifremi unuttum isteği (OTP gönderir). | `{ "email": "..." }` |
| `POST` | `/verify-otp` | E-postaya gelen OTP'yi doğrular. | `{ "email": "...", "otp": "..." }` |
| `POST` | `/resend-otp` | Yeni bir OTP kodu gönderir. | `{ "email": "..." }` |
| `POST` | `/reset-password` | Şifreyi sıfırlar. | `{ "email": "...", "password": "...", "otp": "..." }` |

---

## 2. Kullanıcı Profili (Profile)
**Base Path:** `/api/profile`
Tüm istekler **Authentication** gerektirir.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `GET` | `/` | Giriş yapan kullanıcının profil bilgilerini getirir. | Yok |
| `PATCH` | `/` | Profil bilgilerini (boy, kilo vb.) günceller. | `{ "height": 180, "weight": 75, "goal": "lose_weight" ... }` |
| `PATCH` | `/notifications` | Bildirim ayarlarını günceller. | `{ "emailNotifications": true, "pushNotifications": false }` |

---

## 3. Onboarding (İlk Katılım)
**Base Path:** `/api/onboarding`
Tüm istekler **Authentication** gerektirir.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `GET` | `/status` | Kullanıcının onboarding sürecini tamamlayıp tamamlamadığını döner. | Yok |
| `POST` | `/complete` | Onboarding sürecini tamamlar ve hedefleri belirler. | `{ "gender": "male", "age": 25, "activityLevel": "active", "goalWeight": 70, ... }` |

---

## 4. Beslenme ve Gıda (Foods)
**Base Path:** `/api/foods`
Tüm istekler **Authentication** gerektirir. (Hibrit arama motoru kullanır: Kendi DB'miz -> Open Food Facts -> Gemini AI)

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `GET` | `/search` | Gıda araması yapar. | Query Param: `?q=kuymak` |
| `POST` | `/` | Manuel olarak özel gıda (Custom Food) ekler. | `{ "name": "Elma", "calories": 52, "protein": 0.3, "carbs": 14, "fat": 0.2 ... }` |
| `GET` | `/:id` | Belirtilen ID'ye sahip gıdanın detaylarını getirir. | URL Param: `id` |

---

## 5. Öğün Günlükleri (Meal Logs)
**Base Path:** `/api/meal-logs`
Tüm istekler **Authentication** gerektirir.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `GET` | `/` | Belirli bir günün öğün kayıtlarını getirir. | Query Param: `?date=YYYY-MM-DD` |
| `GET` | `/summary` | Belirli bir günün makro ve kalori özetini getirir. | Query Param: `?date=YYYY-MM-DD` |
| `POST` | `/` | Öğün kaydı oluşturur veya var olanı getirir. | `{ "date": "YYYY-MM-DD", "mealType": "Breakfast" }` |
| `POST` | `/:id/items` | Belirli bir öğüne gıda ekler. | `{ "foodId": "...", "servings": 1, "servingSize": 100 }` |
| `DELETE`| `/:mealLogId/items/:itemId`| Öğünden eklenmiş bir gıdayı çıkarır. | URL Params: `mealLogId`, `itemId` |

---

## 6. Snack AI (Akıllı Atıştırmalık Önerisi)
**Base Path:** `/api/snack`
Tüm istekler **Authentication** gerektirir.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `POST` | `/suggest` | Gemini AI kullanarak kullanıcının güncel kalori ihtiyacına uygun atıştırmalık önerir. | `{ "preferences": "tatlı", "maxCalories": 200 }` (Opsiyonel) |

---

## 7. Su Tüketimi (Hydration)
**Base Path:** `/api/hydration`
Tüm istekler **Authentication** gerektirir.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `GET` | `/today` | Bugünün su tüketim durumunu getirir. | Yok |
| `GET` | `/logs` | Belirli bir tarihin su kayıtlarını getirir. | Query Param: `?date=YYYY-MM-DD` (Opsiyonel) |
| `POST` | `/logs` | Su tüketimi ekler (ml cinsinden). | `{ "amount": 250 }` |

---

## 8. Egzersiz Kütüphanesi (Exercises)
**Base Path:** `/api/exercises`
Tüm istekler **Authentication** gerektirir.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `GET` | `/` | Egzersiz kütüphanesindeki tüm egzersizleri listeler. | Query Params ile filtreleme eklenebilir. |
| `GET` | `/:id` | Belirli bir egzersizin detaylarını döner. | URL Param: `id` |
| `POST` | `/` | Sisteme yeni bir egzersiz ekler. | `{ "name": "Push Up", "muscleGroup": "Chest", ... }` |

---

## 9. Antrenman Programları (Workout Plans)
**Base Path:** `/api/workout-plans`
Tüm istekler **Authentication** gerektirir.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `GET` | `/` | Kullanıcının antrenman programlarını listeler. | Yok |
| `GET` | `/:id` | Antrenman programının detaylarını döner. | URL Param: `id` |
| `POST` | `/` | Yeni bir antrenman programı oluşturur. | `{ "name": "Full Body", "days": [...] }` |
| `PATCH` | `/:id` | Mevcut programı günceller. | Değişecek alanlar |
| `DELETE`| `/:id` | Programı siler. | URL Param: `id` |

---

## 10. Antrenman Oturumları (Workout Sessions)
**Base Path:** `/api/workout-sessions`
Tüm istekler **Authentication** gerektirir.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `POST` | `/` | Yeni bir antrenman oturumu başlatır (Start Workout). | `{ "workoutPlanId": "..." }` |
| `GET` | `/` | Kullanıcının geçmiş antrenman oturumlarını listeler. | Yok |
| `GET` | `/:id` | Oturumun detaylarını getirir. | URL Param: `id` |
| `PATCH` | `/:id/finish` | Aktif oturumu sonlandırır (Finish Workout). | URL Param: `id` |
| `POST` | `/:id/sets` | Oturuma yeni bir set (ağırlık/tekrar) ekler. | `{ "exerciseId": "...", "reps": 10, "weight": 50 }` |
| `GET` | `/:id/sets` | Oturumdaki tüm setleri getirir. | URL Param: `id` |

---

## 11. Egzersiz Durumları (Workout Exercise Status)
**Base Path:** `/api/workout-exercise-status`
Tüm istekler **Authentication** gerektirir. Kullanıcının belirli bir egzersizi yapıp yapmadığını takip etmek için kullanılır.

| Metot | Endpoint | Açıklama | Body / Params |
|-------|----------|----------|---------------|
| `POST` | `/` | Bir egzersizin durumunu (örneğin "tamamlandı") kaydeder. | `{ "workoutPlanId": "...", "exerciseId": "...", "status": "completed" }` |
| `GET` | `/` | Egzersiz durumlarını getirir. | Query Params: `workoutPlanId`, `date` vb. |
| `PATCH` | `/:id` | Mevcut bir egzersiz durumunu günceller. | `{ "status": "skipped" }` |

---

*Not: Tüm API uç noktaları için genel başarılı yanıt yapısı genellikle şu şekildedir:*
```json
{
  "success": true,
  "data": { ... }
}
```
*Hatalı durumlarda dönen yanıt (ErrorHandler Middleware üzerinden):*
```json
{
  "success": false,
  "error": "Hata mesajı"
}
```
