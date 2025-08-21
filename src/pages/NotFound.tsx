import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page not found</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <a href="/" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
