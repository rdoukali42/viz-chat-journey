import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart3, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-custom-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">DataHub</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant={isActive('/') ? 'default' : 'ghost'} 
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/dashboard') ? 'default' : 'ghost'} 
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/dashboard">
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/chatbot') ? 'default' : 'ghost'} 
              asChild
              className="flex items-center space-x-2"
            >
              <Link to="/chatbot">
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;