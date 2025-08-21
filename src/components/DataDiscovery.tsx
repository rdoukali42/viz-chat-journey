import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, BarChart3, Calendar, Database } from 'lucide-react';
import { FileData } from '@/contexts/UserContext';

interface DataDiscoveryProps {
  file: FileData;
  onBack: () => void;
}

// Mock data for demonstration
const mockDataRecords = [
  { id: 1, timestamp: '2024-01-15 10:30:00', value: 1250.75, category: 'Sales', status: 'Complete' },
  { id: 2, timestamp: '2024-01-15 10:31:00', value: 856.20, category: 'Marketing', status: 'Pending' },
  { id: 3, timestamp: '2024-01-15 10:32:00', value: 2100.50, category: 'Sales', status: 'Complete' },
  { id: 4, timestamp: '2024-01-15 10:33:00', value: 675.30, category: 'Support', status: 'Processing' },
  { id: 5, timestamp: '2024-01-15 10:34:00', value: 1890.75, category: 'Sales', status: 'Complete' },
  { id: 6, timestamp: '2024-01-15 10:35:00', value: 445.20, category: 'Marketing', status: 'Pending' },
  { id: 7, timestamp: '2024-01-15 10:36:00', value: 1456.80, category: 'Support', status: 'Complete' },
  { id: 8, timestamp: '2024-01-15 10:37:00', value: 789.45, category: 'Sales', status: 'Processing' },
];

const DataDiscovery: React.FC<DataDiscoveryProps> = ({ file, onBack }) => {
  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{file.name}</h1>
            <p className="text-muted-foreground">Data Discovery & Analysis</p>
          </div>
        </div>

        {/* File Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">File Size</p>
                <p className="text-xl font-bold text-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-accent mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total Records</p>
                <p className="text-xl font-bold text-foreground">{file.rowCount.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-secondary-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Columns</p>
                <p className="text-xl font-bold text-foreground">{file.columns.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Upload Date</p>
                <p className="text-xl font-bold text-foreground">{file.uploadDate}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Column Information</h2>
            <div className="space-y-3">
              {file.columns.map((column, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="font-medium text-foreground">{column}</span>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{Math.floor(Math.random() * 3) + 1} unique values</span>
                    <span>•</span>
                    <span>{Math.floor(Math.random() * 10) + 90}% complete</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Data Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Completeness Rate</span>
                <span className="font-semibold text-foreground">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duplicate Records</span>
                <span className="font-semibold text-foreground">0.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data Quality Score</span>
                <span className="font-semibold text-accent">Excellent</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Last Modified</span>
                <span className="font-semibold text-foreground">{file.uploadDate}</span>
              </div>
              {file.databaseLink && (
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" asChild className="w-full">
                    <a href={file.databaseLink} target="_blank" rel="noopener noreferrer">
                      <Database className="h-4 w-4 mr-2" />
                      View Connected Database
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Data Preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Data Preview</h2>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  {file.columns.map((column) => (
                    <th key={column} className="text-left py-3 px-4 font-medium text-foreground">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockDataRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-4 text-foreground">{record.id}</td>
                    <td className="py-3 px-4 text-foreground">{record.timestamp}</td>
                    <td className="py-3 px-4 text-foreground">${record.value.toFixed(2)}</td>
                    <td className="py-3 px-4 text-foreground">{record.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        record.status === 'Complete' 
                          ? 'bg-accent/10 text-accent' 
                          : record.status === 'Pending'
                          ? 'bg-yellow-500/10 text-yellow-600'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing 8 of {file.rowCount.toLocaleString()} records
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataDiscovery;