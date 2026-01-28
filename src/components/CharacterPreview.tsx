import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
interface CharacterPreviewProps {
  imageUrl?: string;
  onApprove: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
}
export function CharacterPreview({
  imageUrl,
  onApprove,
  onRegenerate,
  isLoading
}: CharacterPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Character & Style Check
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Before we generate the full storyboard, let's make sure the characters
          and art style look right. This reference image will guide all
          subsequent scenes.
        </p>
      </div>

      <Card className="overflow-hidden bg-gray-50 border-2 border-dashed border-gray-300 min-h-[400px] flex flex-col items-center justify-center relative">
        {isLoading ?
        <div className="text-center p-8">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">
              Designing your characters...
            </p>
            <p className="text-sm text-gray-500">Applying shonen/anime style</p>
          </div> :
        imageUrl ?
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          className="relative w-full h-full">

            <img
            src={imageUrl}
            alt="Character Reference"
            className="w-full h-auto max-h-[600px] object-contain mx-auto" />

            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
              16:9 • 2K Resolution
            </div>
          </motion.div> :

        <div className="text-center p-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No image generated yet</p>
          </div>
        }
      </Card>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onRegenerate}
          isLoading={isLoading}
          leftIcon={<RefreshCw className="w-4 h-4" />}>

          Regenerate
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onApprove}
          disabled={!imageUrl || isLoading}
          leftIcon={<Check className="w-4 h-4" />}
          className="min-w-[200px]">

          Approve & Generate Storyboard
        </Button>
      </div>
    </div>);

}