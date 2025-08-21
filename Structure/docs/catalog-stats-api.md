# Data Catalog & Statistics API Documentation

## Purpose
Provides comprehensive data catalog information, file statistics, and analytics for uploaded datasets.

## Endpoints

### GET /api/files/catalog

**Description:** Retrieve all files in user's data catalog with metadata

**Request:**
```javascript
// Query Parameters
{
  page: 1,          // Page number (default: 1)
  limit: 20,        // Items per page (default: 20)
  search: 'sales',  // Search term (optional)
  sortBy: 'date',   // Sort field: 'name', 'date', 'size', 'rows'
  sortOrder: 'desc' // 'asc' or 'desc'
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file_123456",
        "name": "sales_data_q1.csv",
        "size": 2048000,
        "uploadDate": "2024-01-15T10:30:00Z",
        "rowCount": 15420,
        "columns": [
          {
            "name": "date",
            "type": "datetime",
            "uniqueValues": 90,
            "completeness": 100
          },
          {
            "name": "revenue",
            "type": "decimal",
            "uniqueValues": 12845,
            "completeness": 98.5
          }
        ],
        "databaseLink": "https://analytics.company.com/db/sales_q1",
        "tags": ["sales", "quarterly", "revenue"],
        "quality": {
          "score": 94.2,
          "completeness": 98.5,
          "duplicates": 0.8,
          "consistency": 96.1
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 87,
      "hasNext": true,
      "hasPrevious": false
    },
    "summary": {
      "totalFiles": 87,
      "totalRecords": 2456789,
      "totalSize": 1024000000,
      "connectedDatabases": 12
    }
  }
}
```

### GET /api/files/{fileId}/stats

**Description:** Get detailed statistics for a specific file

**Response:**
```json
{
  "success": true,
  "data": {
    "fileInfo": {
      "id": "file_123456",
      "name": "sales_data_q1.csv",
      "size": 2048000,
      "uploadDate": "2024-01-15T10:30:00Z"
    },
    "statistics": {
      "rowCount": 15420,
      "columnCount": 5,
      "completeness": 98.5,
      "duplicateRows": 124,
      "nullValues": 234,
      "dataTypes": {
        "string": 2,
        "numeric": 2,
        "datetime": 1
      }
    },
    "columns": [
      {
        "name": "date",
        "type": "datetime",
        "uniqueValues": 90,
        "nullCount": 0,
        "completeness": 100,
        "distribution": {
          "min": "2024-01-01",
          "max": "2024-03-31",
          "mostFrequent": "2024-02-15"
        }
      }
    ],
    "preview": [
      {
        "date": "2024-01-01",
        "product_id": "PROD_001",
        "customer_id": "CUST_12345",
        "revenue": 1250.75,
        "quantity": 5
      }
    ]
  }
}
```

## Frontend Integration

### Context Usage
```jsx
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [catalogData, setCatalogData] = useState(null);
  
  const fetchCatalog = async () => {
    try {
      const response = await fetch('/api/files/catalog');
      const data = await response.json();
      setCatalogData(data.data);
    } catch (error) {
      console.error('Failed to fetch catalog:', error);
    }
  };
  
  useEffect(() => {
    fetchCatalog();
  }, []);
};
```

### File Statistics Component
```jsx
const FileStats = ({ fileId }) => {
  const [stats, setStats] = useState(null);
  
  const fetchStats = async () => {
    const response = await fetch(`/api/files/${fileId}/stats`);
    const data = await response.json();
    setStats(data.data);
  };
  
  return (
    <div>
      {stats && (
        <>
          <h3>Records: {stats.statistics.rowCount.toLocaleString()}</h3>
          <p>Quality Score: {stats.statistics.completeness}%</p>
        </>
      )}
    </div>
  );
};
```

## Error Handling
- 404: File not found
- 403: Access denied
- 500: Processing error