import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Image as ImageIcon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-amber-50/50 to-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.5
            }}>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Bring Sunday School Stories to{' '}
              <span className="text-amber-500">Life</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Create engaging, anime-style visual storyboards for your lessons
              in minutes. Just describe the story, and let AI handle the
              artwork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6"
                  rightIcon={<ArrowRight className="w-5 h-5" />}>

                  Start Creating
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6">

                View Examples
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-amber-500" />}
            title="Script to Storyboard"
            description="Paste your lesson text or scripture reference. We'll break it down into key visual moments automatically." />

          <FeatureCard
            icon={<Sparkles className="w-8 h-8 text-amber-500" />}
            title="Consistent Characters"
            description="Our AI keeps characters consistent across every scene. Approve the look once, and we handle the rest." />

          <FeatureCard
            icon={<ImageIcon className="w-8 h-8 text-amber-500" />}
            title="Engaging Art Style"
            description="Generated in a high-quality shonen/anime graphic novel style that kids and teens love." />

        </div>

        {/* Example Preview */}
        <div className="mt-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-sm text-gray-500 font-medium">
              Project: Noah's Ark
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-gray-100">
            {[1, 2, 3, 4].map((i) =>
            <div
              key={i}
              className="aspect-video bg-white relative group overflow-hidden">

                <img
                src={`https://placehold.co/600x338/png?text=Scene+${i}`}
                alt={`Example Scene ${i}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

              </div>
            )}
          </div>
        </div>
      </main>
    </div>);

}
function FeatureCard({
  icon,
  title,
  description




}: {icon: React.ReactNode;title: string;description: string;}) {
  return (
    <motion.div
      whileHover={{
        y: -5
      }}
      className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">

      <div className="bg-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>);

}