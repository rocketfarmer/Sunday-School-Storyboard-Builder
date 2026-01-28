import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryPromptForm } from '../components/StoryPromptForm';
import { useStory } from '../contexts/StoryContext';
export function StoryInputPage() {
  const navigate = useNavigate();
  const { createStory, isLoading } = useStory();
  const handleSubmit = (input: string, type: 'prompt' | 'text') => {
    createStory(input, type);
    // Navigate after the mock delay completes
    setTimeout(() => {
      navigate('/prompts');
    }, 1600);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Start Your Story
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter a prompt or paste your full story text. We'll generate a list of
          scenes for you to review.
        </p>
      </div>

      <StoryPromptForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>);

}