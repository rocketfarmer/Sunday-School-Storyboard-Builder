import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoryProvider } from './contexts/StoryContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { StoryInputPage } from './pages/StoryInputPage';
import { PromptEditorPage } from './pages/PromptEditorPage';
import { CharacterApprovalPage } from './pages/CharacterApprovalPage';
import { StoryboardPage } from './pages/StoryboardPage';
import { SavedStoriesPage } from './pages/SavedStoriesPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <StoryProvider>
                    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
                      <Navigation />

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
                </ProtectedRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}