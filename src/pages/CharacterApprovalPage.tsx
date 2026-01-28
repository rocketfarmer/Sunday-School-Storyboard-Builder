import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterPreview } from '../components/CharacterPreview';
import { useStory } from '../contexts/StoryContext';
import { Button } from '../components/ui/Button';
export function CharacterApprovalPage() {
  const navigate = useNavigate();
  const { currentStory, generateCharacter, generateStoryboard, isLoading } =
  useStory();
  // Trigger initial generation if needed
  useEffect(() => {
    if (currentStory && !currentStory.characterImage && !isLoading) {
      generateCharacter();
    }
  }, []);
  const handleApprove = () => {
    generateStoryboard();
    navigate('/storyboard');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/prompts')}
          className="mb-4">

          ← Back to Scenes
        </Button>
      </div>

      <CharacterPreview
        imageUrl={currentStory?.characterImage}
        onApprove={handleApprove}
        onRegenerate={generateCharacter}
        isLoading={isLoading && !currentStory?.characterImage} />

    </div>);

}