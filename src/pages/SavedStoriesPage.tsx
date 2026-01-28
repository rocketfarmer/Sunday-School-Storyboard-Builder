import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { SavedStoryCard } from '../components/SavedStoryCard';
import { Button } from '../components/ui/Button';
import { useStory } from '../contexts/StoryContext';
export function SavedStoriesPage() {
  const navigate = useNavigate();
  const { savedStories, setCurrentStory } = useStory();
  const handleStoryClick = (story: any) => {
    setCurrentStory(story);
    navigate('/storyboard');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Stories</h1>
        <Button
          onClick={() => navigate('/create')}
          leftIcon={<Plus className="w-4 h-4" />}>

          New Story
        </Button>
      </div>

      {savedStories.length === 0 ?
      <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No saved stories yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first storyboard to see it here.
          </p>
          <Button onClick={() => navigate('/create')}>Start Creating</Button>
        </div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedStories.map((story) =>
        <SavedStoryCard
          key={story.id}
          story={story}
          onClick={() => handleStoryClick(story)} />

        )}
        </div>
      }
    </div>);

}