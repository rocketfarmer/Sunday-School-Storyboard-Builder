import { useState, useEffect } from 'react';
import { Story, StoryPrompt, StoryboardImage } from '../types/story';
import { api } from '../lib/api';

const MOCK_PROMPTS: StoryPrompt[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `prompt-${i}`,
  text: `Scene ${i + 1}: Character enters the scene with a determined look. The background shows a vibrant landscape typical of the shonen genre.`,
  order: i
}));

function mapDatabaseStoryToFrontend(dbStory: any): Story {
  return {
    id: dbStory.id,
    title: dbStory.title,
    originalInput: dbStory.original_input,
    inputType: dbStory.input_type,
    status: mapDatabaseStatus(dbStory.status),
    prompts: (dbStory.story_prompts || []).map((p: any) => ({
      id: p.id,
      text: p.prompt_text,
      order: p.sequence_number
    })),
    characterImage: dbStory.character_image_url,
    images: (dbStory.story_prompts || [])
      .filter((p: any) => p.is_generated && p.image_url)
      .map((p: any) => ({
        id: p.id,
        promptId: p.id,
        imageUrl: p.image_url,
        status: 'completed' as const,
        prompt: p.prompt_text
      })),
    createdAt: new Date(dbStory.created_at),
    updatedAt: new Date(dbStory.updated_at)
  };
}

function mapDatabaseStatus(dbStatus: string) {
  const statusMap: Record<string, any> = {
    'draft': 'draft',
    'generating_character': 'generating_characters',
    'character_ready': 'characters_ready',
    'generating_storyboard': 'generating_storyboard',
    'complete': 'completed'
  };
  return statusMap[dbStatus] || 'draft';
}

export function useStoryState() {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSavedStories();
  }, []);

  const loadSavedStories = async () => {
    try {
      const { stories } = await api.getStories();
      setSavedStories(stories.map(mapDatabaseStoryToFrontend));
    } catch (error) {
      console.error('Error loading saved stories:', error);
    }
  };

  const createStory = async (input: string, type: 'prompt' | 'text') => {
    setIsLoading(true);

    try {
      const title = input.slice(0, 50) + (input.length > 50 ? '...' : '');
      const prompts = MOCK_PROMPTS.map((p, i) => ({
        text: `Scene ${i + 1} from "${input}": ${p.text}`,
        order: i + 1
      }));

      const { story } = await api.createStory({
        title,
        originalInput: input,
        inputType: type,
        prompts
      });

      const mappedStory = mapDatabaseStoryToFrontend(story);
      setCurrentStory(mappedStory);
      await loadSavedStories();
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to create story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrompts = async (prompts: StoryPrompt[]) => {
    if (!currentStory) return;

    try {
      const formattedPrompts = prompts.map(p => ({
        text: p.text,
        order: p.order
      }));

      await api.updatePrompts(currentStory.id, formattedPrompts);

      setCurrentStory({
        ...currentStory,
        prompts
      });
    } catch (error) {
      console.error('Error updating prompts:', error);
      alert('Failed to update prompts. Please try again.');
    }
  };

  const generateCharacter = async () => {
    if (!currentStory) return;
    setIsLoading(true);

    try {
      console.log('Generating character reference...');

      const { imageUrl } = await api.generateCharacter({
        storyId: currentStory.id,
        prompts: currentStory.prompts.map(p => ({ text: p.text })),
        storyTitle: currentStory.title
      });

      console.log('Character reference generated:', imageUrl);

      await api.updateStory(currentStory.id, {
        characterImageUrl: imageUrl,
        status: 'character_ready'
      });

      setCurrentStory({
        ...currentStory,
        status: 'characters_ready',
        characterImage: imageUrl
      });
    } catch (error) {
      console.error('Error generating character:', error);
      alert('Failed to generate character reference. Please check your backend is running and Replicate API key is set.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateStoryboard = async () => {
    if (!currentStory) return;
    setIsLoading(true);

    try {
      console.log(`Generating ${currentStory.prompts.length} storyboard images...`);

      setCurrentStory(prev => prev ? { ...prev, status: 'generating_storyboard' } : null);

      const { images } = await api.generateStoryboard({
        storyId: currentStory.id,
        prompts: currentStory.prompts.map(p => ({ id: p.id, text: p.text })),
        characterImageUrl: currentStory.characterImage || '',
        storyTitle: currentStory.title
      });

      console.log(`Successfully generated ${images.length} images`);

      const storyboardImages: StoryboardImage[] = images.map((img: any) => ({
        id: img.id,
        promptId: img.promptId,
        imageUrl: img.imageUrl,
        status: 'completed' as const,
        prompt: img.prompt
      }));

      setCurrentStory(prev => prev ? {
        ...prev,
        status: 'completed',
        images: storyboardImages
      } : null);

      await loadSavedStories();
    } catch (error) {
      console.error('Error generating storyboard:', error);
      alert('Failed to generate storyboard. Please check your backend is running and Replicate API key is set.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateVariation = async (
    imageId: string,
    originalPrompt: string,
    editPrompt: string
  ) => {
    try {
      console.log('Generating variation for image:', imageId);

      const { imageUrl } = await api.generateVariation({
        promptId: imageId,
        originalPrompt,
        editPrompt,
        sceneNumber: parseInt(imageId.split('-')[1] || '0')
      });

      console.log('Variation generated:', imageUrl);

      if (currentStory) {
        const updatedImages = currentStory.images.map(img =>
          img.id === imageId ? { ...img, imageUrl } : img
        );
        setCurrentStory({
          ...currentStory,
          images: updatedImages
        });
      }

      return imageUrl;
    } catch (error) {
      console.error('Error generating variation:', error);
      alert('Failed to generate variation. Please try again.');
      return null;
    }
  };

  const saveStory = async () => {
    if (!currentStory) return;
    await loadSavedStories();
  };

  return {
    currentStory,
    savedStories,
    isLoading,
    createStory,
    updatePrompts,
    generateCharacter,
    generateStoryboard,
    generateVariation,
    saveStory,
    setCurrentStory
  };
}