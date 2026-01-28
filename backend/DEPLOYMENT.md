# Deployment Guide

## Railway Deployment (Recommended)

Railway offers easy deployment with a generous free tier.

### Steps:

1. **Sign up for Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` directory as the root

3. **Configure Environment Variables**
   - Go to your project settings
   - Add the following variables:
     - `REPLICATE_API_TOKEN` - Your Replicate API token
     - `SUPABASE_URL` - Your Supabase project URL
     - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (found in Supabase Dashboard > Settings > API)
     - `FRONTEND_URL` - Your frontend URL (or `*` for development)
     - `NODE_ENV` - Set to `production`

4. **Deploy**
   - Railway will automatically deploy
   - Your API will be available at `https://your-project.up.railway.app`

5. **Update Frontend**
   - Copy your Railway URL
   - Update your frontend `.env` file with `VITE_API_URL=https://your-project.up.railway.app`

## Render Deployment (Alternative)

Render provides a free tier with automatic deployments.

### Steps:

1. **Sign up for Render**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**
   - Name: `sundaystoryboard-api`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - `REPLICATE_API_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

5. **Deploy**
   - Click "Create Web Service"
   - Your API will be available at `https://your-service.onrender.com`

## Getting Your Supabase Service Role Key

1. Go to your Supabase dashboard
2. Navigate to Settings → API
3. Under "Project API keys", copy the `service_role` key (not the anon key!)
4. Keep this secret and never commit it to your repository

## Health Check

After deployment, verify your API is running:
```bash
curl https://your-api-url/health
```

You should receive:
```json
{
  "status": "ok",
  "message": "SundayStoryBoard API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

- **503 errors**: Check your environment variables are set correctly
- **Authentication errors**: Verify your Supabase service role key
- **Image generation fails**: Verify your Replicate API token
- **CORS errors**: Check your FRONTEND_URL environment variable
