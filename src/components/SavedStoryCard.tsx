import React from 'react';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { Story } from '../types/story';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
interface SavedStoryCardProps {
  story: Story;
  onClick: () => void;
}
export function SavedStoryCard({ story, onClick }: SavedStoryCardProps) {
  const date = new Date(story.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  return (
    <Card hover onClick={onClick} className="h-full flex flex-col group">
      <div className="aspect-video bg-gray-100 relative overflow-hidden border-b border-gray-100">
        {story.images.length > 0 ?
        <img
          src={story.images[0].imageUrl}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> :


        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
            <ImageIcon className="w-10 h-10 opacity-50" />
          </div>
        }
        <div className="absolute top-2 right-2">
          <Badge variant={story.status === 'completed' ? 'success' : 'warning'}>
            {story.status === 'completed' ? 'Completed' : 'Draft'}
          </Badge>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {story.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {story.originalInput}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </div>
          <span>{story.prompts.length} scenes</span>
        </div>
      </div>
    </Card>);

}