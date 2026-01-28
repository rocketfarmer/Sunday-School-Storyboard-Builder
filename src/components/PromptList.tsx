import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Trash2, Plus, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { StoryPrompt } from '../types/story';
interface PromptListProps {
  prompts: StoryPrompt[];
  onUpdate: (prompts: StoryPrompt[]) => void;
}
export function PromptList({ prompts, onUpdate }: PromptListProps) {
  const handleReorder = (newOrder: StoryPrompt[]) => {
    onUpdate(
      newOrder.map((p, index) => ({
        ...p,
        order: index
      }))
    );
  };
  const handleEdit = (id: string, text: string) => {
    const updated = prompts.map((p) =>
    p.id === id ?
    {
      ...p,
      text
    } :
    p
    );
    onUpdate(updated);
  };
  const handleDelete = (id: string) => {
    const updated = prompts.filter((p) => p.id !== id);
    onUpdate(updated);
  };
  const handleAdd = () => {
    const newPrompt: StoryPrompt = {
      id: crypto.randomUUID(),
      text: 'New scene description...',
      order: prompts.length
    };
    onUpdate([...prompts, newPrompt]);
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Story Scenes ({prompts.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          leftIcon={<Plus className="w-4 h-4" />}>

          Add Scene
        </Button>
      </div>

      <Reorder.Group
        axis="y"
        values={prompts}
        onReorder={handleReorder}
        className="space-y-3">

        {prompts.map((prompt) =>
        <Reorder.Item key={prompt.id} value={prompt}>
            <motion.div
            layout
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm group hover:border-amber-200 transition-colors">

              <div className="flex gap-4 items-start">
                <div className="mt-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Scene {prompt.order + 1}
                    </span>
                  </div>
                  <Textarea
                  value={prompt.text}
                  onChange={(e) => handleEdit(prompt.id, e.target.value)}
                  className="min-h-[80px] resize-none border-transparent bg-transparent focus:bg-white focus:border-amber-300 p-0 focus:p-2 transition-all" />

                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                  onClick={() => handleDelete(prompt.id)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Delete scene">

                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </Reorder.Item>
        )}
      </Reorder.Group>

      <div className="pt-4 flex justify-center">
        <Button
          variant="ghost"
          onClick={handleAdd}
          leftIcon={<Plus className="w-4 h-4" />}>

          Add another scene
        </Button>
      </div>
    </div>);

}