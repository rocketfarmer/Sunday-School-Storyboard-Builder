/*
  # Initial Schema for Storyboard Generator

  ## Overview
  Creates the core database schema for a multi-user storyboard generation application
  where users can create, save, and manage AI-generated visual stories.

  ## New Tables

  ### `stories`
  Main table storing user's story projects
  - `id` (uuid, primary key) - Unique story identifier
  - `user_id` (uuid, foreign key to auth.users) - Story owner
  - `title` (text) - Story title/name
  - `original_input` (text) - User's original story prompt or text
  - `input_type` (text) - Either 'prompt' or 'text'
  - `style` (text) - Art style (default: 'shonen/anime graphic novel')
  - `character_image_url` (text, nullable) - URL of approved character reference image
  - `character_approved` (boolean) - Whether character design is approved
  - `status` (text) - Story status: 'draft', 'generating_character', 'character_ready', 'generating_storyboard', 'complete'
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `story_prompts`
  Individual image prompts for each story
  - `id` (uuid, primary key) - Unique prompt identifier
  - `story_id` (uuid, foreign key to stories) - Parent story
  - `sequence_number` (integer) - Order in the story (1-25)
  - `prompt_text` (text) - AI image generation prompt
  - `image_url` (text, nullable) - Generated image URL
  - `is_generated` (boolean) - Whether image has been generated
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `image_variations`
  Stores variation images generated from original storyboard images
  - `id` (uuid, primary key) - Unique variation identifier
  - `story_prompt_id` (uuid, foreign key to story_prompts) - Original prompt
  - `variation_prompt` (text) - Modification instructions for variation
  - `image_url` (text) - Generated variation image URL
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only access their own stories and related data
  - Authenticated users required for all operations
  - Cascade deletes to maintain referential integrity

  ## Indexes
  - Index on user_id for fast story lookups
  - Index on story_id for prompt queries
  - Index on created_at for chronological sorting
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  original_input text NOT NULL,
  input_type text NOT NULL CHECK (input_type IN ('prompt', 'text')),
  style text DEFAULT 'shonen/anime graphic novel style that will appeal to 10 year old boys',
  character_image_url text,
  character_approved boolean DEFAULT false,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'generating_character', 'character_ready', 'generating_storyboard', 'complete')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create story_prompts table
CREATE TABLE IF NOT EXISTS story_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  sequence_number integer NOT NULL,
  prompt_text text NOT NULL,
  image_url text,
  is_generated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(story_id, sequence_number)
);

-- Create image_variations table
CREATE TABLE IF NOT EXISTS image_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_prompt_id uuid REFERENCES story_prompts(id) ON DELETE CASCADE NOT NULL,
  variation_prompt text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS stories_user_id_idx ON stories(user_id);
CREATE INDEX IF NOT EXISTS stories_created_at_idx ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS story_prompts_story_id_idx ON story_prompts(story_id);
CREATE INDEX IF NOT EXISTS story_prompts_sequence_idx ON story_prompts(story_id, sequence_number);
CREATE INDEX IF NOT EXISTS image_variations_prompt_id_idx ON image_variations(story_prompt_id);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_variations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stories table
CREATE POLICY "Users can view own stories"
  ON stories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stories"
  ON stories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
  ON stories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
  ON stories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for story_prompts table
CREATE POLICY "Users can view own story prompts"
  ON story_prompts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_prompts.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own story prompts"
  ON story_prompts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_prompts.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own story prompts"
  ON story_prompts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_prompts.story_id
      AND stories.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_prompts.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own story prompts"
  ON story_prompts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_prompts.story_id
      AND stories.user_id = auth.uid()
    )
  );

-- RLS Policies for image_variations table
CREATE POLICY "Users can view own image variations"
  ON image_variations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM story_prompts
      JOIN stories ON stories.id = story_prompts.story_id
      WHERE story_prompts.id = image_variations.story_prompt_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own image variations"
  ON image_variations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM story_prompts
      JOIN stories ON stories.id = story_prompts.story_id
      WHERE story_prompts.id = image_variations.story_prompt_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own image variations"
  ON image_variations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM story_prompts
      JOIN stories ON stories.id = story_prompts.story_id
      WHERE story_prompts.id = image_variations.story_prompt_id
      AND stories.user_id = auth.uid()
    )
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for automatic updated_at timestamps
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_prompts_updated_at
  BEFORE UPDATE ON story_prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();