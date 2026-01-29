import React, { useEffect, useState } from 'react';
import { Wand2, RefreshCw, Check } from 'lucide-react';
import { StoryboardImage } from '../types/story';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Modal } from './ui/Modal';
interface ImageVariationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  image: StoryboardImage | null;
  onGenerateVariation: (
  imageId: string,
  originalPrompt: string,
  editPrompt: string)
  => Promise<string | null>;
}
export function ImageVariationPanel({
  isOpen,
  onClose,
  image,
  onGenerateVariation
}: ImageVariationPanelProps) {
  const [editPrompt, setEditPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  // Reset prompt when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEditPrompt('');
    }
  }, [isOpen]);
  const handleGenerate = async () => {
    if (!image || !editPrompt.trim()) return;
    setIsGenerating(true);
    try {
      await onGenerateVariation(image.id, image.prompt, editPrompt);
      onClose();
    } catch (error) {
      console.error('Failed to generate variation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!image) return;
    setIsGenerating(true);
    try {
      await onGenerateVariation(image.id, image.prompt, 'regenerate with same prompt');
      onClose();
    } catch (error) {
      console.error('Failed to regenerate:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  if (!image) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Scene" maxWidth="2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={image.imageUrl}
              alt="Current version"
              className="w-full h-full object-cover" />

          </div>
          <p className="text-xs text-gray-500 text-center">Current Version</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Prompt
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {image.prompt}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to change?
            </label>
            <Textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              className="h-32"
              placeholder="e.g., Make the sky more dramatic with storm clouds, add more vibrant colors, change the lighting to sunset..." />

            <p className="text-xs text-gray-500 mt-2">
              Describe the changes you want to see in this scene.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!editPrompt.trim()}
              leftIcon={<Wand2 className="w-4 h-4" />}
              className="w-full">

              {isGenerating ? 'Generating...' : 'Generate Variation'}
            </Button>
            <Button
              variant="outline"
              onClick={handleRegenerate}
              isLoading={isGenerating}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="w-full">

              Regenerate Original
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
              disabled={isGenerating}>

              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>);

}