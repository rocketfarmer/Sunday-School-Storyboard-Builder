import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoryProvider } from './contexts/StoryContext';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { StoryInputPage } from './pages/StoryInputPage';
import { PromptEditorPage } from './pages/PromptEditorPage';
import { CharacterApprovalPage } from './pages/CharacterApprovalPage';
import { StoryboardPage } from './pages/StoryboardPage';
import { SavedStoriesPage } from './pages/SavedStoriesPage';
export function App() {
  return (
    <Router>
      <StoryProvider>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
          <Navigation />

          {/* Replicate Integration Notice */}
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 text-center text-sm text-blue-800">
            <span className="font-medium">Development Mode:</span> Currently
            using mock data. Set up your Replicate API key to enable real image
            generation.
          </div>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<StoryInputPage />} />
            <Route path="/prompts" element={<PromptEditorPage />} />
            <Route path="/character" element={<CharacterApprovalPage />} />
            <Route path="/storyboard" element={<StoryboardPage />} />
            <Route path="/saved" element={<SavedStoriesPage />} />
          </Routes>
        </div>
      </StoryProvider>
    </Router>);

}