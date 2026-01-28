# SundayStoryBoard Backend API

Backend server for the SundayStoryBoard application with Replicate AI integration and Supabase database.

## Features

- User authentication with Supabase Auth
- Story management (CRUD operations)
- AI image generation using Replicate (Flux Schnell model)
- Character reference generation
- Storyboard image generation
- Image variation generation
- Secure API with JWT authentication

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
   - `REPLICATE_API_TOKEN`: Your Replicate API token
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `FRONTEND_URL`: Frontend URL for CORS

4. Start the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

## API Endpoints

### Public Endpoints
- `GET /health` - Health check

### Story Management (Authenticated)
- `GET /api/stories` - Get all user stories
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Create new story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story
- `PUT /api/stories/:id/prompts` - Update story prompts

### Image Generation (Authenticated)
- `POST /api/generate-character` - Generate character reference
- `POST /api/generate-storyboard` - Generate storyboard images
- `POST /api/generate-variation` - Generate image variation

## Authentication

All `/api/*` endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Deployment

### Railway
1. Create new project on Railway
2. Add environment variables
3. Deploy from GitHub or using Railway CLI

### Render
1. Create new Web Service
2. Connect your repository
3. Set environment variables
4. Deploy

## Tech Stack

- Node.js + Express
- Replicate AI (Flux Schnell model)
- Supabase (Database + Auth)
- CORS enabled for frontend integration
