import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDays, LogOut, User, Settings, Ticket, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <CalendarDays className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold">
            Event<span className="gradient-text">Sync</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Explorar Eventos
          </Link>
          {isAuthenticated && (
            <Link
              to="/registrations"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Minhas Inscrições
            </Link>
          )}
          {user?.role === 'organizer' && (
            <Link
              to="/organizer/events"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Painel do Organizador
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <span className="text-xs text-primary capitalize">{user?.role}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/registrations" className="flex items-center gap-2 cursor-pointer">
                    <Ticket className="h-4 w-4" />
                    Minhas Inscrições
                  </Link>
                </DropdownMenuItem>
                {user?.role === 'organizer' && (
                  <DropdownMenuItem asChild>
                    <Link to="/organizer/events" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Painel do Organizador
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Criar Conta</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl animate-fade-in">
          <nav className="container py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explorar Eventos
            </Link>
            {isAuthenticated && (
              <Link
                to="/registrations"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Minhas Inscrições
              </Link>
            )}
            {user?.role === 'organizer' && (
              <Link
                to="/organizer/events"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Painel do Organizador
              </Link>
            )}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-4 border-t border-border/40">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Entrar
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    Criar Conta
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
