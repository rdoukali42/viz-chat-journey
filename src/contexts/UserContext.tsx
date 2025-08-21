import React, { createContext, useContext, useState, ReactNode } from 'react';

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

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<FileData[]>([
    // Mock data for development
    {
      id: '1',
      name: 'sales_data_q1.csv',
      size: 2048000,
      uploadDate: '2024-01-15',
      rowCount: 15420,
      columns: ['date', 'product_id', 'customer_id', 'revenue', 'quantity'],
      databaseLink: 'https://analytics.company.com/db/sales_q1'
    },
    {
      id: '2',
      name: 'user_behavior.xlsx', 
      size: 5120000,
      uploadDate: '2024-01-10',
      rowCount: 45230,
      columns: ['user_id', 'session_id', 'event_type', 'timestamp', 'page_url'],
    },
    {
      id: '3',
      name: 'inventory_levels.json',
      size: 1024000, 
      uploadDate: '2024-01-08',
      rowCount: 2340,
      columns: ['product_id', 'warehouse_location', 'stock_count', 'last_updated'],
      databaseLink: 'https://inventory.company.com/live'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);

  const uploadFiles = (newFiles: FileData[]) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
  };

  const value: UserContextType = {
    files,
    uploadFiles,
    removeFile,
    isLoading,
    setIsLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};