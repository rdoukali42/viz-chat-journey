import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ChatInput from '@/components/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquare, Plus, Clock, Copy, RefreshCw } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { useProgress } from '@/contexts/ProgressContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastActivity: Date;
}

// Mock conversation data
const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'Sales Data Analysis',
    lastActivity: new Date('2024-01-15T10:30:00'),
    messages: [
      {
        id: '1-1',
        role: 'user',
        content: 'Can you help me analyze the sales data trends from Q1?',
        timestamp: new Date('2024-01-15T10:30:00')
      },
      {
        id: '1-2',
        role: 'assistant', 
        content: 'I\'d be happy to help analyze your Q1 sales data! Based on the uploaded file "sales_data_q1.csv", I can see you have 15,420 records with revenue, quantity, and product information. What specific trends would you like me to focus on?',
        timestamp: new Date('2024-01-15T10:31:00')
      }
    ]
  },
  {
    id: '2',
    title: 'User Behavior Insights',
    lastActivity: new Date('2024-01-14T15:45:00'),
    messages: [
      {
        id: '2-1',
        role: 'user',
        content: 'What patterns do you see in the user behavior data?',
        timestamp: new Date('2024-01-14T15:45:00')
      },
      {
        id: '2-2',
        role: 'assistant',
        content: 'Looking at your user behavior data with 45,230 session records, I notice several interesting patterns: 1) Peak activity occurs between 2-4 PM, 2) Mobile users have 40% longer session durations, 3) Page bounce rates are lowest on product pages. Would you like me to dive deeper into any of these areas?',
        timestamp: new Date('2024-01-14T15:46:00')
      }
    ]
  }
];

const Chatbot = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(conversations[0]?.id || null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const progress = useProgress();

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: new Date()
    };

  // Add user message
    if (activeConversationId) {
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: [...conv.messages, userMessage], lastActivity: new Date() }
          : conv
      ));
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: `${Date.now()}`,
        title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [userMessage],
        lastActivity: new Date()
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);
    }

    // mark chat step as confirmed (first user send will persist this)
    try {
      progress.confirmChat();
    } catch (e) {
      // if ProgressProvider is not present, silently ignore
    }

    // Prepare for streaming response
    const fullResponse = generateMockResponse(message);
    const assistantId = `${Date.now()}-assistant`;

    setMessage('');
    setIsLoading(true);
    setIsStreaming(true);

    // Insert an empty assistant message placeholder so we can update it progressively
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? { ...conv, messages: [...conv.messages, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }], lastActivity: new Date() }
        : conv
    ));

    // Start streaming simulation
    let idx = 0;
    const tickMs = 60; // speed of typing
    streamingRef.current = setInterval(() => {
      // increase by random small chunk to feel natural
      idx += Math.max(1, Math.floor(Math.random() * 6));
      const chunk = fullResponse.slice(0, idx);

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, messages: conv.messages.map(m => m.id === assistantId ? { ...m, content: chunk } : m) }
          : conv
      ));

      if (idx >= fullResponse.length) {
        // finished
        if (streamingRef.current) {
          clearInterval(streamingRef.current);
          streamingRef.current = null;
        }
        setIsStreaming(false);
        setIsLoading(false);
      }
    }, tickMs);
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // lightweight feedback
      // sonner toast is imported earlier
      // but to avoid duplicate imports, reuse existing toast usage in file (it's used elsewhere)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { toast } = require('sonner');
      toast.success('Copied to clipboard');
    } catch {
      const { toast } = require('sonner');
      toast.error('Copy failed');
    }
  };

  const regenerateMessage = (messageId: string) => {
    if (isStreaming) return; // avoid overlapping streams

    const newResponse = generateMockResponse('regenerate');

    // start streaming into the existing message slot
    setIsLoading(true);
    setIsStreaming(true);

    let idx = 0;
    const assistantId = messageId;
    const tickMs = 60;

    // ensure message exists; if not, do nothing
    setConversations(prev => prev.map(conv => ({ ...conv, messages: conv.messages.map(m => m.id === assistantId ? { ...m, content: '' } : m) })));

    if (streamingRef.current) {
      clearInterval(streamingRef.current);
      streamingRef.current = null;
    }

    streamingRef.current = setInterval(() => {
      idx += Math.max(1, Math.floor(Math.random() * 6));
      const chunk = newResponse.slice(0, idx);
      setConversations(prev => prev.map(conv => 
        ({ ...conv, messages: conv.messages.map(m => m.id === assistantId ? { ...m, content: chunk } : m) })
      ));

      if (idx >= newResponse.length) {
        if (streamingRef.current) {
          clearInterval(streamingRef.current);
          streamingRef.current = null;
        }
        setIsStreaming(false);
        setIsLoading(false);
      }
    }, tickMs);
  };

  const generateMockResponse = (userMessage: string): string => {
    const responses = [
      "Based on your data files, I can see some interesting patterns. Let me analyze the specific metrics you're interested in.",
      "That's a great question! Looking at your uploaded datasets, I notice several trends that might be relevant to your query.",
      "I can help you with that analysis. Your data shows some compelling insights that I'd be happy to break down for you.",
      "Excellent question! From the data you've uploaded, I can provide detailed insights about the patterns and trends you're asking about.",
      "Let me analyze that for you using your uploaded files. I see some key metrics that directly relate to your question."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessage('');
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Conversation History Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Chats</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewChat}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        activeConversationId === conversation.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      onClick={() => setActiveConversationId(conversation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <MessageSquare className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{conversation.title}</p>
                          <div className="flex items-center text-xs opacity-75 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(conversation.lastActivity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              
              {/* Chat Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-primary mr-3" />
                  <div>
                    <h1 className="text-xl font-semibold text-foreground">
                      {activeConversation ? activeConversation.title : 'New Chat'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Ask questions about your data and get AI-powered insights
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {!activeConversation && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Start a new conversation</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Ask questions about your uploaded data, request analysis, or get insights about your datasets.
                      </p>
                    </div>
                  )}
                  
                  {activeConversation?.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-xl ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                            <p className={`text-xs mt-2 ${
                              msg.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                          {msg.role === 'assistant' && (
                            <div className="ml-3 flex items-start space-x-2">
                              <button title="Copy" onClick={() => copyMessage(msg.content)} className="p-1 rounded hover:bg-muted/10">
                                <Copy className="h-4 w-4" />
                              </button>
                              <button title="Regenerate" onClick={() => regenerateMessage(msg.id)} className="p-1 rounded hover:bg-muted/10">
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isStreaming && (
                    <div className="flex justify-start">
                      <div className="bg-secondary text-secondary-foreground p-3 rounded-xl max-w-[40%]">
                        <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse" />
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-75" />
                          <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse delay-150" />
                        </div>
                      </div>
                    </div>
                  )}

                  {isLoading && !isStreaming && (
                    <div className="flex justify-start">
                      <div className="bg-secondary text-secondary-foreground p-4 rounded-xl max-w-[80%]">
                        <div className="flex items-center space-x-2">
                          <Spinner size="sm" />
                          <p className="text-sm text-muted-foreground">AI is thinking...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-6 border-t border-border">
                <div className="flex items-center space-x-4">
                  <ChatInput
                    value={message}
                    onChange={setMessage}
                    onSend={handleSendMessage}
                    placeholder="Ask a question about your data..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    className="bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Ask about trends, patterns, or insights in your uploaded data files
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;