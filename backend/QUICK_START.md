# Backend Quick Start

## Environment Setup

You need to create a `.env` file with the following variables:

```env
REPLICATE_API_TOKEN=your_replicate_api_token
SUPABASE_URL=https://guhogfqxqvizgqodrcxt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Getting Your API Keys

### Replicate API Token
The user already has this token. Use it as provided.

### Supabase Service Role Key
**IMPORTANT**: This is different from the anon key!

1. Go to https://supabase.com/dashboard
2. Select your project (guhogfqxqvizgqodrcxt)
3. Click on Settings (gear icon) in the sidebar
4. Click on "API" under Configuration
5. Scroll to "Project API keys"
6. Copy the **`service_role`** secret key (NOT the anon key!)
7. Paste it in your `.env` file

The service role key:
- Bypasses Row Level Security
- Has full database access
- Should NEVER be exposed to the frontend
- Must be kept secret

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Testing the Server

Once running, test the health endpoint:
```bash
curl http://localhost:3001/health
```

You should see:
```json
{
  "status": "ok",
  "message": "SundayStoryBoard API is running",
  "timestamp": "..."
}
```

## Common Issues

**Port 3001 already in use:**
```bash
# Change PORT in .env to a different port like 3002
PORT=3002
```

**Authentication errors:**
- Double-check your SUPABASE_SERVICE_ROLE_KEY
- Make sure you're using the service role key, not the anon key
- Verify the key has no extra spaces or quotes

**Replicate API errors:**
- Verify your REPLICATE_API_TOKEN is correct
- Check you have available credits at https://replicate.com/account
- Review the Replicate API documentation

**CORS errors:**
- Update FRONTEND_URL to match your frontend's URL
- For local development: `http://localhost:5173`
- For production: your deployed frontend URL

## Next Steps

1. Start the backend server
2. Start the frontend in another terminal
3. Open http://localhost:5173
4. Sign up for an account
5. Create your first storyboard!
