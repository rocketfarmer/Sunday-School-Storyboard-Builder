export type StoryStatus =
'draft' |
'generating_prompts' |
'prompts_ready' |
'generating_characters' |
'characters_ready' |
'generating_storyboard' |
'completed';

export interface StoryPrompt {
  id: string;
  text: string;
  order: number;
}

export interface StoryboardImage {
  id: string;
  promptId: string;
  imageUrl: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  prompt: string;
}

export interface Story {
  id: string;
  title: string;
  originalInput: string;
  inputType: 'prompt' | 'text';
  status: StoryStatus;
  prompts: StoryPrompt[];
  characterImage?: string;
  images: StoryboardImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}