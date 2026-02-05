#!/bin/bash

echo "🚀 Railway + Vercel Deployment Assistant"
echo "========================================"

echo ""
echo "📋 Quick Deployment Checklist:"
echo "✅ Code committed to Git"
echo "✅ Railway configuration ready"
echo "✅ Vercel configuration ready"
echo ""

echo "🗄️  Step 1: MongoDB Atlas Setup"
echo "1. Go to: https://www.mongodb.com/atlas"
echo "2. Create free cluster"
echo "3. Create database user"
echo "4. Set network access to 0.0.0.0/0"
echo "5. Get connection string"
echo ""

read -p "Do you have your MongoDB connection string ready? (y/n): " mongo_ready

if [ "$mongo_ready" != "y" ] && [ "$mongo_ready" != "Y" ]; then
    echo ""
    echo "Please set up MongoDB Atlas first:"
    echo "https://www.mongodb.com/atlas"
    echo ""
    exit 1
fi

echo ""
echo "🚂 Step 2: Railway Backend Deployment"
echo "1. Go to: https://railway.app"
echo "2. Sign up with GitHub"
echo "3. Click 'New Project'"
echo "4. Select 'Deploy from GitHub repo'"
echo "5. Choose your repository and select 'server' folder"
echo "6. Add environment variables:"
echo "   - MONGODB_URI=your_connection_string"
echo "   - JWT_SECRET=your-secret-key"
echo "   - NODE_ENV=production"
echo "   - ACCESS_TOKEN_EXPIRY=7d"
echo ""

read -p "Is your backend deployed to Railway? (y/n): " backend_ready

if [ "$backend_ready" != "y" ] && [ "$backend_ready" != "Y" ]; then
    echo ""
    echo "Please deploy backend to Railway first:"
    echo "https://railway.app"
    echo ""
    exit 1
fi

echo ""
read -p "Enter your Railway backend URL (e.g., https://your-app.railway.app): " railway_url

if [ -z "$railway_url" ]; then
    echo "❌ Railway URL is required"
    exit 1
fi

echo ""
echo "🌐 Step 3: Vercel Frontend Deployment"
echo "1. Go to: https://vercel.com"
echo "2. Sign up with GitHub"
echo "3. Click 'New Project'"
echo "4. Import your repository"
echo "5. Set root directory to 'client'"
echo "6. Set framework to 'Vite'"
echo "7. Add environment variable:"
echo "   - VITE_REACT_API_URI=$railway_url/api"
echo ""

read -p "Is your frontend deployed to Vercel? (y/n): " frontend_ready

if [ "$frontend_ready" != "y" ] && [ "$frontend_ready" != "Y" ]; then
    echo ""
    echo "Please deploy frontend to Vercel first:"
    echo "https://vercel.com"
    echo ""
    exit 1
fi

echo ""
read -p "Enter your Vercel frontend URL (e.g., https://your-app.vercel.app): " vercel_url

if [ -z "$vercel_url" ]; then
    echo "❌ Vercel URL is required"
    exit 1
fi

echo ""
echo "🔄 Step 4: Update Railway Environment Variables"
echo "Go back to Railway and update the ORIGIN variable:"
echo "ORIGIN=$vercel_url"
echo ""

echo "✅ Deployment Complete!"
echo ""
echo "🌍 Your app URLs:"
echo "Frontend: $vercel_url"
echo "Backend API: $railway_url/api"
echo "WebSocket: ${railway_url/https/wss}"
echo ""

echo "🧪 Test your deployment:"
echo "1. Open: $vercel_url"
echo "2. Create an account"
echo "3. Create a ride"
echo "4. Test location sharing"
echo ""

echo "🎉 Your ride-sharing app is now live globally!"
echo ""
echo "📖 For detailed instructions, see: QUICK_DEPLOY_RAILWAY_VERCEL.md"

