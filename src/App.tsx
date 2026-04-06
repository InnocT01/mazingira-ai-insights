import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import OpenData from "./pages/OpenData";
import ContributePage from "./pages/ContributePage";
import AIAssistant from "./pages/AIAssistant";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/open-data" element={<OpenData />} />
              <Route path="/contribute" element={<ContributePage />} />
              <Route path="/ai" element={<AIAssistant />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
              <Route path="/researcher" element={<ProtectedRoute><ResearcherDashboard /></ProtectedRoute>} />
              {/* Legacy redirects */}
              <Route path="/explorer" element={<OpenData />} />
              <Route path="/premium" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
