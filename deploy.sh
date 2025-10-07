#!/bin/bash

echo "🚀 Ride Sharing App - Global Deployment Script"
echo "=============================================="

# Check if user wants to deploy
read -p "Do you want to deploy your app globally? (y/n): " deploy_choice

if [ "$deploy_choice" = "y" ] || [ "$deploy_choice" = "Y" ]; then
    echo ""
    echo "📋 Deployment Options:"
    echo "1. Railway + Vercel (Recommended - Free)"
    echo "2. Heroku (Free tier available)"
    echo "3. Manual deployment guide"
    echo ""
    
    read -p "Choose deployment option (1-3): " option
    
    case $option in
        1)
            echo ""
            echo "🚂 Deploying to Railway + Vercel..."
            echo ""
            echo "Step 1: Backend (Railway)"
            echo "1. Go to https://railway.app"
            echo "2. Sign up with GitHub"
            echo "3. Create new project"
            echo "4. Deploy from GitHub repo"
            echo "5. Set environment variables:"
            echo "   - MONGODB_URI"
            echo "   - JWT_SECRET"
            echo "   - NODE_ENV=production"
            echo "   - ORIGIN=https://your-frontend-domain.vercel.app"
            echo ""
            echo "Step 2: Frontend (Vercel)"
            echo "1. Go to https://vercel.com"
            echo "2. Sign up with GitHub"
            echo "3. Import your repository"
            echo "4. Set environment variables:"
            echo "   - VITE_REACT_API_URI=https://your-backend-domain.railway.app/api"
            echo "5. Deploy"
            echo ""
            echo "📖 Full guide: GLOBAL_DEPLOYMENT_GUIDE.md"
            ;;
        2)
            echo ""
            echo "🔵 Deploying to Heroku..."
            echo ""
            echo "Backend:"
            echo "1. cd server && heroku create your-app-api"
            echo "2. heroku config:set MONGODB_URI='your-mongodb-uri'"
            echo "3. heroku config:set JWT_SECRET='your-jwt-secret'"
            echo "4. git subtree push --prefix=server heroku main"
            echo ""
            echo "Frontend:"
            echo "1. cd client && heroku create your-app-web"
            echo "2. heroku config:set VITE_REACT_API_URI='https://your-app-api.herokuapp.com/api'"
            echo "3. git subtree push --prefix=client heroku main"
            ;;
        3)
            echo ""
            echo "📖 Opening deployment guide..."
            if command -v open &> /dev/null; then
                open GLOBAL_DEPLOYMENT_GUIDE.md
            else
                echo "Please open GLOBAL_DEPLOYMENT_GUIDE.md manually"
            fi
            ;;
        *)
            echo "Invalid option. Please run the script again."
            ;;
    esac
    
    echo ""
    echo "✅ Deployment instructions provided!"
    echo "🌍 Your app will be globally accessible once deployed!"
    
else
    echo "Deployment cancelled. Your app is still running locally at:"
    echo "Frontend: http://localhost:5173"
    echo "Backend: http://localhost:8000/api"
fi

echo ""
echo "📞 Need help? Check GLOBAL_DEPLOYMENT_GUIDE.md for detailed instructions."
