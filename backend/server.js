const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

// Initialize Supabase client with service role key for backend operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Auth middleware to verify JWT token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);

    // Verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'SundayStoryBoard API is running',
    timestamp: new Date().toISOString()
  });
});

// ======================
// STORY MANAGEMENT ENDPOINTS
// ======================

// Get all stories for authenticated user
app.get('/api/stories', authenticateUser, async (req, res) => {
  try {
    const { data: stories, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_prompts (
          id,
          sequence_number,
          prompt_text,
          image_url,
          is_generated
        )
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories', details: error.message });
  }
});

// Get single story by ID
app.get('/api/stories/:id', authenticateUser, async (req, res) => {
  try {
    const { data: story, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_prompts (
          id,
          sequence_number,
          prompt_text,
          image_url,
          is_generated,
          image_variations (
            id,
            variation_prompt,
            image_url,
            created_at
          )
        )
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Story not found' });
      }
      throw error;
    }

    res.json({ story });
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story', details: error.message });
  }
});

// Create new story
app.post('/api/stories', authenticateUser, async (req, res) => {
  try {
    console.log('Creating story for user:', req.user.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const { title, originalInput, inputType, prompts, style } = req.body;

    if (!title || !originalInput || !inputType) {
      console.log('Missing fields - title:', !!title, 'originalInput:', !!originalInput, 'inputType:', !!inputType);
      return res.status(400).json({ error: 'Missing required fields: title, originalInput, inputType' });
    }

    console.log('Inserting story into database...');

    // Create the story
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .insert({
        user_id: req.user.id,
        title,
        original_input: originalInput,
        input_type: inputType,
        style: style || 'shonen/anime graphic novel style that will appeal to 10 year old boys',
        status: 'draft'
      })
      .select()
      .single();

    if (storyError) {
      console.error('Error inserting story:', storyError);
      throw storyError;
    }

    console.log('Story created with ID:', story.id);

    // Create story prompts if provided
    if (prompts && prompts.length > 0) {
      console.log('Inserting', prompts.length, 'prompts...');
      const promptsToInsert = prompts.map((prompt, index) => ({
        story_id: story.id,
        sequence_number: prompt.order || index + 1,
        prompt_text: prompt.text,
        is_generated: false
      }));

      const { error: promptsError } = await supabase
        .from('story_prompts')
        .insert(promptsToInsert);

      if (promptsError) {
        console.error('Error inserting prompts:', promptsError);
        throw promptsError;
      }
      console.log('Prompts inserted successfully');
    }

    // Fetch the complete story with prompts
    console.log('Fetching complete story...');
    const { data: completeStory, error: fetchError } = await supabase
      .from('stories')
      .select(`
        *,
        story_prompts (
          id,
          sequence_number,
          prompt_text,
          image_url,
          is_generated
        )
      `)
      .eq('id', story.id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete story:', fetchError);
      throw fetchError;
    }

    console.log('Story creation complete!');
    res.status(201).json({ story: completeStory });
  } catch (error) {
    console.error('Error creating story:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create story', details: error.message });
  }
});

// Update story
app.put('/api/stories/:id', authenticateUser, async (req, res) => {
  try {
    const { title, status, characterImageUrl, characterApproved } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (status !== undefined) updates.status = status;
    if (characterImageUrl !== undefined) updates.character_image_url = characterImageUrl;
    if (characterApproved !== undefined) updates.character_approved = characterApproved;

    const { data: story, error } = await supabase
      .from('stories')
      .update(updates)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Story not found' });
      }
      throw error;
    }

    res.json({ story });
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ error: 'Failed to update story', details: error.message });
  }
});

// Delete story
app.delete('/api/stories/:id', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete story', details: error.message });
  }
});

// Update story prompts
app.put('/api/stories/:id/prompts', authenticateUser, async (req, res) => {
  try {
    const { prompts } = req.body;

    // Verify story ownership
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('id')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .single();

    if (storyError || !story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Delete existing prompts
    await supabase
      .from('story_prompts')
      .delete()
      .eq('story_id', req.params.id);

    // Insert new prompts
    const promptsToInsert = prompts.map((prompt, index) => ({
      story_id: req.params.id,
      sequence_number: prompt.order || index + 1,
      prompt_text: prompt.text,
      is_generated: false
    }));

    const { data: newPrompts, error: promptsError } = await supabase
      .from('story_prompts')
      .insert(promptsToInsert)
      .select();

    if (promptsError) throw promptsError;

    res.json({ prompts: newPrompts });
  } catch (error) {
    console.error('Error updating prompts:', error);
    res.status(500).json({ error: 'Failed to update prompts', details: error.message });
  }
});

// ======================
// IMAGE GENERATION ENDPOINTS
// ======================

// Generate character reference image
app.post('/api/generate-character', authenticateUser, async (req, res) => {
  try {
    const { storyId, prompts, storyTitle } = req.body;

    console.log('Generating character reference for:', storyTitle);

    // Verify story ownership
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('id, style')
      .eq('id', storyId)
      .eq('user_id', req.user.id)
      .single();

    if (storyError || !story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Create comprehensive character reference prompt
    const characterPrompt = `Character design reference sheet for "${storyTitle}".

Show the main characters from this story in multiple views (front, side, 3/4 view).
Include key props, clothing details, and distinctive features.

Story context: ${prompts[0]?.text || storyTitle}

Style: ${story.style}
Art style: Vibrant colors, clean lines, dynamic proportions
Layout: Professional character turnaround sheet
Quality: High detail, production-ready character designs
Aspect ratio: 16:9 for presentation`;

    // Update story status
    await supabase
      .from('stories')
      .update({ status: 'generating_character' })
      .eq('id', storyId);

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: characterPrompt,
          num_outputs: 1,
          aspect_ratio: "16:9",
          output_format: "png",
          output_quality: 90,
          num_inference_steps: 4
        }
      }
    );

    const imageUrl = output[0];

    // Update story with character image
    await supabase
      .from('stories')
      .update({
        character_image_url: imageUrl,
        status: 'character_ready'
      })
      .eq('id', storyId);

    console.log('Character reference generated successfully');

    res.json({
      imageUrl,
      prompt: characterPrompt
    });
  } catch (error) {
    console.error('Error generating character:', error);

    // Update story status to indicate error
    if (req.body.storyId) {
      await supabase
        .from('stories')
        .update({ status: 'draft' })
        .eq('id', req.body.storyId);
    }

    res.status(500).json({
      error: 'Failed to generate character reference',
      details: error.message
    });
  }
});

// Generate storyboard images
app.post('/api/generate-storyboard', authenticateUser, async (req, res) => {
  try {
    const { storyId, prompts, characterImageUrl, storyTitle } = req.body;

    console.log(`Generating ${prompts.length} storyboard images for: ${storyTitle}`);

    // Verify story ownership
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('id, style')
      .eq('id', storyId)
      .eq('user_id', req.user.id)
      .single();

    if (storyError || !story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Update story status
    await supabase
      .from('stories')
      .update({ status: 'generating_storyboard' })
      .eq('id', storyId);

    const images = [];

    for (let i = 0; i < prompts.length; i++) {
      const prompt = prompts[i];

      console.log(`Generating scene ${i + 1}/${prompts.length}...`);

      const enhancedPrompt = `Scene ${i + 1}: ${prompt.text}

Visual style: ${story.style}
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

      const imageUrl = output[0];

      // Update the prompt in database with generated image
      await supabase
        .from('story_prompts')
        .update({
          image_url: imageUrl,
          is_generated: true
        })
        .eq('id', prompt.id);

      images.push({
        id: prompt.id,
        promptId: prompt.id,
        imageUrl,
        prompt: prompt.text,
        status: 'completed'
      });

      // Small delay between generations
      if (i < prompts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // Update story status to complete
    await supabase
      .from('stories')
      .update({ status: 'complete' })
      .eq('id', storyId);

    console.log('All storyboard images generated successfully');
    res.json({ images });

  } catch (error) {
    console.error('Error generating storyboard:', error);

    // Update story status to indicate error
    if (req.body.storyId) {
      await supabase
        .from('stories')
        .update({ status: 'character_ready' })
        .eq('id', req.body.storyId);
    }

    res.status(500).json({
      error: 'Failed to generate storyboard',
      details: error.message
    });
  }
});

// Generate single image variation
app.post('/api/generate-variation', authenticateUser, async (req, res) => {
  try {
    const { promptId, originalPrompt, editPrompt, sceneNumber } = req.body;

    console.log(`Generating variation for scene ${sceneNumber}`);

    // Verify the prompt belongs to user's story
    const { data: prompt, error: promptError } = await supabase
      .from('story_prompts')
      .select(`
        id,
        story_id,
        stories!inner(user_id, style)
      `)
      .eq('id', promptId)
      .single();

    if (promptError || !prompt || prompt.stories.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const combinedPrompt = `${originalPrompt}

Modification requested: ${editPrompt}

Style: ${prompt.stories.style}, 16:9 cinematic aspect ratio
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

    const imageUrl = output[0];

    // Save variation to database
    const { data: variation, error: variationError } = await supabase
      .from('image_variations')
      .insert({
        story_prompt_id: promptId,
        variation_prompt: editPrompt,
        image_url: imageUrl
      })
      .select()
      .single();

    if (variationError) throw variationError;

    console.log('Variation generated successfully');
    res.json({
      imageUrl,
      variation
    });

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
  console.log(`🚀 SundayStoryBoard API running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Authentication required for all /api/* endpoints`);
});
