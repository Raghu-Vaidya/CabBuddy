# 🌍 Global Deployment Guide - Ride Sharing App

## Quick Deployment Options

### 🚀 **Option 1: Railway (Backend) + Vercel (Frontend) - RECOMMENDED**

#### **Step 1: Deploy Backend to Railway**

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository** (or upload the server folder)
6. **Set Environment Variables** in Railway dashboard:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ridesharapp?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-production-secret-key
   ACCESS_TOKEN_EXPIRY=7d
   NODE_ENV=production
   ORIGIN=https://your-frontend-domain.vercel.app
   ```
7. **Deploy** - Railway will give you a URL like: `https://your-app-name.railway.app`

#### **Step 2: Deploy Frontend to Vercel**

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Import your repository**
5. **Set Build Settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Set Environment Variables:**
   ```
   VITE_REACT_API_URI=https://your-app-name.railway.app/api
   ```
7. **Deploy** - Vercel will give you a URL like: `https://your-app-name.vercel.app`

---

### 🐳 **Option 2: Docker + Any Cloud Provider**

#### **Create Dockerfile for Backend**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

#### **Create Dockerfile for Frontend**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### ☁️ **Option 3: Heroku (Both Frontend & Backend)**

#### **Backend Deployment:**
1. **Install Heroku CLI**
2. **Login to Heroku:**
   ```bash
   heroku login
   ```
3. **Create Heroku app:**
   ```bash
   cd server
   heroku create your-app-name-api
   ```
4. **Set environment variables:**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set NODE_ENV="production"
   ```
5. **Deploy:**
   ```bash
   git subtree push --prefix=server heroku main
   ```

#### **Frontend Deployment:**
1. **Create another Heroku app:**
   ```bash
   cd client
   heroku create your-app-name-web
   ```
2. **Set environment variables:**
   ```bash
   heroku config:set VITE_REACT_API_URI="https://your-app-name-api.herokuapp.com/api"
   ```
3. **Deploy:**
   ```bash
   git subtree push --prefix=client heroku main
   ```

---

## 🗄️ **Database Setup (MongoDB Atlas)**

### **Free MongoDB Atlas Setup:**

1. **Go to [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create free account**
3. **Create new cluster** (free tier)
4. **Get connection string** - it will look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ridesharapp?retryWrites=true&w=majority
   ```
5. **Use this in your environment variables**

---

## 🔧 **Environment Variables Setup**

### **Backend (.env for production):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ridesharapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-production-secret-key-change-this
ACCESS_TOKEN_EXPIRY=7d
NODE_ENV=production
PORT=8000
ORIGIN=https://your-frontend-domain.vercel.app
```

### **Frontend (.env for production):**
```env
VITE_REACT_API_URI=https://your-backend-domain.railway.app/api
```

---

## 📋 **Quick Deployment Checklist**

### **Before Deployment:**
- [ ] MongoDB Atlas cluster created
- [ ] Environment variables prepared
- [ ] Code pushed to GitHub repository
- [ ] Railway/Vercel accounts created

### **Backend Deployment:**
- [ ] Railway project created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] API endpoints accessible
- [ ] WebSocket connection working

### **Frontend Deployment:**
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful
- [ ] Application accessible
- [ ] API integration working

### **Testing:**
- [ ] User registration/login working
- [ ] Ride creation working
- [ ] Location sharing working
- [ ] Real-time updates working
- [ ] Mobile responsiveness working

---

## 🌐 **Expected URLs After Deployment**

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-app-name.railway.app/api`
- **WebSocket**: `wss://your-app-name.railway.app`

---

## 🚨 **Important Notes**

1. **HTTPS Required**: Location sharing requires HTTPS in production
2. **CORS Configuration**: Make sure ORIGIN points to your frontend domain
3. **Environment Variables**: Never commit real secrets to GitHub
4. **Database Security**: Use strong passwords and enable MongoDB authentication
5. **SSL Certificates**: Railway and Vercel provide free SSL certificates

---

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors**: Check ORIGIN environment variable
2. **Database Connection**: Verify MongoDB URI format
3. **WebSocket Issues**: Ensure WebSocket URL uses `wss://` for HTTPS
4. **Build Failures**: Check Node.js version compatibility
5. **Environment Variables**: Verify all required variables are set

### **Testing Commands:**
```bash
# Test API
curl https://your-app-name.railway.app/api/rides/find?from=test&to=test&seat=1&date=2024-01-01

# Test WebSocket (use browser console)
const socket = new WebSocket('wss://your-app-name.railway.app');
socket.onopen = () => console.log('Connected');
```

---

## 📞 **Support**

If you encounter issues:
1. Check Railway/Vercel deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check browser console for errors
5. Ensure all dependencies are properly installed

**Your app will be globally accessible once deployed! 🌍🚀**
