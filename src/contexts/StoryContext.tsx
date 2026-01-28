import React, { createContext, useContext } from 'react';
import { useStoryState } from '../hooks/useStoryState';
import { Story, StoryPrompt } from '../types/story';
interface StoryContextType {
  currentStory: Story | null;
  savedStories: Story[];
  isLoading: boolean;
  createStory: (input: string, type: 'prompt' | 'text') => void;
  updatePrompts: (prompts: StoryPrompt[]) => void;
  generateCharacter: () => void;
  generateStoryboard: () => void;
  saveStory: () => void;
  setCurrentStory: (story: Story | null) => void;
}
const StoryContext = createContext<StoryContextType | undefined>(undefined);
export function StoryProvider({ children }: {children: ReactNode;}) {
  const storyState = useStoryState();
  return (
    <StoryContext.Provider value={storyState}>{children}</StoryContext.Provider>);

}
export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error('useStory must be used within a StoryProvider');
  }
  return context;
}