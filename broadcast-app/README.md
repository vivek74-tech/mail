# एक साथ संदेश — Broadcast Email App

React + Node.js + Express + MongoDB app jisse ek message likh kar 6 logo
ko ek saath email bhej sakte ho.

## Structure
```
broadcast-app/
  server/     -> Express + MongoDB + Nodemailer backend
  client/     -> React frontend
```

## Setup

### 1. MongoDB
- Local MongoDB use karna ho to isse install karo: https://www.mongodb.com/try/download/community
- Ya MongoDB Atlas (free) use karo: https://www.mongodb.com/cloud/atlas — wahan se apna connection string (MONGO_URI) copy karo.

### 2. Gmail App Password banao (email bhejne ke liye)
Gmail apna normal password SMTP ke liye allow nahi karta, isliye App Password banana padega:
1. https://myaccount.google.com/security par jao
2. "2-Step Verification" on karo (agar pehle se nahi hai)
3. Usi page par "App passwords" search karo, ek naya app password banao
4. Wo 16-digit password `.env` file me `EMAIL_PASS` me daalo

### 3. Backend chalao
```bash
cd server
npm install
cp .env.example .env
# ab .env file me MONGO_URI, EMAIL_USER, EMAIL_PASS bharo
npm start
```
Server `http://localhost:5000` par chalega.

### 4. Frontend chalao
Naye terminal me:
```bash
cd client
npm install
npm start
```
Browser me `http://localhost:3000` khulega.

## Use kaise karein
1. Website khol kar 6 me se jitne chaho contacts (naam + email) bharo aur "Contacts Save करें" dabao
2. Message likho
3. "सबको एक साथ भेजें" dabao — backend saare saved contacts ko ek saath email bhej dega
4. Neeche "पिछले भेजे गए संदेश" me history dikhegi ki kitno tak sahi se pahuncha

## Note
- Ye setup sirf **email** ke liye hai. WhatsApp ya SMS automatically bhejne ke liye
  Twilio jaisi paid service ka account chahiye hoga — agar aage wo bhi chahiye to bata dena.
- Production me deploy karte waqt `.env` file kabhi GitHub par mat daalna.
