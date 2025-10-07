# 🚀 Heroku Deployment Steps for Ride Sharing App

## ⚠️ Account Verification Required

Heroku now requires account verification before creating apps. Here are your options:

### Option 1: Verify Heroku Account (Recommended)
1. **Go to**: https://heroku.com/verify
2. **Add payment information** (free tier still available)
3. **Return here** to continue deployment

### Option 2: Alternative Free Hosting
- **Railway**: https://railway.app (Free tier available)
- **Render**: https://render.com (Free tier available)
- **Vercel**: https://vercel.com (Free tier available)

---

## 🏗️ Heroku Deployment Process (After Verification)

### Step 1: Deploy Backend API

```bash
# Navigate to server directory
cd server

# Create Heroku app
heroku create your-app-name-api

# Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/ridesharapp?retryWrites=true&w=majority"
heroku config:set JWT_SECRET="your-super-secure-production-secret-key"
heroku config:set ACCESS_TOKEN_EXPIRY="7d"
heroku config:set NODE_ENV="production"
heroku config:set ORIGIN="https://your-frontend-app-name.herokuapp.com"

# Deploy
git subtree push --prefix=server heroku main
```

### Step 2: Deploy Frontend

```bash
# Navigate to client directory
cd ../client

# Create another Heroku app
heroku create your-app-name-web

# Set environment variables
heroku config:set VITE_REACT_API_URI="https://your-app-name-api.herokuapp.com/api"

# Deploy
git subtree push --prefix=client heroku main
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Free MongoDB Atlas Setup:

1. **Go to**: https://www.mongodb.com/atlas
2. **Create free account**
3. **Create new cluster** (free tier)
4. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ridesharapp?retryWrites=true&w=majority
   ```
5. **Use this in MONGODB_URI environment variable**

---

## 🔧 Environment Variables Needed

### Backend Environment Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ridesharapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-production-secret-key-change-this
ACCESS_TOKEN_EXPIRY=7d
NODE_ENV=production
ORIGIN=https://your-frontend-app-name.herokuapp.com
```

### Frontend Environment Variables:
```
VITE_REACT_API_URI=https://your-backend-app-name.herokuapp.com/api
```

---

## 📋 Quick Commands (Copy & Paste)

### After Account Verification:

```bash
# 1. Deploy Backend
cd server
heroku create ride-share-api-$(date +%s)
heroku config:set MONGODB_URI="YOUR_MONGODB_URI_HERE"
heroku config:set JWT_SECRET="YOUR_SECRET_KEY_HERE"
heroku config:set NODE_ENV="production"
git subtree push --prefix=server heroku main

# 2. Deploy Frontend
cd ../client
heroku create ride-share-web-$(date +%s)
heroku config:set VITE_REACT_API_URI="https://YOUR_BACKEND_APP_NAME.herokuapp.com/api"
git subtree push --prefix=client heroku main
```

---

## 🌐 Expected URLs After Deployment

- **Backend API**: `https://your-app-name-api.herokuapp.com/api`
- **Frontend**: `https://your-app-name-web.herokuapp.com`
- **WebSocket**: `wss://your-app-name-api.herokuapp.com`

---

## 🚨 Important Notes

1. **Account Verification**: Required before creating apps
2. **Free Tier Limits**: 550-1000 dyno hours per month
3. **HTTPS**: Automatically provided by Heroku
4. **Environment Variables**: Set via Heroku dashboard or CLI
5. **Database**: Use MongoDB Atlas (free tier available)

---

## 🔍 Troubleshooting

### Common Issues:
1. **Account verification required**: Add payment info at https://heroku.com/verify
2. **Build failures**: Check Node.js version compatibility
3. **Database connection**: Verify MongoDB URI format
4. **CORS errors**: Check ORIGIN environment variable

### Testing Commands:
```bash
# Test API
curl https://your-app-name-api.herokuapp.com/api/rides/find?from=test&to=test&seat=1&date=2024-01-01

# Check logs
heroku logs --tail --app your-app-name-api
```

---

## 📞 Next Steps

1. **Verify Heroku account** at https://heroku.com/verify
2. **Set up MongoDB Atlas** database
3. **Run deployment commands** above
4. **Test your deployed application**

**Your app will be globally accessible once deployed! 🌍🚀**
