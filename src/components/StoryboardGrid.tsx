import React from 'react';
import { motion } from 'framer-motion';
import { Download, Edit2, Maximize2 } from 'lucide-react';
import { StoryboardImage } from '../types/story';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
interface StoryboardGridProps {
  images: StoryboardImage[];
  onImageClick: (image: StoryboardImage) => void;
}
export function StoryboardGrid({ images, onImageClick }: StoryboardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) =>
      <motion.div
        key={image.id}
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          delay: index * 0.05
        }}>

          <Card
          hover
          className="group cursor-pointer h-full flex flex-col"
          onClick={() => onImageClick(image)}>

            <div className="relative aspect-video bg-gray-100 overflow-hidden">
              {image.status === 'completed' ?
            <>
                  <img
                src={image.imageUrl}
                alt={`Scene ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/90 p-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                      <Edit2 className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                </> :

            <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
            }

              <div className="absolute top-2 left-2">
                <Badge
                variant="default"
                className="bg-white/90 backdrop-blur-sm shadow-sm">

                  Scene {index + 1}
                </Badge>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                {image.prompt}
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400">16:9 • 2K</span>
                <button className="text-gray-400 hover:text-amber-600 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>);

}