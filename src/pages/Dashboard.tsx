import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { 
  FileText, 
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
import { useProgress } from '@/contexts/ProgressContext';

const Dashboard = () => {
  const { files, removeFile } = useUser();
  const progress = useProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleRemoveFile = (fileId: string) => {
    removeFile(fileId);
    toast.success('File removed successfully');
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  useEffect(() => {
    progress.confirmDiscovery();
  }, []);

  if (selectedFile) {
    return (
      <DataDiscovery 
        file={selectedFile} 
        onBack={() => setSelectedFile(null)}
        onFileSelect={(file) => setSelectedFile(file)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 mb-6">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-3">
              Data Dashboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore your data ecosystem with powerful analytics and seamless connections
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mr-4 shadow-md">
                <FileText className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{files.length}</p>
                <p className="text-muted-foreground font-medium">Total Files</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mr-4 shadow-md">
                <BarChart3 className="h-7 w-7 text-accent-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {files.reduce((acc, file) => acc + file.rowCount, 0).toLocaleString()}
                </p>
                <p className="text-muted-foreground font-medium">Total Records</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/30 border-secondary/30 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-secondary/80 rounded-xl flex items-center justify-center mr-4 shadow-md">
                <Database className="h-7 w-7 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {files.filter(file => file.databaseLink).length}
                </p>
                <p className="text-muted-foreground font-medium">Connected Databases</p>
              </div>
            </div>
          </Card>
        </div>


        {/* Files Table */}
        <Card className="p-8 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 shadow-elegant">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Your Data Files</h2>
              <p className="text-muted-foreground">Manage and explore your data collections</p>
            </div>
            <div className="flex items-center space-x-3 bg-secondary/50 rounded-lg p-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 border-0 bg-transparent focus:ring-2 focus:ring-primary/20"
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
                    {/* <th className="text-left py-3 px-4 font-medium text-foreground">Database Link</th> */}
                    <th className="text-left py-3 px-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                     <tr key={file.id} className="border-b border-border hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-200 group">
                       <td className="py-6 px-4">
                         <div className="flex items-center">
                           <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center mr-4 group-hover:shadow-md transition-shadow">
                             <FileText className="h-5 w-5 text-primary-foreground" />
                           </div>
                           <div>
                             <p className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">{file.name}</p>
                             <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                               <span className="font-medium">{formatFileSize(file.size)}</span>
                               <span className="font-medium">{file.rowCount.toLocaleString()} rows</span>
                               <span className="flex items-center font-medium">
                                 {/* <Calendar className="h-3 w-3 mr-1" /> */}
                                 {/* {file.uploadDate} */}
                               </span>
                             </div>
                           </div>
                         </div>
                       </td>
                       <td className="py-6 px-4">
                         <div className="flex flex-wrap gap-2">
                           {file.columns.slice(0, 3).map((column, index) => (
                             <span
                               key={index}
                               className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-sm rounded-full font-medium border border-primary/20"
                             >
                               {column}
                             </span>
                           ))}
                           {file.columns.length > 3 && (
                             <span className="px-3 py-1.5 bg-muted text-muted-foreground text-sm rounded-full font-medium">
                               +{file.columns.length - 3} more
                             </span>
                           )}
                         </div>
                       </td>
                       {/* <td className="py-6 px-4">
                         {file.databaseLink ? (
                           <Button
                             variant="outline"
                             size="sm"
                             asChild
                             className="flex items-center bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 hover:bg-accent/20 transition-all"
                           >
                             <a href={file.databaseLink} target="_blank" rel="noopener noreferrer">
                               <ExternalLink className="h-4 w-4 mr-2" />
                               View Database
                             </a>
                           </Button>
                         ) : (
                           <span className="text-muted-foreground text-sm font-medium">No Link</span>
                         )}
                       </td> */}
                       <td className="py-6 px-4">
                         <div className="flex items-center space-x-3">
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => setSelectedFile(file)}
                             className="flex items-center bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 hover:bg-primary/20 hover:shadow-md transition-all"
                           >
                             <Eye className="h-4 w-4 mr-2" />
                             Discovery
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleRemoveFile(file.id)}
                             className="text-destructive hover:bg-destructive/10 border-destructive/30 hover:shadow-md transition-all"
                           >
                             <Trash2 className="h-4 w-4" />
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