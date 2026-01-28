import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, User, Menu } from 'lucide-react';
import { Button } from './ui/Button';
export function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-amber-500 p-1.5 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                SundayStoryBoard
              </span>
            </Link>

            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/') ? 'border-amber-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>

                Create
              </Link>
              <Link
                to="/saved"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/saved') ? 'border-amber-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>

                Saved Stories
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<User className="h-4 w-4" />}>

                Sign In
              </Button>
              <Button size="sm">Get Started</Button>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>);

}