import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { toast } from 'sonner';
import { Upload, FileText, ArrowRight } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { cn } from '@/lib/utils';

const Home = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { files, uploadFiles, isLoading, setIsLoading } = useUser();
  const progress = useProgress();
  const navigate = useNavigate();

  const handleFileUpload = async (uploadedFiles: FileList) => {
    if (uploadedFiles.length === 0) return;
    
    setIsLoading(true);
    
    // Simulate file processing
    const newFiles = Array.from(uploadedFiles).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      rowCount: Math.floor(Math.random() * 50000) + 1000,
      columns: ['id', 'timestamp', 'value', 'category', 'status'],
      databaseLink: Math.random() > 0.5 ? `https://db.company.com/${file.name.split('.')[0]}` : undefined
    }));

    // Simulate processing delay
    setTimeout(() => {
      uploadFiles(newFiles);
      setIsLoading(false);
  toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
  // confirm upload progress
  progress.confirmUpload();
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Welcome to <span className="bg-gradient-primary bg-clip-text text-transparent">ON</span>Mark
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload, analyze, and explore your data with our powerful analytics platform. 
            Start by uploading your files to get instant insights.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Upload Your Data Files</h2>
              <p className="text-muted-foreground">Support for CSV, JSON, Excel files and more</p>
            </div>
            
            <div
              className={cn(
                'border-2 border-dashed rounded-xl p-12 transition-all duration-300',
                isDragOver 
                  ? 'border-primary bg-primary/5 shadow-glow' 
                  : 'border-border hover:border-primary/50'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <Spinner size="lg" className="mb-4" />
                    <p className="text-lg text-muted-foreground">Processing your files...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Drop files here or click to browse
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Upload multiple files at once. We'll analyze them automatically.
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".csv,.json,.xlsx,.xls"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="file-upload"
                      disabled={isLoading}
                    />
                    <Button 
                      asChild 
                      size="lg"
                      className="bg-gradient-primary hover:opacity-90 transition-opacity"
                    >
                      <label htmlFor="file-upload" className="cursor-pointer">
                        Choose Files
                      </label>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Current Files Preview */}
        {files.length > 0 && (
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Your Files ({files.length})
                </h3>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-accent hover:opacity-90 transition-opacity"
                >
                  View Dashboard <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <div className="grid gap-3">
                {files.slice(0, 3).map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-muted-foreground mr-3" />
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.rowCount.toLocaleString()} rows
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {files.length > 3 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{files.length - 3} more files
                  </p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Process Data Button */}
        {files.length > 0 && (
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-primary hover:opacity-90 transition-opacity px-8"
            >
              Process Data & View Dashboard <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;