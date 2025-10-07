# Deployment Guide for Ride Sharing App with Location Sharing

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local or cloud instance)
3. **Git** for version control

## Environment Setup

### Server Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ridesharapp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ACCESS_TOKEN_EXPIRY=7d

# Server Configuration
PORT=5000
NODE_ENV=development
ORIGIN=http://localhost:5173
```

### Client Environment Variables

Create a `.env` file in the `client/` directory with the following variables:

```env
# API Configuration
VITE_REACT_API_URI=http://localhost:5000/api
```

## Local Development Deployment

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# Or start MongoDB manually
mongod
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Start the Application

**Terminal 1 - Start the Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start the Client:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- WebSocket: ws://localhost:5000

## Production Deployment

### Option 1: Traditional VPS/Cloud Server

1. **Set up your server** (Ubuntu/CentOS recommended)
2. **Install Node.js and MongoDB**
3. **Clone your repository**
4. **Set up environment variables** for production
5. **Use PM2** for process management:

```bash
# Install PM2 globally
npm install -g pm2

# Start server with PM2
cd server
pm2 start index.js --name "ride-share-api"

# Build and serve client
cd client
npm run build
# Serve the build folder with nginx or serve
```

### Option 2: Docker Deployment

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: ridesharapp

  api:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://mongodb:27017/ridesharapp
      JWT_SECRET: your-production-secret
      NODE_ENV: production
    depends_on:
      - mongodb

  client:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      VITE_REACT_API_URI: http://localhost:5000/api
```

### Option 3: Cloud Platform Deployment

#### Heroku Deployment

1. **Create Heroku apps** for both client and server
2. **Set environment variables** in Heroku dashboard
3. **Deploy using Git:**

```bash
# Server deployment
cd server
heroku git:remote -a your-api-app-name
git subtree push --prefix=server heroku main

# Client deployment
cd client
heroku git:remote -a your-client-app-name
git subtree push --prefix=client heroku main
```

#### Vercel Deployment (Frontend)

1. **Connect your GitHub repository** to Vercel
2. **Set build settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Railway/Render Deployment (Backend)

1. **Connect your repository**
2. **Set environment variables**
3. **Deploy automatically**

## Environment Variables for Production

### Server (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ridesharapp?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-production-secret-key
ACCESS_TOKEN_EXPIRY=7d
PORT=5000
NODE_ENV=production
ORIGIN=https://yourdomain.com
```

### Client (.env)
```env
VITE_REACT_API_URI=https://your-api-domain.com/api
```

## Testing the Deployment

1. **Create a user account**
2. **Create a ride** as a driver
3. **Join the ride** as a passenger
4. **Test location sharing:**
   - Driver enables location sharing
   - Driver updates location
   - Passenger sees real-time updates
   - Check WebSocket connectivity

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Check if MongoDB is running
   - Verify connection string
   - Check firewall settings

2. **WebSocket Connection Issues:**
   - Ensure WebSocket is enabled on your server
   - Check CORS settings
   - Verify port configuration

3. **Location Permission Issues:**
   - Test on HTTPS in production
   - Check browser geolocation permissions
   - Verify SSL certificates

### Logs and Monitoring

```bash
# Check PM2 logs
pm2 logs ride-share-api

# Check server logs
cd server
npm run dev # Check console output

# Check client build
cd client
npm run build # Check for build errors
```

## Security Considerations

1. **Use HTTPS** in production
2. **Set secure JWT secrets**
3. **Configure CORS properly**
4. **Use environment variables** for sensitive data
5. **Enable MongoDB authentication**
6. **Set up proper firewall rules**

## Performance Optimization

1. **Enable gzip compression**
2. **Use CDN** for static assets
3. **Implement caching strategies**
4. **Monitor database queries**
5. **Use connection pooling** for MongoDB

## Backup and Maintenance

1. **Regular MongoDB backups**
2. **Monitor server resources**
3. **Update dependencies regularly**
4. **Set up monitoring and alerting**
5. **Regular security audits**
