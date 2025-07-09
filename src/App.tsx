import { BrowserRouter } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Router } from './Router';

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Header />

        <BrowserRouter>
          <Router />
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}
