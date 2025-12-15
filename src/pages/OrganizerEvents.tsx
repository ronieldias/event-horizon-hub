import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  Calendar,
  Users,
  MoreVertical,
  Edit,
  Eye,
  Copy,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Send,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Event } from '@/types';

// Mock data for demo
const mockOrganizerEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Summit Brasil 2024',
    description: 'O maior evento de tecnologia do Brasil',
    category: 'Tecnologia',
    date: '2024-03-15',
    time: '09:00',
    location: 'Centro de Convenções',
    city: 'São Paulo',
    state: 'SP',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop',
    capacity: 500,
    registeredCount: 342,
    isFree: false,
    price: 150,
    status: 'published',
    registrationsOpen: true,
    organizerId: '1',
    organizerName: 'Tech Events BR',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: '7',
    title: 'Workshop de Inteligência Artificial',
    description: 'Aprenda sobre IA na prática',
    category: 'Tecnologia',
    date: '2024-04-10',
    time: '14:00',
    location: 'Online',
    city: 'São Paulo',
    state: 'SP',
    capacity: 100,
    registeredCount: 45,
    isFree: true,
    status: 'draft',
    registrationsOpen: false,
    organizerId: '1',
    organizerName: 'Tech Events BR',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-05',
  },
  {
    id: '8',
    title: 'Meetup de Desenvolvedores',
    description: 'Networking entre devs',
    category: 'Networking',
    date: '2024-02-28',
    time: '19:00',
    location: 'Coworking Space',
    city: 'São Paulo',
    state: 'SP',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&auto=format&fit=crop',
    capacity: 50,
    registeredCount: 50,
    isFree: true,
    status: 'finished',
    registrationsOpen: false,
    organizerId: '1',
    organizerName: 'Tech Events BR',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-28',
  },
];

export default function OrganizerEvents() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: events, isLoading } = useQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => {
      try {
        return await api.getOrganizerEvents();
      } catch {
        return mockOrganizerEvents;
      }
    },
  });

  const filteredEvents = events?.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (event: Event) => {
    switch (event.status) {
      case 'draft':
        return <Badge variant="outline" className="text-muted-foreground">Rascunho</Badge>;
      case 'published':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Publicado</Badge>;
      case 'closed':
        return <Badge variant="secondary">Inscrições Fechadas</Badge>;
      case 'finished':
        return <Badge variant="secondary">Finalizado</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meus Eventos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus eventos em um só lugar
          </p>
        </div>
        <Button asChild variant="hero">
          <Link to="/organizer/events/new">
            <Plus className="h-4 w-4 mr-2" />
            Criar Evento
          </Link>
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredEvents && filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="glass-card overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-40 h-24 md:h-auto relative overflow-hidden">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary/50" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(event)}
                          {event.registrationsOpen && event.status === 'published' && (
                            <Badge variant="outline" className="text-primary border-primary/30">
                              Inscrições Abertas
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold">{event.title}</h3>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {format(new Date(event.date), "d 'de' MMM, yyyy", { locale: ptBR })}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            {event.registeredCount} / {event.capacity} inscritos
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/organizer/events/${event.id}/manage`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Gerenciar
                          </Link>
                        </Button>

                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/events/${event.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {event.status === 'draft' && (
                              <DropdownMenuItem>
                                <Send className="h-4 w-4 mr-2" />
                                Publicar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              {event.registrationsOpen ? (
                                <>
                                  <ToggleRight className="h-4 w-4 mr-2" />
                                  Fechar Inscrições
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-4 w-4 mr-2" />
                                  Abrir Inscrições
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="py-16 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Nenhum evento criado</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              Comece criando seu primeiro evento agora mesmo.
            </p>
            <Button asChild>
              <Link to="/organizer/events/new">
                <Plus className="h-4 w-4 mr-2" />
                Criar Evento
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
