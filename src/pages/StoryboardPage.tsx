import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Share2, Download } from 'lucide-react';
import { StoryboardGrid } from '../components/StoryboardGrid';
import { ImageVariationPanel } from '../components/ImageVariationPanel';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useStory } from '../contexts/StoryContext';
import { useToast } from '../contexts/ToastContext';
import { StoryboardImage } from '../types/story';
import { downloadAllImages } from '../utils/downloadUtils';

export function StoryboardPage() {
  const navigate = useNavigate();
  const { currentStory, saveStory, isLoading, generateVariation } = useStory();
  const { showSuccess, showError, showInfo } = useToast();
  const [selectedImage, setSelectedImage] = useState<StoryboardImage | null>(
    null
  );
  const [isVariationPanelOpen, setIsVariationPanelOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 1, 95));
      }, 50);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isLoading]);
  const handleImageClick = (image: StoryboardImage) => {
    setSelectedImage(image);
    setIsVariationPanelOpen(true);
  };
  const handleGenerateVariation = async (
  imageId: string,
  originalPrompt: string,
  editPrompt: string) =>
  {
    const newImageUrl = await generateVariation(
      imageId,
      originalPrompt,
      editPrompt
    );
    return newImageUrl;
  };
  const handleSave = () => {
    saveStory();
    navigate('/saved');
  };

  const handleDownload = async () => {
    if (!currentStory || currentStory.images.length === 0) {
      showError('No images to download');
      return;
    }

    setIsDownloading(true);
    showInfo(`Downloading ${currentStory.images.length} images...`);

    try {
      await downloadAllImages(currentStory.images, currentStory.title);
      showSuccess('All images downloaded successfully');
    } catch (error) {
      showError('Failed to download some images. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!currentStory) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentStory.title}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {currentStory.images.length} scenes • Shonen Style • 16:9
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Share2 className="w-4 h-4" />}>
            Share
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
            disabled={isDownloading || currentStory.images.length === 0}
          >
            {isDownloading ? 'Downloading...' : 'Download All'}
          </Button>
          <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
            Save Story
          </Button>
        </div>
      </div>

      {isLoading && progress < 100 &&
      <div className="mb-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-medium text-gray-900 mb-4">
            Generating Storyboard...
          </h3>
          <ProgressBar progress={progress} label="Creating scenes with AI" />
          <p className="text-xs text-gray-500 mt-2 text-center">
            This may take a few minutes. We're generating high-resolution images
            for each scene.
          </p>
        </div>
      }

      <StoryboardGrid
        images={currentStory.images}
        onImageClick={handleImageClick} />


      <ImageVariationPanel
        isOpen={isVariationPanelOpen}
        onClose={() => setIsVariationPanelOpen(false)}
        image={selectedImage}
        onGenerateVariation={handleGenerateVariation} />

    </div>);

}