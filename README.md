# NOVA — Real AI + Persian Voice

نسخه واقعی NOVA با:
- OpenAI Responses API برای پاسخ هوشمند
- تبدیل صدای فارسی به متن
- تبدیل پاسخ به صدای فارسی/چندزبانه
- رابط موبایل‌محور مناسب iPhone
- نگهداری API Key فقط روی سرور

## اجرا
1. Node.js نصب کنید.
2. `npm install`
3. `.env.example` را به `.env` تغییر دهید.
4. مقدار `OPENAI_API_KEY` را در `.env` قرار دهید.
5. `npm start`
6. مرورگر را روی `http://localhost:3000` باز کنید.

برای استفاده روی iPhone، سرور باید روی یک هاست HTTPS اجرا شود. API Key را داخل `public` یا کد مرورگر قرار ندهید.
