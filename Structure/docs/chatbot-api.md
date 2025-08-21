# Chatbot API Documentation

## Purpose
Provides AI-powered conversational interface for data analysis, insights, and natural language querying of uploaded datasets.

## Endpoints

### POST /api/chat/send

**Description:** Send a message to the AI chatbot and receive a response

**Request:**
```json
{
  "conversationId": "conv_123456", // Optional, creates new if not provided
  "message": "What are the top 5 products by revenue in my sales data?",
  "context": {
    "availableFiles": ["file_123", "file_456"],
    "preferredDataset": "sales_data_q1.csv"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123456",
    "messageId": "msg_789012",
    "response": {
      "content": "Based on your sales data from Q1, here are the top 5 products by revenue:\n\n1. Product A: $125,430\n2. Product B: $98,250\n3. Product C: $87,650\n4. Product D: $76,890\n5. Product E: $65,430\n\nWould you like me to provide more detailed analysis or visualizations?",
      "type": "text", // 'text', 'chart', 'table'
      "metadata": {
        "datasetUsed": "sales_data_q1.csv",
        "queryType": "ranking",
        "confidence": 0.95
      }
    },
    "timestamp": "2024-01-15T10:45:00Z"
  }
}
```

### GET /api/chat/conversations

**Description:** Retrieve user's conversation history

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv_123456",
        "title": "Sales Data Analysis",
        "lastActivity": "2024-01-15T10:45:00Z",
        "messageCount": 8,
        "preview": "What are the top 5 products by revenue..."
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

### GET /api/chat/conversations/{conversationId}

**Description:** Get detailed conversation with all messages

**Response:**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv_123456",
      "title": "Sales Data Analysis", 
      "createdAt": "2024-01-15T09:30:00Z",
      "lastActivity": "2024-01-15T10:45:00Z",
      "messages": [
        {
          "id": "msg_001",
          "role": "user",
          "content": "Can you help me analyze the sales data trends from Q1?",
          "timestamp": "2024-01-15T09:30:00Z"
        },
        {
          "id": "msg_002",
          "role": "assistant",
          "content": "I'd be happy to help analyze your Q1 sales data! I can see you have...",
          "timestamp": "2024-01-15T09:31:00Z",
          "metadata": {
            "datasetUsed": "sales_data_q1.csv",
            "processingTime": 1.2
          }
        }
      ]
    }
  }
}
```

### DELETE /api/chat/conversations/{conversationId}

**Description:** Delete a conversation and all its messages

## Frontend Integration

### Chat Component Usage
```jsx
import { useState, useEffect } from 'react';

const Chatbot = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState('');
  
  const sendMessage = async () => {
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation?.id,
          message,
          context: {
            availableFiles: userFiles.map(f => f.id)
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        updateConversation(data.data);
        setMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  const loadConversations = async () => {
    const response = await fetch('/api/chat/conversations');
    const data = await response.json();
    setConversations(data.data.conversations);
  };
  
  useEffect(() => {
    loadConversations();
  }, []);
};
```

### Real-time Features
```jsx
// WebSocket integration for real-time responses
const useWebSocketChat = (conversationId) => {
  useEffect(() => {
    const ws = new WebSocket(`ws://api.company.com/chat/${conversationId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'partial_response') {
        updatePartialResponse(data.content);
      }
    };
    
    return () => ws.close();
  }, [conversationId]);
};
```

## AI Capabilities
- Natural language querying of data
- Statistical analysis and insights
- Data visualization suggestions
- Trend identification
- Comparative analysis
- Predictive insights

## Context Awareness
- Available user datasets
- Previous conversation history
- Data schema and column information
- User preferences and common queries