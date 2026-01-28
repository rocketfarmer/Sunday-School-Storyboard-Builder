
# SundayStoryBoard - Replicate Setup Guide

This guide will walk you through setting up Replicate for AI image generation in your SundayStoryBoard app.

## Why Replicate + Flux?

- **Cost**: ~$0.003-0.01 per image (10x cheaper than OpenAI DALL-E)
- **Quality**: Excellent for anime/illustration styles
- **Character Consistency**: Better support for maintaining consistent characters
- **Flexibility**: Easy to switch between different AI models

---

## Step 1: Create Replicate Account

1. Go to [replicate.com](https://replicate.com)
2. Click "Sign Up" (free to start, pay-as-you-go)
3. Verify your email

---

## Step 2: Get Your API Token

1. Go to [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)
2. Click "Create token"
3. Copy your token (starts with `r8_...`)
4. **Keep this secret!** Never commit it to git

---

## Step 3: Choose Your Model

For anime/shonen style with character consistency, I recommend:

### **Option 1: Flux Pro (Best Quality)**
- Model: `black-forest-labs/flux-pro`
- Cost: ~$0.055 per image
- Best quality, excellent for anime styles

### **Option 2: Flux Schnell (Faster, Cheaper)**
- Model: `black-forest-labs/flux-schnell`
- Cost: ~$0.003 per image
- Good quality, 10x faster

### **Option 3: SDXL with Anime LoRA**
- Model: `lucataco/anime-art-diffusion-xl`
- Cost: ~$0.01 per image
- Pre-trained for anime style

**Recommendation**: Start with **Flux Schnell** for development, upgrade to **Flux Pro** for production.

---

## Step 4: Backend Setup

You'll need a backend server to handle API calls (never expose API keys in frontend!).

### Create a Simple Node.js Backend

```bash
# Create backend folder
mkdir sundaystoryboard-backend
cd sundaystoryboard-backend

# Initialize project
npm init -y

# Install dependencies
npm install express cors dotenv replicate
```

### Create `.env` file

```env
REPLICATE_API_TOKEN=r8_your_token_here
PORT=3001
```

### Create `server.js`

```javascript
const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Generate character reference image
app.post('/api/generate-character', async (req, res) => {
  try {
    const { prompts } = req.body; // Array of scene descriptions
    
    // Create character reference prompt
    const characterPrompt = `Character design sheet showing main characters from this story: ${prompts[0]}. 
    Multiple views of each character (front, side, back). 
    Shonen anime style, vibrant colors, dynamic poses. 
    Character reference sheet layout. 16:9 aspect ratio.`;

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: characterPrompt,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "png",
          output_quality: 90
        }
      }
    );

    res.json({ 
      imageUrl: output[0],
      prompt: characterPrompt 
    });
  } catch (error) {
    console.error('Error generating character:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate storyboard images
app.post('/api/generate-storyboard', async (req, res) => {
  try {
    const { prompts, characterImageUrl } = req.body;
    
    // Generate images for each prompt
    const imagePromises = prompts.map(async (prompt, index) => {
      const enhancedPrompt = `${prompt.text}
      
      Style: Shonen anime/manga style, vibrant colors, dynamic composition.
      Maintain character consistency with reference image.
      16:9 cinematic aspect ratio.
      High quality, detailed illustration.`;

      const output = await replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: enhancedPrompt,
            num_outputs: 1,
            aspect_ratio: "16:9",
            output_format: "png",
            output_quality: 90,
            // Note: Character reference can be added here in future
            // when Flux supports image conditioning
          }
        }
      );

      return {
        id: prompt.id,
        imageUrl: output[0],
        prompt: prompt.text,
        status: 'completed'
      };
    });

    const images = await Promise.all(imagePromises);
    res.json({ images });
  } catch (error) {
    console.error('Error generating storyboard:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate image variation
app.post('/api/generate-variation', async (req, res) => {
  try {
    const { originalPrompt, editPrompt } = req.body;
    
    const combinedPrompt = `${originalPrompt}
    
    Modified: ${editPrompt}
    
    Style: Shonen anime/manga style, vibrant colors, 16:9 aspect ratio.`;

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: combinedPrompt,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "png",
          output_quality: 90
        }
      }
    );

    res.json({ imageUrl: output[0] });
  } catch (error) {
    console.error('Error generating variation:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Start the backend

```bash
node server.js
```

---

## Step 5: Update Frontend to Call Backend

Update `hooks/useStoryState.ts` to call your backend instead of using mock data:

```typescript
const generateCharacter = async () => {
  if (!currentStory) return;
  setIsLoading(true);
  
  try {
    const response = await fetch('http://localhost:3001/api/generate-character', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompts: currentStory.prompts })
    });
    
    const data = await response.json();
    
    setCurrentStory({
      ...currentStory,
      status: 'characters_ready',
      characterImage: data.imageUrl,
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## Step 6: Character Consistency Strategy

To maintain consistent characters across all 15-25 images:

### Approach 1: Detailed Character Descriptions (Current)
Include detailed character descriptions in every prompt:

```
"Noah, a wise elderly man with long white beard and brown robes, 
stands on the ark deck. Background shows..."
```

### Approach 2: Use Flux's Image Conditioning (Coming Soon)
Flux Pro will support using your character reference image directly:

```javascript
const output = await replicate.run("black-forest-labs/flux-pro", {
  input: {
    prompt: scenePrompt,
    image: characterReferenceUrl, // Reference image
    prompt_strength: 0.8 // How much to follow the reference
  }
});
```

### Approach 3: Train a Custom LoRA (Advanced)
For perfect consistency, train a custom model on your character designs:
- Costs ~$5-10 to train
- Perfect character consistency
- Reusable across projects

---

## Step 7: Cost Estimation

### Per Storyboard (20 images average):

**Flux Schnell (Recommended for start):**
- Character reference: $0.003
- 20 storyboard images: 20 × $0.003 = $0.06
- **Total: ~$0.063 per storyboard**

**Flux Pro (Production quality):**
- Character reference: $0.055
- 20 storyboard images: 20 × $0.055 = $1.10
- **Total: ~$1.15 per storyboard**

### Pricing Strategy:
- **Free tier**: 3 storyboards/month (cost you ~$0.20)
- **Basic**: $9.99/month for 20 storyboards (cost you ~$1.26)
- **Pro**: $29.99/month for unlimited (set reasonable limits)

You have **huge margins** with this pricing!

---

## Step 8: Testing

1. Start your backend: `node server.js`
2. Start your frontend: `npm start`
3. Create a story: "Noah's Ark"
4. Watch the console for API calls
5. First image should generate in ~3-5 seconds

---

## Step 9: Production Deployment

### Backend (Railway, Render, or Fly.io):
```bash
# Add to package.json
"scripts": {
  "start": "node server.js"
}

# Deploy to Railway
railway login
railway init
railway up
```

### Environment Variables:
Set `REPLICATE_API_TOKEN` in your hosting platform's dashboard.

### Frontend:
Update API URL from `localhost:3001` to your production backend URL.

---

## Troubleshooting

### "Invalid API token"
- Check your token starts with `r8_`
- Verify it's set in `.env` file
- Restart your server after adding `.env`

### "Rate limit exceeded"
- Replicate has generous free tier
- Add delays between requests if needed
- Consider upgrading to paid plan

### Images not consistent
- Add more character details to prompts
- Use the character reference image approach
- Consider training a custom LoRA

---

## Next Steps

1. ✅ Set up Replicate account
2. ✅ Create backend server
3. ✅ Test with one image
4. ✅ Integrate with frontend
5. 🔄 Add error handling
6. 🔄 Add progress tracking
7. 🔄 Deploy to production
8. 🔄 Add user authentication
9. 🔄 Set up payment processing (Stripe)

---

## Resources

- [Replicate Documentation](https://replicate.com/docs)
- [Flux Model Details](https://replicate.com/black-forest-labs/flux-schnell)
- [Node.js SDK](https://github.com/replicate/replicate-javascript)
- [Pricing Calculator](https://replicate.com/pricing)

---

## Support

Need help? Common issues:

1. **CORS errors**: Make sure backend has `cors` enabled
2. **Slow generation**: Normal for first request (cold start)
3. **Character inconsistency**: Add more detailed character descriptions

Good luck! 🚀
