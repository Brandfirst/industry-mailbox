
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Saved from "./pages/Saved";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import NewsletterDetail from "./pages/NewsletterDetail";
import SenderNewsletters from "./pages/SenderNewsletters";
import { AuthProvider } from "./contexts/auth/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const queryClient = new QueryClient();

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<Search />} />
        <Route path="/newsletter/:id" element={<NewsletterDetail />} />
        {/* New URL formats */}
        <Route path="/:sender/:titleId" element={<NewsletterDetail />} />
        <Route path="/sender/:senderSlug" element={<SenderNewsletters />} />
        
        {/* Admin routes - make sure to handle with AND without query parameters */}
        <Route path="/admin" element={
          <ProtectedRoute requireAuth requireAdmin>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/:tab" element={
          <ProtectedRoute requireAuth requireAdmin>
            <Admin />
          </ProtectedRoute>
        } />
        
        <Route 
          path="/auth" 
          element={
            <ProtectedRoute requireAuth={false}>
              <Auth />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/saved" 
          element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen bg-background">
            <AppLayout />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
