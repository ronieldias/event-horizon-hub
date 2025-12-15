import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 py-8 mt-auto">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 EventSync AI. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
