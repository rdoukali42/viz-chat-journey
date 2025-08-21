import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart3, MessageSquare, Upload, CheckCircle } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-custom-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/f109f649-2b67-4d07-a718-8d5c246a9f02.png" 
                alt="OnMark Logo" 
                className="h-8 w-auto"
              />
              {/* <span className="text-xl font-bold text-foreground">OnMark Analytics</span> */}
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
        {/* Progress stepper at bottom of navbar */}
        <div className="border-t border-border/60">
          <ProgressBar />
        </div>
      </div>
    </nav>
  );
};

const ProgressBar = () => {
  const progress = useProgress();
  if (!progress.isVisible) return null;

  // enforce ordered availability: discovery only 'available' after upload, chat after discovery
  const steps = [
    { key: 'upload', label: 'Upload', done: progress.uploadConfirmed, available: true, icon: <Upload className="h-4 w-4" /> },
    { key: 'discovery', label: 'Get Insight', done: progress.discoveryConfirmed, available: progress.uploadConfirmed, icon: <BarChart3 className="h-4 w-4" /> },
    { key: 'chat', label: 'Chat with your data', done: progress.chatConfirmed, available: progress.discoveryConfirmed, icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${s.done ? 'bg-primary text-primary-foreground' : s.available ? 'bg-muted/30 text-foreground' : 'bg-muted/10 text-muted-foreground'}`}>
              {s.done ? <CheckCircle className="h-4 w-4" /> : s.icon}
            </div>
            <div className={`text-sm ${s.available ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</div>
            {i < steps.length - 1 && <div className={`w-6 h-px mx-4 ${steps[i].done ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;