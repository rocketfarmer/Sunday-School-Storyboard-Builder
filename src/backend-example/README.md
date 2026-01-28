
# SundayStoryBoard Backend

Backend API server for SundayStoryBoard image generation using Replicate.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Replicate API token
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Test the API:**
   ```bash
   curl http://localhost:3001/health
   ```

## API Endpoints

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "SundayStoryBoard API is running"
}
```

### `POST /api/generate-character`
Generate character reference image.

**Request:**
```json
{
  "storyTitle": "Noah's Ark",
  "prompts": [
    {
      "id": "prompt-1",
      "text": "Noah building the ark...",
      "order": 0
    }
  ]
}
```

**Response:**
```json
{
  "imageUrl": "https://replicate.delivery/...",
  "prompt": "Character design reference sheet..."
}
```

### `POST /api/generate-storyboard`
Generate all storyboard images.

**Request:**
```json
{
  "storyTitle": "Noah's Ark",
  "characterImageUrl": "https://...",
  "prompts": [
    {
      "id": "prompt-1",
      "text": "Scene description...",
      "order": 0
    }
  ]
}
```

**Response:**
```json
{
  "images": [
    {
      "id": "prompt-1",
      "promptId": "prompt-1",
      "imageUrl": "https://replicate.delivery/...",
      "prompt": "Scene description...",
      "status": "completed"
    }
  ]
}
```

### `POST /api/generate-variation`
Generate variation of existing image.

**Request:**
```json
{
  "originalPrompt": "Original scene description",
  "editPrompt": "Make the sky more dramatic",
  "sceneNumber": 5
}
```

**Response:**
```json
{
  "imageUrl": "https://replicate.delivery/..."
}
```

## Development

```bash
npm run dev  # Start with nodemon for auto-reload
```

## Deployment

### Railway
```bash
railway login
railway init
railway up
```

### Render
1. Connect your GitHub repo
2. Set environment variables in dashboard
3. Deploy

### Fly.io
```bash
fly launch
fly deploy
```

## Environment Variables

- `REPLICATE_API_TOKEN` - Your Replicate API token (required)
- `PORT` - Server port (default: 3001)
- `FLUX_MODEL` - Model to use (default: black-forest-labs/flux-schnell)

## Cost Optimization

- **Flux Schnell**: ~$0.003 per image (fast, good quality)
- **Flux Pro**: ~$0.055 per image (best quality)

For 20-image storyboard:
- Schnell: ~$0.06 total
- Pro: ~$1.10 total

## Rate Limiting

The server includes a 500ms delay between image generations to avoid rate limits. For production, consider:

- Implementing a proper queue system (Bull, BullMQ)
- Adding Redis for caching
- Implementing webhooks for async generation

## Security

- Never commit `.env` file
- Use environment variables for all secrets
- Implement rate limiting for production
- Add authentication for API endpoints
- Validate all user inputs

## Troubleshooting

**"Invalid API token"**
- Check token starts with `r8_`
- Verify `.env` file is in root directory
- Restart server after updating `.env`

**"Rate limit exceeded"**
- Increase delay between requests
- Implement queue system
- Upgrade Replicate plan

**CORS errors**
- Verify frontend URL in CORS config
- Check browser console for specific error
