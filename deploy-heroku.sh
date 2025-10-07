#!/bin/bash

echo "🚀 Heroku Deployment Script for Ride Sharing App"
echo "================================================"

# Check if user is logged into Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "❌ Not logged into Heroku. Please run: heroku login"
    exit 1
fi

echo "✅ Logged into Heroku as: $(heroku auth:whoami)"

# Get app names
BACKEND_APP_NAME="ride-share-api-$(date +%s)"
FRONTEND_APP_NAME="ride-share-web-$(date +%s)"

echo ""
echo "📋 App names:"
echo "Backend: $BACKEND_APP_NAME"
echo "Frontend: $FRONTEND_APP_NAME"
echo ""

# Ask for MongoDB URI
echo "🗄️  Database Setup Required:"
echo "1. Go to https://www.mongodb.com/atlas"
echo "2. Create free cluster"
echo "3. Get connection string"
echo ""
read -p "Enter your MongoDB Atlas URI: " MONGODB_URI

if [ -z "$MONGODB_URI" ]; then
    echo "❌ MongoDB URI is required"
    exit 1
fi

# Ask for JWT Secret
read -p "Enter JWT Secret (or press Enter for default): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET="your-super-secure-production-secret-key-$(date +%s)"
fi

echo ""
echo "🚀 Starting deployment..."

# Deploy Backend
echo ""
echo "📡 Deploying Backend..."
cd server

heroku create $BACKEND_APP_NAME

heroku config:set MONGODB_URI="$MONGODB_URI" --app $BACKEND_APP_NAME
heroku config:set JWT_SECRET="$JWT_SECRET" --app $BACKEND_APP_NAME
heroku config:set ACCESS_TOKEN_EXPIRY="7d" --app $BACKEND_APP_NAME
heroku config:set NODE_ENV="production" --app $BACKEND_APP_NAME
heroku config:set ORIGIN="https://$FRONTEND_APP_NAME.herokuapp.com" --app $BACKEND_APP_NAME

echo "Deploying backend to Heroku..."
git subtree push --prefix=server heroku main

# Deploy Frontend
echo ""
echo "🌐 Deploying Frontend..."
cd ../client

heroku create $FRONTEND_APP_NAME

heroku config:set VITE_REACT_API_URI="https://$BACKEND_APP_NAME.herokuapp.com/api" --app $FRONTEND_APP_NAME

echo "Deploying frontend to Heroku..."
git subtree push --prefix=client heroku main

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌍 Your app URLs:"
echo "Backend API: https://$BACKEND_APP_NAME.herokuapp.com/api"
echo "Frontend: https://$FRONTEND_APP_NAME.herokuapp.com"
echo "WebSocket: wss://$BACKEND_APP_NAME.herokuapp.com"
echo ""
echo "🔧 To check logs:"
echo "Backend: heroku logs --tail --app $BACKEND_APP_NAME"
echo "Frontend: heroku logs --tail --app $FRONTEND_APP_NAME"
echo ""
echo "🎉 Your ride-sharing app is now live globally!"
