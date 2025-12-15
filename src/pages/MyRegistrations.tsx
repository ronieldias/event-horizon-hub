import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Clock, Ticket, X, QrCode, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Registration } from '@/types';

// Mock data for demo
const mockRegistrations: Registration[] = [
  {
    id: '1',
    eventId: '1',
    userId: '1',
    status: 'confirmed',
    checkedIn: false,
    createdAt: '2024-01-15',
    event: {
      id: '1',
      title: 'Tech Summit Brasil 2024',
      description: '',
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
  },
  {
    id: '2',
    eventId: '2',
    userId: '1',
    status: 'confirmed',
    checkedIn: true,
    checkedInAt: '2024-02-20T14:30:00',
    createdAt: '2024-02-10',
    event: {
      id: '2',
      title: 'Workshop de UX Design',
      description: '',
      category: 'Tecnologia',
      date: '2024-02-20',
      time: '14:00',
      location: 'Hub de Inovação',
      city: 'Rio de Janeiro',
      state: 'RJ',
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop',
      capacity: 50,
      registeredCount: 48,
      isFree: true,
      status: 'finished',
      registrationsOpen: false,
      organizerId: '2',
      organizerName: 'Design Lab',
      createdAt: '2024-01-05',
      updatedAt: '2024-02-20',
    },
  },
];

export default function MyRegistrations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: registrations, isLoading } = useQuery({
    queryKey: ['registrations'],
    queryFn: async () => {
      try {
        return await api.getMyRegistrations();
      } catch {
        return mockRegistrations;
      }
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (registrationId: string) => api.cancelRegistration(registrationId),
    onSuccess: () => {
      toast({
        title: 'Inscrição cancelada',
        description: 'Sua inscrição foi cancelada com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao cancelar',
        description: error instanceof Error ? error.message : 'Não foi possível cancelar a inscrição',
        variant: 'destructive',
      });
    },
  });

  const getStatusBadge = (registration: Registration) => {
    if (registration.status === 'cancelled') {
      return <Badge variant="outline" className="text-muted-foreground">Cancelado</Badge>;
    }
    if (registration.checkedIn) {
      return <Badge className="bg-primary text-primary-foreground">Check-in realizado</Badge>;
    }
    if (registration.event?.status === 'finished') {
      return <Badge variant="secondary">Finalizado</Badge>;
    }
    return <Badge className="bg-primary/20 text-primary border-primary/30">Confirmado</Badge>;
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Minhas Inscrições</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas inscrições e acompanhe os eventos
        </p>
      </div>

      {registrations && registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((registration) => {
            const event = registration.event;
            if (!event) return null;

            const eventDate = new Date(event.date);
            const isUpcoming = eventDate > new Date();
            const canCancel = registration.status === 'confirmed' && isUpcoming;

            return (
              <Card key={registration.id} className="glass-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-32 md:h-auto relative overflow-hidden">
                      {event.imageUrl ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Ticket className="h-8 w-8 text-primary/50" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-5">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getStatusBadge(registration)}
                            <Badge variant="outline">{event.category}</Badge>
                          </div>

                          <Link to={`/events/${event.id}`} className="group">
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>
                          </Link>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary" />
                              {format(eventDate, "d 'de' MMM, yyyy", { locale: ptBR })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              {event.city}, {event.state}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/events/${event.id}`}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver evento
                            </Link>
                          </Button>

                          {registration.status === 'confirmed' && !registration.checkedIn && (
                            <Button variant="secondary" size="sm">
                              <QrCode className="h-4 w-4 mr-2" />
                              Cartão Virtual
                            </Button>
                          )}

                          {canCancel && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => cancelMutation.mutate(registration.id)}
                              disabled={cancelMutation.isPending}
                            >
                              {cancelMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-2" />
                                  Cancelar
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="glass-card">
          <CardContent className="py-16 text-center">
            <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Nenhuma inscrição encontrada</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              Você ainda não se inscreveu em nenhum evento.
            </p>
            <Button asChild>
              <Link to="/">Explorar Eventos</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
