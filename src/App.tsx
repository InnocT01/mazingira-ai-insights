import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import OpenData from "./pages/OpenData";
import AIAssistant from "./pages/AIAssistant";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import MazingiraMedia from "./pages/MazingiraMedia";
import CreateArticle from "./pages/CreateArticle";
import Maps from "./pages/Maps";
import Trends from "./pages/Trends";
import EcoKidsSentinel from "./pages/EcoKidsSentinel";
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
              <Route path="/login" element={<Login />} />
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/open-data" element={<OpenData />} />
                <Route path="/maps" element={<Maps />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/ai" element={<AIAssistant />} />
                <Route path="/media" element={<MazingiraMedia />} />
                <Route path="/media/new" element={<ProtectedRoute><CreateArticle /></ProtectedRoute>} />
                <Route path="/ecokids" element={<EcoKidsSentinel />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
                <Route path="/researcher" element={<ProtectedRoute><ResearcherDashboard /></ProtectedRoute>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
