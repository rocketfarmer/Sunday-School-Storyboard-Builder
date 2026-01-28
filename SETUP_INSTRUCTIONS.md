# SundayStoryBoard - Setup Instructions

Your full-stack storyboard generation application is now ready! Follow these steps to deploy and use it.

## What's Been Built

1. **Database**: Supabase PostgreSQL database with tables for stories, prompts, and images with Row Level Security
2. **Backend API**: Express server with Replicate AI integration for image generation
3. **Frontend**: React application with authentication and protected routes
4. **Authentication**: Email/password authentication with Supabase Auth

## Quick Start (Local Development)

### 1. Set Up Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your API keys:

```env
REPLICATE_API_TOKEN=your_replicate_token_here
SUPABASE_URL=https://guhogfqxqvizgqodrcxt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Getting Your Supabase Service Role Key:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy the `service_role` key (NOT the anon key!)

### 2. Start Backend Server

```bash
cd backend
npm start
```

The backend will run on http://localhost:3001

### 3. Start Frontend

In a new terminal:

```bash
npm run dev
```

The frontend will run on http://localhost:5173

### 4. Create Your First Account

1. Open http://localhost:5173 in your browser
2. Click "Sign up" or navigate to the signup page
3. Create an account with email and password
4. You'll be automatically logged in

### 5. Create Your First Story

1. Enter a story prompt like "the story of Noah's ark from Genesis 6-9"
2. Review and edit the generated prompts
3. Generate character reference images
4. Approve the character design
5. Generate the full storyboard

## Deployment Guide

### Deploy Backend to Railway

1. **Sign up for Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the backend

3. **Set Environment Variables**
   Go to your project → Variables and add:
   - `REPLICATE_API_TOKEN` - Your Replicate API token
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `FRONTEND_URL` - Your frontend URL (once deployed) or `*` for development
   - `NODE_ENV` - `production`

4. **Set Root Directory**
   - Go to Settings → Root Directory
   - Set to `backend`

5. **Deploy**
   - Railway will automatically deploy
   - Copy your deployment URL (e.g., `https://your-app.up.railway.app`)

### Update Frontend for Production

1. Update your `.env` file:
```env
VITE_API_URL=https://your-railway-url.up.railway.app
```

2. Rebuild frontend:
```bash
npm run build
```

3. Deploy frontend to your hosting provider of choice (Vercel, Netlify, etc.)

## Architecture Overview

### Database Schema
- `stories` - Main story records with user association
- `story_prompts` - Individual scene prompts for each story
- `image_variations` - Alternative versions of generated images

### API Endpoints
- `POST /api/stories` - Create new story
- `GET /api/stories` - Get user's stories
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story
- `POST /api/generate-character` - Generate character reference
- `POST /api/generate-storyboard` - Generate all storyboard images
- `POST /api/generate-variation` - Generate image variation

### Authentication Flow
1. User signs up or logs in via Supabase Auth
2. JWT token is stored in session
3. All API requests include Authorization header
4. Backend verifies token with Supabase
5. Database RLS policies ensure users only access their own data

## Troubleshooting

### Backend Not Connecting
- Verify backend is running on port 3001
- Check environment variables are set correctly
- Ensure CORS is configured for your frontend URL

### Authentication Errors
- Verify Supabase URL and anon key in frontend `.env`
- Check service role key in backend `.env`
- Make sure you're using the correct Supabase project

### Image Generation Fails
- Verify Replicate API token is valid
- Check you have credits in your Replicate account
- Review backend logs for detailed error messages

### Database Errors
- Confirm database migration was successful
- Check RLS policies are enabled
- Verify user is authenticated before making requests

## Next Steps

1. Add AI-powered prompt generation using an LLM
2. Implement image editing and refinement tools
3. Add export functionality (PDF, PowerPoint, etc.)
4. Set up monitoring and error tracking
5. Add rate limiting and usage quotas

## Support

For issues or questions:
1. Check backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database migrations have been applied
4. Check that your Replicate API key has available credits
