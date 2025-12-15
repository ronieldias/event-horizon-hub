import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { EventFilters, Event } from '@/types';
import { EventCard } from '@/components/eventos/EventCard';
import { EventFiltersBar } from '@/components/eventos/EventFiltersBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Sparkles, ArrowRight, TrendingUp, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for demo purposes (will be replaced by API)
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Summit Brasil 2024',
    description: 'O maior evento de tecnologia do Brasil reunindo os melhores profissionais do mercado.',
    shortDescription: 'O maior evento de tecnologia do Brasil',
    category: 'Tecnologia',
    date: '2024-03-15',
    time: '09:00',
    location: 'Centro de Convenções',
    city: 'São Paulo',
    state: 'SP',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    capacity: 500,
    registeredCount: 342,
    isFree: false,
    price: 150,
    status: 'published',
    registrationsOpen: true,
    organizerId: '1',
    organizerName: 'Tech Events BR',
    tags: ['tecnologia', 'inovação', 'networking'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Workshop de UX Design',
    description: 'Aprenda as melhores práticas de UX Design com profissionais experientes.',
    shortDescription: 'Aprenda UX Design na prática',
    category: 'Tecnologia',
    date: '2024-03-20',
    time: '14:00',
    location: 'Hub de Inovação',
    city: 'Rio de Janeiro',
    state: 'RJ',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop',
    capacity: 50,
    registeredCount: 48,
    isFree: true,
    status: 'published',
    registrationsOpen: true,
    organizerId: '2',
    organizerName: 'Design Lab',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'Networking Empresarial',
    description: 'Conecte-se com outros empreendedores e expanda sua rede de contatos.',
    shortDescription: 'Expanda sua rede de contatos',
    category: 'Networking',
    date: '2024-03-25',
    time: '19:00',
    location: 'Rooftop Business Center',
    city: 'Belo Horizonte',
    state: 'MG',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop',
    capacity: 100,
    registeredCount: 67,
    isFree: false,
    price: 50,
    status: 'published',
    registrationsOpen: true,
    organizerId: '3',
    organizerName: 'BH Business',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-12',
  },
  {
    id: '4',
    title: 'Festival de Música Indie',
    description: 'Três dias de música alternativa com bandas nacionais e internacionais.',
    shortDescription: 'Música alternativa ao vivo',
    category: 'Música',
    date: '2024-04-05',
    time: '16:00',
    location: 'Parque da Cidade',
    city: 'Porto Alegre',
    state: 'RS',
    imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop',
    capacity: 2000,
    registeredCount: 1456,
    isFree: false,
    price: 200,
    status: 'published',
    registrationsOpen: true,
    organizerId: '4',
    organizerName: 'Indie Fest',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
  },
  {
    id: '5',
    title: 'Maratona de Programação',
    description: 'Competição de programação com premiações para os melhores times.',
    shortDescription: '24h de código e desafios',
    category: 'Tecnologia',
    date: '2024-04-12',
    time: '08:00',
    location: 'Campus Universitário',
    city: 'Curitiba',
    state: 'PR',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop',
    capacity: 200,
    registeredCount: 180,
    isFree: true,
    status: 'published',
    registrationsOpen: true,
    organizerId: '5',
    organizerName: 'Code Masters',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-18',
  },
  {
    id: '6',
    title: 'Exposição de Arte Moderna',
    description: 'Obras de artistas contemporâneos brasileiros em uma experiência imersiva.',
    shortDescription: 'Arte contemporânea brasileira',
    category: 'Arte',
    date: '2024-04-18',
    time: '10:00',
    location: 'Museu de Arte Moderna',
    city: 'Salvador',
    state: 'BA',
    imageUrl: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop',
    capacity: 300,
    registeredCount: 123,
    isFree: false,
    price: 30,
    status: 'published',
    registrationsOpen: true,
    organizerId: '6',
    organizerName: 'Arte BA',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-19',
  },
];

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState<EventFilters>({});

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      try {
        return await api.getEvents(filters);
      } catch {
        // Return mock data if API is not available
        return mockEvents;
      }
    },
  });

  const filteredEvents = events?.filter((event) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!event.title.toLowerCase().includes(search) && 
          !event.description.toLowerCase().includes(search)) {
        return false;
      }
    }
    if (filters.category && event.category !== filters.category) return false;
    if (filters.state && event.state !== filters.state) return false;
    if (filters.city && !event.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
    if (filters.isFree && !event.isFree) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-hero-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Plataforma de Eventos Inteligente</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Descubra eventos <br />
              <span className="gradient-text">incríveis</span> perto de você
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Conecte-se com experiências únicas, expanda sua rede e participe dos melhores eventos da sua região.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {!isAuthenticated ? (
                <>
                  <Button asChild size="xl" variant="hero">
                    <Link to="/register">
                      Começar Agora
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="xl" variant="outline">
                    <Link to="/login">Já tenho conta</Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="xl" variant="hero">
                  <a href="#events">
                    Explorar Eventos
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="glass-card p-6 text-center rounded-xl">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Eventos ativos</div>
            </div>
            <div className="glass-card p-6 text-center rounded-xl">
              <Users className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm text-muted-foreground">Participantes</div>
            </div>
            <div className="glass-card p-6 text-center rounded-xl">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-muted-foreground">Organizadores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Próximos Eventos</h2>
              <p className="text-muted-foreground mt-1">
                Explore e encontre eventos que combinam com você
              </p>
            </div>
          </div>

          <EventFiltersBar filters={filters} onFiltersChange={setFilters} />

          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[16/9] rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Erro ao carregar eventos</h3>
                <p className="text-muted-foreground mt-2">
                  Não foi possível conectar ao servidor. Mostrando dados de demonstração.
                </p>
              </div>
            ) : filteredEvents && filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Nenhum evento encontrado</h3>
                <p className="text-muted-foreground mt-2">
                  Tente ajustar os filtros ou volte mais tarde.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
