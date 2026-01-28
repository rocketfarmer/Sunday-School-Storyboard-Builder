
# SundayStoryBoard

An AI-powered storyboard generator for Sunday school lessons. Create engaging, anime-style visual stories from biblical text in minutes.

![SundayStoryBoard](https://placehold.co/1200x630/f59e0b/ffffff?text=SundayStoryBoard)

## ✨ Features

- 📖 **Story Input** - Paste scripture or describe a lesson
- 🎬 **AI Scene Generation** - Automatically breaks stories into 15-25 key scenes
- 🎨 **Character Consistency** - Maintains consistent character designs across all scenes
- 🖼️ **Anime Style** - High-quality shonen/manga art style
- ✏️ **Editable Prompts** - Refine scenes before generating images
- 🔄 **Image Variations** - Generate alternative versions of any scene
- 💾 **Save Stories** - Keep your storyboards for future use

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or download this project**

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend-example
   npm install
   ```

4. **Set up Replicate API:**
   - Sign up at [replicate.com](https://replicate.com)
   - Get your API token from [account/api-tokens](https://replicate.com/account/api-tokens)
   - Create `backend-example/.env`:
     ```env
     REPLICATE_API_TOKEN=your_token_here
     PORT=3001
     ```

5. **Start the backend:**
   ```bash
   cd backend-example
   npm start
   ```

6. **Start the frontend (in a new terminal):**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
sundaystoryboard/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── Navigation.tsx   # Top navigation bar
│   ├── PromptList.tsx   # Editable scene list
│   └── ...
├── pages/               # Page components
│   ├── HomePage.tsx
│   ├── StoryInputPage.tsx
│   ├── PromptEditorPage.tsx
│   ├── CharacterApprovalPage.tsx
│   ├── StoryboardPage.tsx
│   └── SavedStoriesPage.tsx
├── contexts/            # React context providers
│   └── StoryContext.tsx # Global story state
├── hooks/               # Custom React hooks
│   └── useStoryState.ts # Story management logic
├── types/               # TypeScript type definitions
│   └── story.ts
├── backend-example/     # Backend API server
│   ├── server.js        # Express server
│   ├── package.json
│   └── .env.example
├── App.tsx              # Main app component
├── index.tsx            # App entry point
├── index.css            # Global styles
└── tailwind.config.js   # Tailwind configuration
```

## 🎨 Design System

### Colors
- **Primary**: Amber/Orange (`#f59e0b`, `#ea580c`) - Warm, inviting
- **Background**: Light gray (`#f9fafb`)
- **Text**: Gray scale for hierarchy
- **Success**: Green for approved states

### Typography
- **Font**: Inter (clean, readable)
- **Hierarchy**: Clear heading sizes, readable body text

### Motion
- Smooth page transitions
- Staggered fade-in for image grids
- Progress animations for generation
- Hover effects only on interactive elements

## 🔧 Configuration

### Change API URL

Edit `hooks/useStoryState.ts`:
```typescript
const API_URL = 'http://localhost:3001'; // Change for production
```

### Change AI Model

Edit `backend-example/server.js`:
```javascript
// Current: Flux Schnell (fast, cheap)
"black-forest-labs/flux-schnell"

// Alternative: Flux Pro (higher quality)
"black-forest-labs/flux-pro"
```

## 💰 Cost Estimation

Using Flux Schnell:
- Character reference: $0.003
- 15 storyboard images: $0.045
- **Total per story: ~$0.05**

Using Flux Pro:
- Character reference: $0.055
- 15 storyboard images: $0.825
- **Total per story: ~$0.88**

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Build command: `npm run build`
4. Output directory: `dist`

### Backend (Railway/Render/Fly.io)

**Railway:**
```bash
cd backend-example
railway login
railway init
railway up
```

**Render:**
1. Connect GitHub repo
2. Select `backend-example` folder
3. Add environment variable: `REPLICATE_API_TOKEN`
4. Deploy

**Fly.io:**
```bash
cd backend-example
fly launch
fly deploy
```

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Detailed setup instructions
- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Step-by-step integration
- [backend-example/README.md](./backend-example/README.md) - Backend API docs

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- React Router
- Lucide Icons

**Backend:**
- Node.js
- Express
- Replicate API

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your needs!

## 📝 License

MIT License - feel free to use this for your Sunday school ministry!

## 🙏 Acknowledgments

- Built with [Magic Patterns](https://magicpatterns.com)
- AI image generation by [Replicate](https://replicate.com)
- Icons by [Lucide](https://lucide.dev)

## 💡 Tips

1. **Test with small stories first** - Start with 5-10 scenes
2. **Be specific in prompts** - More detail = better results
3. **Use character descriptions** - Include names, clothing, features
4. **Monitor costs** - Check Replicate dashboard regularly
5. **Save frequently** - Don't lose your work!

## 🐛 Troubleshooting

### "Failed to fetch"
- Make sure backend is running on port 3001
- Check backend logs for errors

### "Invalid API token"
- Verify token in `backend-example/.env`
- Token should start with `r8_`

### Images not generating
- Check Replicate dashboard for errors
- Verify you have credits/payment method

### CORS errors
- Backend has CORS enabled by default
- Check console for specific error

## 📧 Support

For issues or questions:
1. Check the documentation files
2. Review backend logs
3. Check browser console (F12)

---

**Made with ❤️ for Sunday school teachers**
