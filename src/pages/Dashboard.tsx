import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { 
  FileText, 
  Upload, 
  ExternalLink, 
  Search, 
  Eye, 
  Trash2,
  BarChart3,
  Database,
  Calendar
} from 'lucide-react';
import Spinner from '@/components/Spinner';
import DataDiscovery from '@/components/DataDiscovery';

const Dashboard = () => {
  const { files, uploadFiles, removeFile, isLoading, setIsLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (uploadedFiles: FileList) => {
    if (uploadedFiles.length === 0) return;
    
    setIsLoading(true);
    
    const newFiles = Array.from(uploadedFiles).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      rowCount: Math.floor(Math.random() * 50000) + 1000,
      columns: ['id', 'timestamp', 'value', 'category', 'status'],
      databaseLink: Math.random() > 0.5 ? `https://db.company.com/${file.name.split('.')[0]}` : undefined
    }));

    setTimeout(() => {
      uploadFiles(newFiles);
      setIsLoading(false);
      toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
    }, 2000);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    removeFile(fileId);
    toast.success('File removed successfully');
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  if (selectedFile) {
    return (
      <DataDiscovery 
        file={selectedFile} 
        onBack={() => setSelectedFile(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your uploaded files and explore your data catalog
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{files.length}</p>
                <p className="text-muted-foreground">Total Files</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mr-4">
                <BarChart3 className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {files.reduce((acc, file) => acc + file.rowCount, 0).toLocaleString()}
                </p>
                <p className="text-muted-foreground">Total Records</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                <Database className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {files.filter(file => file.databaseLink).length}
                </p>
                <p className="text-muted-foreground">Connected Databases</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Upload Section */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Upload New Files</h2>
              <p className="text-muted-foreground">Add more data files to your collection</p>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading && <Spinner size="md" />}
              <Input
                type="file"
                multiple
                accept=".csv,.json,.xlsx,.xls"
                onChange={handleFileInputChange}
                className="hidden"
                id="dashboard-file-upload"
                disabled={isLoading}
              />
              <Button 
                asChild 
                disabled={isLoading}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <label htmlFor="dashboard-file-upload" className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </label>
              </Button>
            </div>
          </div>
        </Card>

        {/* Files Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Your Files</h2>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>

          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
              <p className="text-muted-foreground">
                {files.length === 0 ? 'Upload your first file to get started' : 'Try adjusting your search'}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-foreground">File Name</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Columns</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Database Link</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-muted-foreground mr-3" />
                          <div>
                            <p className="font-medium text-foreground">{file.name}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{file.rowCount.toLocaleString()} rows</span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {file.uploadDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {file.columns.slice(0, 3).map((column, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                            >
                              {column}
                            </span>
                          ))}
                          {file.columns.length > 3 && (
                            <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                              +{file.columns.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {file.databaseLink ? (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="flex items-center"
                          >
                            <a href={file.databaseLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View Database
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">No Link</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFile(file)}
                            className="flex items-center"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Discovery
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFile(file.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;