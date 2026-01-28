import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PromptList } from '../components/PromptList';
import { Button } from '../components/ui/Button';
import { useStory } from '../contexts/StoryContext';
export function PromptEditorPage() {
  const navigate = useNavigate();
  const { currentStory, updatePrompts, generateCharacter } = useStory();
  if (!currentStory) {
    // Redirect if no story exists
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-4">No story found. Please start over.</p>
        <Button onClick={() => navigate('/create')}>Start New Story</Button>
      </div>);

  }
  const handleContinue = () => {
    generateCharacter();
    navigate('/character');
  };
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Scenes</h1>
          <p className="text-gray-600 mt-1">
            Edit, reorder, or add scenes before generating images.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/create')}>
            Back
          </Button>
          <Button
            onClick={handleContinue}
            rightIcon={<ArrowRight className="w-4 h-4" />}>

            Next: Character Design
          </Button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 text-sm text-amber-800">
        <strong>Note:</strong> All scenes will be generated in 16:9 aspect ratio
        with a shonen/anime graphic novel style.
      </div>

      <PromptList prompts={currentStory.prompts} onUpdate={updatePrompts} />

      <div className="mt-8 flex justify-end">
        <Button
          size="lg"
          onClick={handleContinue}
          rightIcon={<ArrowRight className="w-4 h-4" />}>

          Next: Character Design
        </Button>
      </div>
    </div>);

}