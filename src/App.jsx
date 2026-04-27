import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Pacientes from './components/Pacientes';
import Citas from './components/Citas';
import Jornadas from './components/Jornadas';
import ProductosServicios from './components/ProductosServicios';
import Finanzas from './components/Finanzas';
import Settings from './components/Settings';
import AuthPage from './components/auth/AuthPage';
import OnboardingPage from './components/auth/OnboardingPage';
import { useAlerts } from './hooks/useTenantData';

// Landing page components
import SpineVideo from './components/landing/SpineVideo';
import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import ServicesSection from './components/landing/ServicesSection';
import AboutSection from './components/landing/AboutSection';
import JornadasSection from './components/landing/JornadasSection';
import TestimonialsSection from './components/landing/TestimonialsSection';
import ContactSection from './components/landing/ContactSection';
import WhatsAppFAB from './components/landing/WhatsAppFAB';
import LegalPage from './components/landing/LegalPage';

function CRMApp() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const { alerts } = useAlerts();

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard': return <Dashboard onNavigate={setActiveModule} />;
      case 'pacientes': return <Pacientes />;
      case 'citas': return <Citas />;
      case 'jornadas': return <Jornadas />;
      case 'productos': return <ProductosServicios />;
      case 'finanzas': return <Finanzas />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <Sidebar activeModule={activeModule} onNavigate={setActiveModule} alerts={alerts} />
      <main className="flex-1 lg:ml-0 overflow-auto">
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}

function LandingApp() {
  return (
    <div className="bg-background text-on-surface overflow-x-hidden antialiased">
      <SpineVideo />
      <Navbar />
      <div className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <JornadasSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
      <WhatsAppFAB />
    </div>
  );
}

function getViewFromHash() {
  const h = window.location.hash;
  if (h === '#crm') return 'crm';
  if (h === '#terms') return 'terms';
  if (h === '#privacy') return 'privacy';
  return 'landing';
}

function AppRouter() {
  const { user, tenant, loading } = useAuth();
  const [view, setView] = useState(getViewFromHash);

  useEffect(() => {
    const onHash = () => setView(getViewFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const goToLanding = () => {
    window.location.hash = '';
    setView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full clinical-gradient flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-6 h-6 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3" />
            </svg>
          </div>
          <p className="text-on-surface-variant text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // Legal pages — públicas, accesibles desde cualquier estado
  if (view === 'terms') return <LegalPage doc="terms" onBack={goToLanding} />;
  if (view === 'privacy') return <LegalPage doc="privacy" onBack={goToLanding} />;

  // Auth flow
  if (!user) {
    if (view === 'crm') return <AuthPage />;
    return <LandingApp />;
  }

  // User is authenticated but has no tenant → onboarding
  if (!tenant) {
    return <OnboardingPage />;
  }

  // User has tenant → CRM
  return <CRMApp />;
}

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
