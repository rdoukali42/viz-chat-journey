import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProgressProvider } from '@/contexts/ProgressContext';
import { UserProvider } from '@/contexts/UserContext';
import Navbar from "@/components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <ProgressProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </ProgressProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
