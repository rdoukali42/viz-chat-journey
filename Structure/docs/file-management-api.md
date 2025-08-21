# File Management API Documentation

## Purpose
Handles file operations including download, modification, deletion, and additional file uploads to existing collections.

## Endpoints

### GET /api/files/{fileId}/download

**Description:** Download original or processed file

**Query Parameters:**
- `format`: 'original', 'csv', 'json', 'excel' (default: 'original')
- `filtered`: boolean - apply any active filters (default: false)

**Response:**
```
Content-Type: application/octet-stream
Content-Disposition: attachment; filename="sales_data_q1.csv"

[File content as binary stream]
```

### PUT /api/files/{fileId}/metadata

**Description:** Update file metadata, tags, or database connections

**Request:**
```json
{
  "name": "sales_data_q1_updated.csv",
  "tags": ["sales", "quarterly", "revenue", "updated"],
  "databaseLink": "https://new-db.company.com/sales",
  "description": "Updated Q1 sales data with corrections"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": "file_123456",
      "name": "sales_data_q1_updated.csv",
      "tags": ["sales", "quarterly", "revenue", "updated"],
      "databaseLink": "https://new-db.company.com/sales",
      "description": "Updated Q1 sales data with corrections",
      "lastModified": "2024-01-15T11:30:00Z"
    }
  }
}
```

### DELETE /api/files/{fileId}

**Description:** Delete a file and all associated data

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "deletedFile": {
      "id": "file_123456",
      "name": "sales_data_q1.csv"
    }
  }
}
```

### POST /api/files/{fileId}/duplicate

**Description:** Create a copy of an existing file

**Request:**
```json
{
  "newName": "sales_data_q1_backup.csv",
  "copyMetadata": true
}
```

### GET /api/files/{fileId}/versions

**Description:** Get version history of a file

**Response:**
```json
{
  "success": true,
  "data": {
    "versions": [
      {
        "id": "version_001",
        "fileId": "file_123456",
        "version": "1.2",
        "createdAt": "2024-01-15T10:30:00Z",
        "changes": ["Updated column names", "Fixed data types"],
        "size": 2048000,
        "rowCount": 15420
      }
    ]
  }
}
```

### POST /api/files/bulk-upload

**Description:** Upload multiple files to existing collection

**Request:**
```javascript
const formData = new FormData();
formData.append('files', file1);
formData.append('files', file2);
formData.append('collection', 'sales_analysis');
formData.append('autoProcess', 'true');
```

### PUT /api/files/{fileId}/reprocess

**Description:** Reprocess file with updated parsing settings

**Request:**
```json
{
  "parseOptions": {
    "delimiter": ",",
    "encoding": "utf-8",
    "skipRows": 1,
    "dateFormat": "YYYY-MM-DD"
  }
}
```

## Frontend Integration

### File Operations Component
```jsx
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

const FileOperations = ({ file }) => {
  const { removeFile } = useUser();
  
  const downloadFile = async (format = 'original') => {
    try {
      const response = await fetch(
        `/api/files/${file.id}/download?format=${format}`,
        { method: 'GET' }
      );
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      
      window.URL.revokeObjectURL(url);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Download failed');
    }
  };
  
  const deleteFile = async () => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        removeFile(file.id);
        toast.success('File deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };
  
  const updateMetadata = async (metadata) => {
    try {
      const response = await fetch(`/api/files/${file.id}/metadata`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('File updated successfully');
        return data.data.file;
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };
};
```

### Bulk Operations
```jsx
const BulkFileOperations = ({ selectedFiles }) => {
  const bulkDelete = async () => {
    const promises = selectedFiles.map(fileId => 
      fetch(`/api/files/${fileId}`, { method: 'DELETE' })
    );
    
    try {
      await Promise.all(promises);
      toast.success(`${selectedFiles.length} files deleted`);
    } catch (error) {
      toast.error('Some files failed to delete');
    }
  };
  
  const bulkDownload = async () => {
    // Create zip file with selected files
    const response = await fetch('/api/files/bulk-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileIds: selectedFiles })
    });
    
    const blob = await response.blob();
    downloadBlob(blob, 'selected_files.zip');
  };
};
```

## Error Handling
- 404: File not found
- 403: Access denied / insufficient permissions
- 409: File locked by another process
- 413: File too large for operation
- 422: Invalid file format or corrupted data

## File Size Limits
- Single file download: No limit
- Bulk download: 1GB compressed
- File modifications: 500MB limit