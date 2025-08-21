# Routing Documentation

## Overview
The DataHub application uses React Router for client-side routing with a clean, intuitive navigation structure.

## Route Structure

### Application Routes
```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
```

## Page Definitions

### Home Route - `/`
**Component:** `Home.tsx`
**Purpose:** Landing page with file upload functionality
**Features:**
- Hero section with platform introduction
- Drag-and-drop file upload
- File preview and processing initiation
- Navigation to dashboard after upload

**Key Props/State:**
- `isDragOver`: boolean for drag state styling
- `files`: from UserContext for file management
- `isLoading`: global loading state

### Dashboard Route - `/dashboard`
**Component:** `Dashboard.tsx`
**Purpose:** Main data management interface
**Features:**
- File catalog with search and filtering
- Data statistics and overview cards
- File operations (view, delete, discovery)
- Additional file upload capabilities

**Key Props/State:**
- `searchTerm`: string for file filtering
- `selectedFile`: FileData | null for discovery view
- `filteredFiles`: computed array of matching files

### Chatbot Route - `/chatbot`
**Component:** `Chatbot.tsx`
**Purpose:** AI-powered data analysis interface
**Features:**
- Conversation history sidebar
- Real-time chat interface
- Message threading and persistence
- Context-aware AI responses

**Key Props/State:**
- `conversations`: Conversation[] array
- `activeConversationId`: string | null
- `message`: string for current input
- `isLoading`: boolean for response waiting

### 404 Route - `*`
**Component:** `NotFound.tsx`
**Purpose:** Handle invalid routes gracefully
**Features:**
- Professional error messaging
- Navigation back to home
- Error logging for analytics

## Navigation Logic

### Navbar Component
```jsx
const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav>
      <Link to="/">
        <Button variant={isActive('/') ? 'default' : 'ghost'}>
          Home
        </Button>
      </Link>
      // ... other nav items
    </nav>
  );
};
```

### Programmatic Navigation
```jsx
import { useNavigate } from 'react-router-dom';

const NavigationExample = () => {
  const navigate = useNavigate();
  
  const handleProcessData = () => {
    // Process files then navigate
    navigate('/dashboard');
  };
  
  const handleViewDiscovery = (file) => {
    // Set file context then show discovery
    setSelectedFile(file);
    // Discovery is rendered within Dashboard component
  };
};
```

## Route Guards and Protection
Currently no authentication is implemented, but structure supports future guards:

```jsx
// Future implementation
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## URL Parameters and Query Strings

### Future Enhancements
- File-specific routes: `/dashboard/files/:fileId`
- Chat conversation routes: `/chatbot/conversations/:conversationId`
- Search parameters: `/dashboard?search=sales&sort=date`

```jsx
// Example implementation
const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  
  const updateSearch = (term) => {
    setSearchParams(term ? { search: term } : {});
  };
};
```

## Route-based Code Splitting
For performance optimization:

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chatbot = lazy(() => import('./pages/Chatbot'));

const App = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chatbot" element={<Chatbot />} />
    </Routes>
  </Suspense>
);
```

## SEO and Meta Tags
Each route should handle meta tags for SEO:

```jsx
import { Helmet } from 'react-helmet-async';

const Dashboard = () => (
  <>
    <Helmet>
      <title>Dashboard - DataHub Analytics</title>
      <meta name="description" content="Manage and analyze your data files" />
    </Helmet>
    <div>Dashboard content...</div>
  </>
);
```

## Navigation Flow

### Typical User Journey
1. **Home** → Upload files → Navigate to Dashboard
2. **Dashboard** → View file discovery → Return to Dashboard
3. **Dashboard** → Switch to Chatbot for analysis
4. **Chatbot** → Continue analysis or return to Dashboard

### Breadcrumb Navigation
```jsx
const Breadcrumbs = () => {
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    switch (location.pathname) {
      case '/': return [{ label: 'Home', path: '/' }];
      case '/dashboard': return [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/dashboard' }
      ];
      case '/chatbot': return [
        { label: 'Home', path: '/' },
        { label: 'Chat', path: '/chatbot' }
      ];
      default: return [];
    }
  };
};
```

## Error Boundaries
Route-level error handling:

```jsx
class RouteErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Testing Routes
```jsx
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

const renderWithRouter = (component, initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      {component}
    </MemoryRouter>
  );
};
```
