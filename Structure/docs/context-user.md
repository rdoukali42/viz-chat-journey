# User Context Documentation

## Purpose
The UserContext provides centralized state management for user data, file management, and application-wide user state in the DataHub platform.

## Context Structure

### Interface Definition
```typescript
export interface FileData {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  rowCount: number;
  columns: string[];
  databaseLink?: string;
}

export interface UserContextType {
  files: FileData[];
  uploadFiles: (newFiles: FileData[]) => void;
  removeFile: (fileId: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}
```

### Provider Component
```jsx
import { UserProvider } from '@/contexts/UserContext';

// Wrap your app with UserProvider
function App() {
  return (
    <UserProvider>
      <YourAppContent />
    </UserProvider>
  );
}
```

## State Management

### Files State
- **Type:** `FileData[]`
- **Purpose:** Stores all uploaded files and their metadata
- **Initial State:** Pre-populated with mock data for development
- **Updates:** Via `uploadFiles()` and `removeFile()` methods

### Loading State  
- **Type:** `boolean`
- **Purpose:** Global loading indicator for file operations
- **Usage:** Show spinners during upload/processing operations

## Methods

### uploadFiles(newFiles: FileData[])
**Purpose:** Add new files to the user's collection
```jsx
const { uploadFiles } = useUser();

const handleUpload = (fileList) => {
  const processedFiles = fileList.map(file => ({
    id: generateId(),
    name: file.name,
    size: file.size,
    uploadDate: new Date().toISOString(),
    rowCount: estimateRows(file),
    columns: inferColumns(file)
  }));
  
  uploadFiles(processedFiles);
};
```

### removeFile(fileId: string)
**Purpose:** Remove a file from the user's collection
```jsx
const { removeFile } = useUser();

const handleDelete = (fileId) => {
  if (confirm('Delete this file?')) {
    removeFile(fileId);
  }
};
```

### setIsLoading(loading: boolean)
**Purpose:** Control global loading state
```jsx
const { setIsLoading } = useUser();

const processData = async () => {
  setIsLoading(true);
  try {
    await performDataProcessing();
  } finally {
    setIsLoading(false);
  }
};
```

## Usage Examples

### Basic Hook Usage
```jsx
import { useUser } from '@/contexts/UserContext';

const Dashboard = () => {
  const { files, isLoading, removeFile } = useUser();
  
  return (
    <div>
      {isLoading && <Spinner />}
      {files.map(file => (
        <FileCard 
          key={file.id}
          file={file}
          onDelete={() => removeFile(file.id)}
        />
      ))}
    </div>
  );
};
```

### File Upload Integration
```jsx
const FileUploader = () => {
  const { uploadFiles, setIsLoading } = useUser();
  
  const handleFileUpload = async (files) => {
    setIsLoading(true);
    
    // Process files
    const processedFiles = await processUploadedFiles(files);
    uploadFiles(processedFiles);
    
    setIsLoading(false);
    toast.success(`Uploaded ${files.length} files`);
  };
  
  return <UploadComponent onUpload={handleFileUpload} />;
};
```

### Conditional Rendering
```jsx
const FileStats = () => {
  const { files } = useUser();
  
  const totalRecords = files.reduce((sum, file) => sum + file.rowCount, 0);
  const connectedDatabases = files.filter(f => f.databaseLink).length;
  
  return (
    <div>
      <StatCard title="Total Files" value={files.length} />
      <StatCard title="Total Records" value={totalRecords.toLocaleString()} />
      <StatCard title="Connected DBs" value={connectedDatabases} />
    </div>
  );
};
```

## Mock Data Structure
The context includes realistic mock data for development:

```javascript
const mockFiles = [
  {
    id: '1',
    name: 'sales_data_q1.csv',
    size: 2048000,
    uploadDate: '2024-01-15',
    rowCount: 15420,
    columns: ['date', 'product_id', 'customer_id', 'revenue', 'quantity'],
    databaseLink: 'https://analytics.company.com/db/sales_q1'
  },
  // ... more mock data
];
```

## Integration with Backend
When connected to a real backend, replace mock data handling with API calls:

```jsx
// In UserProvider
useEffect(() => {
  const loadUserFiles = async () => {
    try {
      const response = await fetch('/api/files/catalog');
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };
  
  loadUserFiles();
}, []);
```

## Error Handling
The context should handle errors gracefully:

```jsx
const uploadFiles = async (newFiles) => {
  try {
    setIsLoading(true);
    // API call
    const response = await uploadToBackend(newFiles);
    setFiles(prev => [...prev, ...response.files]);
  } catch (error) {
    toast.error('Upload failed: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};
```