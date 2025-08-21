import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Download, FileText, BarChart3, Calendar, Database, ExternalLink } from 'lucide-react';
import { FileData, useUser } from '@/contexts/UserContext';

interface DataDiscoveryProps {
  file: FileData;
  onBack: () => void;
  onFileSelect?: (file: FileData) => void;
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

const DataDiscovery: React.FC<DataDiscoveryProps> = ({ file, onBack, onFileSelect }) => {
  const { files } = useUser();
  
  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  const getRelatedFile = (columnName: string) => {
    if (!file.relatedFiles || !file.relatedFiles[columnName]) return null;
    return files.find(f => f.id === file.relatedFiles![columnName]);
  };

  const handleRelatedFileClick = (relatedFile: FileData) => {
    if (onFileSelect) {
      onFileSelect(relatedFile);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mr-6 bg-gradient-to-r from-secondary/50 to-secondary/30 hover:from-secondary/70 hover:to-secondary/50 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl p-6">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">{file.name}</h1>
              <p className="text-muted-foreground text-lg">Data Discovery & Deep Analysis</p>
            </div>
          </div>
        </div>

        {/* File Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-glow transition-all">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground font-medium">File Size</p>
                <p className="text-2xl font-bold text-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-glow transition-all">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-accent mr-3" />
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Records</p>
                <p className="text-2xl font-bold text-foreground">{file.rowCount.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/30 border-secondary/30 hover:shadow-glow transition-all">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-secondary-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground font-medium">Columns</p>
                <p className="text-2xl font-bold text-foreground">{file.columns.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-muted/30 to-muted/20 border-muted/40 hover:shadow-glow transition-all">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-muted-foreground mr-3" />
              <div>
                <p className="text-sm text-muted-foreground font-medium">Upload Date</p>
                <p className="text-2xl font-bold text-foreground">{file.uploadDate}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 shadow-elegant">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary" />
              Column Information & Connections
            </h2>
            <div className="space-y-3">
              {file.columns.map((column, index) => {
                const relatedFile = getRelatedFile(column);
                return (
                  <div key={index} className="group p-4 bg-secondary/30 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <span className="font-semibold text-foreground text-lg">{column}</span>
                        {relatedFile && (
                          <div className="ml-3 flex items-center text-primary">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Connected</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-foreground">
                          {Math.floor(Math.random() * 3) + 1}k unique values
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foregroup">
                          {Math.floor(Math.random() * 10) + 90}% complete
                        </span>
                        {relatedFile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRelatedFileClick(relatedFile)}
                            className="ml-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 hover:bg-primary/20 hover:shadow-md transition-all"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {relatedFile.name}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 shadow-elegant">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-accent" />
              Data Statistics
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg">
                <span className="text-muted-foreground font-medium">Completeness Rate</span>
                <span className="font-bold text-foreground text-lg">94.2%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-accent/5 to-accent/10 rounded-lg">
                <span className="text-muted-foreground font-medium">Duplicate Records</span>
                <span className="font-bold text-foreground text-lg">0.8%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-secondary/20 to-secondary/30 rounded-lg">
                <span className="text-muted-foreground font-medium">Data Quality Score</span>
                <span className="font-bold text-accent text-lg">Excellent</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <span className="text-muted-foreground font-medium">Last Modified</span>
                <span className="font-bold text-foreground text-lg">{file.uploadDate}</span>
              </div>
              {file.databaseLink && (
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" asChild className="w-full bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 hover:bg-accent/20 transition-all">
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
        <Card className="p-8 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 shadow-elegant">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-primary" />
                Data Preview
              </h2>
              <p className="text-muted-foreground">Sample records from your dataset</p>
            </div>
            <Button variant="outline" className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 hover:bg-accent/20 hover:shadow-md transition-all">
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

          <div className="mt-6 text-center p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground font-medium">
              Showing 8 of <span className="text-primary font-bold">{file.rowCount.toLocaleString()}</span> records
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataDiscovery;