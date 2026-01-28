
# Step-by-Step Integration Guide

Follow these steps exactly to integrate Replicate image generation into your SundayStoryBoard app.

---

## ⏱️ Total Time: ~20 minutes

---

## Step 1: Get Your Replicate API Token (5 minutes)

### 1.1 Create Replicate Account
1. Open your browser and go to: https://replicate.com
2. Click **"Sign Up"** in the top right
3. Sign up with GitHub or email
4. Verify your email if prompted

### 1.2 Get Your API Token
1. Once logged in, go to: https://replicate.com/account/api-tokens
2. Click **"Create token"**
3. Give it a name like "SundayStoryBoard"
4. Click **"Create"**
5. **Copy the token** - it starts with `r8_` and looks like: `r8_abc123...`
6. ⚠️ **Save it somewhere safe** - you'll need it in the next step

### 1.3 Add Payment Method (Optional but Recommended)
1. Go to: https://replicate.com/account/billing
2. Add a credit card (you won't be charged unless you use it)
3. Replicate has a generous free tier to start

**✅ Checkpoint:** You should have a token that starts with `r8_`

---

## Step 2: Set Up the Backend (5 minutes)

### 2.1 Open Terminal
Open your terminal/command prompt and navigate to your project:

```bash
# Navigate to your project root
cd /path/to/your/sundaystoryboard-project
```

### 2.2 Set Up Backend Folder
```bash
# Create backend directory (if not exists)
mkdir -p backend-example
cd backend-example

# Initialize npm (if not already done)
npm init -y

# Install required packages
npm install express cors dotenv replicate
```

**Wait for installation to complete** (should take 1-2 minutes)

### 2.3 Create Environment File
```bash
# Create .env file
touch .env
```

Now open the `.env` file in your text editor and add:

```env
REPLICATE_API_TOKEN=r8_YOUR_TOKEN_HERE
PORT=3001
```

**Replace `r8_YOUR_TOKEN_HERE` with your actual token from Step 1.2**

### 2.4 Verify Files Exist
Make sure you have these files in `backend-example/`:
- ✅ `package.json`
- ✅ `server.js`
- ✅ `.env` (with your token)

### 2.5 Start the Backend
```bash
# Make sure you're in backend-example folder
npm start
```

You should see:
```
🚀 SundayStoryBoard API running on http://localhost:3001
📝 Health check: http://localhost:3001/health
```

**✅ Checkpoint:** Backend is running on port 3001

---

## Step 3: Test the Backend (2 minutes)

### 3.1 Test Health Endpoint
Open a **new terminal window** (keep the backend running in the first one) and run:

```bash
curl http://localhost:3001/health
```

You should see:
```json
{"status":"ok","message":"SundayStoryBoard API is running"}
```

### 3.2 Test Image Generation (Optional)
Let's generate a test image to make sure everything works:

```bash
curl -X POST http://localhost:3001/api/generate-character \
  -H "Content-Type: application/json" \
  -d '{
    "storyTitle": "Test Story",
    "prompts": [{"id": "1", "text": "A brave knight", "order": 0}]
  }'
```

This will take ~5-10 seconds. You should get back a JSON response with an `imageUrl`.

**✅ Checkpoint:** You received an image URL starting with `https://replicate.delivery/`

---

## Step 4: Update Frontend to Use Backend (5 minutes)

### 4.1 Create Frontend Environment File
In your **project root** (not backend-example), create `.env`:

```bash
# Go back to project root
cd ..

# Create .env file
touch .env
```

Add this to `.env`:
```env
REACT_APP_API_URL=http://localhost:3001
```

### 4.2 Update the Frontend Code
The frontend code has already been updated to call your backend! 

The key changes are in:
- `hooks/useStoryState.ts` - Now calls your API instead of using mock data
- Environment variable support for API URL

### 4.3 Restart Your Frontend
Stop your React app (Ctrl+C) and restart it:

```bash
npm start
```

**✅ Checkpoint:** Frontend is running and can see the API URL

---

## Step 5: Test the Full Flow (3 minutes)

### 5.1 Create a Story
1. Open your browser to `http://localhost:3000`
2. Click **"Start Creating"**
3. Type: `Noah's Ark from Genesis`
4. Click **"Generate Storyboard Prompts"**

**What happens:**
- You'll see a loading state for ~2 seconds
- The app generates 15 scene prompts
- You're redirected to the prompt editor

### 5.2 Generate Character Reference
1. Review the prompts (edit if you want)
2. Click **"Next: Character Design"**

**What happens:**
- Backend calls Replicate API
- Takes ~5-10 seconds
- You'll see a real AI-generated character reference image!

### 5.3 Generate Storyboard
1. Click **"Approve & Generate Storyboard"**

**What happens:**
- Backend generates 15 images sequentially
- Takes ~1-2 minutes total
- You'll see a progress bar
- Each image appears as it's generated

### 5.4 Test Image Variation
1. Click on any generated image
2. Type an edit like: "Make the sky more dramatic"
3. Click **"Generate Variation"**

**What happens:**
- New variation generates in ~5 seconds
- You see the updated image

**✅ Checkpoint:** You've generated real AI images!

---

## Step 6: Verify Everything Works

### Checklist:
- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Can create a story
- [ ] Character reference generates (real image)
- [ ] Storyboard images generate (15 real images)
- [ ] Can generate variations
- [ ] Can save stories

---

## Common Issues & Solutions

### Issue 1: "Failed to fetch" error
**Problem:** Frontend can't reach backend

**Solution:**
```bash
# Check backend is running
curl http://localhost:3001/health

# If not running, start it:
cd backend-example
npm start
```

### Issue 2: "Invalid API token"
**Problem:** Replicate token is wrong or missing

**Solution:**
1. Check `backend-example/.env` file exists
2. Verify token starts with `r8_`
3. Make sure there are no spaces or quotes around the token
4. Restart backend after fixing

### Issue 3: CORS error in browser
**Problem:** Browser blocking requests

**Solution:**
The backend already has CORS enabled. If you still see errors:
```javascript
// In backend-example/server.js, update CORS:
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 4: Images generating slowly
**Problem:** Each image takes 5-10 seconds

**This is normal!** AI image generation takes time. For production:
- Use a queue system (Bull/BullMQ)
- Generate images in parallel (with rate limiting)
- Show better progress indicators

### Issue 5: "Rate limit exceeded"
**Problem:** Too many requests to Replicate

**Solution:**
- Wait a few minutes
- The backend has built-in delays
- Upgrade your Replicate plan if needed

---

## Production Deployment (Next Steps)

Once everything works locally, you're ready to deploy!

### Deploy Backend:

**Option 1: Railway (Easiest)**
```bash
cd backend-example
railway login
railway init
railway up
```

**Option 2: Render**
1. Push code to GitHub
2. Go to render.com
3. Create new "Web Service"
4. Connect your repo
5. Add environment variable: `REPLICATE_API_TOKEN`

**Option 3: Fly.io**
```bash
cd backend-example
fly launch
fly deploy
```

### Update Frontend:
Change `.env` to point to your production backend:
```env
REACT_APP_API_URL=https://your-backend.railway.app
```

---

## Cost Tracking

### Monitor Your Usage:
1. Go to: https://replicate.com/account/billing
2. Check your usage dashboard
3. Set up billing alerts

### Expected Costs (Flux Schnell):
- Character reference: $0.003
- 15 storyboard images: $0.045
- **Total per story: ~$0.05**

If you charge $9.99/month for 20 stories, you make:
- Revenue: $9.99
- Cost: $1.00 (20 × $0.05)
- **Profit: $8.99** 🎉

---

## Next Steps

Now that integration is working:

1. ✅ **Test thoroughly** - Create multiple stories
2. ✅ **Add error handling** - Better error messages
3. ✅ **Improve UX** - Better loading states
4. ✅ **Add authentication** - User accounts
5. ✅ **Set up payments** - Stripe integration
6. ✅ **Deploy to production** - Railway/Render/Fly.io

---

## Need Help?

### Check These First:
1. Backend logs (in terminal where you ran `npm start`)
2. Browser console (F12 → Console tab)
3. Network tab (F12 → Network tab)

### Common Log Messages:

**Good:**
```
🚀 SundayStoryBoard API running on http://localhost:3001
Generating character reference for: Noah's Ark
Character reference generated successfully
```

**Bad:**
```
Error: Invalid API token
Error: Rate limit exceeded
Error: Failed to fetch
```

### Still Stuck?
1. Check the token is correct in `.env`
2. Restart both backend and frontend
3. Try generating a single test image with curl
4. Check Replicate dashboard for errors

---

## Success! 🎉

You now have a fully working AI storyboard generator!

**What you've built:**
- ✅ Frontend React app
- ✅ Backend API server
- ✅ Replicate AI integration
- ✅ Real image generation
- ✅ Character consistency
- ✅ Image variations

**Ready for production:**
- Add user authentication
- Set up payment processing
- Deploy to production
- Start getting users!

Good luck! 🚀
