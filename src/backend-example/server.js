
const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SundayStoryBoard API is running' });
});

// Generate character reference image
app.post('/api/generate-character', async (req, res) => {
  try {
    const { prompts, storyTitle } = req.body;

    console.log('Generating character reference for:', storyTitle);

    // Create comprehensive character reference prompt
    const characterPrompt = `Character design reference sheet for "${storyTitle}".
    
Show the main characters from this story in multiple views (front, side, 3/4 view).
Include key props, clothing details, and distinctive features.

Story context: ${prompts[0]?.text || storyTitle}

Style: Shonen anime/manga character design sheet
Art style: Vibrant colors, clean lines, dynamic proportions
Layout: Professional character turnaround sheet
Quality: High detail, production-ready character designs
Aspect ratio: 16:9 for presentation`;

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: characterPrompt,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "png",
          output_quality: 90,
          num_inference_steps: 4 // Schnell is optimized for 4 steps
        }
      }
    );

    console.log('Character reference generated successfully');

    res.json({
      imageUrl: output[0],
      prompt: characterPrompt
    });
  } catch (error) {
    console.error('Error generating character:', error);
    res.status(500).json({
      error: 'Failed to generate character reference',
      details: error.message
    });
  }
});

// Generate storyboard images (batch or single)
app.post('/api/generate-storyboard', async (req, res) => {
  try {
    const { prompts, characterImageUrl, storyTitle } = req.body;

    console.log(`Generating ${prompts.length} storyboard images for: ${storyTitle}`);

    // Generate images sequentially to avoid rate limits
    // In production, you might want to use a queue system
    const images = [];

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];

      console.log(`Generating scene ${i + 1}/${prompts.length}...`);

      const enhancedPrompt = `Scene ${i + 1}: ${prompt.text}

Visual style: Shonen anime/manga illustration
Art quality: High detail, vibrant colors, dynamic composition
Cinematography: 16:9 cinematic framing, dramatic lighting
Character consistency: Maintain character designs from reference
Background: Detailed environment matching the scene description
Mood: Engaging and appropriate for the story moment`;

      const output = await replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: enhancedPrompt,
            num_outputs: 1,
            aspect_ratio: "16:9",
            output_format: "png",
            output_quality: 90,
            num_inference_steps: 4
          }
        }
      );

      images.push({
        id: prompt.id,
        promptId: prompt.id,
        imageUrl: output[0],
        prompt: prompt.text,
        status: 'completed'
      });

      // Small delay to be nice to the API
      if (i < prompts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    console.log('All storyboard images generated successfully');
    res.json({ images });

  } catch (error) {
    console.error('Error generating storyboard:', error);
    res.status(500).json({
      error: 'Failed to generate storyboard',
      details: error.message
    });
  }
});

// Generate single image variation
app.post('/api/generate-variation', async (req, res) => {
  try {
    const { originalPrompt, editPrompt, sceneNumber } = req.body;

    console.log(`Generating variation for scene ${sceneNumber}`);

    const combinedPrompt = `${originalPrompt}

Modification requested: ${editPrompt}

Style: Shonen anime/manga illustration, 16:9 cinematic aspect ratio
Quality: High detail, vibrant colors, professional illustration`;

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: combinedPrompt,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "png",
          output_quality: 90,
          num_inference_steps: 4
        }
      }
    );

    console.log('Variation generated successfully');
    res.json({ imageUrl: output[0] });

  } catch (error) {
    console.error('Error generating variation:', error);
    res.status(500).json({
      error: 'Failed to generate variation',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 SundayStoryBoard API running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});