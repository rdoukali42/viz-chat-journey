import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FileData {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  rowCount: number;
  columns: string[];
  databaseLink?: string;
  relatedFiles?: { [key: string]: string }; // columnName -> relatedFileId
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
      databaseLink: 'https://analytics.company.com/db/sales_q1',
      relatedFiles: { 'product_id': '4', 'customer_id': '5' }
    },
    {
      id: '2',
      name: 'user_behavior.xlsx', 
      size: 5120000,
      uploadDate: '2024-01-10',
      rowCount: 45230,
      columns: ['user_id', 'session_id', 'event_type', 'timestamp', 'page_url'],
      relatedFiles: { 'user_id': '5' }
    },
    {
      id: '3',
      name: 'inventory_levels.json',
      size: 1024000, 
      uploadDate: '2024-01-08',
      rowCount: 2340,
      columns: ['product_id', 'warehouse_location', 'stock_count', 'last_updated'],
      databaseLink: 'https://inventory.company.com/live',
      relatedFiles: { 'product_id': '4' }
    },
    {
      id: '4',
      name: 'products_catalog.csv',
      size: 3072000,
      uploadDate: '2024-01-05',
      rowCount: 8750,
      columns: ['product_id', 'name', 'category', 'price', 'description'],
      databaseLink: 'https://catalog.company.com/products'
    },
    {
      id: '5',
      name: 'customers_database.xlsx',
      size: 4096000,
      uploadDate: '2024-01-03',
      rowCount: 12540,
      columns: ['customer_id', 'name', 'email', 'registration_date', 'tier'],
      databaseLink: 'https://crm.company.com/customers'
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