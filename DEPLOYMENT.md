# Deploy NailsByOle Booking System to Render

## Prerequisites
- GitHub account
- Render account (free tier available)

## Step 1: Push to GitHub

1. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - NailsByOle booking system"
   ```

2. **Create GitHub repository:**
   - Go to GitHub.com
   - Click "New repository"
   - Name it: `nailsbyole-booking`
   - Make it public
   - Don't initialize with README

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/nailsbyole-booking.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Render

1. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com
   - Sign up/Login

2. **Create New Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service:**
   - **Name:** `nailsbyole-booking`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: `10000`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

## Step 3: Update WhatsApp URLs

After deployment, update the WhatsApp URLs in the code:

1. **Update server.js:**
   ```javascript
   const BASE_URL = process.env.NODE_ENV === 'production' 
       ? 'https://YOUR_RENDER_URL.onrender.com' 
       : `http://localhost:${PORT}`;
   ```

2. **Replace `YOUR_RENDER_URL`** with your actual Render URL

## Step 4: Test Deployment

1. **Visit your deployed site:**
   - `https://YOUR_RENDER_URL.onrender.com`

2. **Test booking form:**
   - Fill out a test booking
   - Check WhatsApp integration

3. **Test admin panel:**
   - Visit `/admin`
   - Login with: `admin` / `admin123`

## Features After Deployment

✅ **Live booking form** accessible worldwide  
✅ **WhatsApp notifications** to +27 69 840 4354  
✅ **Admin dashboard** for managing bookings  
✅ **Automatic confirmations** sent to customers  
✅ **Mobile responsive** design  
✅ **Terms and conditions** with checkbox  
✅ **Business hours** enforcement  

## Custom Domain (Optional)

1. **In Render dashboard:**
   - Go to your service
   - Click "Settings"
   - Add custom domain

2. **Update BASE_URL** in server.js with your custom domain

## Monitoring

- **Render dashboard** shows logs and performance
- **Automatic deployments** on Git push
- **Free tier** includes 750 hours/month

## Security Notes

- Change admin credentials in production
- Consider adding rate limiting
- Use environment variables for sensitive data
- Enable HTTPS (automatic on Render)

Your NailsByOle booking system will be live and accessible worldwide! 🎉 