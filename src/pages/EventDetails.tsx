import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  Heart,
  ArrowLeft,
  Ticket,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Event } from '@/types';

// Mock event for demo
const mockEvent: Event = {
  id: '1',
  title: 'Tech Summit Brasil 2024',
  description: `O Tech Summit Brasil 2024 é o maior evento de tecnologia do país, reunindo os melhores profissionais, empreendedores e entusiastas da área.

Durante três dias intensos, você terá acesso a:

• Palestras com speakers renomados internacionalmente
• Workshops práticos sobre as tecnologias mais recentes
• Networking com milhares de profissionais
• Feira de startups e exposição de produtos inovadores
• Hackathon com premiações exclusivas

Não perca esta oportunidade única de se atualizar, fazer conexões valiosas e impulsionar sua carreira na área de tecnologia.

Garanta já sua vaga!`,
  shortDescription: 'O maior evento de tecnologia do Brasil',
  category: 'Tecnologia',
  date: '2024-03-15',
  time: '09:00',
  endDate: '2024-03-17',
  endTime: '18:00',
  location: 'Centro de Convenções Frei Caneca',
  city: 'São Paulo',
  state: 'SP',
  address: 'Rua Frei Caneca, 569 - Consolação',
  imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop',
  capacity: 500,
  registeredCount: 342,
  isFree: false,
  price: 150,
  status: 'published',
  registrationsOpen: true,
  registrationDeadline: '2024-03-14',
  organizerId: '1',
  organizerName: 'Tech Events BR',
  tags: ['tecnologia', 'inovação', 'networking', 'startups'],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-15',
};

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      try {
        return await api.getEvent(id!);
      } catch {
        return mockEvent;
      }
    },
    enabled: !!id,
  });

  const registerMutation = useMutation({
    mutationFn: () => api.registerForEvent(id!),
    onSuccess: () => {
      toast({
        title: 'Inscrição realizada!',
        description: 'Você está inscrito neste evento.',
      });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (error) => {
      toast({
        title: 'Erro na inscrição',
        description: error instanceof Error ? error.message : 'Não foi possível realizar a inscrição',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="aspect-[21/9] rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">Evento não encontrado</h1>
        <p className="text-muted-foreground mt-2">O evento que você procura não existe ou foi removido.</p>
        <Button asChild className="mt-6">
          <Link to="/">Voltar para Home</Link>
        </Button>
      </div>
    );
  }

  const spotsLeft = event.capacity - event.registeredCount;
  const isSoldOut = spotsLeft <= 0;
  const formattedDate = format(new Date(event.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="min-h-screen pb-16">
      {/* Header Image */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        <div className="absolute top-6 left-6">
          <Button asChild variant="glass" size="sm">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
        </div>

        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="glass" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="glass" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="container -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {event.category}
                </Badge>
                {event.isFree && (
                  <Badge className="bg-primary text-primary-foreground">Gratuito</Badge>
                )}
                {isSoldOut && (
                  <Badge variant="destructive">Esgotado</Badge>
                )}
                {event.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>

              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {event.organizerName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{event.organizerName}</p>
                  <p className="text-sm text-muted-foreground">Organizador</p>
                </div>
              </div>
            </div>

            <Card className="glass-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{formattedDate}</p>
                    <p className="text-muted-foreground">
                      {event.time} - {event.endTime || '18:00'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.location}</p>
                    <p className="text-muted-foreground">
                      {event.address && `${event.address} - `}
                      {event.city}, {event.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.registeredCount} inscritos</p>
                    <p className="text-muted-foreground">
                      {isSoldOut ? 'Evento esgotado' : `${spotsLeft} vagas restantes`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Sobre o evento</h2>
              <div className="prose prose-invert max-w-none">
                {event.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  {event.isFree ? (
                    <p className="text-3xl font-bold text-primary">Gratuito</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">A partir de</p>
                      <p className="text-3xl font-bold text-primary">
                        R$ {event.price?.toFixed(2).replace('.', ',')}
                      </p>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={isSoldOut || !event.registrationsOpen || registerMutation.isPending}
                        onClick={() => registerMutation.mutate()}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : isSoldOut ? (
                          'Esgotado'
                        ) : !event.registrationsOpen ? (
                          'Inscrições Encerradas'
                        ) : (
                          <>
                            <Ticket className="h-4 w-4" />
                            Inscreva-se
                          </>
                        )}
                      </Button>

                      {event.registrationsOpen && !isSoldOut && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          Confirmação imediata
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full" size="lg">
                        <Link to="/login">
                          Fazer login para se inscrever
                        </Link>
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        Não tem conta?{' '}
                        <Link to="/register" className="text-primary hover:underline">
                          Cadastre-se
                        </Link>
                      </p>
                    </>
                  )}
                </div>

                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Capacidade</span>
                    <span className="font-medium">{event.capacity} pessoas</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Inscritos</span>
                    <span className="font-medium">{event.registeredCount}</span>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
