import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Components
import { SplashScreen } from './components/Onboarding/SplashScreen';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { HomePage } from './components/Home/HomePage';
import { MapView } from './components/Map/MapView';
import { SearchPage } from './components/Search/SearchPage';

import { ChatPage } from './components/Chat/ChatPage';
import { AdminDashboard } from './components/users/Admin/AdminDashboard';
import { SchoolsList } from './components/users/Admin/SchoolsList';
import { UsersList } from './components/users/Admin/UsersList';
import { SchoolDetail } from './components/School/SchoolDetail';
import { Footer } from './components/Layout/Footer';
import { EditSchoolForm } from './components/users/Admin/EditSchool';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { UnderConstruction } from './components/Layout/UnderConstruction';
import { AddSchoolAdminForm } from './components/users/Admin/AddSchoolAdmin';
import { AddSchoolForm } from './components/users/Representant/AddSchool';

// Layout Component
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleMenuClick = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const isFullScreenView = location.pathname === '/map' || location.pathname === '/chat';

  return (
    <div className="min-h-screen">
      <Header 
        user={user}
        onLogout={logout}
        onMenuClick={handleMenuClick}
        isAdmin={user?.role === 'admin'}
        isRepresentant={user?.role === 'representant'}
      />

      <div className="flex container mx-auto ">
        {/* Sidebar Mobile uniquement */}
        <div className="lg:hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            isAdmin={user?.role === 'admin'}
            isRepresentant={user?.role === 'representant'}
          />
        </div>

        {/* Contenu principal - pleine largeur sur desktop */}
        <main className="flex-1">
          <div className={`${isFullScreenView ? '' : 'p-6'}`}>
            {children}
          </div>
        </main>
      </div>

      {/* Footer - caché sur les vues plein écran */}
      {!isFullScreenView && (
        <Footer />
      )}
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin' && user.role !== 'representant') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Route Components
const HomeRoute = () => <HomePage />;
const MapRoute = () => <MapView />;
const SearchRoute = () => <SearchPage />;

const ChatRoute = () => <ChatPage />;
const SchoolDetailRoute = () => <SchoolDetail />;
const AdminRoute = () => <AdminDashboard />;
const SchoolsListRoute = () => <SchoolsList />;
const AddSchoolAdminRoute = () => <AddSchoolAdminForm />;
const AddSchoolRoute = () => <AddSchoolForm />;
const EditSchoolRoute = () => <EditSchoolForm />;
const LoginRoute = () => <LoginPage />;
const SignupRoute = () => <SignupPage />;
const UnderConstructionRoute = () => <UnderConstruction />;

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <Routes>
        {/* Auth Routes - No Layout */}
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        
        {/* Under Construction Routes - No Layout */}
        <Route path="/under-construction" element={<UnderConstructionRoute />} />
        
        {/* Main Routes - With Layout */}
        <Route path="/" element={
          <AppLayout>
            <HomeRoute />
          </AppLayout>
        } />
        
        <Route path="/map" element={
          <AppLayout>
            <MapRoute />
          </AppLayout>
        } />
        
        <Route path="/search" element={
          <AppLayout>
            <SearchRoute />
          </AppLayout>
        } />
        
        <Route path="/school/:id" element={
          <AppLayout>
            <SchoolDetailRoute />
          </AppLayout>
        } />
        

        
        <Route path="/chat" element={
          <AppLayout>
            <ProtectedRoute>
              <ChatRoute />
            </ProtectedRoute>
          </AppLayout>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AppLayout>
            <ProtectedRoute adminOnly>
              <AdminRoute />
            </ProtectedRoute>
          </AppLayout>
        } />
       
        {/* Representant Routes */}
        <Route path="/add-school" element={
          <AppLayout>
            <ProtectedRoute adminOnly>
              <AddSchoolRoute />
            </ProtectedRoute>
          </AppLayout>
        } />
        
        <Route path="/admin/schools" element={
          <AppLayout>
            <ProtectedRoute adminOnly>
              <SchoolsListRoute />
            </ProtectedRoute>
          </AppLayout>
        } />
        
        <Route path="/admin/add-school-admin" element={
          <AppLayout>
            <ProtectedRoute adminOnly>
              <AddSchoolAdminRoute />
            </ProtectedRoute>
          </AppLayout>
        } />

    
        
        <Route path="/admin/edit-school/:id" element={
          <AppLayout>
            <ProtectedRoute adminOnly>
              <EditSchoolRoute />
            </ProtectedRoute>
          </AppLayout>
        } />

        <Route path="/admin/users" element={
          <AppLayout>
            <ProtectedRoute adminOnly>
              <UsersList />
            </ProtectedRoute>
          </AppLayout>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;