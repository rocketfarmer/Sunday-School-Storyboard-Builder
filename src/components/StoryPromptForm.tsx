import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Card, CardContent } from './ui/Card';
interface StoryPromptFormProps {
  onSubmit: (input: string, type: 'prompt' | 'text') => void;
  isLoading: boolean;
}
export function StoryPromptForm({ onSubmit, isLoading }: StoryPromptFormProps) {
  const [inputType, setInputType] = useState<'prompt' | 'text'>('prompt');
  const [input, setInput] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input, inputType);
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setInputType('prompt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'prompt' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

            <Wand2 className="w-4 h-4" />
            Story Prompt
          </button>
          <button
            onClick={() => setInputType('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${inputType === 'text' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

            <FileText className="w-4 h-4" />
            Full Text
          </button>
        </div>
      </div>

      <Card className="border-amber-100 shadow-lg shadow-amber-500/5">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {inputType === 'prompt' ?
                'What story do you want to tell?' :
                'Paste your story text'}
              </h2>
              <p className="text-gray-500">
                {inputType === 'prompt' ?
                'Describe the biblical story or lesson you want to visualize. Short descriptions work great.' :
                'Paste the full scripture or story text here. We will break it down into scenes.'}
              </p>
            </div>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
              inputType === 'prompt' ?
              "e.g., The story of Noah's Ark from Genesis 6-9, focusing on the animals entering the ark..." :
              'Paste your story text here...'
              }
              className="min-h-[200px] text-base"
              autoFocus />


            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                disabled={!input.trim()}
                className="w-full sm:w-auto"
                rightIcon={<Wand2 className="w-4 h-4" />}>

                Generate Storyboard Prompts
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
        'David and Goliath',
        'The Good Samaritan',
        "Daniel in the Lions' Den"].
        map((example) =>
        <button
          key={example}
          onClick={() => {
            setInputType('prompt');
            setInput(`The story of ${example}`);
          }}
          className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-3 rounded-lg hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all text-left">

            "{example}"
          </button>
        )}
      </div>
    </div>);

}