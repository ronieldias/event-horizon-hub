import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetails from "./pages/EventDetails";
import MyRegistrations from "./pages/MyRegistrations";
import OrganizerEvents from "./pages/OrganizerEvents";
import CreateEvent from "./pages/CreateEvent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main layout routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/events/:id" element={<EventDetails />} />
              
              {/* Protected routes */}
              <Route
                path="/registrations"
                element={
                  <ProtectedRoute>
                    <MyRegistrations />
                  </ProtectedRoute>
                }
              />
              
              {/* Organizer routes */}
              <Route
                path="/organizer/events"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <OrganizerEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events/new"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
