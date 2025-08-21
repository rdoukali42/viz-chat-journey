# File Upload API Documentation

## Purpose
This API handles file uploads for the DataHub analytics platform, processing CSV, JSON, and Excel files for data analysis.

## Endpoints

### POST /api/files/upload

**Description:** Upload single or multiple data files for processing

**Request:**
```javascript
// Form Data
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);

// Headers
{
  'Content-Type': 'multipart/form-data'
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadedFiles": [
      {
        "id": "file_123456",
        "name": "sales_data.csv",
        "size": 2048000,
        "uploadDate": "2024-01-15T10:30:00Z",
        "rowCount": 15420,
        "columns": ["date", "product_id", "customer_id", "revenue", "quantity"],
        "processingStatus": "completed",
        "databaseLink": "https://analytics.company.com/db/sales_data"
      }
    ]
  },
  "message": "Files uploaded successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "UPLOAD_FAILED",
    "message": "File format not supported",
    "details": "Only CSV, JSON, and Excel files are allowed"
  }
}
```

## Frontend Integration

### React Component Usage
```jsx
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

const FileUpload = () => {
  const { uploadFiles, setIsLoading } = useUser();
  
  const handleUpload = async (files) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        uploadFiles(result.data.uploadedFiles);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
};
```

## Supported File Formats
- CSV (.csv)
- JSON (.json) 
- Excel (.xlsx, .xls)

## File Size Limits
- Maximum file size: 100MB per file
- Maximum files per request: 10

## Processing Pipeline
1. File validation and virus scanning
2. Format detection and parsing
3. Schema inference and column analysis
4. Row count calculation
5. Database integration (if applicable)
6. Metadata generation and storage