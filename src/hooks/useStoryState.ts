import { useState, useEffect } from 'react';
import { Story, StoryPrompt, StoryboardImage } from '../types/story';

// API Configuration
// Change this URL when you deploy your backend to production
const API_URL = 'http://localhost:3001';
// For production, change to: 'https://your-backend-url.com'

// Mock data for initial development (fallback if API fails)
const MOCK_PROMPTS: StoryPrompt[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `prompt-${i}`,
  text: `Scene ${i + 1}: Character enters the scene with a determined look. The background shows a vibrant landscape typical of the shonen genre.`,
  order: i
}));

export function useStoryState() {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [savedStories, setSavedStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved stories from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sunday_stories');
    if (saved) {
      try {
        setSavedStories(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved stories', e);
      }
    }
  }, []);

  const createStory = (input: string, type: 'prompt' | 'text') => {
    setIsLoading(true);

    // For now, we still generate prompts on the frontend
    // In production, you might want to use AI to generate better prompts
    setTimeout(() => {
      const newStory: Story = {
        id: crypto.randomUUID(),
        title: input.slice(0, 50) + (input.length > 50 ? '...' : ''),
        originalInput: input,
        inputType: type,
        status: 'prompts_ready',
        prompts: MOCK_PROMPTS.map((p, i) => ({
          ...p,
          text: `Scene ${i + 1} from "${input}": ${p.text}`
        })),
        images: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCurrentStory(newStory);
      setIsLoading(false);
    }, 1500);
  };

  const updatePrompts = (prompts: StoryPrompt[]) => {
    if (!currentStory) return;
    setCurrentStory({
      ...currentStory,
      prompts
    });
  };

  const generateCharacter = async () => {
    if (!currentStory) return;
    setIsLoading(true);

    try {
      console.log('Calling backend to generate character reference...');

      const response = await fetch(`${API_URL}/api/generate-character`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storyTitle: currentStory.title,
          prompts: currentStory.prompts
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Character reference generated:', data.imageUrl);

      setCurrentStory({
        ...currentStory,
        status: 'characters_ready',
        characterImage: data.imageUrl
      });
    } catch (error) {
      console.error('Error generating character:', error);
      alert(
        'Failed to generate character reference. Check console for details.'
      );

      // Fallback to placeholder
      setCurrentStory({
        ...currentStory,
        status: 'characters_ready',
        characterImage:
        'https://placehold.co/1920x1080/png?text=Character+Reference+(API+Error)'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateStoryboard = async () => {
    if (!currentStory) return;
    setIsLoading(true);

    try {
      console.log(
        `Calling backend to generate ${currentStory.prompts.length} storyboard images...`
      );

      setCurrentStory((prev) =>
      prev ? { ...prev, status: 'generating_storyboard' } : null
      );

      const response = await fetch(`${API_URL}/api/generate-storyboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storyTitle: currentStory.title,
          characterImageUrl: currentStory.characterImage,
          prompts: currentStory.prompts
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Successfully generated ${data.images.length} images`);

      setCurrentStory((prev) =>
      prev ?
      {
        ...prev,
        status: 'completed',
        images: data.images
      } :
      null
      );
    } catch (error) {
      console.error('Error generating storyboard:', error);
      alert('Failed to generate storyboard. Check console for details.');

      // Fallback to placeholders
      const placeholderImages: StoryboardImage[] = currentStory.prompts.map(
        (prompt, i) => ({
          id: `img-${i}`,
          promptId: prompt.id,
          imageUrl: `https://placehold.co/1920x1080/png?text=Scene+${i + 1}+(API+Error)`,
          status: 'completed',
          prompt: prompt.text
        })
      );

      setCurrentStory((prev) =>
      prev ?
      {
        ...prev,
        status: 'completed',
        images: placeholderImages
      } :
      null
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateVariation = async (
  imageId: string,
  originalPrompt: string,
  editPrompt: string) =>
  {
    try {
      console.log('Generating variation for image:', imageId);

      const response = await fetch(`${API_URL}/api/generate-variation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalPrompt,
          editPrompt,
          sceneNumber: imageId
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Variation generated:', data.imageUrl);

      // Update the image in current story
      if (currentStory) {
        const updatedImages = currentStory.images.map((img) =>
        img.id === imageId ? { ...img, imageUrl: data.imageUrl } : img
        );
        setCurrentStory({
          ...currentStory,
          images: updatedImages
        });
      }

      return data.imageUrl;
    } catch (error) {
      console.error('Error generating variation:', error);
      alert('Failed to generate variation. Check console for details.');
      return null;
    }
  };

  const saveStory = () => {
    if (!currentStory) return;
    const newSaved = [...savedStories, currentStory];
    setSavedStories(newSaved);
    localStorage.setItem('sunday_stories', JSON.stringify(newSaved));
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